import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { cleanSectionName, formatGradeSection } from '../../utils/formatters';

/* ── SVG Icons (Strictly Zero Emojis) ────────────────────────── */
function IcoUser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function IcoLock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
function IcoKey() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-1.5 1.5L14 9l-1.5-1.5-1.5 1.5 1.5 1.5-3 3a5.5 5.5 0 1 1-2-2l3-3 1.5 1.5 1.5-1.5L12 7l3.5-3.5z"/>
    </svg>
  );
}
function IcoCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Field({ label, value, fullWidth = false }) {
  return (
    <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto', marginBottom: '16px' }}>
      <label style={styles.fieldLabel}>{label}</label>
      <div style={styles.fieldValue}>{value || '—'}</div>
    </div>
  );
}

export default function StudentProfilePage() {
  const { profile, session, supabase } = useAuth();
  const s = profile ?? {};

  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [savingPassword, setSavingPassword]   = useState(false);
  const [pwStatus, setPwStatus]               = useState({ type: '', text: '' });

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPwStatus({ type: '', text: '' });

    if (!newPassword || newPassword.length < 6) {
      setPwStatus({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwStatus({ type: 'error', text: 'Passwords do not match. Please verify and try again.' });
      return;
    }

    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setPwStatus({
        type: 'success',
        text: 'Password updated successfully! Your account is now secured with your private password.',
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwStatus({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setSavingPassword(false);
    }
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  const initials = `${(s.first_name?.[0] ?? 'S')}${(s.last_name?.[0] ?? '')}`.toUpperCase();

  return (
    <>
      <div className="top-header">
        <h1><IcoUser /> Student Portal</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoUser /> Personal Information</h2>
          </div>

          {/* Student Photo & ID Header Card */}
          <div style={styles.photoSection}>
            <div style={styles.avatarFrame}>
              {s.photo_url ? (
                <img src={s.photo_url} alt="Student" style={styles.avatarImg} />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#8B0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#8B0000', marginTop: '4px' }}>
                    {initials}
                  </span>
                </div>
              )}
            </div>
            <div style={styles.photoMeta}>
              <h3 style={{ margin: '0 0 4px 0', color: '#8B0000', fontSize: '18px' }}>
                {s.first_name} {s.middle_name ? s.middle_name + ' ' : ''}{s.last_name}
              </h3>
              <div style={{ fontSize: '13px', color: '#555', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span><strong>DepEd LRN:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#8B0000' }}>{s.lrn_id || s.student_id || '—'}</span></span>
                <span>•</span>
                <span><strong>Grade &amp; Section:</strong> {formatGradeSection(s.grade_level, s.section_name)}</span>
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div style={styles.grid}>
            <Field label="First Name"    value={s.first_name} />
            <Field label="Middle Name"   value={s.middle_name} />
            <Field label="Last Name"     value={s.last_name} />
            <Field label="DepEd LRN"     value={s.lrn_id || s.student_id} />
            <Field label="Address"       value={s.home_address} fullWidth />
            <Field label="Phone Number"  value={s.contact_number} />
            <Field label="Date of Birth" value={s.birthdate} />
            <Field label="Email Address" value={s.email || session?.user?.email} fullWidth />
            <Field label="Nationality"   value={s.nationality ?? 'Filipino'} />
            <Field label="Age"           value={s.age} />
            <Field label="Grade Level"   value={s.grade_level ? `Grade ${s.grade_level}` : undefined} />
            <Field label="Section"       value={cleanSectionName(s.section_name, s.grade_level)} />
          </div>
        </div>

        {/* Change Password / Account Security Card */}
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="card-header">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IcoLock /> Account Security &amp; Password
            </h2>
          </div>

          <div style={{ padding: '20px', maxWidth: '580px' }}>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#334155',
              lineHeight: '1.5',
            }}>
              <strong>First-Time Login Recommendation:</strong> If you received a temporary password from the school administration, please change it to your personal, private password below.
            </div>

            {pwStatus.text && (
              <div style={{
                background: pwStatus.type === 'success' ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${pwStatus.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                color: pwStatus.type === 'success' ? '#166534' : '#b91c1c',
                padding: '12px 14px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                {pwStatus.type === 'success' ? <IcoCheck /> : <IcoLock />}
                <span>{pwStatus.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontWeight: '600', marginBottom: '6px' }}>Login Email</label>
                <input
                  type="text"
                  value={s.email || session?.user?.email || '—'}
                  disabled
                  style={{ width: '100%', backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#475569' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontWeight: '600', marginBottom: '6px' }}>New Password *</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    required
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowPassword(p => !p)}
                    style={{ padding: '0 12px' }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: '600', marginBottom: '6px' }}>Confirm New Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingPassword}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <IcoKey /> {savingPassword ? 'Updating Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  photoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '16px 20px',
    backgroundColor: '#fff8f6',
    border: '1px solid #f2dede',
    borderRadius: '10px',
    marginBottom: '24px',
  },
  avatarFrame: {
    width: '90px',
    height: '90px',
    borderRadius: '10px',
    border: '3px solid #8B0000',
    overflow: 'hidden',
    backgroundColor: '#fff',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff8f6',
  },
  photoMeta: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '8px 20px',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#666',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  fieldValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111',
    wordBreak: 'break-word',
  },
};
