from typing import List, Optional

from pydantic import BaseModel


class PreferenceRequest(BaseModel):
    preferred_colors: Optional[List[str]] = None
    preferred_fits: Optional[List[str]] = None
    preferred_occasions: Optional[List[str]] = None
    preferred_climate: Optional[List[str]] = None
    preferred_style_tags: Optional[List[str]] = None


class PreferenceResponse(BaseModel):
    message: str