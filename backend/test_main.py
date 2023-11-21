import sys
from pyannote.metrics.diarization import DiarizationErrorRate
from pyannote.core import Annotation, Segment
import os
import csv
import pandas as pd  # include in requirements.txt
from PIL import Image  # include in requirements.txt
from whisper_diarization import whisper_diarization
from main import humanDetector


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
    references = sorted([file for file in os.listdir(reference_folder)])
    audio_files = sorted([file for file in os.listdir(audio_folder)])

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


def test_video(filename):
    """
    Evaluate the human detection pipeline according to easily interpretable metrics
    """
    # run sample
    humanDetector("HumanDetection/dataset/video_files/" + filename, testing=True)
    # grab image folder location
    image_folder = "images"

    # define output folder location
    output_folder = "HumanDetection/dataset/outputs"

    # grab all images into a list
    image_files = [f for f in os.listdir(image_folder) if f.endswith((".jpg"))]

    # get img size
    first_image = Image.open(os.path.join(image_folder, image_files[0]))
    width, height = first_image.size

    # create combined image with new width and height
    combined_image = Image.new("RGB", (width * len(image_files), height))

    # add images into combined_image
    for i, image_file in enumerate(image_files):
        image_path = os.path.join(image_folder, image_file)
        img = Image.open(image_path)
        combined_image.paste(img, (i * width, 0))

    root, ext = os.path.splitext(filename)

    # save combined image
    combined_image.save(os.path.join(output_folder, root + "_pred.jpg"))


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
        clean_line = line.split()
        # get rid of irrelevant fields
        # see https://stackoverflow.com/a/74358577 for more about rttm
        onset = float(clean_line[3])
        duration = float(clean_line[4])
        id = clean_line[7]
        # add Segment to Annotation
        annotation[Segment(onset, duration + onset), filename] = id
    return annotation


def main():
    # test_audio()
    # visualize_output("sample2")
    test_video("sample1.mp4")


def visualize_output(filename: str):
    """
    Given a specific file, generate visual examples of performance
    Output is in a file in datasets/outputs/{filename}.txt
    Args:
        filename - string of the name of the file, no extensions
    """
    # get hypothesis + annotation
    audio_file = "HumanDetection/dataset/audio_files/" + filename + ".wav"
    hyp = whisper_diarization(audio_file)

    # get annotation
    with open(
        "HumanDetection/dataset/annotations/" + filename + ".csv", "r", newline=""
    ) as csvfile:
        # convert to dataframe for comparison
        ref_df = pd.read_csv(csvfile)
        hyp_df = pd.DataFrame(
            hyp, columns=["start_time", "end_time", "speaker", "text"]
        )
        comparison_df = pd.concat([ref_df, hyp_df.add_prefix("Hypothesis_")], axis=1)
        # write out to output file
        comparison_df.to_csv(
            "HumanDetection/dataset/outputs/comparison_" + filename + ".csv",
            index=False,
        )


if __name__ == "__main__":
    main()
