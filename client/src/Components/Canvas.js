import React, { useEffect, useRef, useState } from 'react';
import {io} from 'socket.io-client';

const Canvas = ({ roomId, userName }) => {
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // Connect to socket server
    //const newSocket = io('http://localhost:5000');
    //const newSocket = io('https://skproject-a3.wl.r.appspot.com/');
    const newSocket = io('https://collabcanvas-364y.onrender.com/');
    
    setSocket(newSocket);
    
    // Join room when component mounts
    if (roomId && userName) {
      newSocket.emit('join-room', { roomId, userName });
    }
    
    // Setup canvas
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Handle cleanup
    return () => {
      newSocket.disconnect();
    };
  }, [roomId, userName]);
  
  useEffect(() => {
    if (!socket) return;
    
    // Listen for other users' drawing
    socket.on('draw-data', (data) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      context.strokeStyle = data.color;
      context.lineWidth = 3;
      context.lineCap = 'round';
      
      context.beginPath();
      context.moveTo(data.startX, data.startY);
      context.lineTo(data.endX, data.endY);
      context.stroke();
    });
    
    // Listen for user joined events
    socket.on('user-joined', ({ users, canvasData }) => {
      setUsers(users);
      
      // If there's existing canvas data, load it
      if (canvasData) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const image = new Image();
        image.onload = () => {
          context.drawImage(image, 0, 0);
        };
        image.src = canvasData;
      }
    });
  }, [socket]);
  
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    setIsDrawing(true);
    context.beginPath();
    context.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
  };
  
  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const startX = e.nativeEvent.offsetX - 1;
    const startY = e.nativeEvent.offsetY - 1;
    const endX = e.nativeEvent.offsetX;
    const endY = e.nativeEvent.offsetY;
    
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.lineCap = 'round';
    
    context.lineTo(endX, endY);
    context.stroke();
    
    // Emit drawing data to server
    socket.emit('draw', {
      roomId,
      drawData: { startX, startY, endX, endY, color }
    });
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    
    // Save the current state of the canvas
    const canvas = canvasRef.current;
    const canvasData = canvas.toDataURL();
    socket.emit('save-canvas', { roomId, canvasData });
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save empty canvas
    socket.emit('save-canvas', { roomId, canvasData: canvas.toDataURL() });
  };
  
  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)} 
        />
        <button onClick={clearCanvas}>Clear</button>
        <div>
          <strong>Users in room:</strong>
          {users.map((user, index) => (
            <span 
              key={index} 
              style={{ 
                margin: '0 5px', 
                color: user.color 
              }}
            >
              {user.name}
            </span>
          ))}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid #000' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
    </div>
  );
};

export default Canvas;
