import unittest
from anomaly_classifier import AIAnomalyClassifier
from voice_worker import SwahiliVoiceWorker

class TestAIBridge(unittest.TestCase):
    def setUp(self):
        self.classifier = AIAnomalyClassifier()
        self.voice = SwahiliVoiceWorker()

    def test_valid_burn_classification(self):
        payload = {
            "initial_height_cm": 85.0,
            "final_height_cm": 30.0,
            "peak_outer_temp_c": 58.5,
            "duration_minutes": 45.0,
            "heating_rate": 4.2
        }
        res = self.classifier.classify_burn_telemetry(payload)
        self.assertTrue(res["is_clean"])
        self.assertEqual(res["verdict"], "VERIFIED_GENUINE")

    def test_ash_cheating_detection(self):
        # Final height 8cm (< 25% of 85cm) -> ash collapse
        payload = {
            "initial_height_cm": 85.0,
            "final_height_cm": 8.0,
            "peak_outer_temp_c": 55.0,
            "duration_minutes": 40.0,
            "heating_rate": 3.8
        }
        res = self.classifier.classify_burn_telemetry(payload)
        self.assertFalse(res["is_clean"])
        self.assertIn("ASH_CHEATING_DETECTED", res["detected_anomalies"][0])

    def test_sand_padding_detection(self):
        # Sluggish heating rate (0.3 C/min) -> thermal mass heat sink
        payload = {
            "initial_height_cm": 85.0,
            "final_height_cm": 30.0,
            "peak_outer_temp_c": 52.0,
            "duration_minutes": 45.0,
            "heating_rate": 0.3
        }
        res = self.classifier.classify_burn_telemetry(payload)
        self.assertFalse(res["is_clean"])
        self.assertIn("SAND_PADDING_DETECTED", res["detected_anomalies"][0])

    def test_swahili_voice_generation(self):
        voice_data = self.voice.generate_swahili_burn_confirmation("Wanjala", 79.8, 1250.0)
        self.assertIn("Wanjala", voice_data["script_swahili"])
        self.assertIn("M-Pesa", voice_data["script_swahili"])
        self.assertEqual(voice_data["language"], "sw-KE")

if __name__ == "__main__":
    unittest.main()
