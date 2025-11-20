import logging

from fastapi import APIRouter, HTTPException, Response, status

from app.core.security import create_access_token, hash_password, verify_password
from app.db.mongo import db
from app.schemas.user import UserRequest

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login_user(login_data: UserRequest, response: Response):
    try:
        # Find user in MongoDB
        existing_user = await db.users.find_one({"username": login_data.username})
        if not existing_user:
            return {"status": "error", "message": "User not found"}

        # Verify password
        if not verify_password(login_data.password, existing_user["password"]):
            return {"status": "error", "message": "Incorrect password"}

        # Create JWT token
        token_data = {"userId": str(existing_user["_id"]), "username": existing_user["username"]}
        token = create_access_token(token_data)
        # Set cookie
        response.set_cookie(
            key="token",
            value=token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=1800,
        )
        return {
            "message": "Login successful",
            "userId": str(existing_user["_id"]),
            "username": existing_user["username"],
            "status": "success",
        }
    except Exception as exc:
        logger.error("Login failed: %s", exc)
        return {"status": "error", "message": f"Login failed: {exc}"}


@router.post("/signup")
async def register_user(user_data: UserRequest, response: Response):
    try:
        existing_user = await db.users.find_one({"username": user_data.username})
        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")

        hashed_password = hash_password(user_data.password)
        new_user = {
            "username": user_data.username,
            "password": hashed_password,
            "email": user_data.email,
            # "created_at": datetime.utcnow()
        }
        result = await db.users.insert_one(new_user)
        token_data = {"userId": str(result.inserted_id), "username": user_data.username}
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
            "userId": str(result.inserted_id),
            "username": user_data.username,
            "status": "success",
        }
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Registration failed: %s", exc)
        return {"message": f"Registration failed: {exc}", "status": "error"}


@router.post("/logout")
async def logout_user(response: Response):
    response.delete_cookie(key="token")
    return {"message": "Logged out successfully"}
