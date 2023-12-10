import { VideoArtifacts, VoiceDetectedFrame } from "@/utils/api";
import { Fragment } from "react";
export default function TranscriptCard({
  currentVideoArtifacts,
}: {
  currentVideoArtifacts: VideoArtifacts;
}) {
  const transcriptLines = currentVideoArtifacts.voiceDetectedFrames?.map(
    (frame, index) => (
      <Fragment key={index}>
        {`[${Number(frame.startTime).toFixed(2)} - ${Number(
          frame.endTime
        ).toFixed(2)}] ${frame.speaker}: ${frame.transcript}`}
        <br />
      </Fragment>
    )
  );

  return (
    <div className="text-gray-900 overflow-scroll">
      {transcriptLines || "No voice audio detected"}
    </div>
  );
}
