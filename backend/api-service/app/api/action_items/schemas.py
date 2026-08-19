from pydantic import BaseModel
from typing import Optional


class ActionItemCreate(BaseModel):
    meeting_id: int
    title: str
    assigned_to: str
    deadline: str
    status: str = "Pending"


class ActionItemUpdate(BaseModel):
    title: Optional[str] = None
    assigned_to: Optional[str] = None
    deadline: Optional[str] = None
    status: Optional[str] = None


class ActionItemResponse(BaseModel):
    id: int
    meeting_id: int
    title: str
    assigned_to: str
    deadline: str
    status: str

    class Config:
        from_attributes = True