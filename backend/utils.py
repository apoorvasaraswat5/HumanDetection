import os

# make sure you install ffmpeg for it to work


def convert_to_wav(filename: str):
    name, ext = os.path.splitext(filename)
    path = f"{name}.wav"

    if ext != "wav":
        # convert to wav it is not already in the format
        os.system(f"ffmpeg -i {filename} {name}.wav")
    return path
