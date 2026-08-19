class RiskDetector:

    KEYWORDS = [
        "risk",
        "delay",
        "blocked",
        "problem",
        "issue",
        "deadline",
        "dependency",
        "uncertain"
    ]

    @classmethod
    def detect(cls, transcript: str):

        risks = []

        for sentence in transcript.split("."):

            text = sentence.strip()

            if any(
                keyword in text.lower()
                for keyword in cls.KEYWORDS
            ):
                risks.append(text)

        return {
            "risks": risks
        }