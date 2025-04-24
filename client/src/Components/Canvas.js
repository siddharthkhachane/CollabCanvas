import React, { useEffect, useRef, useState } from 'react';
import {io} from 'socket.io-client';
import './custom.css';

const Canvas = ({ roomId, userName }) => {
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#6366f1');
  const [users, setUsers] = useState([]);
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState('brush');
  
  useEffect(() => {
    // Connect to socket server
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
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
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
      context.lineWidth = data.size || 3;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      
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
    
    context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    context.lineWidth = brushSize;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    context.lineTo(endX, endY);
    context.stroke();
    
    // Emit drawing data to server
    socket.emit('draw', {
      roomId,
      drawData: { 
        startX, 
        startY, 
        endX, 
        endY, 
        color: tool === 'eraser' ? '#FFFFFF' : color,
        size: brushSize
      }
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
    <div className="canvas-wrapper">
      <div className="canvas-tools">
        <div className="tools-row">
          <div className="tool-group">
            <span className="tool-label">Color:</span>
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)} 
              className="color-picker"
              disabled={tool === 'eraser'}
            />
          </div>
          
          <div className="tool-group">
            <span className="tool-label">Size:</span>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseInt(e.target.value))} 
              className="size-slider"
            />
            <span className="size-value">{brushSize}px</span>
          </div>
          
          <div className="tool-group">
            <button 
              onClick={() => setTool('brush')} 
              className={`tool-button ${tool === 'brush' ? 'active' : ''}`}
            >
              Brush
            </button>
            <button 
              onClick={() => setTool('eraser')} 
              className={`tool-button ${tool === 'eraser' ? 'active' : ''}`}
            >
              Eraser
            </button>
          </div>
          
          <button 
            onClick={clearCanvas} 
            className="clear-button"
          >
            Clear Canvas
          </button>
        </div>
        
        <div className="users-container">
          <div className="users-title">Users in room:</div>
          <div className="users-list">
            {users.map((user, index) => (
              <span 
                key={index} 
                className="user-tag"
              >
                <span 
                  className="user-color" 
                  style={{ backgroundColor: user.color || '#6366f1' }}
                ></span>
                {user.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="brush-preview">
        <span 
          className="brush-dot" 
          style={{ 
            backgroundColor: tool === 'eraser' ? '#FFFFFF' : color,
            border: tool === 'eraser' ? '1px solid #d1d5db' : 'none',
            width: `${Math.min(brushSize, 12)}px`, 
            height: `${Math.min(brushSize, 12)}px` 
          }}
        ></span>
        <span className="brush-text">
          {tool === 'eraser' ? 'Erasing' : 'Drawing'} with {brushSize}px {tool}
        </span>
      </div>
      
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="canvas-board"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
    </div>
  );
};

export default Canvas;
