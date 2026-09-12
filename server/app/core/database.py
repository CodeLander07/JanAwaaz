import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

logger = logging.getLogger(__name__)

def get_database_engine():
    """
    Attempts to connect to PostgreSQL. If connection fails or credentials aren't configured,
    falls back cleanly to SQLite for local development.
    """
    if settings.DATABASE_URL:
        db_url = settings.DATABASE_URL
    else:
        db_url = (
            f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@"
            f"{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
        )

    # Test PostgreSQL connection if postgres URL
    if db_url.startswith("postgresql"):
        try:
            test_engine = create_engine(db_url, connect_args={"connect_timeout": 2})
            with test_engine.connect() as conn:
                pass
            logger.info("Successfully connected to PostgreSQL database.")
            return test_engine
        except Exception as e:
            logger.warning(
                f"Could not connect to PostgreSQL ({e}). Falling back to SQLite for local development."
            )
            sqlite_url = "sqlite:///./civicpulse.db"
            return create_engine(sqlite_url, connect_args={"check_same_thread": False})
    
    return create_engine(db_url)

engine = get_database_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """FastAPI dependency that yields a SQLAlchemy database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
