const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  participants: [{ 
    name: String, 
    color: String, 
    joinedAt: { type: Date, default: Date.now } 
  }],
  canvasData: { type: String, default: "" }
});

module.exports = mongoose.model('Room', RoomSchema);