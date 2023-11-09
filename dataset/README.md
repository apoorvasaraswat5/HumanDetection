This project utilizes parts of the VoxConverse speaker diarization dataset.
Citation is below.

Before uploading audio files, make sure that there exists a corresponding reference file in /references.
(i.e. if your audio file is named "sample1.wav" located in /audio_files, there is a reference file in /references named "sample1.rttm")
Annotations are expected to be stored as .csv files, where the attributes are, in order:
start_time,end_time,speaker,text

#TODO Add instructions for uploading video files


@article{chung2020spot,
  title={Spot the conversation: speaker diarisation in the wild},
  author={Chung, Joon Son and Huh, Jaesung and Nagrani, Arsha and Afouras, Triantafyllos and Zisserman, Andrew},
  booktitle={Interspeech},
  year={2020}
}
