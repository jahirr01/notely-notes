const pool = require('../../config/db');

const searchNotes = async (query, userId) => {
  if (!query || query.trim().length === 0) return [];

  const searchTerm = `%${query.trim()}%`;

  const result = await pool.query(
    `SELECT DISTINCT n.id, n.title, n.content, n.owner_id, n.updated_at,
            u.name as owner_name,
            CASE WHEN n.owner_id = $2 THEN 'owner' ELSE nc.permission END as user_permission
     FROM notes n
     JOIN users u ON u.id = n.owner_id
     LEFT JOIN note_collaborators nc ON nc.note_id = n.id AND nc.user_id = $2
     WHERE (n.owner_id = $2 OR nc.user_id = $2)
       AND (n.title ILIKE $1 OR n.content ILIKE $1)
     ORDER BY n.updated_at DESC
     LIMIT 50`,
    [searchTerm, userId]
  );

  return result.rows;
};

module.exports = { searchNotes };
