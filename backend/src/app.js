require('./config/env'); // validate env vars first
const express = require('express');
const cors = require('cors');
const { FRONTEND_URL } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const notesRoutes = require('./modules/notes/notes.routes');
const collabRoutes = require('./modules/collaborators/collab.routes');
const activityRoutes = require('./modules/activity/activity.routes');
const searchRoutes = require('./modules/search/search.routes');
const shareRoutes = require('./modules/share/share.routes');

const app = express();

// Global middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/notes/:noteId/collaborators', collabRoutes);
app.use('/api/notes/:noteId/activity', activityRoutes);
app.use('/api/search', searchRoutes);
app.use('/api', shareRoutes);  // handles /api/notes/:noteId/share and /api/shared/:token

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
