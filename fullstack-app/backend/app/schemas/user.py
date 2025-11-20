from typing import Optional

from pydantic import BaseModel, EmailStr


# pydantic model for user requests(request from frontend)
class UserRequest(BaseModel):
    username: str
    password: str
    email: Optional[EmailStr] = None  # Optional for login, required for signup
