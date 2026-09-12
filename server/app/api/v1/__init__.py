from fastapi import APIRouter
from typing import Optional, List, Dict, Any
from app.api.v1 import submission, auth

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(submission.router)

# Sample hotspots endpoint for client dashboard support
@api_router.get("/hotspots", tags=["hotspots"])
async def get_hotspots(sector: Optional[str] = None):
    sample_hotspots: List[Dict[str, Any]] = [
        {
            "id": "h-1",
            "name": "Connaught Place Water Supply",
            "sector": "water",
            "latitude": 28.6315,
            "longitude": 77.2167,
            "reports_count": 142,
            "priority": "high",
        },
        {
            "id": "h-2",
            "name": "Indiranagar Pothole Cluster",
            "sector": "roads",
            "latitude": 12.9784,
            "longitude": 77.6408,
            "reports_count": 89,
            "priority": "medium",
        },
        {
            "id": "h-3",
            "name": "Bandra Power Grid Instability",
            "sector": "electricity",
            "latitude": 19.0596,
            "longitude": 72.8295,
            "reports_count": 115,
            "priority": "high",
        },
    ]
    if sector:
        return [h for h in sample_hotspots if h["sector"].lower() == sector.lower()]
    return sample_hotspots