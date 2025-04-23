import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Canvas from './Canvas';
import './custom.css';

const Room = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get('name');
    
    if (name) {
      setUserName(name);
    } else {
      // Redirect to home if no name
      navigate('/');
    }
  }, [location, navigate]);
  
  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const goHome = () => {
    navigate('/');
  };
  
  return (
    <div className="room-container">
      <div className="room-content">
        <div className="room-header">
          <div className="room-info">
            <h2 className="room-title">
              Room: <span className="room-id">{roomId}</span>
            </h2>
            <p className="room-user">Joined as: {userName}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={goHome}
              className="back-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Home
            </button>
            <button 
              onClick={copyRoomLink}
              className={`copy-button ${copied ? 'copied' : ''}`}
            >
              {copied ? 'Copied!' : 'Copy Room Link'}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          </div>
        </div>
        
        {userName && <Canvas roomId={roomId} userName={userName} />}
      </div>
    </div>
  );
};

export default Room;