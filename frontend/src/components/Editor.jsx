import { useState, useEffect, useRef, useCallback } from 'react';
import { useNoteSocket } from '../hooks/useSocket';
import { updateNote } from '../api/notesApi';

const Editor = ({ note, canEdit }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const saveTimer = useRef(null);
  const isRemoteUpdate = useRef(false);

  // Handle incoming real-time updates from other users
  const handleUpdate = useCallback(({ title: t, content: c, userName }) => {
    isRemoteUpdate.current = true;
    if (t !== undefined) setTitle(t);
    if (c !== undefined) setContent(c);
    setTimeout(() => { isRemoteUpdate.current = false; }, 100);
  }, []);

  const handleUserJoined = useCallback(({ userName }) => {
    setActiveUsers((prev) => [...prev.filter((u) => u !== userName), userName]);
  }, []);

  const handleUserLeft = useCallback(({ userName }) => {
    setActiveUsers((prev) => prev.filter((u) => u !== userName));
  }, []);

  const handleTyping = useCallback(({ userName }) => {
    setTypingUsers((prev) => [...new Set([...prev, userName])]);
    setTimeout(() => {
      setTypingUsers((prev) => prev.filter((u) => u !== userName));
    }, 2000);
  }, []);

  const { emitEdit, emitTyping } = useNoteSocket(note?.id, {
    onUpdate: handleUpdate,
    onUserJoined: handleUserJoined,
    onUserLeft: handleUserLeft,
    onTyping: handleTyping,
  });

  // Auto-save with debounce
  const triggerSave = useCallback((newTitle, newContent) => {
    if (!canEdit) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await updateNote(note.id, { title: newTitle, content: newContent });
        setSavedAt(new Date());
      } catch (err) {
        console.error('Save failed:', err);
      } finally {
        setSaving(false);
      }
    }, 1000);
  }, [note?.id, canEdit]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!isRemoteUpdate.current) {
      emitEdit(val, content);
      triggerSave(val, content);
    }
  };

  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);
    if (!isRemoteUpdate.current) {
      emitEdit(title, val);
      emitTyping();
      triggerSave(title, val);
    }
  };

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
    }
  }, [note?.id]);

  return (
    <div style={styles.container}>
      {/* Status bar */}
      <div style={styles.statusBar}>
        <div style={styles.statusLeft}>
          {activeUsers.length > 0 && (
            <span style={styles.activeUsers}>
              🟢 {activeUsers.join(', ')} also viewing
            </span>
          )}
          {typingUsers.length > 0 && (
            <span style={styles.typing}>
              ✍️ {typingUsers.join(', ')} typing...
            </span>
          )}
        </div>
        <span style={styles.saveStatus}>
          {saving ? '💾 Saving...' : savedAt ? `✅ Saved ${savedAt.toLocaleTimeString()}` : ''}
        </span>
      </div>

      {/* Title */}
      <input
        style={styles.titleInput}
        value={title}
        onChange={handleTitleChange}
        placeholder="Note title..."
        disabled={!canEdit}
      />

      {/* Content */}
      <textarea
        style={{ ...styles.contentArea, cursor: canEdit ? 'text' : 'default' }}
        value={content}
        onChange={handleContentChange}
        placeholder={canEdit ? 'Start writing...' : 'Read-only'}
        disabled={!canEdit}
      />

      {!canEdit && (
        <div style={styles.readonlyBanner}>👁️ View only — you don't have edit permission</div>
      )}
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%' },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    fontSize: 12,
    color: '#64748b',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: 16,
  },
  statusLeft: { display: 'flex', gap: 16 },
  activeUsers: { color: '#22c55e' },
  typing: { color: '#4f46e5' },
  saveStatus: { color: '#64748b' },
  titleInput: {
    fontSize: 26,
    fontWeight: 700,
    border: 'none',
    outline: 'none',
    padding: '8px 0',
    marginBottom: 16,
    color: '#1e293b',
    background: 'transparent',
    borderBottom: '2px solid #e2e8f0',
    width: '100%',
  },
  contentArea: {
    flex: 1,
    border: 'none',
    outline: 'none',
    resize: 'none',
    fontSize: 15,
    lineHeight: 1.8,
    color: '#334155',
    background: 'transparent',
    minHeight: 400,
    width: '100%',
  },
  readonlyBanner: {
    marginTop: 12,
    padding: '8px 14px',
    background: '#fef9c3',
    borderRadius: 6,
    fontSize: 13,
    color: '#854d0e',
  },
};

export default Editor;
