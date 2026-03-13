const usersService = require('./users.service');

const getMe = async (req, res, next) => {
  try {
    const user = await usersService.getMe(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const user = await usersService.updateMe(req.user.id, req.body);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await usersService.getAllUsers();
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMe, updateMe, getAllUsers };
