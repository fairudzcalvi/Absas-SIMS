import { useAuth } from '../../contexts/AuthContext';

function IcoUser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
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
  const { profile } = useAuth();
  const s = profile ?? {};

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
                <span><strong>Grade &amp; Section:</strong> {s.grade_level ? `Grade ${s.grade_level}` : '—'} {s.section_name ? `(${s.section_name})` : ''}</span>
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
            <Field label="Email Address" value={s.email} fullWidth />
            <Field label="Nationality"   value={s.nationality ?? 'Filipino'} />
            <Field label="Age"           value={s.age} />
            <Field label="Grade Level"   value={s.grade_level ? `Grade ${s.grade_level}` : undefined} />
            <Field label="Section"       value={s.section_name} />
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    boxShadow: '0 4px 10px rgba(139, 0, 0, 0.15)',
    flexShrink: 0,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '0 24px',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '13px',
    color: '#8B0000',
    fontWeight: '600',
    marginBottom: '6px',
    textAlign: 'center',
  },
  fieldValue: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#f9f9f9',
    color: '#333',
    textAlign: 'center',
  },
};
