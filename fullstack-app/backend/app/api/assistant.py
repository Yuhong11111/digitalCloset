import json
from typing import Any, Dict, List, Optional, Set

import uuid

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from openai import OpenAI
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.schemas.message import AIResponse, AIRequest, OutfitSuggestRequest
from app.schemas.item import ItemClosetResponse

router = APIRouter(prefix="/assistant", tags=["assistant"])

client = OpenAI()


def repair_json(raw: str) -> str:
    start = raw.find("{")
    end = raw.rfind("}")
    if start != -1 and end != -1 and end > start:
        raw = raw[start:end + 1]
    out = []
    in_str = False
    escape = False
    for ch in raw:
        if in_str:
            if escape:
                out.append(ch)
                escape = False
                continue
            if ch == "\\":
                out.append(ch)
                escape = True
                continue
            if ch == "\n":
                out.append("\\n")
                continue
            if ch == "\r":
                out.append("\\r")
                continue
            if ch == "\"":
                in_str = False
                out.append(ch)
                continue
            out.append(ch)
        else:
            if ch == "\"":
                in_str = True
            out.append(ch)
    return "".join(out)


SYSTEM_PROMPT = """
You are a digital closet assistant.

You receive:
- closet_items: list of items with fields id, name, color, category, season, notes
- question: the user's message
- mode: "chat" or "command"

Return ONLY valid JSON with this structure:
{
  "mode": "chat" | "command",
  "message": "string",
  "draftItem": {
    "name": "string|null",
    "category": "string|null",
    "color": ["string"],
    "season": ["string"],
    "material": "string|null",
    "brand": "string|null"
  } | null,
  "missingFields": ["field1", "field2"],
  "selected_item_ids": ["id1", "id2"]
}

Rules:
- Use only item ids from closet_items.
- If no item matches, use an empty array.
- The JSON must be valid and must not contain unescaped newlines inside strings.
"""



def get_cloth(db: Session, owner_id: Optional[str]) -> List[Dict[str, Any]]:
    if not owner_id:
        return []

    try:
        owner_uuid = uuid.UUID(owner_id)
    except ValueError:
        return []

    query = text(
        "SELECT id, name, category, color, season, notes "
        "FROM cloth_items WHERE owner_id = :owner_id"
    )
    results = db.execute(query, {"owner_id": owner_uuid}).fetchall()

    items_structured = []
    for item in results:
        row = item._mapping
        items_structured.append(
            {
                "id": str(row["id"]),
                "name": row["name"] or "Unnamed item",
                "category": row["category"],
                "color": row["color"],
                "season": row["season"],
                "notes": row["notes"] or "empty note",
            }
        )

    return items_structured


def get_closet_items(db: Session, owner_id: Optional[str]) -> List[Dict[str, Any]]:
    if not owner_id:
        return []

    try:
        owner_uuid = uuid.UUID(owner_id)
    except ValueError:
        return []

    query = text(
        "SELECT id, name, category, color, season, image_url, favorite, tags, notes "
        "FROM cloth_items WHERE owner_id = :owner_id "
        "ORDER BY favorite DESC, created_at DESC"
    )
    results = db.execute(query, {"owner_id": owner_uuid}).fetchall()

    items_structured = []
    for item in results:
        row = item._mapping
        items_structured.append(
            {
                "_id": str(row["id"]),
                "name": row["name"] or "Unnamed item",
                "category": row["category"],
                "color": row["color"],
                "season": row["season"],
                "imageUrl": row["image_url"],
                "favorite": row["favorite"],
                "tags": row["tags"],
                "notes": row["notes"] or "",
            }
        )

    return items_structured

# def clothToString(items: list[str]) -> str:
#     if not items:
#         return "No closet items found for this user."
#     summarized = "\n".join(f"- {entry}" for entry in items[:25])
#     return f"getCloth tool result:\n{summarized}"


