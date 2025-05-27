const ExpertHeader = ({ selectedExpert, onGoBack, started }) => {
  if (!selectedExpert) return null;

  return (
    <div style={{
      background: 'rgba(44, 44, 44, 0.8)',
      borderRadius: '15px',
      padding: '20px',
      marginBottom: '30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid #555'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={selectedExpert.avatar}
          alt={selectedExpert.name}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            marginRight: '15px',
            objectFit: 'cover',
            border: '3px solid #ff5722'
          }}
        />
        <div>
          <h3 style={{ margin: 0, color: '#ffffff' }}>{selectedExpert.name}</h3>
          <p style={{ margin: 0, color: '#ff5722' }}>
            {selectedExpert.role} at {selectedExpert.company}
          </p>
        </div>
      </div>
      {!started && (
        <button
          onClick={onGoBack}
          style={{
            background: 'transparent',
            color: '#ff5722',
            border: '2px solid #ff5722',
            padding: '10px 20px',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Choose Different Expert
        </button>
      )}
    </div>
  );
};

export default ExpertHeader;