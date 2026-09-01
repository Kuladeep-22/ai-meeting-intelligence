class EmbeddingModel:

    def __init__(self):

        self.model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

    def encode(
        self,
        text: str
    ):

        embedding = self.model.encode(
            text
        )

        return embedding.tolist()

    def encode_batch(
        self,
        texts: list
    ):

        embeddings = self.model.encode(
            texts
        )

        return embeddings.tolist()