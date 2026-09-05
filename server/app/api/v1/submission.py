from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/v1/submit", tags=["submissions"])

class TextSubmission(BaseModel):
    text: str
    language: Optional[str] = None
    location: Optional[dict] = None
    user_id: Optional[str] = None

@router.post("/text")
async def submit_text(submission: TextSubmission):
    request_id = str(uuid.uuid4())
    
    # TODO: Send to Kafka queue
    # For now, just acknowledge receipt
    
    return {
        "status": "accepted",
        "request_id": request_id,
        "timestamp": datetime.utcnow().isoformat()
    }

@router.post("/voice")
async def submit_voice(
    audio: UploadFile = File(...),
    language: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    user_id: Optional[str] = Form(None)
):
    request_id = str(uuid.uuid4())
    
    # TODO: Save audio file and send to processing queue
    
    return {
        "status": "accepted",
        "request_id": request_id,
        "filename": audio.filename
    }