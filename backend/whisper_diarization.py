from pyannote.audio import Pipeline
from pydub import AudioSegment
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
from utils import convert_to_wav
import os
import numpy as np
import torch


device = "cuda:0" if torch.cuda.is_available() else "cpu"

print("Running on", device)
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32


# check if temp folder exists
if not os.path.exists("temp"):
    os.makedirs("temp")


def extract_audio_segment(input_file, start_time, end_time):
    audio = AudioSegment.from_file(input_file)
    start_ms = start_time * 1000
    end_ms = end_time * 1000

    segment = audio[start_ms:end_ms]
    output_file = f"temp/{start_time}-{end_time}.wav"

    # Export the segment as a new audio file
    segment.export(output_file, format="wav")
    return output_file


def whisper_diarization(filename: str, distil: bool = False):
    filename = convert_to_wav(filename)

    diarization_pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.0",
        use_auth_token=os.getenv("HF_KEY"),
    )

    outputs = diarization_pipeline(filename)

    # uses distilwhisper
    asr_pipeline = None

    if distil:
        model_id = "distil-whisper/distil-large-v2"
        model = AutoModelForSpeechSeq2Seq.from_pretrained(
            model_id,
            torch_dtype=torch_dtype,
            low_cpu_mem_usage=True,
            use_safetensors=True,
        )
        model.to(device)

        processor = AutoProcessor.from_pretrained(model_id)

        asr_pipeline = pipeline(
            "automatic-speech-recognition",
            model=model,
            tokenizer=processor.tokenizer,
            feature_extractor=processor.feature_extractor,
            torch_dtype=torch_dtype,
            device=device,
        )
    else:
        asr_pipeline = pipeline(
            "automatic-speech-recognition",
            model="openai/whisper-base",
        )

    res = []

    for turn, _, speaker in outputs.itertracks(yield_label=True):
        # get segment based on turn.start and turn.end from the original file
        segment = extract_audio_segment(filename, turn.start, turn.end)
        text = asr_pipeline(segment)["text"]
        print(
            f"{speaker} {np.round(turn.start, 2)}:{np.round(turn.end, 2)}",
            text,
        )

        res.append([turn.start, turn.end, speaker, text])
    # delete temp files
    for f in os.listdir("temp"):
        os.remove(os.path.join("temp", f))
    return res
