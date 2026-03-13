const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { getNotes, getNoteById, createNote, updateNote, deleteNote } = require('./notes.controller');

// GET    /api/notes
router.get('/', auth, getNotes);

// GET    /api/notes/:id
router.get('/:id', auth, getNoteById);

// POST   /api/notes
router.post('/', auth, createNote);

// PATCH  /api/notes/:id
router.patch('/:id', auth, updateNote);

// DELETE /api/notes/:id
router.delete('/:id', auth, deleteNote);

module.exports = router;
