from fastapi import APIRouter
from app.api.v1 import submissions

api_router = APIRouter()
api_router.include_router(submissions.router)

# Add more routers here as needed