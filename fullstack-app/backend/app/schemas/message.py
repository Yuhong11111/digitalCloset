from app.schemas.item import ItemClosetResponse
from fastapi import Form
from pydantic import BaseModel
from typing import List

class AIRequest(BaseModel):
    message: str
    max_tokens: int = 150
    mode: str = "chat"

    @classmethod
    def as_form(
        cls,
        message: str = Form(...),
        max_tokens: int = Form(150),
        mode: str = Form("chat"),
    ) -> "AIRequest":
        # Allow AIRequest to be parsed from multipart/form-data (e.g., when images are uploaded).
        return cls(
            message=message,
            max_tokens=max_tokens,
            mode=mode,
        )

class AIResponse(BaseModel):
    response: str
    referencedItems: List[ItemClosetResponse] = []
