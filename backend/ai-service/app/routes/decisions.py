from flask import Blueprint, request, jsonify

decision_bp = Blueprint("decisions", __name__)


@decision_bp.route("/decisions", methods=["POST"])
def extract_decisions():

    data = request.get_json()

    transcript = data.get("transcript", "")

    decisions = []

    keywords = [
        "decided",
        "decision",
        "approved",
        "confirmed",
        "finalized",
    ]

    for sentence in transcript.split("."):

        if any(
            word.lower() in sentence.lower()
            for word in keywords
        ):
            decisions.append(sentence.strip())

    return jsonify({
        "decisions": decisions
    })