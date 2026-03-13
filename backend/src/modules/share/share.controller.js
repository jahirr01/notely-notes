const shareService = require('./share.service');

const getShareLink = async (req, res, next) => {
  try {
    const data = await shareService.getShareLink(req.params.noteId, req.user.id);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

const getNoteByShareToken = async (req, res, next) => {
  try {
    const note = await shareService.getNoteByShareToken(req.params.token);
    res.json({ success: true, note });
  } catch (err) {
    next(err);
  }
};

const regenerateShareToken = async (req, res, next) => {
  try {
    const data = await shareService.regenerateShareToken(req.params.noteId, req.user.id);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getShareLink, getNoteByShareToken, regenerateShareToken };
