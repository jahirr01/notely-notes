import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchNotes } from '../api/searchApi';
import NoteCard from '../components/NoteCard';
import { deleteNote } from '../api/notesApi';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    const run = async () => {
      setLoading(true);
      try {
        const { data } = await searchNotes(q);
        setResults(data.notes);
      } catch {}
      finally { setLoading(false); }
    };
    run();
  }, [q]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return;
    await deleteNote(id);
    setResults((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="page-container">
      <h1 style={styles.title}>
        Search results for <em>"{q}"</em>
      </h1>

      {loading ? (
        <p style={styles.info}>Searching...</p>
      ) : results.length === 0 ? (
        <p style={styles.info}>No notes found matching "{q}"</p>
      ) : (
        <div style={styles.grid}>
          {results.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  title: { fontSize: 22, fontWeight: 600, marginBottom: 24 },
  info: { color: '#94a3b8', padding: '40px 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
};

export default SearchPage;
