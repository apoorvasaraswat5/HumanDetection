# HumanDetection

## Useful Links
[Jira](https://rwbaker.atlassian.net/jira/software/projects/OM596/boards/2)

[Figma](https://www.figma.com/files/team/1287890789852400861)

## Meeting Logs -
9/24/23 Meeting notes -

For now let's come up with what we're doing next week. Feel free to add in a thread

Decide roles 

Set up Jira, github, decision documentation

Come up with user flow

Find ~10 video datasets that we can potentially use

If we plan to use separate models for audio and video, find the SOTA for each

Create Proof of concept

Find a working model to detect humans in photo/video

Audio detection and video detection for humans

Goal -

detect humans in video along with audio

group similar faces and add timestamp to make it easier to find people

add a way to submit a video through frontend and process it in backend (API centered)

create benchmarks to improve the model

Tasks -

Plan is to swap people between teams later on.

find a good dataset for video and audio - Matthew, Krisna

find a good working model online (hugging face, etc) and create a working demo backend and create a document - Xingyu, Apoorva

design team for mock up UI (using Figma) - Ryan, Peter

Tech Stack -

BackEnd - Python, JS, Django, Fast API

ML - PyTorch, Transformers (Hugging Face, to fine tune models)

FrontEnd - NextJS, React, Svelte
