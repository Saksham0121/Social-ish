// server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv'; // Import dotenv for environment variables

dotenv.config(); // Load environment variables

// Create Express app and HTTP server
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, replace with your frontend URL
    methods: ["GET", "POST"]
  }
});

// Store active users and their socket IDs
const activeUsers = new Map(); // userId -> socketId
const socketToUser = new Map(); // socketId -> userId

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User registration
  socket.on('registerUser', ({ userId, username }) => {
    console.log(`User registered: ${username} (${userId})`);
    
    // Store user info
    activeUsers.set(userId, socket.id);
    socketToUser.set(socket.id, userId);
    
    // Broadcast updated online users list
    broadcastOnlineUsers();
  });

  // Join a chat room
  socket.on('joinChat', ({ sender, receiver }) => {
    const roomId = [sender, receiver].sort().join('_');
    socket.join(roomId);
    console.log(`User ${sender} joined room: ${roomId}`);
  });

  // Leave a chat room
  socket.on('leaveChat', ({ sender, receiver }) => {
    const roomId = [sender, receiver].sort().join('_');
    socket.leave(roomId);
    console.log(`User ${sender} left room: ${roomId}`);
  });

  // Handle messages
  socket.on('sendMessage', (message) => {
    const { sender, receiver, text} = message;
    const roomId = [sender, receiver].sort().join('_');
    
    console.log(`Message in room ${roomId}: ${text}`);
    
    // Broadcast to everyone in the room including sender for consistency
    io.to(roomId).emit('receiveMessage', message);
  });

  // Handle typing indicators
  socket.on('typing', ({ sender, receiver, isTyping }) => {
    const roomId = [sender, receiver].sort().join('_');
    
    // Send to receiver
    socket.to(roomId).emit('userTyping', {
      user: sender,
      isTyping
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const userId = socketToUser.get(socket.id);
    
    if (userId) {
      console.log(`User disconnected: ${userId}`);
      activeUsers.delete(userId);
      socketToUser.delete(socket.id);
      
      // Broadcast updated online users
      broadcastOnlineUsers();
    }
  });

  // Function to broadcast online users
  function broadcastOnlineUsers() {
    const onlineUsers = Array.from(activeUsers.keys()).map(id => ({
      userId: id
    }));
    
    io.emit('usersOnline', onlineUsers);
  }
});
const PORT = process.env.PORT || 3002; // Change to another available port

server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
