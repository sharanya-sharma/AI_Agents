// Create ringing sound using Web Audio API
export const createRingingSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set up ringing tone (typical phone ring frequencies)
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    oscillator.type = 'sine';
    
    // Create ringing pattern (ring for 1 second, pause for 4 seconds)
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    
    const ringPattern = () => {
      const now = audioContext.currentTime;
      // Ring on
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.setValueAtTime(0.3, now + 1);
      // Ring off
      gainNode.gain.setValueAtTime(0, now + 1);
      gainNode.gain.setValueAtTime(0, now + 5);
    };
    
    oscillator.start();
    ringPattern();
    
    // Repeat the pattern every 5 seconds
    const interval = setInterval(ringPattern, 5000);
    
    return {
      stop: () => {
        clearInterval(interval);
        oscillator.stop();
        audioContext.close();
      }
    };
  } catch (error) {
    console.warn('Could not create ringing sound:', error);
    return { stop: () => {} };
  }
};