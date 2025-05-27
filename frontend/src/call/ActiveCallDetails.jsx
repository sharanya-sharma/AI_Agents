import AssistantSpeechIndicator from "./AssistantSpeechIndicator";
import VolumeLevel from "./VolumeLevel";
import CallTranscript from "./callTranscript";
import ExpertProfile from "./ExpertProfile";

const ActiveCallDetails = ({
  assistantIsSpeaking,
  volumeLevel,
  endCallCallback,
  transcript,
  selectedExpert,
}) => {
  return (
    <div className="active-call-detail">
      <div className="call-header">
        <div className="call-controls">
          <div className="call-info">
            <AssistantSpeechIndicator isSpeaking={assistantIsSpeaking} />
            <VolumeLevel volume={volumeLevel} />
          </div>
          <div className="end-call-button">
            <button onClick={endCallCallback}>End Interview</button>
          </div>
        </div>
        <ExpertProfile 
          assistantIsSpeaking={assistantIsSpeaking} 
          selectedExpert={selectedExpert}
        />
      </div>
      <CallTranscript transcript={transcript} />
    </div>
  );
};

export default ActiveCallDetails;