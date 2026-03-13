import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNoteByToken } from '../api/notesApi';

const SharedNotePage = () => {
  const { token } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getNoteByToken(token);
        setNote(data.note);
      } catch (err) {
        setError(err.response?.data?.message || 'Note not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  if (loading) return <div style={styles.center}>Loading...</div>;

  if (error) return (
    <div style={styles.center}>
      <p style={{ color: '#ef4444', marginBottom: 12 }}>🔗 {error}</p>
      <Link to="/" className="btn btn-ghost">Go to Home</Link>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.banner}>
        👁️ <strong>Read-only view</strong> — This note is publicly shared. Sign in to collaborate.
        <Link to="/login" style={{ marginLeft: 12, color: '#4f46e5', fontWeight: 600 }}>Sign In</Link>
      </div>

      <div style={styles.content}>
        <div style={styles.meta}>
          <span>By {note.owner_name}</span>
          <span>Last updated: {new Date(note.updated_at).toLocaleString()}</span>
        </div>

        <h1 style={styles.title}>{note.title}</h1>

        <div style={styles.body}>
          {note.content ? (
            note.content.split('\n').map((line, i) => (
              <p key={i} style={{ minHeight: '1.6em' }}>{line}</p>
            ))
          ) : (
            <p style={{ color: '#94a3b8' }}>This note has no content.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f8fafc' },
  banner: {
    background: '#fef9c3',
    padding: '10px 24px',
    fontSize: 14,
    color: '#854d0e',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    borderBottom: '1px solid #fde68a',
  },
  content: { maxWidth: 720, margin: '0 auto', padding: '40px 24px' },
  meta: { display: 'flex', gap: 20, fontSize: 13, color: '#94a3b8', marginBottom: 24 },
  title: { fontSize: 32, fontWeight: 700, marginBottom: 24, color: '#1e293b' },
  body: { fontSize: 16, lineHeight: 1.8, color: '#334155' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 },
};

export default SharedNotePage;
