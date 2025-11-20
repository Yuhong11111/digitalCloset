import logging

from fastapi import APIRouter, HTTPException, status

from app.db.mongo import db

logger = logging.getLogger(__name__)

router = APIRouter(tags=["system"])


@router.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI backend!"}


@router.get("/test-db")
async def test_db():
    try:
        collections = await db.list_collection_names()
        return {"database": "Closet", "collections": collections, "status": "connected"}
    except Exception as exc:
        logger.error("Database operation failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection failed: {exc}",
        )

