from fastapi import APIRouter, HTTPException, Response, status
from openai import OpenAI
from app.core.config import settings
from pydantic import BaseModel

router = APIRouter(prefix="/assistant", tags=["assistant"])

client = OpenAI()

class AIRequest(BaseModel):
    message: str
    max_tokens: int = 150

class AIResponse(BaseModel):
    response: str 

SYSTEM_PROMPT = """
You are a helpful AI fashion assistant. 
Give practical outfit suggestions. 
Keep answers concise, structured, and friendly.
"""

@router.post("", response_model=AIResponse)
async def get_ai_assistance(request: AIRequest):
    try:
        # Call OpenAI API
        response = client.responses.create(
            model="gpt-4.1-mini",
            # system message that sets the permanent behavior/personality of the assistant
            instructions=SYSTEM_PROMPT,
            input=request.message,
            temperature=0.7,
            max_output_tokens=request.max_tokens,
        )
        reply_text = response.output_text
        return AIResponse(response=reply_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))