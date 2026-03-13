const pool = require('../../config/db');

const getMe = async (userId) => {
  const result = await pool.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
    [userId]
  );
  if (!result.rows[0]) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  return result.rows[0];
};

const updateMe = async (userId, { name }) => {
  const result = await pool.query(
    'UPDATE users SET name = COALESCE($1, name) WHERE id = $2 RETURNING id, name, email, role',
    [name, userId]
  );
  return result.rows[0];
};

const getAllUsers = async () => {
  const result = await pool.query('SELECT id, name, email, role FROM users ORDER BY name');
  return result.rows;
};

module.exports = { getMe, updateMe, getAllUsers };
