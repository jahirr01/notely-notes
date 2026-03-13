const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../../middleware/auth');
const { getCollaborators, addCollaborator, removeCollaborator } = require('./collab.controller');

// GET    /api/notes/:noteId/collaborators
router.get('/', auth, getCollaborators);

// POST   /api/notes/:noteId/collaborators
router.post('/', auth, addCollaborator);

// DELETE /api/notes/:noteId/collaborators/:userId
router.delete('/:userId', auth, removeCollaborator);

module.exports = router;
