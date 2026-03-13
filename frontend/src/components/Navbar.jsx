import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { searchNotes } from '../api/searchApi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/dashboard" style={styles.logo}>
          📝 Notely
        </Link>

        {user && (
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              className="input"
              style={{ width: 280 }}
              placeholder="Search notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        )}

        <div style={styles.actions}>
          {user ? (
            <>
              <span style={styles.userName}>
                <span className={`badge badge-${user.role?.toLowerCase()}`}>{user.role}</span>
                {' '}{user.name}
              </span>
              <button className="btn btn-ghost" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: '#fff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 20px',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  logo: {
    fontWeight: 700,
    fontSize: 20,
    color: '#4f46e5',
    textDecoration: 'none',
    flexShrink: 0,
  },
  searchForm: { flex: 1 },
  actions: { display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 },
  userName: { fontSize: 14, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 },
};

export default Navbar;
