const notesService = require('./notes.service');

const getNotes = async (req, res, next) => {
  try {
    const notes = await notesService.getNotes(req.user.id);
    res.json({ success: true, notes });
  } catch (err) {
    next(err);
  }
};

const getNoteById = async (req, res, next) => {
  try {
    const note = await notesService.getNoteById(req.params.id, req.user.id);
    res.json({ success: true, note });
  } catch (err) {
    next(err);
  }
};

const createNote = async (req, res, next) => {
  try {
    const note = await notesService.createNote(req.body, req.user.id);
    res.status(201).json({ success: true, note });
  } catch (err) {
    next(err);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const note = await notesService.updateNote(req.params.id, req.body, req.user.id);
    res.json({ success: true, note });
  } catch (err) {
    next(err);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const result = await notesService.deleteNote(req.params.id, req.user.id);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote };
