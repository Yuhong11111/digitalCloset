import base64
from typing import Optional, List
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status, Query
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.schemas.item import (
    # send item form
    ItemRequest,
    # get items list response schema with only necessary fields for closet view and pagination
    ItemsPageResponse,
    # get detailed item response schema
    ItemDetailResponse,
    # patch item request and response schemas
    ItemPatchRequest,
    # confirm creation or patching of an item
    CreateOrPatchItemResponse
)

router = APIRouter(prefix="/items", tags=["items"])

def parse_tags(raw: Optional[str]) -> Optional[List[str]]:
    if raw is None:
        return None
    text = raw.strip()
    if text == "":
        return []
    return [tag.strip() for tag in text.split(",") if tag.strip()]


def parse_purchase_price(raw: Optional[str]) -> Optional[float]:
    if raw is None:
        return None
    text = raw.strip()
    if text == "":
        return None
    try:
        return float(text)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid purchase price")


# Create a new clothing item
@router.post("", response_model=CreateOrPatchItemResponse, response_model_by_alias=True)
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
        parsed_tags = parse_tags(item.tags)
        parsed_price = parse_purchase_price(item.purchase_price)

        insert_query = text(
            "INSERT INTO cloth_items "
            "(id, owner_id, name, category, color, size, season, image_url, favorite, notes, created_at, wear_count, last_worn_at, purchase_price, material, brand, tags) "
            "VALUES (gen_random_uuid(), :owner_id, :name, :category, :color, :size, :season, :image_url, :favorite, :notes, NOW(), 0, NULL, :purchase_price, :material, :brand, :tags) "
            "RETURNING id, owner_id, name, category, color, size, season, image_url, favorite, notes, purchase_price, material, brand, tags"
        )
        result = db.execute(
            insert_query,
            {
                "owner_id": owner_id,
                "name": item.name,
                "category": item.category,
                "color": item.color,
                "size": item.size,
                "season": item.season,
                "image_url": image_data,
                "favorite": item.favorite,
                "notes": item.notes,
                "purchase_price": parsed_price,
                "material": item.material,
                "brand": item.brand,
                "tags": parsed_tags,
            },
        )
        # new_item = dict(result.first()._mapping)
        db.commit()

        return {"status": "success"}
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
            "SELECT id, name, category, color, season, image_url, favorite, tags "
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
                "tags": item._mapping["tags"],
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
@router.get("/{item_id}", response_model=ItemDetailResponse, response_model_by_alias=True)
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
            "SELECT id, owner_id, name, category, color, size, season, image_url, favorite, notes, purchase_price, material, brand, tags, wear_count, last_worn_at, created_at "
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
            "size": result._mapping["size"],
            "season": result._mapping["season"],
            "imageUrl": result._mapping["image_url"],
            "favorite": result._mapping["favorite"],
            "notes": result._mapping["notes"],
            "purchase_price": result._mapping["purchase_price"],
            "material": result._mapping["material"],
            "brand": result._mapping["brand"],
            "tags": result._mapping["tags"],
            "wear_count": result._mapping["wear_count"],
            "last_worn_at": result._mapping["last_worn_at"],
            "created_at": result._mapping["created_at"],
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch item: {str(exc)}")

# for updating an existing clothing item(edit or favorite toggle)
@router.patch("/{item_id}", response_model=CreateOrPatchItemResponse, response_model_by_alias=True)
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
            and item.size is None
            and item.season is None
            and item.material is None
            and item.brand is None
            and item.tags is None
            and item.purchase_price is None
            and item.favorite is None
            and item.notes is None
            and item.wear_count is None
            and item.last_worn_at is None
            and image_data is None
        ):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

        parsed_tags = parse_tags(item.tags) if item.tags is not None else None
        parsed_price = parse_purchase_price(item.purchase_price) if item.purchase_price is not None else None

        update_query = text(
            "UPDATE cloth_items SET "
            "name = COALESCE(:name, name), "
            "category = COALESCE(:category, category), "
            "color = COALESCE(:color, color), "
            "size = COALESCE(:size, size), "
            "season = COALESCE(:season, season), "
            "image_url = COALESCE(:image_url, image_url), "
            "material = COALESCE(:material, material), "
            "brand = COALESCE(:brand, brand), "
            "tags = COALESCE(:tags, tags), "
            "purchase_price = COALESCE(:purchase_price, purchase_price), "
            "favorite = COALESCE(:favorite, favorite), "
            "notes = COALESCE(:notes, notes), "
            "wear_count = COALESCE(:wear_count, wear_count), "
            "last_worn_at = COALESCE(:last_worn_at, last_worn_at), "
            "updated_at = NOW() "
            "WHERE id = :item_id AND owner_id = :owner_id "
            "RETURNING id, owner_id, name, category, color, size, season, image_url, favorite, notes, purchase_price, material, brand, tags"
        )
        result = db.execute(
            update_query,
            {
                "item_id": item_uuid,
                "owner_id": owner_id,
                "name": item.name,
                "category": item.category,
                "color": item.color,
                "size": item.size,
                "season": item.season,
                "image_url": image_data,
                "material": item.material,
                "brand": item.brand,
                "tags": parsed_tags,
                "purchase_price": parsed_price,
                "favorite": item.favorite,
                "notes": item.notes,
                "wear_count": item.wear_count,
                "last_worn_at": item.last_worn_at,
            },
        )
        updated_item = result.first()
        if not updated_item:
            raise HTTPException(status_code=404, detail="Item not found")

        db.commit()
        return {"status": "success"}
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
