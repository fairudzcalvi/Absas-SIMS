import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import schoolLogo from '../assets/logo.png';

const CRIMSON = '#8B0000';

const ROLE_HOME = {
  admin:   '/dashboard',
  teacher: '/teacher',
  student: '/student',
};

export default function LoginPage() {
  const { session, supabase, role, logout } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  // Still resolving session on page load
  if (session === undefined) {
    return <div style={styles.loadScreen}>Loading...</div>;
  }

  // Logged in + role known → go to correct portal
  if (session && role && ROLE_HOME[role]) {
    return <Navigate to={ROLE_HOME[role]} replace />;
  }

  // Logged in but the account isn't recognized in admins/faculty/students
  if (session && role === 'unknown') {
    return (
      <div style={styles.loadScreen}>
        <div style={{ textAlign: 'center' }}>
          <p>This account isn't linked to any admin, faculty, or student record.</p>
          <p style={{ fontSize: '13px', opacity: 0.85, marginTop: '8px' }}>
            Contact your administrator, or make sure your login email matches the email on file.
          </p>
          <button
            type="button"
            onClick={logout}
            style={{ marginTop: '16px', padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#fff', color: CRIMSON, fontWeight: 600, cursor: 'pointer' }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Logged in but role still resolving
  if (session && !role) {
    return <div style={styles.loadScreen}>Redirecting...</div>;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const input = email.trim();
    let loginEmail = input;

    // If the input doesn't look like an email, treat it as a username
    if (!input.includes('@')) {
      // Look up in admins table by username
      const { data: adminRow } = await supabase
        .from('admins')
        .select('email')
        .eq('username', input)
        .maybeSingle();

      if (adminRow) {
        loginEmail = adminRow.email;
      } else {
        // Look up in faculty table by username
        const { data: facultyRow } = await supabase
          .from('faculty')
          .select('email')
          .eq('username', input)
          .maybeSingle();

        if (facultyRow) {
          loginEmail = facultyRow.email;
        } else {
          // Look up in students table by username
          const { data: studentRow } = await supabase
            .from('students')
            .select('email')
            .eq('username', input)
            .maybeSingle();

          if (studentRow) {
            loginEmail = studentRow.email;
          } else {
            setError('No account found with that username.');
            setLoading(false);
            return;
          }
        }
      }
    }

    const { error: err } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
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
              type="text"
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
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={styles.passwordInput}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={styles.eyeBtn}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IcoEyeOff /> : <IcoEye />}
              </button>
            </div>
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

    </div>
  );
}

function IcoEye({ size = 18 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IcoEyeOff({ size = 18 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

const styles = {
  loadScreen: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', backgroundColor: CRIMSON, color: '#fff', fontSize: '16px', padding: '24px', textAlign: 'center',
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
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  passwordInput: {
    width: '100%',
    padding: '12px 42px 12px 14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#333',
    outline: 'none',
    boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#777',
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