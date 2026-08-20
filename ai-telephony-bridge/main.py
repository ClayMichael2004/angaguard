from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn

from anomaly_classifier import AIAnomalyClassifier
from voice_worker import SwahiliVoiceWorker
from serial_lora_forwarder import SerialLoRaForwarder

app = FastAPI(
    title="AngaGuard AI & Telephony Bridge",
    description="Bridge microservice connecting LoRa gateways, AI anomaly classification, and Africa's Talking / ElevenLabs voice stacks.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

classifier = AIAnomalyClassifier()
voice_worker = SwahiliVoiceWorker()
lora_forwarder = SerialLoRaForwarder()

class TelemetryInput(BaseModel):
    device_uid: str
    kiln_id: str
    coop_id: Optional[str] = "COOP-KAKAMEGA-01"
    farmer_phone: Optional[str] = "+254712345678"
    initial_height_cm: float
    final_height_cm: float
    peak_outer_temp_c: float
    duration_minutes: float
    heating_rate: float
    latitude: Optional[float] = 0.2827
    longitude: Optional[float] = 34.7519
    cell_tower_id: Optional[str] = "SAF-TOWER-KKM-04"

class VoiceRequest(BaseModel):
    farmer_name: str
    biochar_kg: float
    mpesa_ksh: float

class AnomalyVoiceRequest(BaseModel):
    farmer_name: str
    reason: str

@app.get("/")
def health_check():
    return {
        "service": "AngaGuard AI & Telephony Bridge",
        "status": "HEALTHY",
        "modules": {
            "ai_anomaly_classifier": "ACTIVE",
            "swahili_voice_engine": "ACTIVE",
            "lora_forwarder": "ACTIVE"
        }
    }

@app.post("/classify-anomaly")
def classify_telemetry(data: TelemetryInput):
    """
    Evaluates telemetry against AI anomaly rules and statistical classifiers.
    """
    result = classifier.classify_burn_telemetry(data.model_dump())
    return result

@app.post("/voice/synthesize-burn")
def synthesize_burn_voice(req: VoiceRequest):
    """
    Generates Swahili & English speech audio transcript for M-Pesa burn confirmation.
    """
    return voice_worker.generate_swahili_burn_confirmation(req.farmer_name, req.biochar_kg, req.mpesa_ksh)

@app.post("/voice/synthesize-alert")
def synthesize_alert_voice(req: AnomalyVoiceRequest):
    """
    Generates Swahili voice alert for anomaly warning.
    """
    return voice_worker.generate_swahili_anomaly_alert(req.farmer_name, req.reason)

@app.post("/forward-lora")
def forward_lora_packet(payload: Dict[str, Any]):
    """
    Ingests LoRaWAN gateway packet, classifies anomalies, and forwards to Go Core.
    """
    classification = classifier.classify_burn_telemetry(payload)
    if not classification["is_clean"]:
        return {
            "forwarded": False,
            "status": "REJECTED_BY_AI_ORACLE",
            "details": classification
        }

    forward_res = lora_forwarder.forward_to_backend(payload)
    return {
        "forwarded": True,
        "classification": classification,
        "backend_response": forward_res
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
