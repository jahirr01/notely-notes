const pool = require('../../config/db');
const activityService = require('../activity/activity.service');

// Get or regenerate share token for a note (owner only)
const getShareLink = async (noteId, requesterId) => {
  const result = await pool.query(
    'SELECT id, share_token FROM notes WHERE id = $1 AND owner_id = $2',
    [noteId, requesterId]
  );
  if (!result.rows[0]) {
    const err = new Error('Note not found or only owner can share');
    err.status = 403;
    throw err;
  }
  return { shareToken: result.rows[0].share_token };
};

// Fetch note by public share token (no auth needed)
const getNoteByShareToken = async (token) => {
  const result = await pool.query(
    `SELECT n.id, n.title, n.content, n.created_at, n.updated_at,
            u.name as owner_name
     FROM notes n
     JOIN users u ON u.id = n.owner_id
     WHERE n.share_token = $1`,
    [token]
  );
  if (!result.rows[0]) {
    const err = new Error('Invalid or expired share link');
    err.status = 404;
    throw err;
  }
  return result.rows[0];
};

// Regenerate share token (revoke old link)
const regenerateShareToken = async (noteId, requesterId) => {
  const result = await pool.query(
    `UPDATE notes SET share_token = gen_random_uuid()
     WHERE id = $1 AND owner_id = $2
     RETURNING share_token`,
    [noteId, requesterId]
  );
  if (!result.rows[0]) {
    const err = new Error('Note not found or access denied');
    err.status = 403;
    throw err;
  }
  await activityService.log(noteId, requesterId, 'share', 'Share link regenerated');
  return { shareToken: result.rows[0].share_token };
};

module.exports = { getShareLink, getNoteByShareToken, regenerateShareToken };
