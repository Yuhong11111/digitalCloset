from fastapi import APIRouter, Depends

from app.api.deps import get_current_user

router = APIRouter(tags=["profile"])


@router.get("/profile")
def get_profile(current_user=Depends(get_current_user)):
    return current_user
