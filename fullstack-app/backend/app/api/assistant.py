from fastapi import APIRouter, HTTPException, Response, status
from openai import OpenAI
from app.core.config import settings

router = APIRouter(prefix="/assistant", tags=["assistant"])

client = Openai()