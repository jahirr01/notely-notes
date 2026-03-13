import { useState, useEffect } from 'react';
import { getCollaborators, addCollaborator, removeCollaborator } from '../api/notesApi';

const CollaboratorPanel = ({ noteId, isOwner }) => {
  const [collaborators, setCollaborators] = useState([]);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('Viewer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await getCollaborators(noteId);
      setCollaborators(data.collaborators);
    } catch {}
  };

  useEffect(() => { load(); }, [noteId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      await addCollaborator(noteId, { email, permission });
      setEmail('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add collaborator');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    try {
      await removeCollaborator(noteId, userId);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove');
    }
  };

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>👥 Collaborators</h3>

      {isOwner && (
        <form onSubmit={handleAdd} style={styles.form}>
          <input
            className="input"
            placeholder="User email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            className="input"
            style={{ width: 'auto' }}
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
          >
            <option value="Viewer">Viewer</option>
            <option value="Editor">Editor</option>
          </select>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? '...' : 'Add'}
          </button>
        </form>
      )}

      {error && <p className="error-msg">{error}</p>}

      <div style={styles.list}>
        {collaborators.length === 0 ? (
          <p style={styles.empty}>No collaborators yet</p>
        ) : (
          collaborators.map((c) => (
            <div key={c.id} style={styles.collabRow}>
              <div>
                <div style={styles.collabName}>{c.name}</div>
                <div style={styles.collabEmail}>{c.email}</div>
              </div>
              <div style={styles.collabRight}>
                <span className={`badge badge-${c.permission.toLowerCase()}`}>{c.permission}</span>
                {isOwner && (
                  <button
                    className="btn btn-danger"
                    style={{ fontSize: 11, padding: '3px 8px' }}
                    onClick={() => handleRemove(c.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  panel: { padding: 16 },
  heading: { fontSize: 14, fontWeight: 600, marginBottom: 14 },
  form: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 },
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  empty: { fontSize: 13, color: '#94a3b8' },
  collabRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 10px',
    background: '#f8fafc',
    borderRadius: 6,
  },
  collabName: { fontSize: 13, fontWeight: 500 },
  collabEmail: { fontSize: 12, color: '#94a3b8' },
  collabRight: { display: 'flex', alignItems: 'center', gap: 8 },
};

export default CollaboratorPanel;
