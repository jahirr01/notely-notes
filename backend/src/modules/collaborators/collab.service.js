const pool = require('../../config/db');
const activityService = require('../activity/activity.service');

// Add or update collaborator on a note
const addCollaborator = async (noteId, targetEmail, permission, requesterId) => {
  // Only owner can manage collaborators
  const noteCheck = await pool.query(
    'SELECT id, title FROM notes WHERE id = $1 AND owner_id = $2',
    [noteId, requesterId]
  );
  if (!noteCheck.rows[0]) {
    const err = new Error('Only the note owner can manage collaborators');
    err.status = 403;
    throw err;
  }

  // Find target user
  const userResult = await pool.query('SELECT id, name FROM users WHERE email = $1', [targetEmail]);
  if (!userResult.rows[0]) {
    const err = new Error('User with that email not found');
    err.status = 404;
    throw err;
  }
  const targetUser = userResult.rows[0];

  // Cannot add yourself
  if (targetUser.id === requesterId) {
    const err = new Error('You cannot add yourself as a collaborator');
    err.status = 400;
    throw err;
  }

  // Upsert collaborator
  await pool.query(
    `INSERT INTO note_collaborators (note_id, user_id, permission)
     VALUES ($1, $2, $3)
     ON CONFLICT (note_id, user_id) DO UPDATE SET permission = $3`,
    [noteId, targetUser.id, permission || 'Viewer']
  );

  await activityService.log(
    noteId, requesterId, 'share',
    `Shared with ${targetUser.name} as ${permission || 'Viewer'}`
  );

  return { message: 'Collaborator added', user: targetUser, permission };
};

// Remove collaborator
const removeCollaborator = async (noteId, targetUserId, requesterId) => {
  const noteCheck = await pool.query(
    'SELECT id FROM notes WHERE id = $1 AND owner_id = $2',
    [noteId, requesterId]
  );
  if (!noteCheck.rows[0]) {
    const err = new Error('Only the note owner can remove collaborators');
    err.status = 403;
    throw err;
  }

  await pool.query(
    'DELETE FROM note_collaborators WHERE note_id = $1 AND user_id = $2',
    [noteId, targetUserId]
  );

  return { message: 'Collaborator removed' };
};

// Get all collaborators for a note
const getCollaborators = async (noteId, requesterId) => {
  const access = await pool.query(
    `SELECT 1 FROM notes n
     LEFT JOIN note_collaborators nc ON nc.note_id = n.id AND nc.user_id = $2
     WHERE n.id = $1 AND (n.owner_id = $2 OR nc.user_id = $2)`,
    [noteId, requesterId]
  );
  if (!access.rows[0]) {
    const err = new Error('Access denied');
    err.status = 403;
    throw err;
  }

  const result = await pool.query(
    `SELECT u.id, u.name, u.email, nc.permission
     FROM note_collaborators nc
     JOIN users u ON u.id = nc.user_id
     WHERE nc.note_id = $1`,
    [noteId]
  );
  return result.rows;
};

module.exports = { addCollaborator, removeCollaborator, getCollaborators };
