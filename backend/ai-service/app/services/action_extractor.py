class ActionExtractor:

    KEYWORDS = [
        "will",
        "should",
        "need to",
        "must",
        "assign",
        "complete",
        "update"
    ]

    @classmethod
    def extract(cls, transcript: str):

        actions = []

        for sentence in transcript.split("."):

            text = sentence.strip()

            if any(
                keyword in text.lower()
                for keyword in cls.KEYWORDS
            ):
                actions.append(text)

        return {
            "action_items": actions
        }