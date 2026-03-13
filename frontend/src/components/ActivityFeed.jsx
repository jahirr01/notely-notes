import { useEffect, useState } from 'react';
import { getActivity } from '../api/notesApi';

const actionIcons = {
  create: '✨',
  update: '✏️',
  delete: '🗑️',
  share: '🔗',
};

const ActivityFeed = ({ noteId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getActivity(noteId);
        setLogs(data.logs);
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, [noteId]);

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>📋 Activity Log</h3>
      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : logs.length === 0 ? (
        <p style={styles.empty}>No activity yet</p>
      ) : (
        <div style={styles.list}>
          {logs.map((log) => (
            <div key={log.id} style={styles.row}>
              <span style={styles.icon}>{actionIcons[log.action] || '•'}</span>
              <div style={styles.info}>
                <span style={styles.meta}>{log.meta}</span>
                <span style={styles.who}>
                  by {log.user_name || 'Unknown'} · {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: 16 },
  heading: { fontSize: 14, fontWeight: 600, marginBottom: 14 },
  empty: { fontSize: 13, color: '#94a3b8' },
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  row: { display: 'flex', gap: 10, alignItems: 'flex-start' },
  icon: { fontSize: 16, flexShrink: 0 },
  info: { display: 'flex', flexDirection: 'column', gap: 2 },
  meta: { fontSize: 13, color: '#334155' },
  who: { fontSize: 11, color: '#94a3b8' },
};

export default ActivityFeed;
