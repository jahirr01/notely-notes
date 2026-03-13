const pool = require('../../config/db');

const log = async (noteId, userId, action, meta = '') => {
  try {
    await pool.query(
      'INSERT INTO activity_logs (note_id, user_id, action, meta) VALUES ($1, $2, $3, $4)',
      [noteId, userId, action, meta]
    );
  } catch (err) {
    // Non-blocking - log failures shouldn't break the main flow
    console.error('Activity log error:', err.message);
  }
};

const getActivityByNote = async (noteId, requesterId) => {
  // Check access
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
    `SELECT al.id, al.action, al.meta, al.created_at,
            u.name as user_name, u.email as user_email
     FROM activity_logs al
     LEFT JOIN users u ON u.id = al.user_id
     WHERE al.note_id = $1
     ORDER BY al.created_at DESC
     LIMIT 100`,
    [noteId]
  );
  return result.rows;
};

module.exports = { log, getActivityByNote };
