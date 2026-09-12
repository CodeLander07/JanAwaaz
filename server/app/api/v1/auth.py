import logging
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    create_password_reset_token,
    decode_token,
)
from app.models.user import User
from app.schemas.auth import (
    UserResponse,
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    MessageResponse,
)
from app.api.deps import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

def user_to_response(user: User) -> UserResponse:
    """Format SQLAlchemy User to Pydantic UserResponse."""
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        country=user.country,
        is_verified=user.is_verified,
        created_at=user.created_at.isoformat() if user.created_at else datetime.now(timezone.utc).isoformat(),
    )

def set_auth_cookies(response: Response, user_id: str, role: str) -> None:
    """Helper to set access and refresh token cookies."""
    access_token = create_access_token(subject=user_id, extra_data={"role": role})
    refresh_token = create_refresh_token(subject=user_id)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    """Register a new user, issue session cookies, and return user profile."""
    existing_user = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email address already exists",
        )

    hashed = hash_password(payload.password)
    new_user = User(
        email=payload.email.lower(),
        full_name=payload.full_name.strip(),
        hashed_password=hashed,
        country=payload.country,
        role="citizen",
        is_verified=False,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    set_auth_cookies(response, new_user.id, new_user.role)
    return user_to_response(new_user)

@router.post("/login", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def login(
    payload: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    """Authenticate user with email and password, setting session cookies."""
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    set_auth_cookies(response, user.id, user.role)
    return user_to_response(user)

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout():
    """Clear session cookies."""
    resp = Response(status_code=status.HTTP_204_NO_CONTENT)
    resp.delete_cookie(key="access_token", path="/")
    resp.delete_cookie(key="refresh_token", path="/")
    return resp

@router.post("/refresh", status_code=status.HTTP_200_OK)
async def refresh_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    """Use refresh token cookie to issue a new access token cookie."""
    token = request.cookies.get("refresh_token")
    if not token:
        # Check authorization header as fallback
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing",
        )

    payload = decode_token(token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    # Issue new access token
    new_access_token = create_access_token(
        subject=user.id, extra_data={"role": user.role}
    )
    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )

    return {"status": "ok", "message": "Token refreshed"}

@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_me(current_user: User = Depends(get_current_user)):
    """Return profile for currently authenticated user."""
    return user_to_response(current_user)

@router.post("/forgot-password", response_model=MessageResponse, status_code=status.HTTP_202_ACCEPTED)
async def forgot_password(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    """
    Initiates password reset process. Always returns 202 to avoid email enumeration.
    In development, the reset link is logged for verification.
    """
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if user:
        reset_token = create_password_reset_token(user.email)
        user.reset_token = reset_token
        user.reset_token_expires_at = datetime.now(timezone.utc) + timedelta(
            minutes=settings.RESET_TOKEN_EXPIRE_MINUTES
        )
        db.commit()
        
        # Log reset link for easy local testing
        reset_link = f"http://localhost:3000/auth/reset-password?token={reset_token}"
        logger.info(f"===> [DEV AUTH] Password reset link for {user.email}: {reset_link}")
        print(f"\n[DEV AUTH] Password reset link for {user.email}:\n{reset_link}\n")

    return MessageResponse(
        message="If this email is registered, a password reset link has been sent."
    )

@router.post("/reset-password", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    """Reset password using verified token."""
    decoded = decode_token(payload.token)
    if not decoded or decoded.get("type") != "reset":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    email = decoded.get("sub")
    user = db.query(User).filter(User.email == email).first()
    if not user or user.reset_token != payload.token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token or token already used",
        )

    # Check expiry
    if user.reset_token_expires_at:
        token_expiry = user.reset_token_expires_at
        if token_expiry.tzinfo is None:
            token_expiry = token_expiry.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) > token_expiry:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset token has expired",
            )

    user.hashed_password = hash_password(payload.new_password)
    user.reset_token = None
    user.reset_token_expires_at = None
    db.commit()

    return MessageResponse(message="Password reset successful. You can now sign in with your new password.")
