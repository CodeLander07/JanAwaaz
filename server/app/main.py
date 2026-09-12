from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.models.user import User  # Ensures User model is registered with Base
from app.api.v1 import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="CivicPulse API",
    description="Multilingual AI Platform for Citizen-Driven Infrastructure Planning",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS for credentials (cookies) support
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "CivicPulse API", "status": "operational"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}