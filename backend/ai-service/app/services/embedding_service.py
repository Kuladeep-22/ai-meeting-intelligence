from sentence_transformers import SentenceTransformer


class EmbeddingService:

    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is None:
            print("Loading embedding model...")

            cls._model = SentenceTransformer(
                "all-MiniLM-L6-v2",
                device="cpu"
            )

            print("Embedding model loaded.")

        return cls._model

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