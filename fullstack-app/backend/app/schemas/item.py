from typing import Optional

from pydantic import BaseModel, HttpUrl


# pydantic model for item requests(request from frontend)
class ItemRequest(BaseModel):
    name: str
    category: str
    color: str
    season: str
    imageUrl: Optional[HttpUrl] = None   # Optional URL for image
    favorite: bool = False               # Boolean flag
    notes: Optional[str] = None
    ownerId: str  # ID of the user who owns the item
