from flask import Blueprint, request, jsonify

from app.services.groq_service import generate_answer


assistant_bp = Blueprint(
    "assistant",
    __name__
)


def handle_chat():
    try:

        data = request.get_json(silent=True) or {}

        question = str(
            data.get("question", "")
        ).strip()

        context = str(
            data.get("context", "")
        )

        if not question:

            return jsonify({
                "error": "question is required"
            }), 400

        answer = generate_answer(
            question=question,
            context=context
        )

        return jsonify({
            "answer": answer
        }), 200

    except Exception as e:

        print("========== CHAT ERROR ==========")
        print(type(e).__name__, str(e))
        print("================================")

        return jsonify({
            "error": str(e)
        }), 500


# Support BOTH URLs.
#
# This removes the URL mismatch that has been causing
# your 404 errors.

assistant_bp.route(
    "/api/v1/chat",
    methods=["POST"]
)(handle_chat)

assistant_bp.route(
    "/chat",
    methods=["POST"]
)(handle_chat)