import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import schoolLogo from '../assets/logo.png';

export default function LoginPage() {
  const { session, supabase } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Already logged in — go straight to dashboard
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      navigate('/dashboard', { replace: true });
    }

    setLoading(false);
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <img src={schoolLogo} alt="School Logo" style={styles.logo} />
        </div>

        {/* School name */}
        <h1 style={styles.title}>A.B. Simpson Alliance School</h1>
        <p style={styles.subtitle}>Student Information and Management System</p>

        {/* Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Username / Email</label>
            <input
              type="text"
              placeholder="Enter your username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
              autoComplete="username"
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            style={{ ...styles.loginBtn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <button style={styles.forgotBtn} type="button">
          Forgot Password?
        </button>
      </div>

      {/* Default login hint */}
      <div style={styles.hint}>
        <strong>Default Login:</strong>
        <br />
        Username: admin
        <br />
        Password: admin123
      </div>
    </div>
  );
}

const CRIMSON = '#8B0000';
const CRIMSON_DARK = '#6a0000';

const styles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: CRIMSON,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '40px 48px',
    width: '100%',
    maxWidth: '480px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
  },
  logoWrap: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: `2px solid ${CRIMSON}`,
    overflow: 'hidden',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: CRIMSON,
    textAlign: 'center',
    marginBottom: '6px',
    lineHeight: '1.3',
  },
  subtitle: {
    fontSize: '13px',
    color: '#555',
    textAlign: 'center',
    marginBottom: '28px',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#333',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  error: {
    color: '#c0392b',
    fontSize: '13px',
    textAlign: 'center',
    margin: '-8px 0',
  },
  loginBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: CRIMSON,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
    transition: 'background-color 0.2s',
  },
  forgotBtn: {
    marginTop: '16px',
    background: 'none',
    border: 'none',
    color: CRIMSON,
    fontSize: '13px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  hint: {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '12px',
    color: '#333',
    lineHeight: '1.6',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
};
