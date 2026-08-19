import os

from flask import Blueprint, request, jsonify

from app.vectorstore.retrieval import retrieval_service
from app.models.llm_client import LLMClient

chatbot_bp = Blueprint(
    "chatbot",
    __name__,
)

_prompt_path = os.path.join(
    os.path.dirname(__file__),
    "..",
    "prompts",
    "chatbot_prompt.txt",
)

with open(_prompt_path, "r", encoding="utf-8") as f:
    CHATBOT_PROMPT = f.read()

_llm_client = None


def _get_llm_client():
    global _llm_client

    if _llm_client is None and os.getenv("OPENAI_API_KEY"):
        _llm_client = LLMClient()

    return _llm_client


@chatbot_bp.route(
    "/chat",
    methods=["POST"],
)
def chatbot():

    data = request.get_json()

    question = data.get(
        "question",
        ""
    )

    if not question:
        return jsonify({
            "answer": "Please ask a question."
        }), 400

    try:
        results = retrieval_service.retrieve(question, top_k=3)
        documents = results.get("documents", [[]])[0]
    except Exception:
        documents = []

    context = "\n".join(f"- {doc}" for doc in documents)

    llm_client = _get_llm_client()

    if llm_client and documents:
        try:
            prompt = CHATBOT_PROMPT.format(
                context=context,
                question=question,
            )

            answer = llm_client.generate(prompt)
        except Exception as e:
            answer = f"AI Service Error: {str(e)}"
    elif documents:
        answer = (
            "Based on your meeting records, here's what I found:\n"
            f"{context}"
        )
    else:
        answer = (
            f"You asked: '{question}'. No relevant meeting content has been "
            "indexed yet, so I can't ground this answer in your data."
        )

    return jsonify({
        "answer": answer,
        "sources": documents,
    })