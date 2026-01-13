import base64
from typing import Optional
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.db.models import ClothItem

router = APIRouter(prefix="/items", tags=["items"])


@router.post("")
async def create_item(
    name: str = Form(...),
    category: str = Form(...),
    color: str = Form(...),
    season: str = Form(...),
    favorite: bool = Form(False),
    notes: Optional[str] = Form(None),
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
        # Create new item using ORM
        new_item = ClothItem(
            id=uuid.uuid4(),
            owner_id=uuid.UUID(current_user.get("userId")),
            name=name,
            category=category,
            color=color,
            season=season,
            image_url=image_data,
            favorite=favorite,
            notes=notes,
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        
        return {
            "status": "success",
            "item": {
                "_id": str(new_item.id),
                "name": new_item.name,
                "category": new_item.category,
                "color": new_item.color,
                "season": new_item.season,
                "imageUrl": new_item.image_url,
                "favorite": new_item.favorite,
                "notes": new_item.notes,
                "ownerId": str(new_item.owner_id),
            }
        }
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create item: {str(exc)}")


@router.get("")
async def get_items(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        owner_id = uuid.UUID(current_user.get("userId"))
        # Get all items for this user using ORM
        items = db.query(ClothItem).filter(ClothItem.owner_id == owner_id).all()
        
        return [
            {
                "_id": str(item.id),
                "name": item.name,
                "category": item.category,
                "color": item.color,
                "season": item.season,
                "imageUrl": item.image_url,
                "favorite": item.favorite,
                "notes": item.notes,
                "ownerId": str(item.owner_id),
            }
            for item in items
        ]
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch items: {str(exc)}")
