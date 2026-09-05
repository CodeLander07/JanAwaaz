from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import api_router

app.include_router(api_router, prefix="/api/v1")

app = FastAPI(
    title="CivicPulse API",
    description="Multilingual AI Platform for Citizen-Driven Infrastructure Planning",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "CivicPulse API", "status": "operational"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}