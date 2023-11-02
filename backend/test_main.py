import sklearn  # put in requirements.txt
import sys
import simpleder  # put in reqruirements.txt
import os

from whisper_diarization import whisper_diarization


def test_audio():
    """
    Evaluate the whisper_diarization pipeline according to de facto diarization metrics
        reference - the ground truth
        hypothesis - the predicted results from our pipeline
    """
    # define folder paths
    reference_folder = "HumanDetection/dataset/references"
    audio_folder = "HumanDetection/dataset/audio_files"
    # get reference and audio files
    references = [file for file in os.listdir(reference_folder)]
    audio_files = [file for file in os.listdir(audio_folder)]

    for reference, audio_file in zip(references, audio_files):
        # construct file paths
        reference_path = os.path.join(reference_folder, reference)
        audio_path = os.path.join(audio_folder, audio_file)

        # feed audio into pipeline
        res = whisper_diarization(audio_path)

        with open(reference_path, "r") as ref:
            print(ref.readline())


def clean_rttm():
    """
    Clean up an .rttm file for evaluation tasks
    Args:
    Returns:
    """


def main():
    test_audio()


if __name__ == "__main__":
    main()
