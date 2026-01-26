import base64
from typing import Optional
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status, Query
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.schemas.item import (
    CreateItemResponse,
    ItemPatchRequest,
    ItemRequest,
    ItemResponse,
    PatchResponse,
    ItemsPageResponse,
)

router = APIRouter(prefix="/items", tags=["items"])


# Create a new clothing item
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


# Get a list of clothing items
@router.get("", response_model=ItemsPageResponse, response_model_by_alias=True)
async def get_items(
    search: Optional[str] = None,
    filter: Optional[str] = None,
    sort: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        owner_id = uuid.UUID(current_user.get("userId"))
        where_clause = "owner_id = :owner_id"
        params = {"owner_id": owner_id}
        if filter:
            normalized = filter.lower()
            category_map = {
                "tops": "top",
                "bottoms": "bottom",
                "outerwear": "outerwear",
                "footwear": "footwear",
                "accessories": "accessory",
                "dress": "dress",
            }
            if normalized == "favorites":
                where_clause += " AND favorite = TRUE"
            elif normalized in category_map:
                where_clause += " AND category = :category"
                params["category"] = category_map[normalized]
        if search:
            where_clause += (
                " AND (name ILIKE :search OR category ILIKE :search OR color ILIKE :search "
                "OR season ILIKE :search OR notes ILIKE :search)"
            )
            params["search"] = f"%{search}%"
        
        count_query = text(f"SELECT COUNT(*) FROM cloth_items WHERE {where_clause}")
        total = db.execute(count_query, params).scalar() or 0

        # offset is how many items to skip in the query based on the current page and page size(get next set of items for pagination)
        offset = (page - 1) * page_size
        params.update({"limit": page_size, "offset": offset})
        order_clause = "created_at DESC"
        query = text(
            "SELECT id, owner_id, name, category, color, season, image_url, favorite, notes "
            f"FROM cloth_items WHERE {where_clause} "
            f"ORDER BY {order_clause} "
            "LIMIT :limit OFFSET :offset"
        )
        results = db.execute(query, params).fetchall()

        items = [
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
        return {
            "items": items,
            "page": page,
            "page_size": page_size,
            "total": total,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch items: {str(exc)}")
    
# Get a specific clothing item by ID(from clicking on an item to view details or edit)
@router.get("/{item_id}", response_model=ItemResponse, response_model_by_alias=True)
async def get_item(
    item_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        owner_id = uuid.UUID(current_user.get("userId"))
        try:
            item_uuid = uuid.UUID(item_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid item id")

        query = text(
            "SELECT id, owner_id, name, category, color, season, image_url, favorite, notes "
            "FROM cloth_items WHERE owner_id = :owner_id AND id = :item_id"
        )
        result = db.execute(query, {"owner_id": owner_id, "item_id": item_uuid}).fetchone()

        if not result:
            raise HTTPException(status_code=404, detail="Item not found")

        return {
            "_id": str(result._mapping["id"]),
            "name": result._mapping["name"],
            "category": result._mapping["category"],
            "color": result._mapping["color"],
            "season": result._mapping["season"],
            "imageUrl": result._mapping["image_url"],
            "favorite": result._mapping["favorite"],
            "notes": result._mapping["notes"],
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch item: {str(exc)}")

# for updating an existing clothing item(edit or favorite toggle)
@router.patch("/{item_id}", response_model=PatchResponse, response_model_by_alias=True)
async def update_item(
    item_id: str,
    item: ItemPatchRequest = Depends(ItemPatchRequest.as_form),
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
        try:
            item_uuid = uuid.UUID(item_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid item id")

        if (
            item.name is None
            and item.category is None
            and item.color is None
            and item.season is None
            and item.favorite is None
            and item.notes is None
            and image_data is None
        ):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

        update_query = text(
            "UPDATE cloth_items SET "
            "name = COALESCE(:name, name), "
            "category = COALESCE(:category, category), "
            "color = COALESCE(:color, color), "
            "season = COALESCE(:season, season), "
            "image_url = COALESCE(:image_url, image_url), "
            "favorite = COALESCE(:favorite, favorite), "
            "notes = COALESCE(:notes, notes), "
            "updated_at = NOW() "
            "WHERE id = :item_id AND owner_id = :owner_id "
            "RETURNING id, owner_id, name, category, color, season, image_url, favorite, notes"
        )
        result = db.execute(
            update_query,
            {
                "item_id": item_uuid,
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
        updated_item = result.first()
        if not updated_item:
            raise HTTPException(status_code=404, detail="Item not found")

        db.commit()
        updated_item_dict = dict(updated_item._mapping)
        return {
            "status": "success",
            "item": {
                "_id": str(updated_item_dict["id"]),
                "name": updated_item_dict["name"],
                "category": updated_item_dict["category"],
                "color": updated_item_dict["color"],
                "season": updated_item_dict["season"],
                "imageUrl": updated_item_dict["image_url"],
                "favorite": updated_item_dict["favorite"],
                "notes": updated_item_dict["notes"],}
        }
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update item: {str(exc)}")


@router.delete("/{item_id}", response_model_by_alias=True)
async def delete_item(
    item_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        owner_id = uuid.UUID(current_user.get("userId"))
        try:
            item_uuid = uuid.UUID(item_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid item id")

        delete_query = text("DELETE FROM cloth_items WHERE id = :item_id AND owner_id = :owner_id RETURNING id")
        result = db.execute(delete_query, {"item_id": item_uuid, "owner_id": owner_id})
        deleted_item = result.fetchone()
        if not deleted_item:
            raise HTTPException(status_code=404, detail="Item not found")

        db.commit()
        return {
            "status": "success",
            "message": "Item deleted successfully"
        }
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete item: {str(exc)}")
