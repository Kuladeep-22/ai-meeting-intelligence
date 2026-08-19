from flask import Blueprint, request, jsonify

risk_bp = Blueprint("risks", __name__)


@risk_bp.route("/risks", methods=["POST"])
def detect_risks():

    data = request.get_json()

    transcript = data.get("transcript", "")

    risks = []

    keywords = [
        "delay",
        "risk",
        "issue",
        "problem",
        "blocked",
        "deadline",
    ]

    for sentence in transcript.split("."):

        if any(
            word.lower() in sentence.lower()
            for word in keywords
        ):
            risks.append(sentence.strip())

    return jsonify({
        "risks": risks
    })