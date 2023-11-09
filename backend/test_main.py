import sys
from pyannote.metrics.diarization import DiarizationErrorRate
from pyannote.database import get_protocol, FileFinder
from pyannote.core import Annotation, Segment
import simpleder  # include in requirements.txt
import os
from whisper_diarization import whisper_diarization


def test_audio():
    """
    Evaluate the whisper_diarization pipeline according to de facto diarization metrics
        reference - the ground truth
        hypothesis - the predicted results from our pipeline
        DER - diarization error rate
    """
    # define folder paths
    reference_folder = "HumanDetection/dataset/references"
    audio_folder = "HumanDetection/dataset/audio_files"

    # get reference and audio files (unsure if this always works)
    references = [file for file in os.listdir(reference_folder)]
    audio_files = [file for file in os.listdir(audio_folder)]

    for reference, audio_file in zip(references, audio_files):
        # construct file paths
        reference_path = os.path.join(reference_folder, reference)
        audio_path = os.path.join(audio_folder, audio_file)

        # feed audio into pipeline
        hyp = whisper_diarization(audio_path, testing=True)

        # convert rttm file to Annotation
        with open(reference_path, "r") as f:
            ref = rttm_to_annotation(f, reference)

        # calculate DER
        metric = DiarizationErrorRate()
        value = metric(ref, hyp)

        print(f"DER value: {round(value,ndigits=4)}")


def rttm_to_annotation(file, filename):
    """
    Convert a .rttm file to an Annotation object
    Args:
        f: The .rttm file
        filename: the name of the file
    Returns:
        annotation: A new Annotation object
    """
    annotation = Annotation(modality="speaker")
    for line in file:
        temp = []
        clean_line = line.split()
        # get rid of irrelevant fields
        # see https://stackoverflow.com/a/74358577 for more about rttm
        onset = float(clean_line[3])
        duration = float(clean_line[4])
        id = clean_line[7]
        temp.append(round(onset + duration, ndigits=4))  # end time
        temp.append(round(onset, ndigits=4))  # start time
        # clean speaker id tag
        temp.append(id[3:] if id[3] != "0" else id[4:])
        temp = tuple(temp[::-1])
        annotation[Segment(onset, duration + onset), filename] = id

    return annotation


def main():
    test_audio()


if __name__ == "__main__":
    main()
