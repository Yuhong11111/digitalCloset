from app.schemas.item import ItemClosetResponse
from fastapi import Form
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class AIRequest(BaseModel):
    message: str
    max_tokens: int = 150
    mode: str = "chat"
    recommendations_enabled: bool = True

    @classmethod
    def as_form(
        cls,
        message: str = Form(...),
        max_tokens: int = Form(150),
        mode: str = Form("chat"),
        recommendations_enabled: bool = Form(True),
    ) -> "AIRequest":
        # Allow AIRequest to be parsed from multipart/form-data (e.g., when images are uploaded).
        return cls(
            message=message,
            max_tokens=max_tokens,
            mode=mode,
            recommendations_enabled=recommendations_enabled,
        )

class AIResponse(BaseModel):
    message: str
    mode: str = "chat"
    draftItem: Optional[Dict[str, Any]] = None
    missingFields: List[str] = []
    referencedItems: List[ItemClosetResponse] = []
    mode : str = "chat"


class WeatherDisplay(BaseModel):
    location: str
    temp: str
    condition: str


class OutfitSuggestRequest(BaseModel):
    weather: WeatherDisplay
