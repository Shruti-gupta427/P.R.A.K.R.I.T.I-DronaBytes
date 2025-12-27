const socketIO = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user room for personalized notifications
    socket.on('join-user-room', (userId) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Helper function to send notification to user
const sendNotificationToUser = (userId, notification) => {
  const io = getIO();
  io.to(`user-${userId}`).emit('notification', notification);
};

// Helper function to broadcast to all users
const broadcastToAll = (event, data) => {
  const io = getIO();
  io.emit(event, data);
};

module.exports = {
  initializeSocket,
  getIO,
  sendNotificationToUser,
  broadcastToAll
};

