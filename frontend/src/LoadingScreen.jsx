const LoadingScreen = ({ loading, loadingResult, selectedExpert }) => {
  if (!loading && !loadingResult) return null;

  return (
    <>
      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px',
        gap: '20px'
      }}>
        <div style={{
          border: '4px solid #333',
          borderTop: '4px solid #ff5722',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          animation: 'spin 1s linear infinite'
        }}></div>
        
        {loading && (
          <div style={{
            fontSize: '1.4em',
            color: '#ff5722',
            fontWeight: 600,
            animation: 'pulse 1.5s ease-in-out infinite',
            textAlign: 'center'
          }}>
            📞 Ringing...
            <div style={{
              fontSize: '0.9em',
              color: 'rgba(255, 255, 255, 0.7)',
              marginTop: '10px',
              fontWeight: 'normal'
            }}>
              Connecting to {selectedExpert?.name}...
            </div>
          </div>
        )}
        
        {loadingResult && (
          <div style={{
            fontSize: '1.2em',
            color: '#ffffff',
            textAlign: 'center'
          }}>
            Processing interview results...
          </div>
        )}
      </div>
    </>
  );
};

export default LoadingScreen;