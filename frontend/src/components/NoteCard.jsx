import { Link } from 'react-router-dom';

const NoteCard = ({ note, onDelete }) => {
  const permission = note.user_permission || 'viewer';
  const badgeClass = `badge badge-${permission}`;

  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <Link to={`/notes/${note.id}`} style={styles.title}>
          {note.title || 'Untitled Note'}
        </Link>
        <span className={badgeClass}>{permission}</span>
      </div>

      <p style={styles.preview}>
        {note.content?.slice(0, 120) || 'No content yet...'}
        {note.content?.length > 120 ? '...' : ''}
      </p>

      <div style={styles.footer}>
        <span style={styles.meta}>
          By {note.owner_name} · {new Date(note.updated_at).toLocaleDateString()}
        </span>
        <div style={styles.footerActions}>
          <Link to={`/notes/${note.id}`} className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }}>
            Open
          </Link>
          {permission === 'owner' && (
            <button
              className="btn btn-danger"
              style={{ fontSize: 12, padding: '4px 10px' }}
              onClick={() => onDelete(note.id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: { display: 'flex', flexDirection: 'column', gap: 10, transition: 'box-shadow 0.15s' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  title: { fontWeight: 600, fontSize: 16, color: '#1e293b', flex: 1 },
  preview: { fontSize: 13, color: '#64748b', lineHeight: 1.5 },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  meta: { fontSize: 12, color: '#94a3b8' },
  footerActions: { display: 'flex', gap: 8 },
};

export default NoteCard;
