import json
from typing import Dict, Any

class SwahiliVoiceWorker:
    """
    Swahili & English Automated Voice Engine.
    Delivers automated IVR voice instructions to rural smallholders lacking smartphones.
    """

    def __init__(self, voice_id: str = "swahili_native_female_01"):
        self.voice_id = voice_id

    def generate_swahili_burn_confirmation(self, farmer_name: str, biochar_kg: float, mpesa_ksh: float) -> Dict[str, Any]:
        """
        Generates Swahili audio script and IVR command for verified burn completion.
        """
        script_swahili = (
            f"Habari {farmer_name}. Mfumo wa AngaGuard umethibitisha kuwa umechoma kilo "
            f"{biochar_kg:.1f} za mkaa bora wa biochar. Pesa yako ya M-Pesa shilingi "
            f"{mpesa_ksh:.2f} imetumwa moja kwa moja kwa simu yako. "
            f"Tafadhali kumbuka kuweka mkaa huu kwenye mchanga wa shamba lako ili kuboresha rutuba. "
            f"Asante sana kwa kuzuia uchafuzi wa hewa!"
        )

        script_english = (
            f"Hello {farmer_name}. The AngaGuard oracle has verified your harvest of "
            f"{biochar_kg:.1f} kg of premium biochar. Your M-Pesa payout of KSh "
            f"{mpesa_ksh:.2f} has been dispatched directly to your mobile phone. "
            f"Please incorporate this biochar back into your farm soil to boost organic fertility. "
            f"Thank you for preserving our atmosphere!"
        )

        return {
            "farmer_name": farmer_name,
            "voice_engine": "ElevenLabs-Multilingual-v2",
            "voice_id": self.voice_id,
            "language": "sw-KE",
            "script_swahili": script_swahili,
            "script_english": script_english,
            "audio_duration_seconds": 18.5,
            "delivery_channel": "Africa's Talking Voice Call / IVR Gateway"
        }

    def generate_swahili_anomaly_alert(self, farmer_name: str, reason: str) -> Dict[str, Any]:
        """
        Generates warning voice script if a burn was rejected due to an anomaly.
        """
        script_swahili = (
            f"Habari {farmer_name}. Uchomaji wako wa hivi karibuni haukufaulu ukaguzi wa kidijitali. "
            f"Sababu: {reason}. Tafadhali hakikisha mifereji ya hewa imefungwa vizuri na "
            f"usitumie udongo au mchanga ndani ya pipa. Wasiliana na afisa wako wa nyanjani."
        )

        return {
            "farmer_name": farmer_name,
            "language": "sw-KE",
            "script_swahili": script_swahili,
            "delivery_channel": "Africa's Talking Automated IVR"
        }
