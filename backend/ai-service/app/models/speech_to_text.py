class WhisperService:

    @classmethod
    def transcribe(cls, audio_path):

        raise RuntimeError(
            "Local Whisper transcription is disabled "
            "on the Render free instance."
        )