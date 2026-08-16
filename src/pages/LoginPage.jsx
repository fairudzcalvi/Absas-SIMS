import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import schoolLogo from '../assets/logo.png';

const CRIMSON = '#8B0000';

export default function LoginPage() {
  const { session, supabase, role } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  // Still resolving session on page load
  if (session === undefined) {
    return <div style={styles.loadScreen}>Loading...</div>;
  }

  // Logged in + role known → go to correct portal
  if (session && role) {
    return <Navigate to={role === 'teacher' ? '/teacher' : '/dashboard'} replace />;
  }

  // Logged in but role still resolving
  if (session && !role) {
    return <div style={styles.loadScreen}>Redirecting...</div>;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      setLoading(false);
    }
    // On success: onAuthStateChange fires → resolveRole runs → role is set → Navigate above triggers
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoWrap}>
          <img src={schoolLogo} alt="ABSAS Logo" style={styles.logo} />
        </div>

        {/* Title */}
        <h1 style={styles.title}>A.B. Simpson Alliance School</h1>
        <p style={styles.subtitle}>Student Information and Management System</p>

        {/* Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Username / Email</label>
            <input
              type="email"
              placeholder="Enter your username or email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              onChange={e => setPassword(e.target.value)}
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

      {/* Hint */}
      <div style={styles.hint}>
        <strong>Default Login:</strong><br />
        Username: admin<br />
        Password: admin123
      </div>
    </div>
  );
}

const styles = {
  loadScreen: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', backgroundColor: CRIMSON, color: '#fff', fontSize: '16px',
  },
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
    backgroundColor: '#fff',
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
  },
  forgotBtn: {
    marginTop: '16px',
    background: 'none',
    border: 'none',
    color: CRIMSON,
    fontSize: '13px',
    cursor: 'pointer',
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
