import { aiExperts } from './aiExperts';

const ExpertSelection = ({ onSelectExpert }) => {
  const selectExpert = (expert) => {
    onSelectExpert(expert);
  };

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '40px', padding: '40px 0' }}>
        <h1 style={{
          fontSize: '3.2em',
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          color: '#ff5722',
          fontWeight: 'bold'
        }}>
          AI Interview Experts
        </h1>
        <p style={{ fontSize: '1.2em', opacity: 0.9 }}>
          Choose your AI interviewer and practice with industry professionals
        </p>
      </div>

      <div className="experts-grid">
        {aiExperts.map((expert) => (
          <div
            key={expert.id}
            onClick={() => selectExpert(expert)}
            style={{
              background: 'rgba(44, 44, 44, 0.8)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #555',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-10px)';
              e.target.style.boxShadow = '0 25px 50px rgba(255, 87, 34, 0.3)';
              e.target.style.borderColor = '#ff5722';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
              e.target.style.borderColor = '#555';
            }}
          >
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(90deg, #ff5722, #e64a19)'
            }}></div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <img
                src={expert.avatar}
                alt={expert.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  marginRight: '20px',
                  objectFit: 'cover',
                  border: '4px solid #ff5722'
                }}
              />
              <div>
                <h3 style={{ color: '#ffffff', fontSize: '1.4em', marginBottom: '5px' }}>
                  {expert.name}
                </h3>
                <div style={{ color: '#ff5722', fontWeight: 600, fontSize: '1.1em' }}>
                  {expert.role}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', padding: '8px 0' }}>
                <span style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #ff5722, #e64a19)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '15px',
                  fontSize: '0.85em',
                  fontWeight: 600
                }}>
                  {expert.company}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', padding: '8px 0' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: '0.95em' }}>
                  {expert.experience} experience
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', padding: '8px 0' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: '0.95em' }}>
                  {expert.location}
                </span>
              </div>

              <div style={{ marginTop: '15px' }}>
                <h4 style={{ color: '#ffffff', marginBottom: '10px', fontSize: '1em' }}>
                  Specialties
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {expert.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      style={{
                        background: 'rgba(44, 44, 44, 0.9)',
                        color: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.8em',
                        border: '1px solid #555'
                      }}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                selectExpert(expert);
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #ff5722, #e64a19)',
                color: 'white',
                border: 'none',
                padding: '15px 24px',
                borderRadius: '25px',
                fontSize: '1em',
                fontWeight: 600,
                marginTop: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
              }}
            >
              Start Interview with {expert.name.split(' ')[0]}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ExpertSelection;