@router.post("", response_model=AIResponse)
async def get_ai_assistance(
    request: AIRequest = Depends(AIRequest.as_form),
    image: Optional[UploadFile] = File(None),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        user_id = current_user.get("userId")
        # get mode to decide which system prompt to use
        mode = request.mode
        cloth_list: List[Dict[str, Any]] = []
        # if mode == "command" and image is not None: def command mode system
        # if mode == "chat": def chat mode system (more casual, less strict on response format)
        if mode == "command":
            instructions = f"""{SYSTEM_PROMPT}
            You are in COMMAND MODE.

            If an image is provided, you MUST extract as many details as possible directly from the image (name, category, color, season, material, patterns, and any visible notes like logos/brands).
            Provide a best-effort guess even if uncertain. Then ask a short follow-up only for missing or ambiguous fields.
            If no image is provided, ask the user to upload one and include any details they already know.
            Fill draftItem with your best guesses, set missingFields for anything you couldn't determine, and set type="add_clothing_draft".
            Always respond in valid JSON.
            """

        elif mode == "chat":
            cloth_list = get_cloth(db, user_id)
            payload = {
                "closet_items": cloth_list,
                "question": request.message
            }
            instructions = f"""{SYSTEM_PROMPT}
            You are in CHAT MODE.
            
            You are given the payload with the user's closet items and their question.{payload}

            you are having a friendly conversation with the user about their closet and fashion choices.
            Provide a natural language message, set type="chat_response", and include any relevant selected_item_ids.
            """
        else:
            instructions = SYSTEM_PROMPT
        # closet_text, cloth_list = await get_cloth(request.userId)
        # closet_context = clothToString(closet_text.split("\n"))
        image_file_id = None
        if image is not None:
            image.file.seek(0)
            image_bytes = image.file.read()
            uploaded = client.files.create(
                file=(image.filename or "upload", image_bytes, image.content_type or "application/octet-stream"),
                purpose="vision",
            )
            image_file_id = uploaded.id

        input_content = [
            {"type": "input_text", "text": request.message},
        ]
        if image_file_id:
            input_content.append({"type": "input_image", "file_id": image_file_id})

        # Call OpenAI API
        response = client.responses.create(
            model="gpt-4o-mini",
            # system message that sets the permanent behavior/personality of the assistant
            instructions=instructions,
            # since we include image data in the input, we need to use the structured input format and include the text and image as separate parts of the input array
            input=[{"role": "user", "content": input_content}],
            temperature=0.7,
            max_output_tokens=request.max_tokens,
        )
         # Parse JSON from the model response
        raw_json = response.output[0].content[0].text
        try:
            data = json.loads(raw_json)
        except json.JSONDecodeError:
            repaired = repair_json(raw_json)
            data = json.loads(repaired)

        response_mode = data.get("mode", mode)
        message = data.get("message", "")
        draft_item = data.get("draftItem")
        missing_fields = data.get("missingFields", [])
        selected_ids = set(data.get("selected_item_ids", []))
        # reply_text = response.output_text
        selected_items = [item for item in cloth_list if item["id"] in selected_ids]
        return AIResponse(
            mode=response_mode,
            message=message,
            draftItem=draft_item,
            missingFields=missing_fields,
            referencedItems=[ItemClosetResponse(**item) for item in selected_items],
        )
    except Exception as e:
        # you might want to log e here
        raise HTTPException(status_code=500, detail=str(e))
    

# for outfit suggestion, we can have a separate endpoint that takes weather info and returns a suggested outfit based on the user's closet items and the weather conditions. 
# This would likely involve another call to the OpenAI API with a prompt specifically designed for outfit suggestions.
@router.post("/outfit/suggest", response_model=List[ItemClosetResponse], response_model_by_alias=True)
async def get_outfit_suggest(
    request: OutfitSuggestRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        user_id = current_user.get("userId")
        closet_list = get_closet_items(db, user_id)
        if not closet_list:
            return []

        weather = request.weather.model_dump()
        prompt = {
            "weather": weather,
            "closet_items": [
                {
                    "id": item["_id"],
                    "name": item["name"],
                    "category": item["category"],
                    "color": item["color"],
                    "season": item["season"],
                    "tags": item["tags"],
                    "favorite": item["favorite"],
                    "notes": item["notes"],
                }
                for item in closet_list
            ],
        }

        response = client.responses.create(
            model="gpt-4o-mini",
            instructions="""
                You are a fashion assistant that selects clothing items for an outfit.

                Return ONLY valid JSON in this format:
                {
                "selected_item_ids": ["item-id-1", "item-id-2", "item-id-3"]
                }

                Rules:
                - Use only ids that appear in closet_items.
                - Choose 2 to 5 items that make sense together as one outfit.
                - Prefer items appropriate for the reported temperature and condition.
                - If there is no good match, return an empty array.
                """,
            input=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": json.dumps(prompt),
                        }
                    ],
                }
            ],
            temperature=0.4,
            max_output_tokens=300,
        )

        raw_json = response.output_text
        try:
            data = json.loads(raw_json)
        except json.JSONDecodeError:
            data = json.loads(repair_json(raw_json))

        selected_ids = set(data.get("selected_item_ids", []))
        selected_items = [item for item in closet_list if item["_id"] in selected_ids]
        return [ItemClosetResponse(**item) for item in selected_items]
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to generate outfit suggestion: {type(exc).__name__}: {exc}")
