const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { search } = require('./search.controller');

// GET /api/search?q=keyword
router.get('/', auth, search);

module.exports = router;
