from sentence_transformers import SentenceTransformer


class EmbeddingService:

    @staticmethod
    def generate_embedding(text: str):
        raise NotImplementedError(
            "Local embedding are disabled."
            "Chroma handles document embeddings."
        )

    @classmethod
    def generate_embedding(cls, text: str):

        if not text or not text.strip():
            return []

        model = cls.get_model()

        embedding = model.encode(
            text,
            convert_to_numpy=True,
            normalize_embeddings=True
        )

        return embedding.tolist()