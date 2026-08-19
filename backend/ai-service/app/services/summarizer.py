import re


class Summarizer:

    @staticmethod
    def summarize(transcript: str):

        transcript = re.sub(r"\s+", " ", transcript).strip()

        sentences = transcript.split(".")

        summary = ". ".join(sentences[:5])

        if summary:
            summary += "."

        return {
            "summary": summary
        }