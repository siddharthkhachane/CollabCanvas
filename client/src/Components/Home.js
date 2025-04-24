import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './custom.css';

const Home = () => {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const createRoom = async () => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    setIsLoading(true);
    try {
      //const response = await axios.post('https://skproject-a3.wl.r.appspot.com/api/rooms');
      const response = await axios.post('https://collabcanvas-364y.onrender.com/api/rooms');
      const { roomId } = response.data;
      navigate(`/room/${roomId}?name=${userName}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room');
    } finally {
      setIsLoading(false);
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
    <div className="home-container">
      <div className="home-card">
        <div className="home-logo">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
        </div>
        
        <h1 className="home-title">Collaborative Whiteboard</h1>
        <p className="home-subtitle">Draw and collaborate in real-time with anyone, anywhere</p>
        
        <div className="input-group">
          <label htmlFor="username" className="input-label">Your Name</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your name to get started"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="input-field"
          />
        </div>
        
        <div className="button-container">
          <button 
            onClick={createRoom}
            disabled={isLoading}
            className="primary-button"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create New Room
              </>
            )}
          </button>
          <button 
            onClick={joinRoom}
            className="secondary-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            Join Existing Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
