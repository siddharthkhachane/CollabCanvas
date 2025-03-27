const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const mongo="mongodb+srv://siddh2k1:mongo@sidcluster1.fhfsn.mongodb.net/whiteboard?retryWrites=true&w=majority&appName=sidcluster1";
mongoose.connect(mongo)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const Room = require('./models/Room');
const { v4: uuidv4 } = require('uuid');

// API endpoint to create a new room
app.post('/api/rooms', async (req, res) => {
  try {
    const roomId = uuidv4();
    const newRoom = new Room({ roomId });
    await newRoom.save();
    res.status(201).json({ roomId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Socket.io connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join a room
  socket.on('join-room', async ({ roomId, userName }) => {
    socket.join(roomId);
    
    // Update room in database with new participant
    try {
      const room = await Room.findOneAndUpdate(
        { roomId },
        { 
          $push: { participants: { name: userName, color: getRandomColor() } },
          lastActive: Date.now()
        },
        { new: true }
      );
      
      if (room) {
        // Broadcast to room that a new user joined
        io.to(roomId).emit('user-joined', {
          users: room.participants,
          canvasData: room.canvasData
        });
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  });
  
  // Handle drawing events
  socket.on('draw', ({ roomId, drawData }) => {
    socket.to(roomId).emit('draw-data', drawData);
  });
  
  // Save canvas state
  socket.on('save-canvas', async ({ roomId, canvasData }) => {
    try {
      await Room.findOneAndUpdate(
        { roomId },
        { canvasData, lastActive: Date.now() }
      );
    } catch (error) {
      console.error('Error saving canvas:', error);
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

function getRandomColor() {
  return "#" + Math.floor(Math.random()*16777215).toString(16);
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});