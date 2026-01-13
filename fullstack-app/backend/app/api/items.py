import base64
from typing import Optional, List
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.schemas.item import CreateItemResponse, ItemRequest, ItemResponse

router = APIRouter(prefix="/items", tags=["items"])


@router.post("", response_model=CreateItemResponse, response_model_by_alias=True)
async def create_item(
    item: ItemRequest = Depends(ItemRequest.as_form),
    image: Optional[UploadFile] = File(None),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    image_data: Optional[str] = None
    if image is not None:
        content = await image.read()
        mime = image.content_type or "application/octet-stream"
        encoded = base64.b64encode(content).decode("utf-8")
        image_data = f"data:{mime};base64,{encoded}"

    try:
        owner_id = uuid.UUID(current_user.get("userId"))
        insert_query = text(
            "INSERT INTO cloth_items "
            "(id, owner_id, name, category, color, season, image_url, favorite, notes, created_at, updated_at) "
            "VALUES (gen_random_uuid(), :owner_id, :name, :category, :color, :season, :image_url, :favorite, :notes, NOW(), NOW()) "
            "RETURNING id, owner_id, name, category, color, season, image_url, favorite, notes"
        )
        result = db.execute(
            insert_query,
            {
                "owner_id": owner_id,
                "name": item.name,
                "category": item.category,
                "color": item.color,
                "season": item.season,
                "image_url": image_data,
                "favorite": item.favorite,
                "notes": item.notes,
            },
        )
        new_item = dict(result.first()._mapping)
        db.commit()

        return {
            "status": "success",
            "item": {
                "_id": str(new_item["id"]),
                "name": new_item["name"],
                "category": new_item["category"],
                "color": new_item["color"],
                "season": new_item["season"],
                "imageUrl": new_item["image_url"],
                "favorite": new_item["favorite"],
                "notes": new_item["notes"],
            }
        }
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create item: {str(exc)}")


@router.get("", response_model=List[ItemResponse], response_model_by_alias=True)
async def get_items(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        owner_id = uuid.UUID(current_user.get("userId"))
        query = text(
            "SELECT id, owner_id, name, category, color, season, image_url, favorite, notes "
            "FROM cloth_items WHERE owner_id = :owner_id"
        )
        results = db.execute(query, {"owner_id": owner_id}).fetchall()

        return [
            {
                "_id": str(item._mapping["id"]),
                "name": item._mapping["name"],
                "category": item._mapping["category"],
                "color": item._mapping["color"],
                "season": item._mapping["season"],
                "imageUrl": item._mapping["image_url"],
                "favorite": item._mapping["favorite"],
                "notes": item._mapping["notes"],
            }
            for item in results
        ]
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch items: {str(exc)}")
