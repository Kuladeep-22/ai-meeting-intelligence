import whisper


class WhisperService:

    _model = None

    @classmethod
    def get_model(cls):

        if cls._model is None:
            print("Loading Whisper model...")

            cls._model = whisper.load_model(
                "tiny"
            )

            print("Whisper model loaded.")

        return cls._model

    @classmethod
    def transcribe(cls, audio_path):

        model = cls.get_model()

        return model.transcribe(
            audio_path
        )