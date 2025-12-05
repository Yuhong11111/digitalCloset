import base64
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, Query, UploadFile

from app.db.mongo import db

router = APIRouter(prefix="/items", tags=["items"])


@router.post("")
async def create_item(
    name: str = Form(...),
    category: str = Form(...),
    color: str = Form(...),
    season: str = Form(...),
    favorite: bool = Form(False),
    notes: Optional[str] = Form(None),
    ownerId: str = Form(...),
    image: Optional[UploadFile] = File(None),
):
    image_data: Optional[str] = None
    if image is not None:
        content = await image.read()
        mime = image.content_type or "application/octet-stream"
        encoded = base64.b64encode(content).decode("utf-8")
        image_data = f"data:{mime};base64,{encoded}"

    new_item = {
        "name": name,
        "category": category,
        "color": color,
        "season": season,
        "imageUrl": image_data,
        "favorite": favorite,
        "notes": notes,
        "ownerId": ownerId,
    }
    result = await db.clothes.insert_one(new_item)
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to create item")
    new_item["_id"] = str(result.inserted_id)
    return {"status": "success", "item": new_item}


@router.get("")
async def get_items(owner_id: str = Query(..., alias="owner_id")):
    cursor = db.clothes.find({"ownerId": owner_id})
    items = []
    async for item in cursor:
        item["_id"] = str(item["_id"])
        items.append(item)
    return items
