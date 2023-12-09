import { VideoArtifacts, VoiceDetectedFrame } from "@/utils/api";
import TranscriptCard from "./TranscriptCard";

export default function VideoPreview({
  currentVideoArtifacts,
}: {
  currentVideoArtifacts: VideoArtifacts;
}) {
  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Images
      </h2>
      <div className="flex flex-row p-5 space-x-5 overflow-scroll text-gray-900">
        {currentVideoArtifacts.peopleDetectedFrames?.map((frame) => {
          return (
            <img
              className="h-[200px] w-[250px] max-w-lg rounded-lg"
              alt=""
              src={frame.thumbnail}
              key={frame.thumbnail}
            />
          );
        }) || "No images detected"}
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">Audio</h2>
      <div className="h-screen p-4 text-gray-900">
        {currentVideoArtifacts.voiceDetectedFrames?.reduce(
          (acc: string, frame: VoiceDetectedFrame) => {
            return acc + `${frame.speaker}: ${frame.transcript}\n`;
          },
          ""
        ) || "No audio detected"}
      </div>
      {/* <div className="flex flex-row p-5 space-x-5">
        {currentVideoArtifacts.voiceDetectedFrames?.map((frame) => {
          return (
            <TranscriptCard content={frame.transcript} key={frame.timestamp} />
          );
        })}
      </div> */}
      {/* <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          People
        </h2>
        <div className="flex flex-row p-5 space-x-5">
          {
            currentVideoArtifacts.distinctPeopleDetected?.map((person,index) => {
              return <img
              className="h-[200px] w-[200px] max-w-lg rounded-full"
              alt=""
              src={`${person.thumbnail}`}
              key={`${index},${person.thumbnail}`}
              />
            })
          }
        </div> */}
    </>
  );
}
