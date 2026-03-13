const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { getMe, updateMe, getAllUsers } = require('./users.controller');

// GET /api/users/me
router.get('/me', auth, getMe);

// PATCH /api/users/me
router.patch('/me', auth, updateMe);

// GET /api/users  (used for collaborator search)
router.get('/', auth, getAllUsers);

module.exports = router;
