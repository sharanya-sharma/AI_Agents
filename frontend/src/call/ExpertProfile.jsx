const ExpertProfile = ({ assistantIsSpeaking, selectedExpert }) => {
  // Get the expert's image, default to Bot1.png for Sarah Chen
  const getExpertImage = () => {
    if (selectedExpert) {
      // If it's Sarah Chen, use Bot1.png
      if (selectedExpert.name === "Dr. Sarah Chen") {
        return "./Bots_Images/Bot1.png";
      }
      // For other experts, use their avatar or placeholder
      return selectedExpert.avatar || "/api/placeholder/60/60";
    }
    // Default fallback
    return "./Bots_Images/Bot1.png";
  };

  const getExpertName = () => {
    return selectedExpert?.name || "Dr. Sarah Chen";
  };

  const getExpertTitle = () => {
    return selectedExpert?.role || "Full Stack Engineer";
  };

  return (
    <div className="expert-profile">
      <div className="expert-avatar">
        <img 
          src={getExpertImage()} 
          alt={getExpertName()}
          className="profile-image"
        />
        <div className={`status-indicator ${assistantIsSpeaking ? 'speaking' : 'listening'}`}></div>
      </div>
      <div className="expert-info">
        <h4 className="expert-name">{getExpertName()}</h4>
        <p className="expert-title">{getExpertTitle()}</p>
        <p className="expert-status">
          {assistantIsSpeaking ? 'Speaking...' : 'Listening'}
        </p>
      </div>
    </div>
  );
};

export default ExpertProfile;