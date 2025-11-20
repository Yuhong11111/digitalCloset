from fastapi import APIRouter, HTTPException, Query

from app.db.mongo import db
from app.schemas.item import ItemRequest

router = APIRouter(prefix="/items", tags=["items"])


@router.post("")
async def create_item(item_data: ItemRequest):
    new_item = {
        "name": item_data.name,
        "category": item_data.category,
        "color": item_data.color,
        "season": item_data.season,
        "imageUrl": item_data.imageUrl,
        "favorite": item_data.favorite,
        "notes": item_data.notes,
        "ownerId": item_data.ownerId,
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

