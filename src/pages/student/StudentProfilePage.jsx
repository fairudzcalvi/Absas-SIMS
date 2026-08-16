import { useAuth } from '../../contexts/AuthContext';

function IcoUser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

export default function StudentProfilePage() {
  const { profile } = useAuth();
  const s = profile ?? {};

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  function Field({ label, value, fullWidth = false }) {
    return (
      <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto', marginBottom: '16px' }}>
        <label style={styles.fieldLabel}>{label}</label>
        <div style={styles.fieldValue}>{value || '—'}</div>
      </div>
    );
  }

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

          <div style={styles.grid}>
            <Field label="First Name"    value={s.first_name} />
            <Field label="Last Name"     value={s.last_name} />
            <Field label="Address"       value={s.home_address} fullWidth />
            <Field label="Phone Number"  value={s.contact_number} />
            <Field label="Date of Birth" value={s.birthdate} />
            <Field label="Email Address" value={s.email} fullWidth />
            <Field label="Nationality"   value={s.nationality ?? 'Filipino'} />
            <Field label="Age"           value={s.age} />
            <Field label="Grade Level"   value={s.grade_level ? `Grade ${s.grade_level}` : undefined} />
            <Field label="Section"       value={s.section_name} />
            <Field label="Student ID"    value={s.student_id} />
            <Field label="LRN"           value={s.lrn_id} />
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0 32px',
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
