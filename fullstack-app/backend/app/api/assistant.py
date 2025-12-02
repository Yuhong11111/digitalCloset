from fastapi import APIRouter, HTTPException
from openai import OpenAI
from pydantic import BaseModel
from app.db.mongo import db

router = APIRouter(prefix="/assistant", tags=["assistant"])

client = OpenAI()

class AIRequest(BaseModel):
    message: str
    userId: str
    max_tokens: int = 150

class AIResponse(BaseModel):
    response: str 

SYSTEM_PROMPT = """
You are a helpful AI fashion assistant. 
Give practical outfit suggestions. 
Keep answers concise, structured, and friendly.
"""


async def get_cloth(owner_id: str) -> str:
    if not owner_id:
        return "No closet data provided."
    cursor = db.clothes.find({"ownerId": owner_id})
    items = []
    async for item in cursor:
        name = item.get("name") or "Unnamed item"
        category = item.get("category")
        color = item.get("color")
        season = item.get("season")
        parts = [name]
        if category:
            parts.append(category)
        if color:
            parts.append(color)
        if season:
            parts.append(season)
        # an item would be like: "Blue Shirt, top, blue, summer"
        items.append(", ".join(parts))
    if not items:
        return "No closet items found for this user."
    summarized = "\n".join(f"- {entry}" for entry in items[:25])
    return f"getCloth tool result:\n{summarized}"

Toolset = """
You have access to the following tool:
getCloth: Retrieves the user's closet items for context.
"""


@router.post("", response_model=AIResponse)
async def get_ai_assistance(request: AIRequest):
    try:
        closet_context = await get_cloth(request.userId)
        # Call OpenAI API
        response = client.responses.create(
            model="gpt-4.1-mini",
            toolset=Toolset,
            # system message that sets the permanent behavior/personality of the assistant
            instructions=f"{SYSTEM_PROMPT}\nAlso, use the tool to get the user's closet data:\n{closet_context}",
            input=request.message,
            temperature=0.7,
            max_output_tokens=request.max_tokens,
        )
        reply_text = response.output_text
        return AIResponse(response=reply_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
