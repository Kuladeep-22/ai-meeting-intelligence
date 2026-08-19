from flask import Blueprint
from flask import request
from flask import jsonify

from app.services.summarizer import Summarizer

summarize_bp = Blueprint(
    "summarize",
    __name__
)


@summarize_bp.route(
    "/summarize",
    methods=["POST"]
)
def summarize():

    transcript = request.json.get(
        "transcript",
        ""
    )

    result = Summarizer.summarize(
        transcript
    )

    return jsonify(result)