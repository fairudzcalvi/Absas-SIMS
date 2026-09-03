import { useEffect, useState, useCallback } from 'react';
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
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="15" rx="1" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  );
}
function IcoAcademic() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
function IcoSections() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
function IcoFee() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <path d="M6 14h.01M10 14h4" />
    </svg>
  );
}
function IcoPolicy() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
function IcoAccount() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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
function IcoEdit() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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
function IcoCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
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
function IcoClose() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── Tabs Configuration ───────────────────────────────────── */
const TABS = [
  { id: 'school',       label: 'School Profile',     Icon: IcoSchool    },
  { id: 'academic',     label: 'Academic & Quarters',Icon: IcoAcademic  },
  { id: 'sections',     label: 'Sections Manager',   Icon: IcoSections  },
  { id: 'fees',         label: 'Fees & Scholarships',Icon: IcoFee       },
  { id: 'policies',     label: 'Policies & Grading', Icon: IcoPolicy    },
  { id: 'account_data', label: 'Account & Data',     Icon: IcoAccount   },
];

/* ── Main Settings Page ─────────────────────────────────── */
export default function SettingsPage() {
  const { supabase, session, refreshAcademicYear } = useAuth();
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
        {/* Tab Navigation */}
        <div className="card" style={{ padding: '10px 14px', marginBottom: '20px' }}>
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

        {/* Tab Contents */}
        {activeTab === 'school'       && <SchoolProfileTab       supabase={supabase} />}
        {activeTab === 'academic'     && <AcademicYearsTab       supabase={supabase} refreshAcademicYear={refreshAcademicYear} />}
        {activeTab === 'sections'     && <SectionsManagerTab     supabase={supabase} />}
        {activeTab === 'fees'         && <FeesScholarshipsTab    supabase={supabase} />}
        {activeTab === 'policies'     && <SchoolPoliciesTab      supabase={supabase} />}
        {activeTab === 'account_data' && <AccountAndDataTab      supabase={supabase} session={session} />}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 1: School Profile
   ══════════════════════════════════════════════════════════ */
function SchoolProfileTab({ supabase }) {
  const [form, setForm] = useState({
    school_name:    'A.B. Simpson Alliance School Inc.',
    abbreviation:   'ABSAS',
    address:        'Zamboanga City, Philippines',
    contact_number: '(062) 991-XXXX',
    email:          'absas.sims.portal@gmail.com',
    school_year:    '2025-2026',
    principal:      'Dr. Evelyn R. Santos',
    registrar:      'Maria Clara De Leon',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('school_settings').select('*').limit(1).maybeSingle();
      if (data) setForm(prev => ({ ...prev, ...data }));
      setLoading(false);
    }
    load();
  }, [supabase]);

  async function handleSave(e) {
    e.preventDefault();
    await supabase.from('school_settings').upsert([{ id: 1, ...form }]);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <div className="card"><p style={{ padding: '20px' }}>Loading school profile...</p></div>;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title"><IcoSchool /> School Information & DepEd Identification</h2>
        <button className="btn btn-primary" onClick={handleSave}>
          <IcoSave /> {saved ? 'Saved Successfully!' : 'Save Changes'}
        </button>
      </div>
      <form onSubmit={handleSave}>
        <div className="form-grid">
          <div className="form-group">
            <label>School Name *</label>
            <input value={form.school_name} onChange={e => setForm(f => ({ ...f, school_name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Abbreviation *</label>
            <input value={form.abbreviation} onChange={e => setForm(f => ({ ...f, abbreviation: e.target.value }))} required />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Address / Campus Location *</label>
            <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Contact Number *</label>
            <input value={form.contact_number} onChange={e => setForm(f => ({ ...f, contact_number: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Official Email Address *</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>School Principal</label>
            <input value={form.principal} onChange={e => setForm(f => ({ ...f, principal: e.target.value }))} placeholder="Full Name" />
          </div>
          <div className="form-group">
            <label>Registrar-in-Charge</label>
            <input value={form.registrar} onChange={e => setForm(f => ({ ...f, registrar: e.target.value }))} placeholder="Full Name" />
          </div>
        </div>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 2: Academic Calendar, Quarters & SHS Strands
   ══════════════════════════════════════════════════════════ */
function AcademicYearsTab({ supabase, refreshAcademicYear }) {
  const [years, setYears] = useState([]);
  const [quarters, setQuarters] = useState([]);
  const [strands, setStrands] = useState([]);
  const [activeYear, setActiveYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  // New School Year Modal
  const [syModal, setSyModal] = useState(false);
  const [newSyLabel, setNewSyLabel] = useState('');
  const [newSyStart, setNewSyStart] = useState('');
  const [newSyEnd, setNewSyEnd] = useState('');
  const [syFormError, setSyFormError] = useState('');
  const [sySaving, setSySaving] = useState(false);

  // New Strand Modal
  const [strandModal, setStrandModal] = useState(false);
  const [newStrand, setNewStrand] = useState({ strand_code: '', strand_name: '', track_type: 'Academic Track', description: '' });
  const [strandFormError, setStrandFormError] = useState('');
  const [strandSaving, setStrandSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setDbError(null);
    try {
      const { data: syData, error: syErr } = await supabase.from('school_years').select('*').order('created_at', { ascending: false });
      if (syErr) {
        setDbError(syErr.message);
      } else {
        const currentSy = (syData || []).find(y => y.is_active) || (syData && syData[0]) || null;
        setYears(syData || []);
        setActiveYear(currentSy);

        if (currentSy) {
          const { data: qData } = await supabase.from('quarters').select('*').eq('school_year_id', currentSy.id).order('quarter_number', { ascending: true });
          setQuarters(qData || []);
        }
      }

      const { data: stData } = await supabase.from('shs_strands').select('*').order('strand_code', { ascending: true });
      setStrands(stData || []);
    } catch (err) {
      setDbError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleSetActiveSY(syId) {
    await supabase.from('school_years').update({ is_active: false }).neq('id', syId);
    await supabase.from('school_years').update({ is_active: true }).eq('id', syId);
    fetchData();
    if (refreshAcademicYear) refreshAcademicYear();
  }

  async function handleToggleQuarter(quarterId, isCurrentActive) {
    if (!activeYear) return;
    if (!isCurrentActive) {
      await supabase.from('quarters').update({ is_active: false }).eq('school_year_id', activeYear.id);
      await supabase.from('quarters').update({ is_active: true }).eq('id', quarterId);
    } else {
      await supabase.from('quarters').update({ is_active: false }).eq('id', quarterId);
    }
    fetchData();
    if (refreshAcademicYear) refreshAcademicYear();
  }

  async function handleToggleGrading(quarterId, currentGrading) {
    await supabase.from('quarters').update({ is_grading_open: !currentGrading }).eq('id', quarterId);
    fetchData();
  }

  async function handleAddSchoolYear(e) {
    e.preventDefault();
    if (!newSyLabel) return;
    setSySaving(true);
    setSyFormError('');

    try {
      const { data: createdSy, error } = await supabase.from('school_years').insert([{
        year_label: newSyLabel,
        start_date: newSyStart || null,
        end_date:   newSyEnd || null,
        is_active:  years.length === 0,
      }]).select().single();

      if (error) {
        setSyFormError(error.message);
        setSySaving(false);
        return;
      }

      if (createdSy) {
        // Auto create 4 quarters
        await supabase.from('quarters').insert([
          { school_year_id: createdSy.id, quarter_number: 1, quarter_name: '1st Quarter', is_active: true, is_grading_open: true },
          { school_year_id: createdSy.id, quarter_number: 2, quarter_name: '2nd Quarter', is_active: false, is_grading_open: true },
          { school_year_id: createdSy.id, quarter_number: 3, quarter_name: '3rd Quarter', is_active: false, is_grading_open: false },
          { school_year_id: createdSy.id, quarter_number: 4, quarter_name: '4th Quarter', is_active: false, is_grading_open: false },
        ]);
      }

      setSyModal(false);
      setNewSyLabel('');
      setNewSyStart('');
      setNewSyEnd('');
      fetchData();
    } catch (err) {
      setSyFormError(err.message);
    } finally {
      setSySaving(false);
    }
  }

  async function handleAddStrand(e) {
    e.preventDefault();
    if (!newStrand.strand_code || !newStrand.strand_name) return;
    setStrandSaving(true);
    setStrandFormError('');

    try {
      const { error } = await supabase.from('shs_strands').insert([newStrand]);
      if (error) {
        setStrandFormError(error.message);
        setStrandSaving(false);
        return;
      }
      setStrandModal(false);
      setNewStrand({ strand_code: '', strand_name: '', track_type: 'Academic Track', description: '' });
      fetchData();
    } catch (err) {
      setStrandFormError(err.message);
    } finally {
      setStrandSaving(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Database Error Banner if SQL migration has not been run */}
      {dbError && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffeeba', color: '#856404', padding: '14px 18px', borderRadius: '10px' }}>
          <strong>⚠️ Database Notice:</strong> {dbError}
          <div style={{ marginTop: '6px', fontSize: '13px' }}>
            If the <code>school_years</code> table does not exist yet, please run the SQL script in <code>supabase_complete_migration.sql</code> inside your <strong>Supabase SQL Editor</strong>.
          </div>
        </div>
      )}

      {/* School Years & Quarters Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title"><IcoAcademic /> Academic Calendar & Active School Year</h2>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
              Switch active school years and control quarterly grade encoding windows.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => { setSyFormError(''); setSyModal(true); }}>
            <IcoAdd /> Add New School Year
          </button>
        </div>

        {loading ? (
          <p style={{ padding: '20px' }}>Loading academic calendar...</p>
        ) : years.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', background: '#fcfcfc', border: '1px dashed #ccc', borderRadius: '10px', margin: '15px 0' }}>
            <p style={{ color: '#666', marginBottom: '12px', fontSize: '14px' }}>
              No school years found in database.
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => { setSyFormError(''); setSyModal(true); }}>
              <IcoAdd /> Create First School Year
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', padding: '16px 0' }}>
            {years.map(sy => (
              <div
                key={sy.id}
                style={{
                  border: sy.is_active ? '2px solid #8B0000' : '1px solid #ddd',
                  borderRadius: '10px',
                  padding: '16px',
                  background: sy.is_active ? '#fff9f9' : '#fff',
                  boxShadow: sy.is_active ? '0 4px 12px rgba(139,0,0,0.08)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '17px', color: '#8B0000', fontWeight: '700' }}>{sy.year_label}</h3>
                  {sy.is_active ? (
                    <span style={styles.badgeActive}><IcoCheck /> ACTIVE S.Y.</span>
                  ) : (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleSetActiveSY(sy.id)}>
                      Set as Active
                    </button>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
                  <div><strong>Start Date:</strong> {sy.start_date || 'Not set'}</div>
                  <div><strong>End Date:</strong> {sy.end_date || 'Not set'}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quarters for the active school year */}
        {activeYear && (
          <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            <h3 style={{ fontSize: '15px', color: '#8B0000', marginBottom: '12px', fontWeight: '600' }}>
              Quarterly Periods for S.Y. {activeYear.year_label}
            </h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Quarter</th>
                    <th>Current Status</th>
                    <th>Teacher Grade Encoding</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quarters.map(q => (
                    <tr key={q.id}>
                      <td style={{ fontWeight: '600' }}>{q.quarter_name}</td>
                      <td>
                        {q.is_active ? (
                          <span style={styles.badgeActive}>● Currently Active Quarter</span>
                        ) : (
                          <span style={styles.badgeInactive}>Inactive</span>
                        )}
                      </td>
                      <td>
                        {q.is_grading_open ? (
                          <span style={{ color: '#28a745', fontWeight: '600' }}>🔓 Open (Encoding Allowed)</span>
                        ) : (
                          <span style={{ color: '#dc3545', fontWeight: '600' }}>🔒 Closed / Locked</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className={`btn btn-sm ${q.is_active ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={() => handleToggleQuarter(q.id, q.is_active)}
                          >
                            {q.is_active ? 'Deactivate' : 'Set as Current Quarter'}
                          </button>
                          <button
                            className={`btn btn-sm ${q.is_grading_open ? 'btn-danger' : 'btn-secondary'}`}
                            onClick={() => handleToggleGrading(q.id, q.is_grading_open)}
                          >
                            {q.is_grading_open ? 'Lock Grades' : 'Open Grading'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Senior High School (SHS) Strands Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title"><IcoAcademic /> Senior High School (SHS) Strands & Tracks</h2>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
              Define specialized programs when Senior High School (Grades 11 & 12) is established.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => { setStrandFormError(''); setStrandModal(true); }}>
            <IcoAdd /> Add SHS Strand
          </button>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Strand / Track Name</th>
                <th>Track Type</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {strands.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-message">No SHS strands defined yet.</td>
                </tr>
              ) : (
                strands.map(st => (
                  <tr key={st.id}>
                    <td style={{ fontWeight: '700', color: '#8B0000' }}>{st.strand_code}</td>
                    <td style={{ fontWeight: '600' }}>{st.strand_name}</td>
                    <td><span style={styles.badgeNeutral}>{st.track_type}</span></td>
                    <td style={{ fontSize: '13px', color: '#666' }}>{st.description || '—'}</td>
                    <td>
                      <span style={st.status === 'Active' ? styles.badgeActive : styles.badgeInactive}>
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add School Year */}
      {syModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title"><IcoAdd /> New School Year</h3>
              <button className="modal-close" onClick={() => setSyModal(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleAddSchoolYear}>
              <div className="modal-body">
                {syFormError && (
                  <div style={{ color: '#dc3545', background: '#f8d7da', padding: '10px', borderRadius: '6px', marginBottom: '14px', fontSize: '13px' }}>
                    {syFormError}
                  </div>
                )}
                <div className="form-group">
                  <label>School Year Label *</label>
                  <input value={newSyLabel} onChange={e => setNewSyLabel(e.target.value)} placeholder="e.g. 2026-2027" required />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input type="date" value={newSyStart} onChange={e => setNewSyStart(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input type="date" value={newSyEnd} onChange={e => setNewSyEnd(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSyModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={sySaving}>
                  <IcoSave /> {sySaving ? 'Saving...' : 'Create S.Y.'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Strand */}
      {strandModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title"><IcoAdd /> Add Senior High Strand</h3>
              <button className="modal-close" onClick={() => setStrandModal(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleAddStrand}>
              <div className="modal-body">
                {strandFormError && (
                  <div style={{ color: '#dc3545', background: '#f8d7da', padding: '10px', borderRadius: '6px', marginBottom: '14px', fontSize: '13px' }}>
                    {strandFormError}
                  </div>
                )}
                <div className="form-group">
                  <label>Strand Code *</label>
                  <input value={newStrand.strand_code} onChange={e => setNewStrand(s => ({ ...s, strand_code: e.target.value.toUpperCase() }))} placeholder="e.g. STEM, ABM, HUMSS" required />
                </div>
                <div className="form-group">
                  <label>Complete Strand Name *</label>
                  <input value={newStrand.strand_name} onChange={e => setNewStrand(s => ({ ...s, strand_name: e.target.value }))} placeholder="e.g. Science, Technology, Engineering, and Mathematics" required />
                </div>
                <div className="form-group">
                  <label>Track Type</label>
                  <select value={newStrand.track_type} onChange={e => setNewStrand(s => ({ ...s, track_type: e.target.value }))}>
                    <option value="Academic Track">Academic Track</option>
                    <option value="TVL Track">TVL Track (Technical-Vocational-Livelihood)</option>
                    <option value="Sports Track">Sports Track</option>
                    <option value="Arts and Design Track">Arts and Design Track</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description / Specialization</label>
                  <textarea value={newStrand.description} onChange={e => setNewStrand(s => ({ ...s, description: e.target.value }))} rows="3" placeholder="Brief details about curriculum focus..."></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setStrandModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={strandSaving}>
                  <IcoSave /> {strandSaving ? 'Saving...' : 'Save Strand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 3: Sections Management (Multiple per Grade Level)
   ══════════════════════════════════════════════════════════ */
function SectionsManagerTab({ supabase }) {
  const [sections, setSections] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [strands, setStrands] = useState([]);
  const [activeSy, setActiveSy] = useState(null);
  const [filterGrade, setFilterGrade] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [form, setForm] = useState({
    grade_level: 7,
    section_name: '',
    strand_id: '',
    adviser_id: '',
    room_number: '',
    max_capacity: 45,
    status: 'Active',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: sy } = await supabase.from('school_years').select('*').eq('is_active', true).maybeSingle();
    setActiveSy(sy);

    const { data: fac } = await supabase.from('faculty').select('faculty_record_id, faculty_id, first_name, last_name').order('last_name', { ascending: true });
    setFaculty(fac || []);

    const { data: str } = await supabase.from('shs_strands').select('*').order('strand_code', { ascending: true });
    setStrands(str || []);

    let q = supabase.from('sections').select('*, shs_strands(strand_code), faculty(first_name, last_name)').order('grade_level', { ascending: true });
    if (sy) q = q.eq('school_year_id', sy.id);
    const { data: sec } = await q;
    setSections(sec || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function openAddModal() {
    setEditSection(null);
    setForm({
      grade_level: 7,
      section_name: '',
      strand_id: '',
      adviser_id: '',
      room_number: '',
      max_capacity: 45,
      status: 'Active',
    });
    setModalOpen(true);
  }

  function openEditModal(sec) {
    setEditSection(sec);
    setForm({
      grade_level: sec.grade_level,
      section_name: sec.section_name,
      strand_id: sec.strand_id || '',
      adviser_id: sec.adviser_id || '',
      room_number: sec.room_number || '',
      max_capacity: sec.max_capacity || 45,
      status: sec.status || 'Active',
    });
    setModalOpen(true);
  }

  async function handleSaveSection(e) {
    e.preventDefault();
    if (!form.section_name) return;

    const payload = {
      grade_level: Number(form.grade_level),
      section_name: form.section_name,
      strand_id: form.grade_level >= 11 && form.strand_id ? form.strand_id : null,
      adviser_id: form.adviser_id ? Number(form.adviser_id) : null,
      room_number: form.room_number || null,
      max_capacity: Number(form.max_capacity) || 45,
      status: form.status,
      school_year_id: activeSy?.id || null,
    };

    if (editSection) {
      await supabase.from('sections').update(payload).eq('id', editSection.id);
    } else {
      await supabase.from('sections').insert([payload]);
    }
    setModalOpen(false);
    fetchData();
  }

  async function handleDeleteSection(id) {
    if (window.confirm('Are you sure you want to delete this section?')) {
      await supabase.from('sections').delete().eq('id', id);
      fetchData();
    }
  }

  const filteredSections = sections.filter(sec => {
    if (filterGrade !== 'all' && Number(sec.grade_level) !== Number(filterGrade)) return false;
    return true;
  });

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title"><IcoSections /> Class Sections (Multiple per Grade Level)</h2>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
            Configure 2 or more sections per grade, assign room numbers, and designate class advisers.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <IcoAdd /> Add New Section
        </button>
      </div>

      {/* Grade Level Filter */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#8B0000' }}>Filter by Grade:</label>
        <select
          className="filter-select"
          value={filterGrade}
          onChange={e => setFilterGrade(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="all">All Grade Levels (1–12)</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
            <option key={g} value={g}>{g >= 11 ? `Grade ${g} (Senior High)` : `Grade ${g}`}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ padding: '20px' }}>Loading sections...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Grade Level</th>
                <th>Section Name</th>
                <th>SHS Strand</th>
                <th>Designated Adviser</th>
                <th>Room #</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSections.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-message">No sections found for this grade level.</td>
                </tr>
              ) : (
                filteredSections.map(sec => (
                  <tr key={sec.id}>
                    <td style={{ fontWeight: '700', color: '#8B0000' }}>
                      {sec.grade_level >= 11 ? `Grade ${sec.grade_level} (SHS)` : `Grade ${sec.grade_level}`}
                    </td>
                    <td style={{ fontWeight: '600' }}>{sec.section_name}</td>
                    <td>
                      {sec.shs_strands?.strand_code ? (
                        <span style={styles.badgeNeutral}>{sec.shs_strands.strand_code}</span>
                      ) : (
                        <span style={{ color: '#aaa' }}>—</span>
                      )}
                    </td>
                    <td>
                      {sec.faculty ? (
                        `${sec.faculty.first_name} ${sec.faculty.last_name}`
                      ) : (
                        <span style={{ color: '#888', fontStyle: 'italic' }}>Unassigned</span>
                      )}
                    </td>
                    <td>{sec.room_number || '—'}</td>
                    <td>{sec.max_capacity} students</td>
                    <td>
                      <span style={sec.status === 'Active' ? styles.badgeActive : styles.badgeInactive}>
                        {sec.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(sec)}><IcoEdit /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSection(sec.id)}><IcoTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Add/Edit Section */}
      {modalOpen && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editSection ? 'Edit Section' : 'Create New Section'}</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleSaveSection}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Grade Level *</label>
                    <select
                      value={form.grade_level}
                      onChange={e => setForm(f => ({ ...f, grade_level: Number(e.target.value) }))}
                      required
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                        <option key={g} value={g}>{g >= 11 ? `Grade ${g} (Senior High)` : `Grade ${g}`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Section Name *</label>
                    <input
                      value={form.section_name}
                      onChange={e => setForm(f => ({ ...f, section_name: e.target.value }))}
                      placeholder="e.g. Diamond, Emerald, STEM-A"
                      required
                    />
                  </div>
                </div>

                {form.grade_level >= 11 && (
                  <div className="form-group">
                    <label>SHS Strand (Required for Senior High)</label>
                    <select
                      value={form.strand_id}
                      onChange={e => setForm(f => ({ ...f, strand_id: e.target.value }))}
                    >
                      <option value="">Select SHS Strand...</option>
                      {strands.map(st => (
                        <option key={st.id} value={st.id}>{st.strand_code} - {st.strand_name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Section Adviser</label>
                  <select
                    value={form.adviser_id}
                    onChange={e => setForm(f => ({ ...f, adviser_id: e.target.value }))}
                  >
                    <option value="">Unassigned</option>
                    {faculty.map(fac => (
                      <option key={fac.faculty_record_id} value={fac.faculty_record_id}>
                        {fac.last_name}, {fac.first_name} ({fac.faculty_id || 'ID'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Room Number</label>
                    <input
                      value={form.room_number}
                      onChange={e => setForm(f => ({ ...f, room_number: e.target.value }))}
                      placeholder="e.g. Room 204, Science Lab"
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Student Capacity</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={form.max_capacity}
                      onChange={e => setForm(f => ({ ...f, max_capacity: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><IcoSave /> Save Section</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 4: Fee Structure & Scholarships Matrix
   ══════════════════════════════════════════════════════════ */
const DEFAULT_FEES = [
  { level: 'Elementary (Grades 1–6)', tuition: 15000, miscellaneous: 3500 },
  { level: 'Junior High (Grades 7–10)', tuition: 18000, miscellaneous: 4000 },
  { level: 'Senior High (Grades 11–12)', tuition: 22000, miscellaneous: 4500 },
];

function FeesScholarshipsTab({ supabase }) {
  const [fees, setFees] = useState(DEFAULT_FEES);
  const [scholarships, setScholarships] = useState([]);
  const [feeSaved, setFeeSaved] = useState(false);
  const [schModal, setSchModal] = useState(false);
  const [editSch, setEditSch] = useState(null);
  const [schForm, setSchForm] = useState({
    name: '',
    code: '',
    discount_type: 'percentage',
    discount_value: 100,
    description: '',
    is_active: true,
  });

  const [showArchived, setShowArchived] = useState(false);

  const fetchScholarships = useCallback(async () => {
    const { data } = await supabase.from('scholarships').select('*').order('name', { ascending: true });
    setScholarships(data || []);
  }, [supabase]);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  function updateFee(i, field, val) {
    setFees(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: Number(val) } : f));
  }

  function openAddScholarship() {
    setEditSch(null);
    setSchForm({
      name: '',
      code: '',
      discount_type: 'percentage',
      discount_value: 100,
      description: '',
      is_active: true,
    });
    setSchModal(true);
  }

  async function handleSaveScholarship(e) {
    e.preventDefault();
    if (!schForm.name || !schForm.code) return;
    const payload = {
      name: schForm.name,
      code: schForm.code.toUpperCase(),
      discount_type: schForm.discount_type,
      discount_value: Number(schForm.discount_value),
      description: schForm.description,
      is_active: schForm.is_active,
    };

    if (editSch) {
      await supabase.from('scholarships').update(payload).eq('id', editSch.id);
    } else {
      await supabase.from('scholarships').insert([payload]);
    }
    setSchModal(false);
    fetchScholarships();
  }

  async function handleArchiveScholarship(id) {
    if (window.confirm('Archive this scholarship? It will no longer appear in new enrollments, but existing records will be preserved.')) {
      await supabase.from('scholarships').update({ is_active: false, is_archived: true }).eq('id', id);
      fetchScholarships();
    }
  }

  async function handleRestoreScholarship(id) {
    await supabase.from('scholarships').update({ is_active: true, is_archived: false }).eq('id', id);
    fetchScholarships();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Fee Structure */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><IcoFee /> Tuition & Miscellaneous Fee Matrix</h2>
          <button className="btn btn-primary" onClick={() => { setFeeSaved(true); setTimeout(() => setFeeSaved(false), 3000); }}>
            <IcoSave /> {feeSaved ? 'Saved!' : 'Save Fee Changes'}
          </button>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Academic Level</th>
                <th>Tuition Fee (₱)</th>
                <th>Miscellaneous (₱)</th>
                <th>Total Assessment (₱)</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: '600' }}>{row.level}</td>
                  <td>
                    <input
                      style={styles.tableInput}
                      type="number"
                      value={row.tuition}
                      onChange={e => updateFee(i, 'tuition', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      style={styles.tableInput}
                      type="number"
                      value={row.miscellaneous}
                      onChange={e => updateFee(i, 'miscellaneous', e.target.value)}
                    />
                  </td>
                  <td style={{ fontWeight: '700', color: '#8B0000' }}>
                    ₱{(Number(row.tuition) + Number(row.miscellaneous)).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Scholarships */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title"><IcoFee /> Scholarships, Grants & Discount Programs</h2>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
              Define ESC vouchers, academic honors, and sibling discounts for automatic financial deduction.
            </p>
          </div>
          <button className="btn btn-primary" onClick={openAddScholarship}>
            <IcoAdd /> Add Scholarship Grant
          </button>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Scholarship Name</th>
                <th>Discount Type</th>
                <th>Discount Value</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scholarships.filter(s => !s.is_archived).length === 0 ? (
                <tr><td colSpan={7} className="empty-message">No active scholarships. Add one above.</td></tr>
              ) : scholarships.filter(s => !s.is_archived).map(sch => (
                <tr key={sch.id}>
                  <td style={{ fontWeight: '700', color: '#8B0000' }}>{sch.code}</td>
                  <td style={{ fontWeight: '600' }}>{sch.name}</td>
                  <td>
                    <span style={styles.badgeNeutral}>
                      {sch.discount_type === 'percentage' ? 'Percentage Waiver' : 'Fixed Amount Subsidized'}
                    </span>
                  </td>
                  <td style={{ fontWeight: '700', color: '#28a745' }}>
                    {sch.discount_type === 'percentage' ? `${sch.discount_value}% OFF` : `₱${Number(sch.discount_value).toLocaleString()} Deduction`}
                  </td>
                  <td style={{ fontSize: '13px', color: '#666' }}>{sch.description || '—'}</td>
                  <td>
                    <span style={sch.is_active ? styles.badgeActive : styles.badgeInactive}>
                      {sch.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        title="Edit"
                        onClick={() => {
                          setEditSch(sch);
                          setSchForm({
                            name: sch.name,
                            code: sch.code,
                            discount_type: sch.discount_type,
                            discount_value: sch.discount_value,
                            description: sch.description || '',
                            is_active: sch.is_active,
                          });
                          setSchModal(true);
                        }}
                      >
                        <IcoEdit />
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: '#856404', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer' }}
                        title="Archive"
                        onClick={() => handleArchiveScholarship(sch.id)}
                      >
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Archived scholarships collapsible */}
        {scholarships.filter(s => s.is_archived).length > 0 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #f2dede' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '13px' }}
              onClick={() => setShowArchived(p => !p)}
            >
              {showArchived ? 'Hide' : 'Show'} Archived ({scholarships.filter(s => s.is_archived).length})
            </button>
            {showArchived && (
              <div className="table-container" style={{ marginTop: '12px' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Scholarship Name</th>
                      <th>Discount Value</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scholarships.filter(s => s.is_archived).map(sch => (
                      <tr key={sch.id} style={{ opacity: 0.6 }}>
                        <td style={{ fontWeight: '700', color: '#999' }}>{sch.code}</td>
                        <td style={{ fontWeight: '600', textDecoration: 'line-through', color: '#999' }}>{sch.name}</td>
                        <td style={{ color: '#999' }}>
                          {sch.discount_type === 'percentage' ? `${sch.discount_value}% OFF` : `₱${Number(sch.discount_value).toLocaleString()}`}
                        </td>
                        <td style={{ fontSize: '13px', color: '#999' }}>{sch.description || '—'}</td>
                        <td>
                          <button
                            className="btn btn-sm"
                            style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer' }}
                            title="Restore"
                            onClick={() => handleRestoreScholarship(sch.id)}
                          >
                            Restore
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Add / Edit Scholarship */}
      {schModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editSch ? 'Edit Scholarship' : 'Add Scholarship Grant'}</h3>
              <button className="modal-close" onClick={() => setSchModal(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleSaveScholarship}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Scholarship Name *</label>
                    <input
                      value={schForm.name}
                      onChange={e => setSchForm(s => ({ ...s, name: e.target.value }))}
                      placeholder="e.g. ESC Voucher Program, Academic Top 1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Code Identifier *</label>
                    <input
                      value={schForm.code}
                      onChange={e => setSchForm(s => ({ ...s, code: e.target.value.toUpperCase() }))}
                      placeholder="e.g. ESC-GRANT, ACAD-100"
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Discount Type</label>
                    <select
                      value={schForm.discount_type}
                      onChange={e => setSchForm(s => ({ ...s, discount_type: e.target.value }))}
                    >
                      <option value="percentage">Percentage (%) Waiver</option>
                      <option value="fixed_amount">Fixed Amount (₱) Subsidy</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Discount Value ({schForm.discount_type === 'percentage' ? '%' : '₱'}) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={schForm.discount_value}
                      onChange={e => setSchForm(s => ({ ...s, discount_value: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description & Eligibility</label>
                  <textarea
                    rows="3"
                    value={schForm.description}
                    onChange={e => setSchForm(s => ({ ...s, description: e.target.value }))}
                    placeholder="Eligibility criteria and requirements..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSchModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><IcoSave /> Save Scholarship</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 5: School Policies & DepEd Grading Standards
   ══════════════════════════════════════════════════════════ */
function SchoolPoliciesTab({ supabase }) {
  const [policies, setPolicies] = useState([]);
  const [saved, setSaved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    policy_name: '',
    category: 'Academic',
    written_work_pct: 30,
    performance_task_pct: 50,
    quarterly_exam_pct: 20,
    passing_grade: 75,
    attendance_warning_threshold: 10,
    description: '',
    document_url: '',
  });

  const fetchPolicies = useCallback(async () => {
    const { data } = await supabase.from('school_policies').select('*').order('created_at', { ascending: false });
    setPolicies(data || []);
  }, [supabase]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  async function handleAddPolicy(e) {
    e.preventDefault();
    if (!form.policy_name) return;
    await supabase.from('school_policies').insert([form]);
    setModalOpen(false);
    setForm({
      policy_name: '',
      category: 'Academic',
      written_work_pct: 30,
      performance_task_pct: 50,
      quarterly_exam_pct: 20,
      passing_grade: 75,
      attendance_warning_threshold: 10,
      description: '',
      document_url: '',
    });
    fetchPolicies();
  }

  async function handleDeletePolicy(id) {
    if (window.confirm('Delete this policy configuration?')) {
      await supabase.from('school_policies').delete().eq('id', id);
      fetchPolicies();
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title"><IcoPolicy /> School Policies & DepEd Grading Formulas</h2>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
              Configure component weights (DepEd Order No. 8, s. 2015), passing marks, and attendance rules.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <IcoAdd /> Add Policy Rule
          </button>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Policy Name</th>
                <th>Category</th>
                <th>Grading Weight Distribution</th>
                <th>Passing Grade</th>
                <th>Absence Warning</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: '600' }}>
                    {p.policy_name}
                    {p.description && <div style={{ fontSize: '12px', color: '#777' }}>{p.description}</div>}
                  </td>
                  <td><span style={styles.badgeNeutral}>{p.category}</span></td>
                  <td>
                    <div style={{ fontSize: '13px', display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#0056b3', fontWeight: '600' }}>Written: {p.written_work_pct}%</span>
                      <span style={{ color: '#28a745', fontWeight: '600' }}>Perf: {p.performance_task_pct}%</span>
                      <span style={{ color: '#8B0000', fontWeight: '600' }}>Exam: {p.quarterly_exam_pct}%</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: '700', color: '#8B0000' }}>{p.passing_grade} / 100</td>
                  <td>{p.attendance_warning_threshold} days</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeletePolicy(p.id)}><IcoTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Policy */}
      {modalOpen && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title"><IcoAdd /> Add School Policy / Grading Formula</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleAddPolicy}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Policy Name *</label>
                    <input
                      value={form.policy_name}
                      onChange={e => setForm(p => ({ ...p, policy_name: e.target.value }))}
                      placeholder="e.g. DepEd JHS Core Subjects Standard"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                      <option value="Academic">Academic</option>
                      <option value="Attendance">Attendance</option>
                      <option value="Discipline">Discipline</option>
                      <option value="Financial">Financial</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                <div style={{ background: '#f9f9f9', padding: '14px', borderRadius: '8px', marginBottom: '16px' }}>
                  <label style={{ fontWeight: '600', color: '#8B0000', marginBottom: '10px', display: 'block' }}>
                    DepEd Grading Percentage Weights (Must total 100%)
                  </label>
                  <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <div className="form-group">
                      <label>Written Work %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={form.written_work_pct}
                        onChange={e => setForm(p => ({ ...p, written_work_pct: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Performance Tasks %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={form.performance_task_pct}
                        onChange={e => setForm(p => ({ ...p, performance_task_pct: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Quarterly Exam %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={form.quarterly_exam_pct}
                        onChange={e => setForm(p => ({ ...p, quarterly_exam_pct: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Minimum Passing Grade Threshold</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.passing_grade}
                      onChange={e => setForm(p => ({ ...p, passing_grade: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Attendance Warning (Consecutive Absences)</label>
                    <input
                      type="number"
                      value={form.attendance_warning_threshold}
                      onChange={e => setForm(p => ({ ...p, attendance_warning_threshold: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Policy Description</label>
                  <textarea
                    rows="3"
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Reference DepEd memo or school resolution..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><IcoSave /> Save Policy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 6: Admin Account & Data Management
   ══════════════════════════════════════════════════════════ */
function AccountAndDataTab({ supabase, session }) {
  const [pwForm, setPwForm] = useState({ newPw: '', confirm: '' });
  const [pwStatus, setPwStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  async function handleChangePassword(e) {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { setPwStatus('error:Passwords do not match.'); return; }
    if (pwForm.newPw.length < 8)         { setPwStatus('error:Password must be at least 8 characters.'); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pwForm.newPw });
    setSaving(false);
    if (error) { setPwStatus(`error:${error.message}`); }
    else        { setPwStatus('success:Password updated successfully.'); setPwForm({ newPw: '', confirm: '' }); }
  }

  async function exportTable(table, filename) {
    setExporting(true);
    const { data } = await supabase.from(table).select('*');
    if (data && data.length > 0) {
      const headers = Object.keys(data[0]);
      const rows    = data.map(r => headers.map(h => `"${(r[h] ?? '').toString().replace(/"/g, '""')}"`).join(','));
      const csv     = [headers.join(','), ...rows].join('\n');
      const blob    = new Blob([csv], { type: 'text/csv' });
      const url     = URL.createObjectURL(blob);
      const a       = document.createElement('a'); a.href = url; a.download = `${filename}.csv`; a.click();
      URL.revokeObjectURL(url);
    } else {
      alert('No data found in table: ' + table);
    }
    setExporting(false);
  }

  const EXPORT_MODULES = [
    { label: 'Export Students (Masterlist)', table: 'students',         file: 'students_masterlist' },
    { label: 'Export Faculty & Staff',       table: 'faculty',          file: 'faculty_records' },
    { label: 'Export Sections',              table: 'sections',         file: 'class_sections' },
    { label: 'Export Scholarships',          table: 'scholarships',     file: 'scholarships_list' },
    { label: 'Export Finances & Billing',    table: 'student_finances', file: 'student_finances' },
    { label: 'Export Official Receipts',     table: 'payments',         file: 'payment_receipts' },
  ];

  const statusType = pwStatus.startsWith('success') ? 'success' : pwStatus.startsWith('error') ? 'error' : '';
  const statusMsg  = pwStatus.split(':').slice(1).join(':');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Account Info */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><IcoAccount /> Admin Account Security</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: '14px', padding: '12px 0' }}>
          <div><span style={{ color: '#8B0000', fontWeight: '600' }}>Email Address: </span>{session?.user?.email ?? 'admin@school.edu.ph'}</div>
          <div><span style={{ color: '#8B0000', fontWeight: '600' }}>System Role: </span>Super Administrator</div>
          <div><span style={{ color: '#8B0000', fontWeight: '600' }}>User ID: </span><span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{session?.user?.id || '—'}</span></div>
          <div><span style={{ color: '#8B0000', fontWeight: '600' }}>Database Status: </span><span style={styles.badgeActive}>Connected to Supabase</span></div>
        </div>

        <form onSubmit={handleChangePassword} style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
          <h3 style={{ fontSize: '15px', color: '#8B0000', marginBottom: '12px' }}>Update Password</h3>
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
              <label>Confirm Password</label>
              <input type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Repeat new password" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <IcoSave /> {saving ? 'Updating...' : 'Update Admin Password'}
          </button>
        </form>
      </div>

      {/* CSV Export & Archiving Tools */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title"><IcoDownload /> Data Exports & Archiving</h2>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
              Download full system records as CSV spreadsheets for DepEd reporting or offline backups.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px 0' }}>
          {EXPORT_MODULES.map(({ label, table, file }) => (
            <button key={table} className="btn btn-secondary" onClick={() => exportTable(table, file)} disabled={exporting}>
              <IcoDownload /> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Inline Styles ── */
const styles = {
  tabBar: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 18px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    background: '#f9f9f9',
    color: '#555',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flex: 1,
    minWidth: '150px',
    justifyContent: 'center',
  },
  tabActive: {
    background: '#8B0000',
    color: '#FFD700',
    border: '1px solid #8B0000',
    boxShadow: '0 4px 10px rgba(139,0,0,0.2)',
  },
  tableInput: {
    padding: '6px 10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    width: '100%',
  },
  badgeActive: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: '#e6f4ea',
    color: '#137333',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeInactive: {
    display: 'inline-block',
    background: '#f1f3f4',
    color: '#5f6368',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
  },
  badgeNeutral: {
    display: 'inline-block',
    background: '#e8f0fe',
    color: '#1a73e8',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
};
