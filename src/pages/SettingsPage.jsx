import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

/* ── Icons ─────────────────────────────────────────────── */
function IcoSettings() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function IcoSchool() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="15" rx="1" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  );
}
function IcoFee() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <path d="M6 14h.01M10 14h4" />
    </svg>
  );
}
function IcoAcademic() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
function IcoAccount() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}
function IcoData() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}
function IcoSave() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}
function IcoAdd() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function IcoTrash() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
function IcoKey() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}
function IcoDownload() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function IcoWarn() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/* ── Tabs config ─────────────────────────────────────────── */
const TABS = [
  { id: 'school',   label: 'School Profile',   Icon: IcoSchool   },
  { id: 'fees',     label: 'Fee Management',   Icon: IcoFee      },
  { id: 'academic', label: 'Academic Config',  Icon: IcoAcademic },
  { id: 'account',  label: 'Account Settings', Icon: IcoAccount  },
  { id: 'data',     label: 'Data Management',  Icon: IcoData     },
];

/* ── Page ──────────────────────────────────────────────── */
export default function SettingsPage() {
  const { supabase, session } = useAuth();
  const [activeTab, setActiveTab] = useState('school');

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <>
      <div className="top-header">
        <h1><IcoSettings /> System Settings</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">

        {/* Tab Bar */}
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={styles.tabBar}>
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                style={{ ...styles.tab, ...(activeTab === id ? styles.tabActive : {}) }}
                onClick={() => setActiveTab(id)}
              >
                <Icon />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Panels */}
        {activeTab === 'school'   && <SchoolProfileTab   supabase={supabase} />}
        {activeTab === 'fees'     && <FeeManagementTab   supabase={supabase} />}
        {activeTab === 'academic' && <AcademicConfigTab  supabase={supabase} />}
        {activeTab === 'account'  && <AccountSettingsTab supabase={supabase} session={session} />}
        {activeTab === 'data'     && <DataManagementTab  supabase={supabase} />}

      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 1 — School Profile
