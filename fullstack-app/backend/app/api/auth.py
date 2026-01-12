import logging

from fastapi import APIRouter, Depends, Response
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.db.database import get_db
from app.db.models import User
from app.schemas.user import UserRequest

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login_user(login_data: UserRequest, response: Response, db: Session = Depends(get_db)):
    try:
        # Find user using raw SQL
        query = text("SELECT * FROM users WHERE username = :username")
        result = db.execute(query, {"username": login_data.username}).first()
        
        if not result:
            return {"status": "error", "message": "User not found"}

        # Convert result to dict for easier access
        existing_user = dict(result._mapping)

        # Verify password
        if not verify_password(login_data.password, existing_user["password"]):
            return {"status": "error", "message": "Incorrect password"}

        # Create JWT token
        token_data = {"userId": str(existing_user["id"]), "username": existing_user["username"]}
        token = create_access_token(token_data)
        # Set cookie
        response.set_cookie(
            key="token",
            value=token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=1800,
        )
        return {
            "message": "Login successful",
            "userId": str(existing_user["id"]),
            "username": existing_user["username"],
            "status": "success",
        }
    except Exception as exc:
        logger.error("Login failed: %s", exc)
        return {"status": "error", "message": f"Login failed: {exc}"}


@router.post("/signup")
async def register_user(user_data: UserRequest, response: Response, db: Session = Depends(get_db)):
    try:
        # Check if username already exists using raw SQL
        check_query = text("SELECT * FROM users WHERE username = :username")
        existing_user = db.execute(check_query, {"username": user_data.username}).first()
        
        if existing_user:
            return {"status": "error", "message": "Username already registered"}

        # Insert new user using raw SQL
        hashed_password = hash_password(user_data.password)
        insert_query = text(
            "INSERT INTO users (id, username, password, email, created_at, updated_at) "
            "VALUES (gen_random_uuid(), :username, :password, :email, NOW(), NOW()) "
            "RETURNING id, username"
        )
        
        result = db.execute(
            insert_query,
            {
                "username": user_data.username,
                "password": hashed_password,
                "email": user_data.email,
            }
        )
        new_user = dict(result.first()._mapping)
        db.commit()

        # Create JWT token
        token_data = {"userId": str(new_user["id"]), "username": new_user["username"]}
        token = create_access_token(token_data)
        # Set cookie and return response
        response.set_cookie(
            key="token",
            value=token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=1800,
        )
        return {
            "message": "User registered successfully",
            "userId": str(new_user["id"]),
            "username": new_user["username"],
            "status": "success",
        }
    except Exception as exc:
        db.rollback()
        logger.error("Registration failed: %s", exc)
        return {"message": f"Registration failed: {exc}", "status": "error"}


@router.post("/logout")
async def logout_user(response: Response):
    response.delete_cookie(key="token")
    return {"message": "Logged out successfully"}
