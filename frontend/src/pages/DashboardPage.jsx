import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNotes, createNote, deleteNote } from '../api/notesApi';
import NoteCard from '../components/NoteCard';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const { data } = await fetchNotes();
      setNotes(data.notes);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { loadNotes(); }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const { data } = await createNote({ title: 'Untitled Note', content: '' });
      navigate(`/notes/${data.note.id}`);
    } catch {}
    finally { setCreating(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return;
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const myNotes = notes.filter((n) => n.user_permission === 'owner');
  const sharedNotes = notes.filter((n) => n.user_permission !== 'owner');

  return (
    <div className="page-container">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>My Notes</h1>
          <p style={styles.pageSub}>Welcome back, {user?.name}</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate} disabled={creating}>
          {creating ? 'Creating...' : '+ New Note'}
        </button>
      </div>

      {loading ? (
        <div style={styles.center}>Loading notes...</div>
      ) : (
        <>
          {myNotes.length > 0 && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>📁 My Notes ({myNotes.length})</h2>
              <div style={styles.grid}>
                {myNotes.map((note) => (
                  <NoteCard key={note.id} note={note} onDelete={handleDelete} />
                ))}
              </div>
            </section>
          )}

          {sharedNotes.length > 0 && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>🤝 Shared With Me ({sharedNotes.length})</h2>
              <div style={styles.grid}>
                {sharedNotes.map((note) => (
                  <NoteCard key={note.id} note={note} onDelete={handleDelete} />
                ))}
              </div>
            </section>
          )}

          {notes.length === 0 && (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>📝</div>
              <p>No notes yet. Create your first note!</p>
              <button className="btn btn-primary" onClick={handleCreate} style={{ marginTop: 16 }}>
                Create Note
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  pageTitle: { fontSize: 28, fontWeight: 700 },
  pageSub: { color: '#64748b', marginTop: 4 },
  section: { marginBottom: 36 },
  sectionTitle: { fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#475569' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
  center: { textAlign: 'center', padding: 60, color: '#94a3b8' },
  empty: { textAlign: 'center', padding: 80, color: '#94a3b8' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
};

export default DashboardPage;
