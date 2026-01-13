from typing import Optional

from fastapi import Form
from pydantic import BaseModel


class ItemResponse(BaseModel):
    id: str
    name: str
    category: Optional[str] = None
    color: Optional[str] = None
    season: Optional[str] = None
    notes: Optional[str] = None


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
