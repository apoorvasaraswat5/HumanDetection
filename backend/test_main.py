#import sklearn  # put in requirements.txt
import sys
#import simpleder  # put in reqruirements.txt
import os

#from whisper_diarization import whisper_diarization


def test_audio():
    """
    Evaluate the whisper_diarization pipeline according to de facto diarization metrics
        reference - the ground truth
        hypothesis - the predicted results from our pipeline
    """
    # define folder paths
    reference_folder = "HumanDetection/dataset/references"
    audio_folder = "HumanDetection/dataset/audio_files"

    # get reference and audio files (unsure if this always works)
    references = sorted([file for file in os.listdir(reference_folder)])
    audio_files = sorted([file for file in os.listdir(audio_folder)])

    for reference, audio_file in zip(references, audio_files):
        # construct file paths
        reference_path = os.path.join(reference_folder, reference)
        audio_path = os.path.join(audio_folder, audio_file)

        # feed audio into pipeline
        #res = whisper_diarization(audio_path)

        # get cleaned up reference
        clean_rttm(reference_path)

        


def clean_rttm(reference_path):
    """
    Clean up an .rttm file for evaluation tasks
    Args: file - file path for a .rttm file
    Returns: a list of tuples of form:
            (speaker id, time start, time end)
    """
    res = []
    running_time = 0.00 # keep track of time from 0.00
    with open(reference_path, "r") as ref:
        for line in ref:
            temp = []
            clean_line = line.split()
            # get rid of irrelevant fields
            # see https://stackoverflow.com/a/74358577 for more about rttm
            for i, elem in enumerate(clean_line):
                # get timestamps
                if i in [3, 4]:
                    temp.append(float(elem))
                # get speaker id in correct format
                if i == 7:
                    temp.append(elem[3:] if elem[3] != "0" else elem[4:])
            temp = temp[::-1]

            print(temp)

            

def main():
    test_audio()


if __name__ == "__main__":
    main()
