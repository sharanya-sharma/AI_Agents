import { useState, useRef } from "react";
import { vapi, startAssistant, stopAssistant } from "./ai";
import ActiveCallDetails from "./call/ActiveCallDetails";
import Timer from "./Timer";
import ExpertSelection from "./ExpertSelection";
import ContactForm from "./ContactForm";
import ExpertHeader from "./ExpertHeader";
import LoadingScreen from "./LoadingScreen";
import InterviewResults from "./InterviewResults";
import { createRingingSound } from "./audioUtils";
import { useTranscript } from "./useTranscript";

function App() {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callId, setCallId] = useState("");
  const [callResult, setCallResult] = useState(null);
  const [loadingResult, setLoadingResult] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  
  // Timer state - 6 minutes
  const [timeRemaining, setTimeRemaining] = useState(6 * 60);
  const [timerActive, setTimerActive] = useState(false);

  // Updated state for user data
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(false);

  // Ref for ringing audio
  const ringingAudioRef = useRef(null);

  // Use custom transcript hook - corrected
  const { transcript, downloadTranscript } = useTranscript(vapi);

  // VAPI event listeners for call state
  useState(() => {
    vapi
      .on("call-start", () => {
        setLoading(false);
        setStarted(true);
        setTimerActive(true);
        // Stop ringing sound when call starts
        if (ringingAudioRef.current) {
          ringingAudioRef.current.stop();
          ringingAudioRef.current = null;
        }
      })
      .on("call-end", () => {
        setStarted(false);
        setLoading(false);
        setTimerActive(false);
        // Stop ringing sound when call ends
        if (ringingAudioRef.current) {
          ringingAudioRef.current.stop();
          ringingAudioRef.current = null;
        }
      })
      .on("speech-start", () => {
        setAssistantIsSpeaking(true);
      })
      .on("speech-end", () => {
        setAssistantIsSpeaking(false);
      })
      .on("volume-level", (level) => {
        setVolumeLevel(level);
      });
  }, []);

  // Function to fetch user data from database
  const fetchUserData = async (userIdInput) => {
    setUserDataLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/user-data/${userIdInput}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      const data = await response.json();
      setUserData(data);
      setUserDataLoading(false);
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Error fetching user data: ' + error.message);
      setUserDataLoading(false);
      return null;
    }
  };

  const handleStart = async () => {
    if (!userData) {
      alert('Please fetch user data first');
      return;
    }
    
    if (!selectedExpert) {
      alert('Please select an expert first');
      return;
    }
    
    setLoading(true);
    setTimeRemaining(6 * 60); // Reset timer to 6 minutes
    
    // Start ringing sound
    ringingAudioRef.current = createRingingSound();
    
    // Pass complete user data AND selected expert to the assistant
    const data = await startAssistant(userData, selectedExpert);
    setCallId(data.id);
  };

  const handleStop = () => {
    stopAssistant();
    setTimerActive(false);
    // Stop ringing sound
    if (ringingAudioRef.current) {
      ringingAudioRef.current.stop();
      ringingAudioRef.current = null;
    }
    getCallDetails();
  };

  const getCallDetails = (interval = 3000) => {
  setLoadingResult(true);
  fetch(`/call-details?call_id=${callId}&userId=${userId}`) // <-- pass userId here
    .then((response) => response.json())
    .then((data) => {
      if (data.analysis && data.summary) {
        console.log(data);
        setCallResult(data);
        setLoadingResult(false);
      } else {
        setTimeout(() => getCallDetails(interval), interval);
      }
    })
    .catch((error) => alert(error));
};

  const selectExpert = (expert) => {
    setSelectedExpert(expert);
  };

  const goBackToExperts = () => {
    setSelectedExpert(null);
    setCallResult(null);
    // Reset user data when going back
    setUserId("");
    setUserData(null);
    // Stop any ringing sound
    if (ringingAudioRef.current) {
      ringingAudioRef.current.stop();
      ringingAudioRef.current = null;
    }
  };

  // Download transcript function
  const handleDownload = () => {
    downloadTranscript('txt'); // or 'json', 'csv'
  };

  // Show expert selection if no expert is selected and not in interview
  const showExpertSelection = !selectedExpert && !loading && !started && !loadingResult && !callResult;
  
  // Show form if expert is selected but interview hasn't started
  const showForm = selectedExpert && !loading && !started && !loadingResult && !callResult;

  return (
    <div style={{
      margin: 0,
      minWidth: '320px',
      background: 'linear-gradient(135deg, #1a1a1a, #333)',
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      lineHeight: 1.5,
      paddingBottom: '50px',
      minHeight: '100vh',
      height: 'auto',
      overflow: 'visible'
    }}>
      {/* Timer Component */}
      <Timer
        timeRemaining={timeRemaining}
        setTimeRemaining={setTimeRemaining}
        timerActive={timerActive}
        setTimerActive={setTimerActive}
        onTimeUp={handleStop}
        started={started}
      />

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '20px',
        height: 'auto',
        overflow: 'visible'
      }}>
        {/* Expert Selection Screen */}
        {showExpertSelection && (
          <ExpertSelection onSelectExpert={selectExpert} />
        )}

        {/* Expert Info Header */}
        <ExpertHeader
          selectedExpert={selectedExpert}
          onGoBack={goBackToExperts}
          started={started}
        />

        {/* Contact Form - Updated to handle user ID and data fetching */}
        {showForm && (
          <ContactForm
            userId={userId}
            setUserId={setUserId}
            userData={userData}
            userDataLoading={userDataLoading}
            onFetchUserData={fetchUserData}
            onStart={handleStart}
            selectedExpert={selectedExpert}
          />
        )}
        
        {/* Loading States */}
        {loadingResult && !callResult && (
          <div style={{ textAlign: 'center', color: '#ffffff', fontSize: '1.2em' }}>
            Loading call details... please wait
          </div>
        )}
        
        {/* Interview Results */}
        <InterviewResults
          callResult={callResult}
          transcript={transcript}
          selectedExpert={selectedExpert}
          onStartNew={goBackToExperts}
          onDownloadTranscript={handleDownload}
        />
        
        {/* Loading Screen with Ringing */}
        <LoadingScreen
          loading={loading}
          loadingResult={loadingResult}
          selectedExpert={selectedExpert}
        />
        
        {/* Active Call Details */}
        {started && (
          <ActiveCallDetails
            assistantIsSpeaking={assistantIsSpeaking}
            volumeLevel={volumeLevel}
            endCallCallback={handleStop}
            transcript={transcript}
            selectedExpert={selectedExpert}
            timeRemaining={timeRemaining}
          />
        )}
      </div>
    </div>
  );
}

export default App;