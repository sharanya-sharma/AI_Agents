import { useEffect, useRef } from "react";

const CallTranscript = ({ transcript }) => {
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to the bottom when new messages are added
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Group consecutive messages from the same role into paragraphs
  const groupMessages = (messages) => {
    const grouped = [];
    let currentGroup = null;

    messages.forEach((message) => {
      if (!currentGroup || currentGroup.role !== message.role) {
        // Start a new group
        if (currentGroup) {
          grouped.push(currentGroup);
        }
        currentGroup = {
          role: message.role,
          content: message.content,
          timestamp: message.timestamp,
          endTimestamp: message.timestamp
        };
      } else {
        // Add to existing group
        currentGroup.content += ' ' + message.content;
        currentGroup.endTimestamp = message.timestamp;
      }
    });

    if (currentGroup) {
      grouped.push(currentGroup);
    }

    return grouped;
  };

  const groupedTranscript = groupMessages(transcript);

  return (
    <div className="call-transcript">
      <div className="transcript-header">
        <h3>Interview Transcript</h3>
        <span className="message-count">{groupedTranscript.length} exchanges</span>
      </div>
      <div className="transcript-content">
        {groupedTranscript.length === 0 ? (
          <div className="no-messages">
            <p>Conversation will appear here...</p>
          </div>
        ) : (
          groupedTranscript.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'assistant' ? 'assistant-message' : 'user-message'}`}
            >
              <div className="message-header">
                <span className="message-role">
                  {message.role === 'assistant' ? '🎯 Interview Expert' : '👤 Candidate'}
                </span>
                <span className="message-timestamp">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))
        )}
        <div ref={transcriptEndRef} />
      </div>
    </div>
  );
};

export default CallTranscript;