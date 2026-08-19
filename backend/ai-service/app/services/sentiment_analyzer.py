from textblob import TextBlob


class SentimentAnalyzer:

    @staticmethod
    def analyze(text: str):

        polarity = TextBlob(
            text
        ).sentiment.polarity

        if polarity > 0:

            sentiment = "Positive"

        elif polarity < 0:

            sentiment = "Negative"

        else:

            sentiment = "Neutral"

        return {
            "sentiment": sentiment,
            "score": polarity
        }