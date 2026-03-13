const searchService = require('./search.service');

const search = async (req, res, next) => {
  try {
    const { q } = req.query;
    const notes = await searchService.searchNotes(q, req.user.id);
    res.json({ success: true, notes });
  } catch (err) {
    next(err);
  }
};

module.exports = { search };
