import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Canvas from './Canvas';

const Room = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get('name');
    
    if (name) {
      setUserName(name);
    } else {
      // Redirect to home if no name
      window.location.href = '/';
    }
  }, [location]);
  
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Room: {roomId}</h2>
        <div>
          <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
            Copy Room Link
          </button>
        </div>
      </div>
      {userName && <Canvas roomId={roomId} userName={userName} />}
    </div>
  );
};

export default Room;