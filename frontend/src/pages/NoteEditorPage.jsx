import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchNoteById, deleteNote } from '../api/notesApi';
import Editor from '../components/Editor';
import CollaboratorPanel from '../components/CollaboratorPanel';
import ActivityFeed from '../components/ActivityFeed';
import SharePanel from '../components/SharePanel';
import { useAuth } from '../context/AuthContext';

const TABS = ['Collaborators', 'Activity', 'Share'];

const NoteEditorPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Collaborators');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await fetchNoteById(id);
        setNote(data.note);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load note');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div style={styles.center}>Loading note...</div>;
  if (error) return <div style={styles.center}><p style={{ color: '#ef4444' }}>{error}</p><Link to="/dashboard">← Back</Link></div>;
  if (!note) return null;

  const isOwner = note.owner_id === user?.id;
  const canEdit = note.user_permission === 'owner' || note.user_permission === 'Editor';

  return (
    <div style={styles.layout}>
      {/* Editor area */}
      <div style={styles.editorArea}>
        {/* Toolbar */}
        <div style={styles.toolbar}>
          <Link to="/dashboard" style={styles.backBtn}>← Dashboard</Link>
          <div style={styles.toolbarRight}>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
            </button>
          </div>
        </div>

        <div style={styles.editorPad}>
          <Editor note={note} canEdit={canEdit} />
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div style={styles.sidebar}>
          {/* Tabs */}
          <div style={styles.tabs}>
            {TABS.map((tab) => (
              <button
                key={tab}
                style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={styles.tabContent}>
            {activeTab === 'Collaborators' && (
              <CollaboratorPanel noteId={id} isOwner={isOwner} />
            )}
            {activeTab === 'Activity' && (
              <ActivityFeed noteId={id} />
            )}
            {activeTab === 'Share' && (
              <SharePanel noteId={id} isOwner={isOwner} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  layout: { display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' },
  editorArea: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 24px',
    borderBottom: '1px solid #e2e8f0',
    background: '#fff',
  },
  backBtn: { fontSize: 14, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 },
  toolbarRight: { display: 'flex', gap: 10 },
  editorPad: { flex: 1, overflow: 'auto', padding: 32, maxWidth: 840, width: '100%', margin: '0 auto' },
  sidebar: {
    width: 320,
    borderLeft: '1px solid #e2e8f0',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tabs: { display: 'flex', borderBottom: '1px solid #e2e8f0' },
  tab: {
    flex: 1,
    padding: '10px 0',
    background: 'none',
    border: 'none',
    fontSize: 12,
    fontWeight: 500,
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'color 0.15s',
  },
  tabActive: { color: '#4f46e5', borderBottom: '2px solid #4f46e5' },
  tabContent: { flex: 1, overflow: 'auto' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 },
};

export default NoteEditorPage;
