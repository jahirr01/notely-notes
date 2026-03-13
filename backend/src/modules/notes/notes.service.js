const pool = require('../../config/db');
const activityService = require('../activity/activity.service');

// Get all notes accessible by user (owned + collaborated)
const getNotes = async (userId) => {
  const result = await pool.query(
    `SELECT DISTINCT n.*, u.name as owner_name,
      CASE WHEN n.owner_id = $1 THEN 'owner'
           ELSE nc.permission END as user_permission
     FROM notes n
     JOIN users u ON u.id = n.owner_id
     LEFT JOIN note_collaborators nc ON nc.note_id = n.id AND nc.user_id = $1
     WHERE n.owner_id = $1 OR nc.user_id = $1
     ORDER BY n.updated_at DESC`,
    [userId]
  );
  return result.rows;
};

// Get single note (with permission check)
const getNoteById = async (noteId, userId) => {
  const result = await pool.query(
    `SELECT n.*, u.name as owner_name,
      CASE WHEN n.owner_id = $2 THEN 'owner'
           ELSE nc.permission END as user_permission
     FROM notes n
     JOIN users u ON u.id = n.owner_id
     LEFT JOIN note_collaborators nc ON nc.note_id = n.id AND nc.user_id = $2
     WHERE n.id = $1 AND (n.owner_id = $2 OR nc.user_id = $2)`,
    [noteId, userId]
  );

  if (!result.rows[0]) {
    const err = new Error('Note not found or access denied');
    err.status = 404;
    throw err;
  }
  return result.rows[0];
};

// Create note
const createNote = async ({ title, content }, userId) => {
  const result = await pool.query(
    `INSERT INTO notes (title, content, owner_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title || 'Untitled Note', content || '', userId]
  );
  const note = result.rows[0];
  await activityService.log(note.id, userId, 'create', `Created note "${note.title}"`);
  return note;
};

// Update note (owner or Editor collaborator only)
const updateNote = async (noteId, { title, content }, userId) => {
  // Check permission
  const permResult = await pool.query(
    `SELECT n.owner_id, nc.permission
     FROM notes n
     LEFT JOIN note_collaborators nc ON nc.note_id = n.id AND nc.user_id = $2
     WHERE n.id = $1`,
    [noteId, userId]
  );

  const row = permResult.rows[0];
  if (!row) {
    const err = new Error('Note not found');
    err.status = 404;
    throw err;
  }

  const isOwner = row.owner_id === userId;
  const isEditor = row.permission === 'Editor';

  if (!isOwner && !isEditor) {
    const err = new Error('You do not have edit permission on this note');
    err.status = 403;
    throw err;
  }

  const result = await pool.query(
    `UPDATE notes
     SET title = COALESCE($1, title),
         content = COALESCE($2, content),
         updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [title, content, noteId]
  );

  const note = result.rows[0];
  await activityService.log(noteId, userId, 'update', `Updated note "${note.title}"`);
  return note;
};

// Delete note (owner only)
const deleteNote = async (noteId, userId) => {
  const check = await pool.query(
    'SELECT id, title FROM notes WHERE id = $1 AND owner_id = $2',
    [noteId, userId]
  );

  if (!check.rows[0]) {
    const err = new Error('Note not found or only owner can delete');
    err.status = 403;
    throw err;
  }

  await activityService.log(noteId, userId, 'delete', `Deleted note "${check.rows[0].title}"`);
  await pool.query('DELETE FROM notes WHERE id = $1', [noteId]);
  return { message: 'Note deleted successfully' };
};

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote };
