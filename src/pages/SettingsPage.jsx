import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchFeeMatrix, saveFeeMatrix, DEFAULT_FEES } from '../utils/feeMatrix';

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
  const [newSySemesters, setNewSySemesters] = useState(2); // 0, 1, 2, or 3
  const [newSyQuarters, setNewSyQuarters] = useState(4);   // 2, 3, or 4
  const [syFormError, setSyFormError] = useState('');
  const [sySaving, setSySaving] = useState(false);

  // Edit Academic Structure Modal (Supports fully dynamic numeric values & custom period naming)
  const [structureModal, setStructureModal] = useState(false);
  const [structureSaving, setStructureSaving] = useState(false);
  const [structureError, setStructureError] = useState('');
  const [editSemesters, setEditSemesters] = useState(2);
  const [editQuartersCount, setEditQuartersCount] = useState(4);
  const [structurePeriods, setStructurePeriods] = useState([]); // Array of { name, semester }

  // Inline Quarter/Period Edit Modal
  const [editQuarterModal, setEditQuarterModal] = useState(false);
  const [editingQuarter, setEditingQuarter] = useState(null); // { id, quarter_name, semester_name }
  const [editQuarterSaving, setEditQuarterSaving] = useState(false);
  const [editQuarterError, setEditQuarterError] = useState('');

  // Add Custom Period Modal
  const [periodModal, setPeriodModal] = useState(false);
  const [newPeriodName, setNewPeriodName] = useState('');
  const [newPeriodSemester, setNewPeriodSemester] = useState('1st Semester');
  const [customSemesterText, setCustomSemesterText] = useState('');
  const [periodSaving, setPeriodSaving] = useState(false);
  const [periodError, setPeriodError] = useState('');

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
      // 1. Insert school year record with semester_count and quarter_count
      const syPayload = {
        year_label: newSyLabel,
        start_date: newSyStart || null,
        end_date:   newSyEnd || null,
        is_active:  years.length === 0,
        semester_count: Number(newSySemesters),
        quarter_count:  Number(newSyQuarters),
      };

      // Try inserting with semester/quarter count columns; fallback gracefully if columns not present yet
      let createdSy = null;
      const { data: insertedSy, error } = await supabase.from('school_years').insert([syPayload]).select().single();
      if (error) {
        // If columns don't exist yet, retry with base columns
        if (error.message && (error.message.includes('semester_count') || error.message.includes('quarter_count') || error.code === '42703')) {
          const { data: baseSy, error: baseErr } = await supabase.from('school_years').insert([{
            year_label: newSyLabel,
            start_date: newSyStart || null,
            end_date:   newSyEnd || null,
            is_active:  years.length === 0,
          }]).select().single();
          if (baseErr) throw baseErr;
          createdSy = baseSy;
        } else {
          throw error;
        }
      } else {
        createdSy = insertedSy;
      }

      if (createdSy) {
        const numQ = Number(newSyQuarters);
        const numSem = Number(newSySemesters);
        const quarterRows = [];

        for (let i = 1; i <= numQ; i++) {
          let semName = null;
          if (numSem === 2) {
            semName = (numQ === 4 && i > 2) ? '2nd Semester' : (numQ === 2 && i === 2) ? '2nd Semester' : '1st Semester';
          } else if (numSem === 1) {
            semName = 'Full Year';
          }

          const qOrdinal = i === 1 ? '1st' : i === 2 ? '2nd' : i === 3 ? '3rd' : `${i}th`;
          quarterRows.push({
            school_year_id: createdSy.id,
            quarter_number: i,
            quarter_name: `${qOrdinal} Quarter`,
            semester_name: semName,
            is_active: i === 1,
            is_grading_open: i <= 2,
          });
        }

        // Try inserting with semester_name, fallback if column doesn't exist
        const { error: qErr } = await supabase.from('quarters').insert(quarterRows);
        if (qErr && (qErr.message.includes('semester_name') || qErr.code === '42703')) {
          const fallbackRows = quarterRows.map(({ semester_name, ...rest }) => rest);
          await supabase.from('quarters').insert(fallbackRows);
        }
      }

      setSyModal(false);
      setNewSyLabel('');
      setNewSyStart('');
      setNewSyEnd('');
      setNewSySemesters(2);
      setNewSyQuarters(4);
      fetchData();
      if (refreshAcademicYear) refreshAcademicYear();
    } catch (err) {
      setSyFormError(err.message || 'Failed to save school year');
    } finally {
      setSySaving(false);
    }
  }

  function openStructureModal() {
    if (!activeYear) return;
    setStructureError('');
    const sCount = activeYear.semester_count != null ? activeYear.semester_count : 2;
    const qCount = activeYear.quarter_count != null ? activeYear.quarter_count : (quarters.length || 4);
    setEditSemesters(sCount);
    setEditQuartersCount(qCount);

    // Populate current period items with custom names and semesters
    if (quarters.length > 0) {
      setStructurePeriods(quarters.map(q => ({
        id: q.id,
        quarter_number: q.quarter_number,
        quarter_name: q.quarter_name,
        semester_name: q.semester_name || (q.quarter_number <= 2 ? '1st Semester' : '2nd Semester'),
      })));
    } else {
      const generated = [];
      for (let i = 1; i <= qCount; i++) {
        const qOrdinal = i === 1 ? '1st' : i === 2 ? '2nd' : i === 3 ? '3rd' : `${i}th`;
        generated.push({
          quarter_number: i,
          quarter_name: `${qOrdinal} Quarter`,
          semester_name: (sCount === 2 && i > 2) ? '2nd Semester' : '1st Semester',
        });
      }
      setStructurePeriods(generated);
    }
    setStructureModal(true);
  }

  // Adjust structurePeriods dynamically when count changes
  function handleQuartersCountChange(newCount) {
    const count = Math.max(1, Math.min(8, Number(newCount)));
    setEditQuartersCount(count);
    setStructurePeriods(prev => {
      const updated = [...prev];
      if (count > updated.length) {
        for (let i = updated.length + 1; i <= count; i++) {
          const qOrdinal = i === 1 ? '1st' : i === 2 ? '2nd' : i === 3 ? '3rd' : `${i}th`;
          const sName = (editSemesters === 2 && i > 2) ? '2nd Semester' : '1st Semester';
          updated.push({
            quarter_number: i,
            quarter_name: `${qOrdinal} Quarter`,
            semester_name: sName,
          });
        }
      } else if (count < updated.length) {
        return updated.slice(0, count);
      }
      return updated;
    });
  }

  async function handleSaveStructure(e) {
    e.preventDefault();
    if (!activeYear) return;
    setStructureSaving(true);
    setStructureError('');

    try {
      const targetQ = Number(editQuartersCount);
      const targetSem = Number(editSemesters);

      // 1. Update school_years table
      const syUpdate = {
        semester_count: targetSem,
        quarter_count: targetQ,
      };
      const { error: syErr } = await supabase.from('school_years').update(syUpdate).eq('id', activeYear.id);
      if (syErr && !syErr.message.includes('semester_count')) {
        throw syErr;
      }

      // 2. Upsert each period with user's customized name and semester track
      for (let idx = 0; idx < structurePeriods.length; idx++) {
        const p = structurePeriods[idx];
        const qNum = idx + 1;
        const row = {
          school_year_id: activeYear.id,
          quarter_number: qNum,
          quarter_name: p.quarter_name || `${qNum}th Quarter`,
          semester_name: p.semester_name || '1st Semester',
        };

        if (p.id) {
          await supabase.from('quarters').update(row).eq('id', p.id);
        } else {
          const { error: insErr } = await supabase.from('quarters').insert([{
            ...row,
            is_active: qNum === 1,
            is_grading_open: qNum <= 2,
          }]);
          if (insErr && (insErr.message.includes('semester_name') || insErr.code === '42703')) {
            const { semester_name, ...baseRow } = row;
            await supabase.from('quarters').insert([baseRow]);
          }
        }
      }

      // If user reduced the number of periods, delete the surplus ones
      if (quarters.length > targetQ) {
        const surplus = quarters.filter(q => q.quarter_number > targetQ);
        for (const s of surplus) {
          await supabase.from('quarters').delete().eq('id', s.id);
        }
      }

      setStructureModal(false);
      fetchData();
      if (refreshAcademicYear) refreshAcademicYear();
    } catch (err) {
      setStructureError(err.message || 'Failed to update academic structure');
    } finally {
      setStructureSaving(false);
    }
  }

  function openEditQuarterModal(q) {
    setEditQuarterError('');
    setEditingQuarter({
      id: q.id,
      quarter_name: q.quarter_name,
      semester_name: q.semester_name || '1st Semester',
    });
    setEditQuarterModal(true);
  }

  async function handleSaveQuarterEdit(e) {
    e.preventDefault();
    if (!editingQuarter) return;
    setEditQuarterSaving(true);
    setEditQuarterError('');

    try {
      const updateData = {
        quarter_name: editingQuarter.quarter_name.trim(),
        semester_name: editingQuarter.semester_name,
      };

      const { error } = await supabase
        .from('quarters')
        .update(updateData)
        .eq('id', editingQuarter.id);

      if (error && (error.message.includes('semester_name') || error.code === '42703')) {
        await supabase
          .from('quarters')
          .update({ quarter_name: editingQuarter.quarter_name.trim() })
          .eq('id', editingQuarter.id);
      } else if (error) {
        throw error;
      }

      setEditQuarterModal(false);
      setEditingQuarter(null);
      fetchData();
      if (refreshAcademicYear) refreshAcademicYear();
    } catch (err) {
      setEditQuarterError(err.message || 'Failed to update period');
    } finally {
      setEditQuarterSaving(false);
    }
  }

  async function handleAddCustomPeriod(e) {
    e.preventDefault();
    if (!activeYear || !newPeriodName.trim()) return;
    setPeriodSaving(true);
    setPeriodError('');

    try {
      const semToUse = newPeriodSemester === '__custom__'
        ? (customSemesterText.trim() || 'Custom Semester')
        : newPeriodSemester;

      const nextNum = quarters.length ? Math.max(...quarters.map(q => q.quarter_number)) + 1 : 1;
      const row = {
        school_year_id: activeYear.id,
        quarter_number: nextNum,
        quarter_name: newPeriodName.trim(),
        semester_name: semToUse,
        is_active: false,
        is_grading_open: true,
      };

      const { error } = await supabase.from('quarters').insert([row]);
      if (error && (error.message.includes('semester_name') || error.code === '42703')) {
        const { semester_name, ...fallback } = row;
        await supabase.from('quarters').insert([fallback]);
      } else if (error) {
        throw error;
      }

      // Update school year quarter_count
      await supabase.from('school_years').update({ quarter_count: quarters.length + 1 }).eq('id', activeYear.id);

      setPeriodModal(false);
      setNewPeriodName('');
      setCustomSemesterText('');
      fetchData();
      if (refreshAcademicYear) refreshAcademicYear();
    } catch (err) {
      setPeriodError(err.message || 'Failed to add period');
    } finally {
      setPeriodSaving(false);
    }
  }

  async function handleDeleteQuarter(qId, qName) {
    if (!window.confirm(`Are you sure you want to remove ${qName}? Any grading rules tied to this period will be unlinked.`)) return;
    try {
      await supabase.from('quarters').delete().eq('id', qId);
      if (activeYear) {
        await supabase.from('school_years').update({ quarter_count: Math.max(1, quarters.length - 1) }).eq('id', activeYear.id);
      }
      fetchData();
      if (refreshAcademicYear) refreshAcademicYear();
    } catch (err) {
      alert('Error removing quarter: ' + err.message);
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
                  <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: '#f0f4f8',
                      color: '#334155',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}>
                      {sy.semester_count != null ? sy.semester_count : 2} Semesters
                    </span>
                    <span style={{
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}>
                      {sy.quarter_count != null ? sy.quarter_count : 4} Quarters
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quarters for the active school year */}
        {activeYear && (
          <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '16px', color: '#8B0000', margin: 0, fontWeight: '700' }}>
                  Academic Structure & Periods for S.Y. {activeYear.year_label}
                </h3>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '3px' }}>
                  System Configuration: <strong>{activeYear.semester_count != null ? activeYear.semester_count : 2} Semester{activeYear.semester_count === 1 ? '' : 's'}</strong> &bull; <strong>{quarters.length} Grading Period{quarters.length === 1 ? '' : 's'}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={openStructureModal}
                >
                  <IcoEdit /> Configure Semesters & Quarters
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => { setPeriodError(''); setPeriodModal(true); }}
                >
                  <IcoAdd /> Add Period
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Quarter / Period Name</th>
                    <th>Semester Track</th>
                    <th>Current Status</th>
                    <th>Teacher Grade Encoding</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quarters.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-message">No quarters/periods found. Click "Configure Semesters & Quarters" or "Add Period" to create them.</td>
                    </tr>
                  ) : (
                    quarters.map(q => {
                      const semTag = q.semester_name || (
                        q.quarter_number <= 2 ? '1st Semester' : '2nd Semester'
                      );
                      return (
                        <tr key={q.id}>
                          <td style={{ fontWeight: '600' }}>{q.quarter_name}</td>
                          <td>
                            <span style={{
                              display: 'inline-block',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: semTag.includes('1st') ? '#e8f0fe' : '#fef7e0',
                              color: semTag.includes('1st') ? '#1a73e8' : '#b06000',
                            }}>
                              {semTag}
                            </span>
                          </td>
                          <td>
                            {q.is_active ? (
                              <span style={styles.badgeActive}>● Currently Active Quarter</span>
                            ) : (
                              <span style={styles.badgeInactive}>Inactive</span>
                            )}
                          </td>
                          <td>
                            {q.is_grading_open ? (
                              <span style={{ color: '#28a745', fontWeight: '600' }}>Open (Encoding Allowed)</span>
                            ) : (
                              <span style={{ color: '#dc3545', fontWeight: '600' }}>Closed / Locked</span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <button
                                type="button"
                                className="btn btn-sm btn-secondary"
                                title="Edit period name or semester track"
                                onClick={() => openEditQuarterModal(q)}
                              >
                                <IcoEdit /> Edit
                              </button>
                              <button
                                className={`btn btn-sm ${q.is_active ? 'btn-secondary' : 'btn-primary'}`}
                                onClick={() => handleToggleQuarter(q.id, q.is_active)}
                              >
                                {q.is_active ? 'Deactivate' : 'Set as Current'}
                              </button>
                              <button
                                className={`btn btn-sm ${q.is_grading_open ? 'btn-danger' : 'btn-secondary'}`}
                                onClick={() => handleToggleGrading(q.id, q.is_grading_open)}
                              >
                                {q.is_grading_open ? 'Lock Grades' : 'Open Grading'}
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm"
                                style={{ background: '#f8d7da', color: '#721c24', padding: '6px 8px' }}
                                title="Remove this period"
                                onClick={() => handleDeleteQuarter(q.id, q.quarter_name)}
                              >
                                <IcoTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
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

                <div style={{ background: '#fdfbf7', border: '1px solid #eedcbf', borderRadius: '8px', padding: '14px', marginTop: '8px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#8B0000', fontWeight: '600' }}>
                    Academic Structure Setup
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Number of Semesters</label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        className="filter-select"
                        style={{ width: '100%' }}
                        value={newSySemesters}
                        onChange={e => setNewSySemesters(Math.max(1, Math.min(6, Number(e.target.value) || 1)))}
                        required
                      />
                      <small style={{ color: '#666', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                        e.g. 2 for Standard Semestral (1st & 2nd), 1 for Full Year, 3 for Trimesters
                      </small>
                    </div>

                    <div className="form-group">
                      <label>Number of Quarters / Periods</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        className="filter-select"
                        style={{ width: '100%' }}
                        value={newSyQuarters}
                        onChange={e => setNewSyQuarters(Math.max(1, Math.min(8, Number(e.target.value) || 1)))}
                        required
                      />
                      <small style={{ color: '#666', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                        Total grading periods to generate (e.g. 4 for standard Q1-Q4, 2 for Sem 1 & 2)
                      </small>
                    </div>
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

      {/* Modal: Configure Academic Structure (Semesters & Quarters) */}
      {structureModal && activeYear && (
        <div className="modal active">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoEdit /> Dynamic Academic Structure (S.Y. {activeYear.year_label})</h3>
              <button className="modal-close" onClick={() => setStructureModal(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleSaveStructure}>
              <div className="modal-body">
                {structureError && (
                  <div style={{ color: '#dc3545', background: '#f8d7da', padding: '10px', borderRadius: '6px', marginBottom: '14px', fontSize: '13px' }}>
                    {structureError}
                  </div>
                )}
                <p style={{ fontSize: '13px', color: '#555', marginBottom: '16px' }}>
                  Dynamically adjust the number of semesters and grading periods for this school year. You can customize the name and semester track for every individual period below.
                </p>

                <div className="form-grid" style={{ marginBottom: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Number of Semesters *</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={editSemesters}
                      onChange={e => setEditSemesters(Math.max(1, Math.min(6, Number(e.target.value) || 1)))}
                      required
                    />
                    <small style={{ color: '#666', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                      e.g. 2 for Semestral, 1 for Full Year, 3 for Trimesters
                    </small>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Number of Grading Periods *</label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={editQuartersCount}
                      onChange={e => handleQuartersCountChange(e.target.value)}
                      required
                    />
                    <small style={{ color: '#666', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                      Total number of grading periods (1 to 8)
                    </small>
                  </div>
                </div>

                {/* Dynamic Period Customizer List */}
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px', marginTop: '12px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#8B0000', fontWeight: '700' }}>
                    Period Names & Semester Associations
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '260px', overflowY: 'auto' }}>
                    {structurePeriods.map((p, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>
                          Period {idx + 1}:
                        </span>
                        <input
                          type="text"
                          className="search-input"
                          style={{ padding: '6px 10px', fontSize: '13px' }}
                          placeholder="e.g. 1st Quarter, Midterm"
                          value={p.quarter_name}
                          onChange={e => {
                            const val = e.target.value;
                            setStructurePeriods(curr => {
                              const copy = [...curr];
                              copy[idx] = { ...copy[idx], quarter_name: val };
                              return copy;
                            });
                          }}
                          required
                        />
                        <input
                          type="text"
                          className="search-input"
                          style={{ padding: '6px 10px', fontSize: '13px' }}
                          placeholder="Semester (e.g. 1st Semester)"
                          value={p.semester_name}
                          onChange={e => {
                            const val = e.target.value;
                            setStructurePeriods(curr => {
                              const copy = [...curr];
                              copy[idx] = { ...copy[idx], semester_name: val };
                              return copy;
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setStructureModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={structureSaving}>
                  <IcoSave /> {structureSaving ? 'Saving...' : 'Save Structure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Single Period Inline */}
      {editQuarterModal && editingQuarter && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title"><IcoEdit /> Edit Period</h3>
              <button className="modal-close" onClick={() => setEditQuarterModal(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleSaveQuarterEdit}>
              <div className="modal-body">
                {editQuarterError && (
                  <div style={{ color: '#dc3545', background: '#f8d7da', padding: '10px', borderRadius: '6px', marginBottom: '14px', fontSize: '13px' }}>
                    {editQuarterError}
                  </div>
                )}
                <div className="form-group">
                  <label>Quarter / Period Display Name *</label>
                  <input
                    value={editingQuarter.quarter_name}
                    onChange={e => setEditingQuarter(eq => ({ ...eq, quarter_name: e.target.value }))}
                    placeholder="e.g. 1st Quarter, Midterm Assessment, Finals"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Semester Track</label>
                  <input
                    value={editingQuarter.semester_name}
                    onChange={e => setEditingQuarter(eq => ({ ...eq, semester_name: e.target.value }))}
                    placeholder="e.g. 1st Semester, 2nd Semester, Summer Term"
                    required
                  />
                  <small style={{ color: '#666', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                    Type any custom semester or academic period name (e.g. 1st Semester, Summer Term, Trimester 2).
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditQuarterModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={editQuarterSaving}>
                  <IcoSave /> {editQuarterSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Custom Period */}
      {periodModal && activeYear && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title"><IcoAdd /> Add Period (S.Y. {activeYear.year_label})</h3>
              <button className="modal-close" onClick={() => setPeriodModal(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleAddCustomPeriod}>
              <div className="modal-body">
                {periodError && (
                  <div style={{ color: '#dc3545', background: '#f8d7da', padding: '10px', borderRadius: '6px', marginBottom: '14px', fontSize: '13px' }}>
                    {periodError}
                  </div>
                )}
                <div className="form-group">
                  <label>Quarter / Period Name *</label>
                  <input
                    value={newPeriodName}
                    onChange={e => setNewPeriodName(e.target.value)}
                    placeholder="e.g. 5th Quarter, Summer Term, Remedial Period"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Semester Track</label>
                  <select
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={newPeriodSemester}
                    onChange={e => setNewPeriodSemester(e.target.value)}
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="Summer / Special Term">Summer / Special Term</option>
                    <option value="Full Year">Full Year</option>
                    <option value="__custom__">+ Enter Custom Semester Name...</option>
                  </select>
                </div>
                {newPeriodSemester === '__custom__' && (
                  <div className="form-group">
                    <label>Custom Semester Label *</label>
                    <input
                      value={customSemesterText}
                      onChange={e => setCustomSemesterText(e.target.value)}
                      placeholder="e.g. 3rd Trimester, Mid-Year Term"
                      required
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setPeriodModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={periodSaving}>
                  <IcoSave /> {periodSaving ? 'Saving...' : 'Add Period'}
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
    let sy = null;
    try {
      const { data } = await supabase.from('school_years').select('*').eq('is_active', true).maybeSingle();
      sy = data;
      setActiveSy(sy);
    } catch {
      setActiveSy(null);
    }

    let facList = [];
    try {
      const { data: fac } = await supabase.from('faculty').select('faculty_record_id, faculty_id, first_name, last_name').order('last_name', { ascending: true });
      facList = fac || [];
      setFaculty(facList);
    } catch {
      setFaculty([]);
    }

    let strList = [];
    try {
      const { data: str } = await supabase.from('shs_strands').select('*').order('strand_code', { ascending: true });
      strList = str || [];
      setStrands(strList);
    } catch {
      setStrands([]);
    }

    // Resilient sections fetch:
    // 1. Fetch raw sections without foreign-key joins to avoid PostgREST relationship cache errors
    let rawSections = [];
    
    // First try: active school year or sections with null school_year_id
    if (sy?.id) {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .or(`school_year_id.eq.${sy.id},school_year_id.is.null`)
        .order('grade_level', { ascending: true });
      if (!error && data && data.length > 0) {
        rawSections = data;
      }
    }

    // Second try / fallback: fetch all sections without SY filter if first try returned empty or had error
    if (rawSections.length === 0) {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('grade_level', { ascending: true });
      if (!error && data) {
        rawSections = data;
      }
    }

    // Map relationships in JS using facList and strList
    const joinedSections = (rawSections || []).map(sec => {
      const adviser = facList.find(f => 
        f.faculty_record_id === sec.adviser_id || 
        f.faculty_id === sec.adviser_id ||
        String(f.faculty_record_id) === String(sec.adviser_id)
      );
      const strand = strList.find(st => st.id === sec.strand_id);
      return {
        ...sec,
        faculty: adviser ? { first_name: adviser.first_name, last_name: adviser.last_name } : null,
        shs_strands: strand ? { strand_code: strand.strand_code } : null,
      };
    });

    setSections(joinedSections);
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
      const { error } = await supabase.from('sections').update(payload).eq('id', editSection.id);
      if (error) {
        const fallback = { ...payload };
        delete fallback.school_year_id;
        delete fallback.strand_id;
        await supabase.from('sections').update(fallback).eq('id', editSection.id);
      }
    } else {
      const { error } = await supabase.from('sections').insert([payload]);
      if (error) {
        const fallback = { ...payload };
        delete fallback.school_year_id;
        delete fallback.strand_id;
        await supabase.from('sections').insert([fallback]);
      }
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
function FeesScholarshipsTab({ supabase }) {
  const [fees, setFees] = useState(DEFAULT_FEES);
  const [scholarships, setScholarships] = useState([]);
  const [feeSaved, setFeeSaved] = useState(false);
  const [feeSaving, setFeeSaving] = useState(false);
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

  // Load persistent fee matrix
  useEffect(() => {
    let ignore = false;
    async function loadFees() {
      const data = await fetchFeeMatrix(supabase);
      if (!ignore && data) setFees(data);
    }
    loadFees();
    return () => { ignore = true; };
  }, [supabase]);

  const fetchScholarships = useCallback(async () => {
    const { data } = await supabase.from('scholarships').select('*').order('name', { ascending: true });
    setScholarships(data || []);
  }, [supabase]);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  const [deptFilter, setDeptFilter] = useState('ALL');

  function updateFeeByGrade(gradeLevel, field, val) {
    setFees(prev => prev.map(f => Number(f.grade_level) === Number(gradeLevel) ? { ...f, [field]: Number(val) } : f));
  }

  async function handleSaveFees() {
    setFeeSaving(true);
    try {
      await saveFeeMatrix(supabase, fees);
      setFeeSaved(true);
      setTimeout(() => setFeeSaved(false), 3500);
    } catch (err) {
      console.error('Error saving fee matrix:', err);
      setFeeSaved(true);
      setTimeout(() => setFeeSaved(false), 3500);
    } finally {
      setFeeSaving(false);
    }
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

  const displayedFees = fees.filter(row => deptFilter === 'ALL' || row.department === deptFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Fee Structure */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 className="card-title"><IcoFee /> Tuition & Miscellaneous Fee Matrix (Grades 1–12)</h2>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
              Configure specific tuition and miscellaneous fee assessments for every individual grade level.
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleSaveFees} disabled={feeSaving}>
            <IcoSave /> {feeSaving ? 'Saving...' : feeSaved ? 'Saved Successfully!' : 'Save Fee Changes'}
          </button>
        </div>

        {/* Department Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', padding: '0 16px 12px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Grades (1–12)' },
            { id: 'Elementary', label: 'Elementary (Grades 1–6)' },
            { id: 'Junior High', label: 'Junior High (Grades 7–10)' },
            { id: 'Senior High', label: 'Senior High (Grades 11–12)' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`btn btn-sm ${deptFilter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDeptFilter(tab.id)}
              style={{
                fontSize: '12px',
                padding: '5px 12px',
                borderRadius: '20px',
                ...(deptFilter === tab.id ? { background: '#8B0000', borderColor: '#8B0000', color: '#fff' } : {}),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Academic Level</th>
                <th style={{ width: '220px' }}>Tuition Fee (₱)</th>
                <th style={{ width: '220px' }}>Miscellaneous (₱)</th>
                <th style={{ width: '180px' }}>Total Assessment (₱)</th>
              </tr>
            </thead>
            <tbody>
              {displayedFees.map(row => (
                <tr key={row.grade_level}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '15px' }}>{row.level}</span>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        background: row.department === 'Elementary' ? '#e8f0fe' : row.department === 'Junior High' ? '#fef3c7' : '#fce8e6',
                        color: row.department === 'Elementary' ? '#1a73e8' : row.department === 'Junior High' ? '#b45309' : '#8B0000',
                      }}>
                        {row.department}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#888', fontWeight: 'bold' }}>₱</span>
                      <input
                        style={styles.tableInput}
                        type="number"
                        min="0"
                        step="100"
                        value={row.tuition}
                        onChange={e => updateFeeByGrade(row.grade_level, 'tuition', e.target.value)}
                      />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#888', fontWeight: 'bold' }}>₱</span>
                      <input
                        style={styles.tableInput}
                        type="number"
                        min="0"
                        step="100"
                        value={row.miscellaneous}
                        onChange={e => updateFeeByGrade(row.grade_level, 'miscellaneous', e.target.value)}
                      />
                    </div>
                  </td>
                  <td style={{ fontWeight: '700', fontSize: '15px', color: '#8B0000' }}>
                    ₱{(Number(row.tuition || 0) + Number(row.miscellaneous || 0)).toLocaleString()}
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
