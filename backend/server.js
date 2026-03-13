require('dotenv').config(); 

const http = require('http');
const app = require('./src/app');
const { PORT } = require('./src/config/env');
const { initSocket } = require('./src/sockets/socketServer');
const pool = require('./src/config/db');

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Test DB connection then start server
pool.query('SELECT 1')
  .then(() => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ Connected to PostgreSQL`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection failed:', err.message);
    process.exit(1);
  });

server.listen(PORT);
