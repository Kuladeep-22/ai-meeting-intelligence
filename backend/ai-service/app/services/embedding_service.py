from sentence_transformers import SentenceTransformer


class EmbeddingService:

    model = SentenceTransformer(
        "all-MiniLM-L6-v2"
    )

    @classmethod
    def generate_embedding(
        cls,
        text: str
    ):

        embedding = cls.model.encode(text)

        return embedding.tolist()