// server.js (ESM version)
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Track connected users and their socket ids
const connectedUsers = new Map(); // username -> socketId
const userSockets = new Map();     // socketId -> username

// Track private chat rooms between users
const privateRooms = new Map(); // "user1_user2" -> roomId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Register user when they login
  socket.on('registerUser', ({ username }) => {
    connectedUsers.set(username, socket.id);
    userSockets.set(socket.id, username);
    
    console.log(`User ${username} registered with socket ${socket.id}`);
    
    const onlineUsers = Array.from(connectedUsers.keys());
    io.emit('usersOnline', onlineUsers);
  });

  // Join private chat
  socket.on('joinChat', ({ sender, receiver }) => {
    const roomName = [sender, receiver].sort().join('_');
    socket.join(roomName);
    privateRooms.set(roomName, roomName);
    console.log(`${sender} joined room ${roomName} to chat with ${receiver}`);
  });

  // Leave private chat
  socket.on('leaveChat', ({ sender, receiver }) => {
    const roomName = [sender, receiver].sort().join('_');
    socket.leave(roomName);
    console.log(`${sender} left room ${roomName}`);
  });

  // Send message
  socket.on('sendMessage', ({ sender, receiver, text, time }) => {
    const roomName = [sender, receiver].sort().join('_');
    socket.to(roomName).emit('receiveMessage', { sender, text, time });
    console.log(`Message from ${sender} to ${receiver} in room ${roomName}`);
  });

  // Typing indicator
  socket.on('typing', ({ sender, receiver, isTyping }) => {
    const roomName = [sender, receiver].sort().join('_');
    socket.to(roomName).emit('userTyping', { user: sender, isTyping });
  });

  // Explicit logout
  socket.on('userLogout', ({ username }) => {
    if (connectedUsers.has(username)) {
      connectedUsers.delete(username);
      userSockets.delete(socket.id);
      io.emit('usersOnline', Array.from(connectedUsers.keys()));
      console.log(`User ${username} logged out`);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const username = userSockets.get(socket.id);
    if (username) {
      connectedUsers.delete(username);
      userSockets.delete(socket.id);
      io.emit('usersOnline', Array.from(connectedUsers.keys()));
      console.log(`User ${username} disconnected`);
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
