const activityService = require('./activity.service');

const getActivityByNote = async (req, res, next) => {
  try {
    const logs = await activityService.getActivityByNote(req.params.noteId, req.user.id);
    res.json({ success: true, logs });
  } catch (err) {
    next(err);
  }
};

module.exports = { getActivityByNote };
