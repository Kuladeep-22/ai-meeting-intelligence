from pydantic import BaseModel
from typing import Optional


class RiskCreate(BaseModel):
    meeting_id: int
    title: str
    description: Optional[str] = None
    severity: str
    owner: str
    status: str = "Open"


class RiskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    owner: Optional[str] = None
    status: Optional[str] = None


class RiskResponse(BaseModel):
    id: int
    meeting_id: int
    title: str
    description: Optional[str]
    severity: str
    owner: str
    status: str

    class Config:
        from_attributes = True