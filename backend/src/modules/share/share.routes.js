const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../../middleware/auth');
const { getShareLink, getNoteByShareToken, regenerateShareToken } = require('./share.controller');

// GET  /api/notes/:noteId/share        → get share token
router.get('/notes/:noteId/share', auth, getShareLink);

// POST /api/notes/:noteId/share/regenerate → new token
router.post('/notes/:noteId/share/regenerate', auth, regenerateShareToken);

// GET  /api/shared/:token              → public read-only (no auth)
router.get('/shared/:token', getNoteByShareToken);

module.exports = router;
