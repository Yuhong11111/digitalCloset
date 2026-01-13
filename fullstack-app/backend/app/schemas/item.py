from typing import Optional

from fastapi import Form
from pydantic import BaseModel, ConfigDict, Field


class ItemResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="_id")
    name: str
    category: Optional[str] = None
    color: Optional[str] = None
    season: Optional[str] = None
    size: Optional[str] = None
    imageUrl: Optional[str] = None
    notes: Optional[str] = None
    favorite: Optional[bool] = None


class ItemRequest(BaseModel):
    name: str
    category: str
    color: str
    season: str
    favorite: bool = False
    notes: Optional[str] = None

    @classmethod
    def as_form(
        cls,
        name: str = Form(...),
        category: str = Form(...),
        color: str = Form(...),
        season: str = Form(...),
        favorite: bool = Form(False),
        notes: Optional[str] = Form(None),
    ) -> "ItemRequest":
        return cls(
            name=name,
            category=category,
            color=color,
            season=season,
            favorite=favorite,
            notes=notes,
        )


class CreateItemResponse(BaseModel):
    status: str
    item: ItemResponse

class ItemPatchRequest(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    season: Optional[str] = None
    favorite: Optional[bool] = None
    notes: Optional[str] = None

    @classmethod
    def as_form(
        cls,
        name: Optional[str] = Form(None),
        category: Optional[str] = Form(None),
        color: Optional[str] = Form(None),
        season: Optional[str] = Form(None),
        favorite: Optional[bool] = Form(None),
        notes: Optional[str] = Form(None),
    ) -> "ItemPatchRequest":
        return cls(
            name=name,
            category=category,
            color=color,
            season=season,
            favorite=favorite,
            notes=notes,
        )

class PatchResponse(BaseModel):
    status: str
    item: ItemPatchRequest