from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str


class IndexRequest(BaseModel):
    doc_id: str
    text: str