import statistics
from typing import Dict, Any, List

class AIAnomalyClassifier:
    """
    AI Anomaly Classifier for Pyrolysis Burns & Sensor Telemetry.
    Evaluates real-time thermal curves, volumetric ratios, and acoustic noise scatter
    to flag fraud vectors (Ash Cheating, Sand Padding, Stolen Hardware, Sensor Tampering).
    """

    def __init__(self):
        # Baseline statistical parameters from empirical biochar calibrations
        self.expected_min_heating_rate = 1.2   # °C / min
        self.expected_max_heating_rate = 15.0  # °C / min
        self.min_valid_duration = 30.0         # Minutes
        self.min_retention_ratio = 0.25        # Biochar volume fraction
        self.max_retention_ratio = 0.45

    def classify_burn_telemetry(self, telemetry: Dict[str, Any]) -> Dict[str, Any]:
        """
        Classifies incoming telemetry packet and outputs anomaly score and fraud flags.
        """
        anomalies: List[str] = []
        confidence_score = 1.0

        init_h = float(telemetry.get("initial_height_cm", 0.0))
        final_h = float(telemetry.get("final_height_cm", 0.0))
        peak_temp = float(telemetry.get("peak_outer_temp_c", 0.0))
        duration = float(telemetry.get("duration_minutes", 0.0))
        heating_rate = float(telemetry.get("heating_rate", 0.0))

        # 1. Volumetric Retention Analysis (Ash Cheating Detection)
        if init_h > 0:
            retention_ratio = final_h / init_h
            if retention_ratio < self.min_retention_ratio:
                anomalies.append(f"ASH_CHEATING_DETECTED (Volume retention {retention_ratio:.3f} < {self.min_retention_ratio:.2f})")
                confidence_score -= 0.6
            elif retention_ratio > self.max_retention_ratio:
                anomalies.append(f"INCOMPLETE_PYROLYSIS_OR_TAMPER (Volume retention {retention_ratio:.3f} > {self.max_retention_ratio:.2f})")
                confidence_score -= 0.5

        # 2. Thermal Mass Coherence (Sand-Padding Attack Detection)
        if heating_rate < self.expected_min_heating_rate:
            anomalies.append(f"SAND_PADDING_DETECTED (Thermal ramp rate {heating_rate:.2f}°C/min is abnormally slow due to dense inert heat sink)")
            confidence_score -= 0.7
        elif heating_rate > self.expected_max_heating_rate:
            anomalies.append(f"EXTERNAL_ACCELERANT_DETECTED (Heating rate {heating_rate:.2f}°C/min exceeds natural biomass combustion)")
            confidence_score -= 0.4

        # 3. Outer Skin Temperature Boundaries
        if peak_temp < 40.0:
            anomalies.append(f"INSUFFICIENT_CORE_HEAT (Peak skin temp {peak_temp:.1f}°C below pyrolysis threshold 40°C)")
            confidence_score -= 0.5
        elif peak_temp > 75.0:
            anomalies.append(f"CORE_RUNAWAY_OR_SENSOR_FUSION (Peak skin temp {peak_temp:.1f}°C exceeds safe casing bounds 75°C)")
            confidence_score -= 0.6

        # 4. Burn Duration Check
        if duration < self.min_valid_duration:
            anomalies.append(f"PREMATURE_TERMINATION (Duration {duration:.1f} min < {self.min_valid_duration} min)")
            confidence_score -= 0.4

        confidence_score = max(0.0, min(1.0, confidence_score))
        is_clean = len(anomalies) == 0

        return {
            "is_clean": is_clean,
            "anomaly_score": round(1.0 - confidence_score, 3),
            "confidence_score": round(confidence_score, 3),
            "detected_anomalies": anomalies,
            "verdict": "VERIFIED_GENUINE" if is_clean else "FRAUD_REJECTED"
        }

    def filter_acoustic_noise_scatter(self, raw_pings_cm: List[float]) -> float:
        """
        Applies a robust median filter over ultrasonic pulse train
        to discard turbulence-induced acoustic reflections.
        """
        if not raw_pings_cm:
            return 0.0
        return float(statistics.median(raw_pings_cm))
