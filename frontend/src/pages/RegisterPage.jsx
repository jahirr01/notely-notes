import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Editor' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.page}>
      <div className="card" style={styles.card}>
        <h1 style={styles.title}>📝 Notely</h1>
        <p style={styles.sub}>Create your account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={styles.label}>Full Name</label>
            <input className="input" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label style={styles.label}>Email</label>
            <input className="input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label style={styles.label}>Password</label>
            <input className="input" name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <div>
            <label style={styles.label}>Role</label>
            <select className="input" name="role" value={form.role} onChange={handleChange}>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={{ color: '#4f46e5' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' },
  card: { width: '100%', maxWidth: 420, padding: 32 },
  title: { fontSize: 26, fontWeight: 700, textAlign: 'center', marginBottom: 4 },
  sub: { textAlign: 'center', color: '#64748b', marginBottom: 28 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 },
  footer: { textAlign: 'center', fontSize: 14, marginTop: 20, color: '#64748b' },
};

export default RegisterPage;
