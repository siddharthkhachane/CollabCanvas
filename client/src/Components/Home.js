import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const createRoom = async () => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    try {
      const response = await axios.post('https://skproject-a3.wl.r.appspot.com/api/rooms');
      //const response = await axios.post('https://collabcanvas-364y.onrender.com/api/rooms');
      //const response = await axios.post('http://localhost:5000/api/rooms');

      const { roomId } = response.data;
      navigate(`/room/${roomId}?name=${userName}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room');
    }
  };

  const joinRoom = () => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    const roomId = prompt('Enter room ID:');
    if (roomId) {
      navigate(`/room/${roomId}?name=${userName}`);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Collaborative Whiteboard</h1>
      <div style={{ margin: '20px' }}>
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        />
      </div>
      <div>
        <button 
          onClick={createRoom}
          style={{ margin: '10px', padding: '8px 16px' }}
        >
          Create New Room
        </button>
        <button 
          onClick={joinRoom}
          style={{ margin: '10px', padding: '8px 16px' }}
        >
          Join Existing Room
        </button>
      </div>
    </div>
  );
};

export default Home;
