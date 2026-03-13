const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, FRONTEND_URL } = require('../config/env');

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // JWT auth middleware for sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.user.name} (${socket.id})`);

    // Join a note room
    socket.on('join-note', (noteId) => {
      socket.join(noteId);
      console.log(`${socket.user.name} joined note room: ${noteId}`);

      // Notify others in the room
      socket.to(noteId).emit('user-joined', {
        userId: socket.user.id,
        userName: socket.user.name,
      });
    });

    // Leave a note room
    socket.on('leave-note', (noteId) => {
      socket.leave(noteId);
      socket.to(noteId).emit('user-left', {
        userId: socket.user.id,
        userName: socket.user.name,
      });
    });

    // Real-time note editing — broadcast to everyone else in the room
    socket.on('note:edit', ({ noteId, title, content }) => {
      socket.to(noteId).emit('note:update', {
        noteId,
        title,
        content,
        userId: socket.user.id,
        userName: socket.user.name,
        timestamp: Date.now(),
      });
    });

    // Typing indicator
    socket.on('note:typing', ({ noteId }) => {
      socket.to(noteId).emit('note:typing', {
        userId: socket.user.id,
        userName: socket.user.name,
      });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.user.name}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = { initSocket, getIO };
