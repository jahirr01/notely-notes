import { useState } from 'react';
import { getShareLink, regenerateShare } from '../api/notesApi';

const SharePanel = ({ noteId, isOwner }) => {
  const [shareToken, setShareToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const shareUrl = shareToken
    ? `${window.location.origin}/shared/${shareToken}`
    : '';

  const handleGetLink = async () => {
    setLoading(true);
    try {
      const { data } = await getShareLink(noteId);
      setShareToken(data.shareToken);
    } catch {}
    finally { setLoading(false); }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const { data } = await regenerateShare(noteId);
      setShareToken(data.shareToken);
    } catch {}
    finally { setLoading(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>🔗 Share Note</h3>
      <p style={styles.desc}>Generate a public read-only link — no login required.</p>

      {!shareToken ? (
        <button className="btn btn-primary" onClick={handleGetLink} disabled={loading}>
          {loading ? 'Loading...' : 'Get Share Link'}
        </button>
      ) : (
        <div style={styles.linkBox}>
          <input
            className="input"
            readOnly
            value={shareUrl}
            style={{ fontSize: 12 }}
          />
          <div style={styles.actions}>
            <button className="btn btn-primary" onClick={handleCopy}>
              {copied ? '✅ Copied!' : 'Copy Link'}
            </button>
            {isOwner && (
              <button className="btn btn-ghost" onClick={handleRegenerate} disabled={loading}>
                Regenerate
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: 16 },
  heading: { fontSize: 14, fontWeight: 600, marginBottom: 6 },
  desc: { fontSize: 12, color: '#94a3b8', marginBottom: 14 },
  linkBox: { display: 'flex', flexDirection: 'column', gap: 10 },
  actions: { display: 'flex', gap: 8 },
};

export default SharePanel;
