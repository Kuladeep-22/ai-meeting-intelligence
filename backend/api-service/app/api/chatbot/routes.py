from fastapi import APIRouter

from .schemas import ChatRequest, IndexRequest

from .service import ask_chatbot, index_document

router = APIRouter(
    prefix="/chatbot",
    tags=["Chatbot"]
)


@router.post("/ask")
def chat(request: ChatRequest):

    return ask_chatbot(
        request.question
    )


@router.post("/index")
def index(request: IndexRequest):

    return index_document(
        request.doc_id,
        request.text,
    )