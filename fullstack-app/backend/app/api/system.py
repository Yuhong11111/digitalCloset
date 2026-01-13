import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.database import get_db

logger = logging.getLogger(__name__)

router = APIRouter(tags=["system"])


@router.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI backend!"}


@router.get("/test-db")
async def test_db(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"database": "postgresql", "status": "connected"}
    except Exception as exc:
        logger.error("Database operation failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection failed: {exc}",
        )