══════════════════════════════════════════════════════════ */
function SchoolProfileTab({ supabase }) {
  const [form, setForm] = useState({
    school_name:    'A.B. Simpson Alliance School Inc.',
    abbreviation:   'ABSAS',
    address:        'Zamboanga City, Philippines',
    contact_number: '(086) 826-XXXX',
    email:          'absas@school.edu.ph',
    school_year:    '2024-2025',
    principal:      '',
    registrar:      '',
  });
  const [saved, setSaved] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    await supabase.from('school_settings').upsert([{ id: 1, ...form }]);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title"><IcoSchool /> School Information</h2>
        <button className="btn btn-primary" onClick={handleSave}>
          <IcoSave /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
      <form onSubmit={handleSave}>
        <div className="form-grid">
          <div className="form-group">
            <label>School Name *</label>
            <input value={form.school_name} onChange={e => setForm(f => ({ ...f, school_name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Abbreviation *</label>
            <input value={form.abbreviation} onChange={e => setForm(f => ({ ...f, abbreviation: e.target.value }))} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Address *</label>
            <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Contact Number *</label>
            <input value={form.contact_number} onChange={e => setForm(f => ({ ...f, contact_number: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Current School Year *</label>
            <input value={form.school_year} onChange={e => setForm(f => ({ ...f, school_year: e.target.value }))} placeholder="e.g. 2024-2025" />
          </div>
          <div className="form-group">
            <label>School Principal</label>
            <input value={form.principal} onChange={e => setForm(f => ({ ...f, principal: e.target.value }))} placeholder="Full name" />
          </div>
          <div className="form-group">
            <label>Registrar</label>
            <input value={form.registrar} onChange={e => setForm(f => ({ ...f, registrar: e.target.value }))} placeholder="Full name" />
          </div>
        </div>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 2 — Fee Management
══════════════════════════════════════════════════════════ */
const DEFAULT_FEES = [
  { level: 'Nursery / Kinder', tuition: 12000, miscellaneous: 3000 },
  { level: 'Elementary (Grades 1–6)', tuition: 15000, miscellaneous: 3500 },
  { level: 'Junior High (Grades 7–10)', tuition: 18000, miscellaneous: 4000 },
];

function FeeManagementTab() {
  const [fees, setFees] = useState(DEFAULT_FEES);
  const [saved, setSaved] = useState(false);

  function updateFee(i, field, val) {
    setFees(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: Number(val) } : f));
  }

  function addRow() {
    setFees(prev => [...prev, { level: '', tuition: 0, miscellaneous: 0 }]);
  }

  function removeRow(i) {
    setFees(prev => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title"><IcoFee /> Fee Structure</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={addRow}><IcoAdd /> Add Row</button>
          <button className="btn btn-primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}>
            <IcoSave /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Level</th>
              <th>Tuition Fee (₱)</th>
              <th>Miscellaneous (₱)</th>
              <th>Total per Semester (₱)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((row, i) => (
              <tr key={i}>
                <td>
                  <input
                    style={styles.tableInput}
                    value={row.level}
                    onChange={e => updateFee(i, 'level', e.target.value)}
                    placeholder="Level name"
                  />
                </td>
                <td>
                  <input
                    style={styles.tableInput}
                    type="number" min="0"
                    value={row.tuition}
                    onChange={e => updateFee(i, 'tuition', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    style={styles.tableInput}
                    type="number" min="0"
                    value={row.miscellaneous}
                    onChange={e => updateFee(i, 'miscellaneous', e.target.value)}
                  />
                </td>
                <td style={{ fontWeight: '600', color: '#8B0000' }}>
                  ₱{(Number(row.tuition) + Number(row.miscellaneous)).toLocaleString()}
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => removeRow(i)}><IcoTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 3 — Academic Config
══════════════════════════════════════════════════════════ */
function AcademicConfigTab() {
  const [config, setConfig] = useState({
    school_year:   '2024-2025',
    grading_system: 'Percentage',
    passing_grade:  '75',
    quarters:       '4',
    semester_start: '2024-06-01',
    semester_end:   '2025-03-31',
  });
  const [saved, setSaved] = useState(false);

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title"><IcoAcademic /> Academic Configuration</h2>
        <button className="btn btn-primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}>
          <IcoSave /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Active School Year</label>
          <input value={config.school_year} onChange={e => setConfig(c => ({ ...c, school_year: e.target.value }))} placeholder="e.g. 2024-2025" />
        </div>
        <div className="form-group">
          <label>Grading System</label>
          <select value={config.grading_system} onChange={e => setConfig(c => ({ ...c, grading_system: e.target.value }))}>
            <option value="Percentage">Percentage (0–100)</option>
            <option value="GPA">GPA (1.0–5.0)</option>
            <option value="Letter">Letter Grade (A–F)</option>
          </select>
        </div>
        <div className="form-group">
          <label>Passing Grade</label>
          <input type="number" value={config.passing_grade} onChange={e => setConfig(c => ({ ...c, passing_grade: e.target.value }))} min="0" max="100" />
        </div>
        <div className="form-group">
          <label>Number of Quarters / Terms</label>
          <select value={config.quarters} onChange={e => setConfig(c => ({ ...c, quarters: e.target.value }))}>
            <option value="2">2 (Semesters)</option>
            <option value="3">3 (Trimesters)</option>
            <option value="4">4 (Quarters)</option>
          </select>
        </div>
        <div className="form-group">
          <label>School Year Start</label>
          <input type="date" value={config.semester_start} onChange={e => setConfig(c => ({ ...c, semester_start: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>School Year End</label>
          <input type="date" value={config.semester_end} onChange={e => setConfig(c => ({ ...c, semester_end: e.target.value }))} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 4 — Account Settings
══════════════════════════════════════════════════════════ */
function AccountSettingsTab({ supabase, session }) {
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwStatus, setPwStatus] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleChangePassword(e) {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { setPwStatus('error:Passwords do not match.'); return; }
    if (pwForm.newPw.length < 8)         { setPwStatus('error:Password must be at least 8 characters.'); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pwForm.newPw });
    setSaving(false);
    if (error) { setPwStatus(`error:${error.message}`); }
    else        { setPwStatus('success:Password updated successfully.'); setPwForm({ current: '', newPw: '', confirm: '' }); }
  }

  const statusType = pwStatus.startsWith('success') ? 'success' : pwStatus.startsWith('error') ? 'error' : '';
  const statusMsg  = pwStatus.split(':').slice(1).join(':');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Profile Info */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><IcoAccount /> Admin Account</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: '14px' }}>
          <div><span style={{ color: '#8B0000', fontWeight: '600' }}>Email: </span>{session?.user?.email ?? '—'}</div>
          <div><span style={{ color: '#8B0000', fontWeight: '600' }}>Role: </span>Administrator</div>
          <div><span style={{ color: '#8B0000', fontWeight: '600' }}>User ID: </span><span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{session?.user?.id?.slice(0, 20)}…</span></div>
          <div><span style={{ color: '#8B0000', fontWeight: '600' }}>Last Sign In: </span>{session?.user?.last_sign_in_at ? new Date(session.user.last_sign_in_at).toLocaleString() : '—'}</div>
        </div>
      </div>

      {/* Change Password */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><IcoKey /> Change Password</h2>
        </div>
        <form onSubmit={handleChangePassword}>
          {statusMsg && (
            <p style={{ color: statusType === 'success' ? '#28a745' : '#dc3545', marginBottom: '12px', fontSize: '14px' }}>
              {statusMsg}
            </p>
          )}
          <div className="form-grid">
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={pwForm.newPw} onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))} placeholder="Min. 8 characters" />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Repeat new password" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <IcoSave /> {saving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 5 — Data Management
══════════════════════════════════════════════════════════ */
function DataManagementTab({ supabase }) {
  const [exporting, setExporting] = useState(false);

  async function exportTable(table, filename) {
    setExporting(true);
    const { data } = await supabase.from(table).select('*');
    if (data && data.length > 0) {
      const headers = Object.keys(data[0]);
      const rows    = data.map(r => headers.map(h => `"${r[h] ?? ''}"`).join(','));
      const csv     = [headers.join(','), ...rows].join('\n');
      const blob    = new Blob([csv], { type: 'text/csv' });
      const url     = URL.createObjectURL(blob);
      const a       = document.createElement('a'); a.href = url; a.download = `${filename}.csv`; a.click();
      URL.revokeObjectURL(url);
    } else {
      alert('No data found in ' + table);
    }
    setExporting(false);
  }

  const EXPORT_ITEMS = [
    { label: 'Export Students',   table: 'students',  file: 'students_export'  },
    { label: 'Export Faculty',    table: 'faculty',   file: 'faculty_export'   },
    { label: 'Export Attendance', table: 'attendance',file: 'attendance_export' },
    { label: 'Export Finance',    table: 'finance',   file: 'finance_export'   },
    { label: 'Export Grades',     table: 'grades',    file: 'grades_export'    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Export Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><IcoData /> Export Data</h2>
        </div>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
          Download full data exports for each module as CSV files.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {EXPORT_ITEMS.map(({ label, table, file }) => (
            <button key={table} className="btn btn-secondary" onClick={() => exportTable(table, file)} disabled={exporting}>
              <IcoDownload /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ border: '1px solid #f5c6cb', backgroundColor: '#fff8f8' }}>
        <div className="card-header">
          <h2 className="card-title" style={{ color: '#dc3545' }}><IcoWarn /> Danger Zone</h2>
        </div>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
          These actions are <strong>irreversible</strong>. Please make sure you have a backup before proceeding.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete ALL student records? This cannot be undone.')) {
                supabase.from('students').delete().neq('student_record_id', '').then(() => alert('All student records deleted.'));
              }
            }}
          >
            <IcoTrash /> Clear Student Records
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete ALL attendance records? This cannot be undone.')) {
                supabase.from('attendance').delete().neq('id', '').then(() => alert('All attendance records deleted.'));
              }
            }}
          >
            <IcoTrash /> Clear Attendance Data
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Styles ── */
const styles = {
  tabBar: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    padding: '14px 20px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    background: '#f9f9f9',
    color: '#555',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '120px',
    flex: 1,
  },
  tabActive: {
    background: '#8B0000',
    color: '#FFD700',
    border: '1px solid #8B0000',
  },
  tableInput: {
    padding: '6px 10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    width: '100%',
  },
};
