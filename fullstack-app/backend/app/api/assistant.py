import json
from typing import Any, Dict, List, Optional, Set

from fastapi import APIRouter, Depends, HTTPException
from openai import OpenAI
from pydantic import BaseModel

from app.api.deps import get_current_user
from app.db.mongo import db
from app.schemas.item import ItemResponse

router = APIRouter(prefix="/assistant", tags=["assistant"])

client = OpenAI()

class AIRequest(BaseModel):
    message: str
    max_tokens: int = 150

class AIResponse(BaseModel):
    response: str
    referencedItems: List[ItemResponse] = []

SYSTEM_PROMPT = """
You are a closet assistant.

You receive:
- closet_items: a list of items with fields id, name, color, category, season, note
- question: the user's question

Your job:
1. Answer the question naturally.
2. Identify which items are relevant, if there are any.
3. Return ONLY JSON in this exact schema:

{
  "answer": "string",
  "selected_item_ids": ["id1", "id2"]
}
"""


async def get_cloth(owner_id: Optional[str]) -> List[Dict[str, Any]]:
    if not owner_id:
        return []
    cursor = db.clothes.find({"ownerId": owner_id})
    # items_text = []
    items_structured = []
    async for item in cursor:
        id = item.get("_id")
        name = item.get("name") or "Unnamed item"
        category = item.get("category")
        color = item.get("color")
        season = item.get("season")
        note = item.get("note") or "empty note"
        # parts = [name]
        # if category:
        #     parts.append(category)
        # if color:
        #     parts.append(color)
        # if season:
        #     parts.append(season)
        # if note and note != "empty note":
        #     parts.append(f"note: {note}")
        # # an item would be like: "Blue Shirt, top, blue, summer"
        # items_text.append(", ".join(parts))

        items_structured.append({
            "id": str(id),
            "name": name,
            "category": category,
            "color": color,
            "season": season,
            "note": note,
        })
    # return "\n".join(items_text), items_structured
    return items_structured

# def clothToString(items: list[str]) -> str:
#     if not items:
#         return "No closet items found for this user."
#     summarized = "\n".join(f"- {entry}" for entry in items[:25])
#     return f"getCloth tool result:\n{summarized}"


@router.post("", response_model=AIResponse)
async def get_ai_assistance(
    request: AIRequest,
    current_user=Depends(get_current_user),
):
    try:
        user_id = current_user.get("userId")
        cloth_list = await get_cloth(user_id)
        payload = {
            "closet_items": cloth_list,
            "question": request.message
        }
        # closet_text, cloth_list = await get_cloth(request.userId)
        # closet_context = clothToString(closet_text.split("\n"))
        # Call OpenAI API
        response = client.responses.create(
            model="gpt-4.1-mini",
            # system message that sets the permanent behavior/personality of the assistant
            instructions=f"""{SYSTEM_PROMPT}
            You are a digital closet assistant.

            You receive a JSON object with two fields, which is {payload}:
            - "closet_items": a list of clothing items (id, name, color, category, season, image_url)
            - "question": the user's question about their clothes.

            Your job:
            1. Answer the user's question in natural language.
            2. Identify which specific items from "closet_items" you are referring to.

            You MUST respond with ONLY valid JSON (no extra text, no backticks).
            The JSON must have exactly this structure:

            {{
            "answer": "string",
            "selected_item_ids": ["id1", "id2", ...]
            }}

            Rules:
            - "selected_item_ids" must contain only ids that actually exist in "closet_items".
            - If no item matches, use an empty array [].
            """,
            input=request.message,
            # response_format={
            #     "type": "json_schema",
            #     "json_schema": {
            #         "name": "closet_answer",
            #         "schema": {
            #             "type": "object",
            #             "properties": {
            #                 "answer": {"type": "string"},
            #                 "selected_item_ids": {
            #                     "type": "array",
            #                     "items": {"type": "string"},
            #                 },
            #             },
            #             "required": ["answer", "selected_item_ids"],
            #             "additionalProperties": False,
            #         },
            #         "strict": True,
            #     },
            # },
            temperature=0.7,
            max_output_tokens=request.max_tokens,
        )
         # 4. Parse JSON from the model response
        raw_json = response.output[0].content[0].text
        data = json.loads(raw_json)

        answer: str = data["answer"]
        selected_ids = set(data["selected_item_ids"])
        # reply_text = response.output_text
        selected_items = [item for item in cloth_list if item["id"] in selected_ids]
        return AIResponse(
            response=answer,
            referencedItems=[ItemResponse(**item) for item in selected_items],
        )
    except Exception as e:
        # you might want to log e here
        raise HTTPException(status_code=500, detail=str(e))
