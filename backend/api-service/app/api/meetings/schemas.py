from pydantic import BaseModel
from typing import List, Optional


class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    meeting_date: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    organizer: str
    participant_ids: Optional[List[int]] = []


class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    meeting_date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    organizer: Optional[str] = None
    participant_ids: Optional[List[int]] = None


class ParticipantResponse(BaseModel):
    id: int
    user_id: int
    status: str
    full_name: Optional[str] = None
    email: Optional[str] = None

    class Config:
        from_attributes = True


class RSVPUpdate(BaseModel):
    # accepted | declined | tentative
    status: str


class MeetingResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    meeting_date: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    organizer: str
    join_url: Optional[str] = None
    participants: List[ParticipantResponse] = []


    class Config:
        from_attributes = True