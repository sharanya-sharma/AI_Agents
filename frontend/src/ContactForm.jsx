import React from 'react';

const ContactForm = ({ 
  userId, 
  setUserId, 
  userData, 
  userDataLoading, 
  onFetchUserData, 
  onStart, 
  selectedExpert 
}) => {
  const handleFetchData = async () => {
    if (!userId.trim()) {
      alert('Please enter a valid User ID');
      return;
    }
    await onFetchUserData(userId);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFetchData();
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '30px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '30px',
        color: '#ffffff',
        fontSize: '2rem',
        fontWeight: '600'
      }}>
        Enter Your Details
      </h2>

      <div style={{ marginBottom: '25px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          color: '#ffffff',
          fontSize: '1.1rem',
          fontWeight: '500'
        }}>
          User ID
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your User ID"
            style={{
              flex: 1,
              padding: '15px',
              fontSize: '1rem',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
          />
          <button
            onClick={handleFetchData}
            disabled={userDataLoading || !userId.trim()}
            style={{
              padding: '15px 25px',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              background: userDataLoading ? '#666' : '#4CAF50',
              color: '#ffffff',
              cursor: userDataLoading || !userId.trim() ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease',
              minWidth: '100px'
            }}
          >
            {userDataLoading ? 'Loading...' : 'Fetch Data'}
          </button>
        </div>
      </div>

      {/* Display user data if loaded */}
      {userData && (
        <div style={{
          marginBottom: '25px',
          padding: '20px',
          background: 'rgba(76, 175, 80, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(76, 175, 80, 0.3)'
        }}>
          <h3 style={{ color: '#4CAF50', marginBottom: '15px' }}>User Data Loaded</h3>
          <div style={{ color: '#ffffff', lineHeight: '1.6' }}>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Current Role:</strong> {userData.current_job_role}</p>
            <p><strong>Experience:</strong> {userData.years_of_experience} years</p>
            <p><strong>Industry:</strong> {userData.industry}</p>
            <p><strong>Skills:</strong> {Array.isArray(userData.skills) ? userData.skills.join(', ') : userData.skills}</p>
            {userData.interested_job_roles && (
              <p><strong>Interested Roles:</strong> {Array.isArray(userData.interested_job_roles) ? userData.interested_job_roles.join(', ') : userData.interested_job_roles}</p>
            )}
          </div>
        </div>
      )}

      <button
        onClick={onStart}
        disabled={!userData}
        style={{
          width: '100%',
          padding: '18px',
          fontSize: '1.2rem',
          fontWeight: '600',
          border: 'none',
          borderRadius: '10px',
          background: !userData ? '#666' : 'linear-gradient(135deg, #4CAF50, #45a049)',
          color: '#ffffff',
          cursor: !userData ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: !userData ? 'none' : '0 4px 15px rgba(76, 175, 80, 0.3)'
        }}
        onMouseEnter={(e) => {
          if (userData) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (userData) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
          }
        }}
      >
        {!userData ? 'Please Fetch User Data First' : `Start Interview with ${selectedExpert?.name}`}
      </button>
    </div>
  );
};

export default ContactForm;