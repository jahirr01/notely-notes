const collabService = require('./collab.service');

const getCollaborators = async (req, res, next) => {
  try {
    const collaborators = await collabService.getCollaborators(req.params.noteId, req.user.id);
    res.json({ success: true, collaborators });
  } catch (err) {
    next(err);
  }
};

const addCollaborator = async (req, res, next) => {
  try {
    const { email, permission } = req.body;
    if (!email) return res.status(400).json({ message: 'email is required' });
    const result = await collabService.addCollaborator(
      req.params.noteId, email, permission, req.user.id
    );
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const removeCollaborator = async (req, res, next) => {
  try {
    const result = await collabService.removeCollaborator(
      req.params.noteId, req.params.userId, req.user.id
    );
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCollaborators, addCollaborator, removeCollaborator };
