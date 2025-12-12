from typing import Optional

from pydantic import BaseModel


class ItemResponse(BaseModel):
    id: str
    name: str
    category: Optional[str] = None
    color: Optional[str] = None
    season: Optional[str] = None
    note: Optional[str] = None

