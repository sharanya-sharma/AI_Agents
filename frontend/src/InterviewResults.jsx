const InterviewResults = ({ callResult, transcript, selectedExpert, onStartNew, onDownloadTranscript }) => {
  if (!callResult) return null;

  return (
    <div style={{
      background: 'rgba(44, 44, 44, 0.8)',
      borderRadius: '20px',
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      border: '1px solid #555'
    }}>
      <h2 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '20px' }}>
        Interview Complete! 🎉
      </h2>
      <div>
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Interview Summary:</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.87)', lineHeight: 1.6 }}>
            {callResult.summary}
          </p>
        </div>
      </div>
      
      {transcript.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '15px' 
          }}>
            <h3 style={{ color: '#ffffff', margin: 0 }}>Complete Interview Transcript</h3>
            <button
              onClick={onDownloadTranscript}
              style={{
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '20px',
                fontSize: '0.9em',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
              }}
            >
              📥 Download Transcript
            </button>
          </div>
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '10px',
            padding: '20px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {transcript.map((message, index) => (
              <div key={index} style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#ff5722' }}>
                  {message.role === 'assistant' ? selectedExpert?.name || 'Interviewer' : 'Candidate'}:
                </strong>
                <span style={{ color: 'rgba(255, 255, 255, 0.87)', marginLeft: '10px' }}>
                  {message.content}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onStartNew}
          style={{
            background: 'linear-gradient(135deg, #ff5722, #e64a19)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '1.1em',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
          }}
        >
          Start New Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewResults;