import { useState, useEffect, useCallback } from 'react';

export const useTranscript = (vapi) => {
  const [transcript, setTranscript] = useState([]);

  useEffect(() => {
    let messageBuffer = '';
    let currentRole = null;
    let bufferTimeout = null;

    const handleTranscriptMessage = (role, content) => {
      if (!content || content.trim().length === 0) return;
      
      // Clear any pending timeout
      if (bufferTimeout) clearTimeout(bufferTimeout);
      
      if (currentRole === role) {
        // Same speaker, add to buffer
        messageBuffer += ' ' + content.trim();
      } else {
        // Different speaker, flush previous buffer and start new one
        if (messageBuffer.trim()) {
          addCompleteMessage(currentRole, messageBuffer.trim());
        }
        messageBuffer = content.trim();
        currentRole = role;
      }
      
      // Set timeout to flush buffer after 2 seconds of silence
      bufferTimeout = setTimeout(() => {
        if (messageBuffer.trim()) {
          addCompleteMessage(currentRole, messageBuffer.trim());
          messageBuffer = '';
          currentRole = null;
        }
      }, 2000);
    };

    const addCompleteMessage = (role, content) => {
      if (!content || !role) return;
      
      setTranscript(prev => {
        // Avoid duplicates by checking recent messages
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && 
            lastMessage.role === role && 
            lastMessage.content.includes(content.substring(0, 50))) {
          return prev;
        }
        
        return [...prev, {
          role: role,
          content: content,
          timestamp: Date.now()
        }];
      });
    };

    const clearTranscript = () => {
      setTranscript([]);
      messageBuffer = '';
      currentRole = null;
      if (bufferTimeout) clearTimeout(bufferTimeout);
    };

    // VAPI event listeners
    vapi
      .on("call-start", () => {
        clearTranscript();
      })
      .on("call-end", () => {
        // Flush any remaining buffer when call ends
        if (messageBuffer.trim()) {
          addCompleteMessage(currentRole, messageBuffer.trim());
        }
      })
      .on("speech-end", () => {
        // When speech ends, flush the buffer after a short delay
        if (bufferTimeout) clearTimeout(bufferTimeout);
        bufferTimeout = setTimeout(() => {
          if (messageBuffer.trim()) {
            addCompleteMessage(currentRole, messageBuffer.trim());
            messageBuffer = '';
            currentRole = null;
          }
        }, 1000);
      })
      .on("message", (message) => {
        // Handle different message types more carefully
        if (message.type === "transcript" && message.transcriptType === "final") {
          handleTranscriptMessage(message.role, message.transcript);
        }
      })
      .on("transcript", (data) => {
        // Handle direct transcript events - only final transcripts
        if (data.type === "final" || !data.type) {
          handleTranscriptMessage(data.role, data.transcript);
        }
      });

    return () => {
      if (bufferTimeout) clearTimeout(bufferTimeout);
    };
  }, [vapi]);

  // Download transcript function
  const downloadTranscript = useCallback((format = 'txt', filename = null) => {
    if (!transcript || transcript.length === 0) {
      console.warn('No transcript available to download');
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const defaultFilename = filename || `interview-transcript-${timestamp}`;
    
    let content = '';
    let mimeType = '';
    let fileExtension = '';

    switch (format.toLowerCase()) {
      case 'json':
        content = JSON.stringify(transcript, null, 2);
        mimeType = 'application/json';
        fileExtension = 'json';
        break;
      
      default: // txt format
        content = `Interview Transcript\n`;
        content += `Date: ${new Date().toLocaleDateString()}\n`;
        content += `Time: ${new Date().toLocaleTimeString()}\n`;
        content += `Total Messages: ${transcript.length}\n`;
        content += `${'='.repeat(50)}\n\n`;
        
        transcript.forEach((msg) => {
          const time = new Date(msg.timestamp).toLocaleTimeString();
          const speaker = msg.role === 'user' ? 'Interviewer' : 'Assistant';
          content += `[${time}] ${speaker}:\n${msg.content}\n\n`;
        });
        mimeType = 'text/plain';
        fileExtension = 'txt';
        break;
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${defaultFilename}.${fileExtension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }, [transcript]);

  return { transcript, downloadTranscript };
};