from flask import Blueprint, request, jsonify

from app.vectorstore.retrieval import retrieval_service

rag_bp = Blueprint(
    "rag",
    __name__,
)


@rag_bp.route(
    "/rag/index",
    methods=["POST"],
)
def rag_index():

    data = request.get_json() or {}

    doc_id = data.get("doc_id")
    text = data.get("text", "")

    if not doc_id or not text:
        return jsonify({
            "error": "doc_id and text are required"
        }), 400

    retrieval_service.index(doc_id, text)

    return jsonify({
        "status": "indexed",
        "doc_id": doc_id,
    })


@rag_bp.route(
    "/rag/search",
    methods=["POST"],
)
def rag_search():

    data = request.get_json() or {}

    question = data.get("question", "")
    top_k = data.get("top_k", 5)

    if not question:
        return jsonify({
            "error": "question is required"
        }), 400

    results = retrieval_service.retrieve(question, top_k=top_k)

    documents = results.get("documents", [[]])[0]
    distances = results.get("distances", [[]])[0]
    ids = results.get("ids", [[]])[0]

    matches = [
        {"id": doc_id, "text": text, "distance": distance}
        for doc_id, text, distance in zip(ids, documents, distances)
    ]

    return jsonify({
        "results": matches
    })
