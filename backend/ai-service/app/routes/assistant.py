from flask import Blueprint, request, jsonify

from app.services.rag_service import RAGService
from app.services.groq_service import GroqService


assistant_bp = Blueprint(
    "assistant",
    __name__
)


@assistant_bp.route("/chat", methods=["POST"])
def chat():

    try:
        data = request.get_json(silent=True)

        print("CHAT REQUEST:", data)

        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required"
            }), 400

        question = data.get("question", "").strip()

        if not question:
            return jsonify({
                "success": False,
                "message": "Question is required"
            }), 400

        print("USER QUESTION:", question)

        # ---------------------------------------
        # Search relevant meeting information
        # ---------------------------------------

        rag_result = RAGService.search(
            question=question,
            top_k=5
        )

        documents = rag_result.get(
            "results",
            []
        )

        print("RAG DOCUMENTS:", documents)

        # ---------------------------------------
        # Build context
        # ---------------------------------------

        context = ""

        if documents:
            context = "\n\n".join(
                documents
            )

        print("CONTEXT:", context)

        # ---------------------------------------
        # Send actual question to Groq
        # ---------------------------------------

        answer = GroqService.generate(
            question=question,
            context=context
        )

        print("AI ANSWER:", answer)

        return jsonify({
            "success": True,
            "question": question,
            "answer": answer,
            "sources": documents
        })

    except Exception as e:

        print(
            "AI ASSISTANT ERROR:",
            str(e)
        )

        return jsonify({
            "success": False,
            "message": "AI Assistant failed",
            "error": str(e)
        }), 500