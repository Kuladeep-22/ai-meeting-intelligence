from pydantic import BaseModel
from typing import Optional


class DecisionCreate(BaseModel):
    meeting_id: int
    title: str
    description: Optional[str] = None
    owner: str
    status: str = "Pending"


class DecisionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    owner: Optional[str] = None
    status: Optional[str] = None


class DecisionResponse(BaseModel):
    id: int
    meeting_id: int
    title: str
    description: Optional[str]
    owner: str
    status: str

    class Config:
        from_attributes = True