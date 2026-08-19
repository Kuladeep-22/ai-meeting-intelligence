from flask import Blueprint, request, jsonify

actions_bp = Blueprint(
    "actions",
    __name__,
)


@actions_bp.route(
    "/actions",
    methods=["POST"],
)
def extract_actions():

    data = request.get_json()

    transcript = data.get(
        "transcript",
        ""
    )

    actions = []

    keywords = [
        "will",
        "should",
        "need to",
        "must",
        "assign",
    ]

    for sentence in transcript.split("."):

        if any(
            word.lower() in sentence.lower()
            for word in keywords
        ):
            actions.append(
                sentence.strip()
            )

    return jsonify({
        "action_items": actions
    })