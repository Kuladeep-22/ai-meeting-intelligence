class DecisionExtractor:

    KEYWORDS = [
        "decided",
        "decision",
        "approved",
        "finalized",
        "confirmed",
        "agreed"
    ]

    @classmethod
    def extract(cls, transcript: str):

        decisions = []

        for sentence in transcript.split("."):

            text = sentence.strip()

            if any(
                word in text.lower()
                for word in cls.KEYWORDS
            ):
                decisions.append(text)

        return {
            "decisions": decisions
        }