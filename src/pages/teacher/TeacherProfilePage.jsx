import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { cleanSectionName } from '../../utils/formatters';

/* ── SVG Icons (Zero Emojis) ─────────────────────────────────── */
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
    <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto', marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {label}
      </label>
      <div style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>
        {value || '—'}
      </div>
    </div>
  );
}

export default function TeacherProfilePage() {
  const { profile, session, supabase, selectedSchoolYear, activeSchoolYear } = useAuth();
  const f = profile ?? {};
  const currentSy = selectedSchoolYear || activeSchoolYear;

  const [advisorySections, setAdvisorySections] = useState([]);
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [savingPassword, setSavingPassword]   = useState(false);
  const [pwStatus, setPwStatus]               = useState({ type: '', text: '' });

  useEffect(() => {
    let ignore = false;
    async function loadAdvisory() {
      if (!f?.faculty_record_id && !f?.faculty_id) return;
      let q = supabase.from('sections').select('id, section_name, grade_level, adviser_id, status').eq('status', 'Active');
      if (currentSy?.id) q = q.eq('school_year_id', currentSy.id);
      const { data } = await q;
      if (!ignore && data) {
        const facRecId = f.faculty_record_id ? String(f.faculty_record_id) : '';
        const facId = (f.faculty_id || '').toLowerCase().trim();
        const mine = data.filter(sec => {
          const adv = sec.adviser_id ? String(sec.adviser_id).trim() : '';
          return (facRecId && adv === facRecId) || (facId && adv.toLowerCase() === facId);
        });
        setAdvisorySections(mine);
      }
    }
    loadAdvisory();
    return () => { ignore = true; };
  }, [supabase, f?.faculty_record_id, f?.faculty_id, currentSy]);

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPwStatus({ type: '', text: '' });

    if (!newPassword || newPassword.trim().length < 6 || newPassword !== newPassword.trim()) {
      setPwStatus({ type: 'error', text: 'Password must be at least 6 non-whitespace characters without leading/trailing spaces.' });
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

  const initials = `${(f.first_name?.[0] ?? 'T')}${(f.last_name?.[0] ?? '')}`.toUpperCase();

  return (
    <>
      <div className="top-header">
        <h1><IcoUser /> Faculty Profile &amp; Security</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">
        {/* Profile Card */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h2 className="card-title"><IcoUser /> Faculty Credentials</h2>
          </div>

          {/* Header Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '16px 20px',
            backgroundColor: '#fff8f6',
            borderBottom: '1px solid #f2dede',
            flexWrap: 'wrap',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#8B0000',
              color: '#FFD700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: '700',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(139,0,0,0.2)',
            }}>
              {initials}
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <h3 style={{ margin: '0 0 4px 0', color: '#8B0000', fontSize: '20px', fontWeight: '700' }}>
                {f.first_name} {f.middle_name ? f.middle_name + ' ' : ''}{f.last_name}
              </h3>
              <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span><strong>Faculty ID:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#8B0000' }}>{f.faculty_id || '—'}</span></span>
                <span>•</span>
                <span><strong>Position:</strong> {f.position || 'Subject Teacher'}</span>
                <span>•</span>
                <span><strong>Department:</strong> {f.department || 'Junior High School'}</span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px 24px' }}>
            <Field label="Full Name"           value={`${f.first_name || ''} ${f.middle_name ? f.middle_name + ' ' : ''}${f.last_name || ''}`.trim()} />
            <Field label="Faculty ID"          value={f.faculty_id} />
            <Field label="System Role"         value={f.role || 'Teacher'} />
            <Field label="Position"            value={f.position || 'Subject Teacher'} />
            <Field label="Department"          value={f.department || 'Junior High School'} />
            <Field label="Official Email"      value={f.email || session?.user?.email} />
            <Field label="Contact Number"      value={f.contact_number} />
            <Field label="Employment Status"   value={f.employment_status || 'Active'} />
            <Field
              label="Advisory Section"
              value={
                advisorySections.length > 0
                  ? advisorySections.map(s => `Grade ${s.grade_level} - ${cleanSectionName(s.section_name, s.grade_level)}`).join(', ')
                  : f.adviser_grade_level ? `Grade ${f.adviser_grade_level}` : 'None Assigned'
              }
            />
            <Field label="Subjects Taught"     value={f.subjects_taught} fullWidth />
          </div>
        </div>

        {/* Change Password / Account Security Card */}
        <div className="card">
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
              <strong>First-Time Login Recommendation:</strong> If you received a temporary password from the school administration, please change it to a private, secure password of your choice.
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
                  value={f.email || session?.user?.email || '—'}
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
