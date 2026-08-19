from pydantic import BaseModel
from typing import Optional


class NotificationCreate(BaseModel):
    user_id: int
    title: str
    message: str


class NotificationUpdate(BaseModel):
    title: Optional[str] = None
    message: Optional[str] = None
    is_read: Optional[bool] = None


class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    is_read: bool

    class Config:
        from_attributes = True