from fastapi import APIRouter, HTTPException, Request, status
from jose import JWTError, jwt

from app.core.config import settings

router = APIRouter(tags=["profile"])


@router.get("/profile")
def get_profile(request: Request):
    token = request.cookies.get("token")
    if not token:
        return {"error": "No token provided"}, status.HTTP_401_UNAUTHORIZED
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

