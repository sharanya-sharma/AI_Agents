import { useEffect, useRef } from 'react';

const Timer = ({ timeRemaining, setTimeRemaining, timerActive, setTimerActive, onTimeUp, started }) => {
  const intervalRef = useRef(null);
  const onTimeUpRef = useRef(onTimeUp);

  // Update the ref when onTimeUp changes
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Timer effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prevTime => {
          const newTime = prevTime - 1;
          
          if (newTime <= 0) {
            setTimerActive(false);
            // Use setTimeout to avoid calling onTimeUp during render
            setTimeout(() => {
              onTimeUpRef.current();
            }, 0);
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      // Clear interval if timer is not active or time is 0
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerActive, setTimeRemaining, setTimerActive]);

  // Handle case where timeRemaining becomes 0 externally
  useEffect(() => {
    if (timeRemaining === 0 && timerActive) {
      setTimerActive(false);
      setTimeout(() => {
        onTimeUpRef.current();
      }, 0);
    }
  }, [timeRemaining, timerActive, setTimerActive]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(Math.abs(seconds) / 60);
    const remainingSeconds = Math.abs(seconds) % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Only show timer during interview or when timer is active
  if (!started && !timerActive) return null;

  // Determine timer color based on remaining time
  const getTimerColor = () => {
    if (timeRemaining <= 0) return '#ff4444';
    if (timeRemaining <= 60) return '#ff6644'; // Last minute warning
    if (timeRemaining <= 300) return '#ffaa44'; // Last 5 minutes warning
    return '#ff5722';
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.9)',
      padding: '15px 20px',
      borderRadius: '12px',
      zIndex: 1000,
      border: `2px solid ${getTimerColor()}`,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#ffffff', fontSize: '0.9em' }}>
          Interview Time:
        </span>
        <span style={{ 
          color: getTimerColor(),
          fontWeight: 'bold',
          fontSize: '1.3em',
          fontFamily: 'monospace',
          letterSpacing: '1px'
        }}>
          {formatTime(timeRemaining)}
        </span>
        {timeRemaining <= 0 && (
          <span style={{ 
            color: '#ff4444', 
            fontWeight: 'bold',
            fontSize: '0.9em',
            animation: 'blink 1s infinite'
          }}>
            TIME'S UP!
          </span>
        )}
      </div>
      
      {/* Add blinking animation for time's up */}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default Timer;