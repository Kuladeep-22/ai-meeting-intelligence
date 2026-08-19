from flask import Blueprint, request, jsonify

from textblob import TextBlob

sentiment_bp = Blueprint(
    "sentiment",
    __name__,
)


@sentiment_bp.route(
    "/sentiment",
    methods=["POST"],
)
def sentiment():

    data = request.get_json()

    transcript = data.get(
        "transcript",
        ""
    )

    polarity = TextBlob(
        transcript
    ).sentiment.polarity

    if polarity > 0:

        label = "Positive"

    elif polarity < 0:

        label = "Negative"

    else:

        label = "Neutral"

    return jsonify({
        "sentiment": label,
        "score": polarity,
    })