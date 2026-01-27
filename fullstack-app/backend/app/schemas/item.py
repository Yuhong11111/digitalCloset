from typing import Optional, List

from fastapi import Form
from pydantic import BaseModel, ConfigDict, Field


class ItemClosetResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="_id")
    name: str
    category: Optional[str] = None
    color: Optional[str] = None
    season: Optional[str] = None
    size: Optional[str] = None
    material: Optional[str] = None
    brand: Optional[str] = None
    tags: Optional[List[str]] = None
    purchase_price: Optional[float] = None
    imageUrl: Optional[str] = None
    notes: Optional[str] = None
    favorite: Optional[bool] = None


class ItemRequest(BaseModel):
    name: str
    category: str
    color: str
    season: str
    size: Optional[str] = None
    material: Optional[str] = None
    brand: Optional[str] = None
    tags: Optional[str] = None
    purchase_price: Optional[str] = None
    favorite: bool = False
    notes: Optional[str] = None

    @classmethod
    def as_form(
        cls,
        name: str = Form(...),
        category: str = Form(...),
        color: str = Form(...),
        season: str = Form(...),
        size: Optional[str] = Form(None),
        material: Optional[str] = Form(None),
        brand: Optional[str] = Form(None),
        tags: Optional[str] = Form(None),
        purchase_price: Optional[str] = Form(None),
        favorite: bool = Form(False),
        notes: Optional[str] = Form(None),
    ) -> "ItemRequest":
        return cls(
            name=name,
            category=category,
            color=color,
            season=season,
            size=size,
            material=material,
            brand=brand,
            tags=tags,
            purchase_price=purchase_price,
            favorite=favorite,
            notes=notes,
        )


class CreateItemResponse(BaseModel):
    status: str
    item: ItemClosetResponse


class ItemsPageResponse(BaseModel):
    items: List[ItemClosetResponse]
    page: int
    page_size: int
    total: int

class ItemPatchRequest(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    season: Optional[str] = None
    size: Optional[str] = None
    material: Optional[str] = None
    brand: Optional[str] = None
    tags: Optional[str] = None
    purchase_price: Optional[str] = None
    favorite: Optional[bool] = None
    notes: Optional[str] = None


    @classmethod
    def as_form(
        cls,
        name: Optional[str] = Form(None),
        category: Optional[str] = Form(None),
        color: Optional[str] = Form(None),
        season: Optional[str] = Form(None),
        size: Optional[str] = Form(None),
        material: Optional[str] = Form(None),
        brand: Optional[str] = Form(None),
        tags: Optional[str] = Form(None),
        purchase_price: Optional[str] = Form(None),
        favorite: Optional[bool] = Form(None),
        notes: Optional[str] = Form(None),
    ) -> "ItemPatchRequest":
        return cls(
            name=name,
            category=category,
            color=color,
            season=season,
            size=size,
            material=material,
            brand=brand,
            tags=tags,
            purchase_price=purchase_price,
            favorite=favorite,
            notes=notes,
        )

class PatchResponse(BaseModel):
    status: str
    item: ItemPatchRequest
