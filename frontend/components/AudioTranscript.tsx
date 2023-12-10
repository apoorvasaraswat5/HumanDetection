import { VideoArtifacts, VoiceDetectedFrame } from "@/utils/api";
import { Fragment } from "react";

export default function TranscriptCard({
  currentVideoArtifacts,
}: {
  currentVideoArtifacts: VideoArtifacts;
}) {
  const transcriptLines = currentVideoArtifacts.voiceDetectedFrames?.map(
    (frame, index) => {
      let textColor = "";
      if (frame.sentiment === "negative") {
        textColor = "text-red-500"; // Red color for negative sentiment
      } else if (frame.sentiment === "positive") {
        textColor = "text-green-500"; // Green color for positive sentiment
      }

      return (
        <Fragment key={index}>
          <span className={textColor}>
            {`[${Number(frame.startTime).toFixed(2)} - ${Number(
              frame.endTime
            ).toFixed(2)}] ${frame.speaker}: ${frame.transcript}`}
          </span>
          <br />
        </Fragment>
      );
    }
  );

  return (
    <div className="text-gray-900 overflow-scroll">
      {transcriptLines || "No voice audio detected"}
    </div>
  );
}
