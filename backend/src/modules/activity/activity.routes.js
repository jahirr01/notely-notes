const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../../middleware/auth');
const { getActivityByNote } = require('./activity.controller');

// GET /api/notes/:noteId/activity
router.get('/', auth, getActivityByNote);

module.exports = router;
