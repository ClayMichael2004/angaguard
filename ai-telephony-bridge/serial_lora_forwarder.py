import requests
import json
import time
from typing import Dict, Any, Optional

class SerialLoRaForwarder:
    """
    Serial and LoRaWAN packet forwarder.
    Ingests binary or hex sensor packets from edge gateways,
    decodes payload, and forwards JSON telemetry to Go Core Backend.
    """

    def __init__(self, backend_url: str = "http://localhost:8080/api/telemetry"):
        self.backend_url = backend_url

    def decode_lora_hex_payload(self, hex_str: str) -> Optional[Dict[str, Any]]:
        """
        Decodes compact binary packet from LoRaWAN gateway.
        Format: [1B header][8B UID][4B KilnID][2B InitH_x10][2B FinalH_x10][2B PeakTemp_x10][2B Duration_x10][2B HeatRate_x100]
        """
        try:
            # For demonstration, support both JSON-encoded hex and structured packets
            if hex_str.startswith("{"):
                return json.loads(hex_str)

            # Simulated sample decoder
            return {
                "device_uid": "MCU-WAZIDEV-77A9",
                "kiln_id": "KILN-001",
                "coop_id": "COOP-KAKAMEGA-01",
                "farmer_phone": "+254712345678",
                "initial_height_cm": 85.0,
                "final_height_cm": 30.0,
                "peak_outer_temp_c": 58.5,
                "duration_minutes": 45.0,
                "heating_rate": 4.2,
                "latitude": 0.2827,
                "longitude": 34.7519,
                "cell_tower_id": "SAF-TOWER-KKM-04",
                "timestamp": int(time.time())
            }
        except Exception as e:
            print(f"[LoRa Forwarder] Decoding error: {e}")
            return None

    def forward_to_backend(self, telemetry: Dict[str, Any]) -> Dict[str, Any]:
        """
        Pipes telemetry packet to Go Core dMRV Oracle API.
        """
        try:
            response = requests.post(self.backend_url, json=telemetry, timeout=5)
            return {
                "status_code": response.status_code,
                "data": response.json()
            }
        except Exception as e:
            return {
                "status_code": 500,
                "error": f"Failed to reach Go Core Backend: {str(e)}"
            }
