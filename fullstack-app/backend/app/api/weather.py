from fastapi import APIRouter, HTTPException, Query
import httpx

from app.core.config import settings

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/current")
async def get_current_weather(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180),
):
    if not settings.WEATHER_API_KEY:
        raise HTTPException(status_code=500, detail="Weather API key is not configured")

    weather_api_url = (
        "https://api.weatherapi.com/v1/current.json"
        f"?key={settings.WEATHER_API_KEY}&q={lat},{lon}&aqi=no"
    )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(weather_api_url)
            response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=502, detail="Weather provider returned an error") from exc
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="Unable to reach weather provider") from exc

    data = response.json()
    location = data.get("location") or {}
    current = data.get("current") or {}
    condition = current.get("condition") or {}

    city = location.get("name")
    region = location.get("region")
    location_label = ", ".join(part for part in [city, region] if part) or "Current location"

    return {
        "location": location_label,
        "temp_c": round(current.get("temp_c")) if isinstance(current.get("temp_c"), (int, float)) else None,
        "condition": condition.get("text"),
    }
