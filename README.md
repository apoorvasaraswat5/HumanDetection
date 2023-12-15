# Human Detection in Videos and Audios

Fall 2023

Team members - Apoorva Saraswat, Krisna Lach, Matthew Weiner, Peter Tran, Ryan Baker, Xingyu Bian

## Goal

To build a model that detects humans in the video based on the video and audio and creates thumbnails of faces found in the video along with their timestamps to make it easier to find people.

## Utility

A law enforcement official can use our tool while processing videos and view timestamps where specific people appeared in the video. This can save their time and make it easier for them to process videos.

## Dataset

[Video Dataset](https://github.com/xiaobai1217/Awesome-Video-Datasets)

[Audio (Mozilla CommonVoice)](https://commonvoice.mozilla.org/en/datasets)

## Sample Output

TBD

## Project Setup

TBD

## Useful Links
[Jira](https://rwbaker.atlassian.net/jira/software/projects/OM596/boards/2)

[Figma](https://www.figma.com/files/team/1287890789852400861)

# Branching and Commit Rules

In a version control system like Git, maintaining a structured and organized workflow is crucial for effective collaboration and code management. Branching and commit rules help establish guidelines and best practices to ensure a smooth development process. This section outlines some essential rules and recommendations for branching and committing in a Git-based workflow.

## Branching Rules

### 1. **Use Descriptive Branch Names**

   - Choose branch names that convey the purpose or feature you are working on.
   - Avoid generic names like "feature," "fix," or "update."

   Example:
   ```shell
   # Good branch name
   git checkout -b feature/user-authentication

   # Bad branch name
   git checkout -b feature/new-feature
   ```

### 2. **Create Feature Branches**

   - For each new feature, bug fix, or task, create a separate branch.
   - This isolates changes and makes it easier to track and manage them.

   Example:
   ```shell
   git checkout -b feature/new-feature
   ```

### 3. **Branch from the Latest Master (or Main) Branch**

   - Always create feature branches based on the latest version of the master (or main) branch.
   - This ensures that your branch includes all recent changes.

   Example:
   ```shell
   git checkout -b feature/new-feature master
   ```

### 4. **Frequent Updates from Master (or Main)**

   - Regularly merge or rebase your feature branch with the master (or main) branch to keep it up-to-date.
   - This prevents conflicts and simplifies the final integration.

   Example:
   ```shell
   # Merge
   git checkout feature/new-feature
   git merge master

   # Rebase
   git checkout feature/new-feature
   git rebase master
   ```

## Commit Rules

### 1. **Use Clear and Concise Commit Messages**

   - Write descriptive commit messages that summarize the purpose of the commit.
   - Follow a consistent format, such as the imperative mood ("Fix bug" instead of "Fixed bug").

   Example:
   ```shell
   # Good commit message
   git commit -m "Add user authentication functionality"

   # Bad commit message
   git commit -m "Updated stuff"
   ```

### 2. **Commit Small and Logical Units of Work**

   - Each commit should represent a single, cohesive change.
   - Avoid large, monolithic commits that mix unrelated changes.

   Example:
   ```shell
   # Instead of
   git commit -m "Update homepage, refactor authentication, and fix bug"

   # Prefer
   git commit -m "Update homepage layout"
   git commit -m "Refactor user authentication"
   git commit -m "Fix critical bug in user registration"
   ```

### 3. **Avoid Committing Temporary or Debug Code**

   - Don't commit code that's meant for debugging or temporary purposes.
   - Use Git's stash feature or a separate branch for such code.

   Example:
   ```shell
   # Avoid committing debug code
   git commit -m "Temporarily disable login validation for debugging"
   ```

By adhering to these branching and commit rules, your team can maintain a clean and efficient version control workflow, making it easier to collaborate, review code, and deploy changes with confidence. Consistency in branch and commit practices enhances code quality and project maintainability.
## Meeting Logs -

**Week of 9/18/23 - 9/24/23: 1**

- Decided roles for team members and divided the tasks accordingly for finding dataset, building a working model, and create UI mock up design.
- Set up JIRA, GitHub, and Figma.
- Decided tech stack -
- BackEnd: Python, JS, Django, Fast API
- ML: PyTorch, Transformers (Hugging Face, to fine tune models)
- FrontEnd: NextJS, React, Svelte
- Planned to create proof of concept by 9/28/23.

**Week of 9/25/23 - 10/1/23: 2**
- FE: Created UI mock up design for the project. Added starter code for NextJS + TailwindCSS.
- BE: Decided on FastAPI for the backend. Working on setting up the backend inference API.
- ML: 
   1. Found models for audio detection: https://huggingface.co/openai/whisper-small
   1. Models for video/image detection: TBD
- Data: 
   1. Found dataset for audio detection: https://github.com/xiaobai1217/Awesome-Video-Datasets
   1. dataset for video/image detection: 
      1. https://commonvoice.mozilla.org/en/datasets 
      1. https://github.com/jim-schwoebel/voice_datasets

Next steps:
- FE: Create UI from mockup design. List out potential queries to the backend.
- BE: Set up the backend inference API. Set up uploading and fetching videos/media.
- ML: 
   1. Decide on dataset
   1. Evaluate model performance


**Week of 10/2/23 - 10/8/23: 3**
- Action item: Getting the video model end point working - Apoorva, Xingyu
- UI Frontend - Get a rough demo working. Ryan: Added a mock UI
- Audio - Implemented hugging face endpoint
- Using speaker model vs speech model - can discuss with Ben
- Matt: Working on getting data on cloud working
- Work on file uploading on backend - Next week
- Get a model working for demo
- Housekeeping - Protect main branch - Next week (add .gitignore for S3 credentials) - Apoorva

**Week of 10/9/23 - 10/15/23: 4**
- updated the database to use supabase and set it up - Matt
- updated the video model to use the YOLO model to get better accuracy on detecting people in a video - Apoorva
- Researched on using WhisperX for the audio model along with diarization - speaker labels and timestamps - Xingyu & Krisna
- might use custom datasets to test and baseline the existing models in the coming weeks.
- video UI component is now working with minor issues. To connect with backend team to integrate frontend and backend - Peter
- video upload on UI by drag drop or click button. To be integrated with backend. Might work on using NextJS on the UI. - Ryan

**Week of 10/16/23 - 10/22/23: 5**
- Database - Upload video to supabase and take 4 thumnails from video and upload to supabase @Matthew Weiner
- backend - retrieve list of videos along with thumbnails and send to frontend @Apoorva Saraswat
- frontend - use the response to show the list of videos along with thumbnails [use proxy response for now], create another page to play the video @Peter Tran
- Audio model - Xingyu and Krisna working on getting the diarization model work with different speakers and their timestamps information
- File upload - Ryan working on changing HTML frontend to NextJS

**Week of 10/23/23 - 10/29/23: 6**
- Ryan - worked on frontend, fixed rendering issues. we can now upload and view files on frontend
- Matt - created thumbnail from video, added new endpoint to download videos, added an endpoint to fetch data for a user, working on combining endpoints
- Xingyu - combined diarization and whisper pipelines. tells timestamps that each person speaks at.
- Apoorva - worked on fetching unique faces from the videos and save it to supabase, currently facing issues with it
- Peter - worked on backend
- Krisna - found a dataset and ran performance test on audio endpoint, will work on video as well
- Ben's feedback -
   - add some performance metrics in the final presentation
   - investigate on what type of data is it successful on
   - what are the failures
   - why are the failures
   - eg - struggles on low light videos, or audios where multiple people are talking over each other
   - can hyper tune models to make it better
   - can create a dataset yourself and fine tune on that

**Week of 10/30/23 - 11/5/23: 7**
- Added sentiment analysis feature
- Added timestamps along with unique faces to seek on the video playback

**Week of 11/6/23 - 11/12/23: 8**
- Stitching frontend and backend
- Bug fixes

**Week of 11/13/23 - 11/19/23: 9**
- Team started working on presentation
- Minor tweaks and fixing of bugs

**Week of 11/20/23 - 11/26/23: 10**
- Thanksgiving break

**Week of 11/27/23 - 12/3/23: 11**
- Presentation preperation

**Week of 12/4/23 - 12/10/23: 12**
- Presentation
