import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

/* ── Icons ─────────────────────────────────────────────── */
function IcoBook() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function IcoAdd() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
function IcoClose() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IcoSettings() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

/* ── Helpers ────────────────────────────────────────────── */
const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

const EMPTY_SUBJECT_FORM = {
  subject_name: '',
  subject_code: '',
  curriculum_id: '',
  grade_level: '',
  semester: '',
  description: '',
  status: 'Active',
};

const EMPTY_CURRICULUM_FORM = {
  name: '',
  code: '',
  grade_level_start: 1,
  grade_level_end: 6,
  description: '',
  sort_order: 0,
  is_active: true,
};

function StatusBadge({ status }) {
  const s = (status ?? 'active').toLowerCase();
  const cls =
    s === 'active'   ? 'badge badge-success' :
    s === 'inactive' ? 'badge badge-warning' : 'badge badge-info';
  return <span className={cls}>{status ?? 'Active'}</span>;
}

/* ── Main Page ─────────────────────────────────────────── */
export default function SubjectsPage() {
  const { supabase } = useAuth();

  /* ── State ── */
  const [curriculums, setCurriculums]       = useState([]);
  const [subjects, setSubjects]             = useState([]);
  const [loadingCurr, setLoadingCurr]       = useState(true);
  const [loadingSubj, setLoadingSubj]       = useState(true);

  // Active curriculum tab & grade sub-tab
  const [activeCurrId, setActiveCurrId]     = useState(null); // null = "All"
  const [activeGrade, setActiveGrade]       = useState(null); // null = all grades in curriculum

  // Search within current view
  const [search, setSearch]                 = useState('');

  // Subject modal
  const [subjModal, setSubjModal]           = useState(false);
  const [editSubj, setEditSubj]             = useState(null);
  const [subjForm, setSubjForm]             = useState(EMPTY_SUBJECT_FORM);
  const [subjSaving, setSubjSaving]         = useState(false);
  const [subjError, setSubjError]           = useState('');

  // Curriculum management panel
  const [currPanel, setCurrPanel]           = useState(false);
  const [editCurr, setEditCurr]             = useState(null);
  const [currForm, setCurrForm]             = useState(EMPTY_CURRICULUM_FORM);
  const [currSaving, setCurrSaving]         = useState(false);
  const [currError, setCurrError]           = useState('');

  // Delete confirm
  const [deleteSubj, setDeleteSubj]         = useState(null);
  const [deleteCurr, setDeleteCurr]         = useState(null);

  /* ── Fetch curriculums ── */
  const fetchCurriculums = useCallback(async () => {
    setLoadingCurr(true);
    const { data } = await supabase
      .from('curriculums')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });
    setCurriculums(data ?? []);
    setLoadingCurr(false);
  }, [supabase]);

  /* ── Fetch subjects ── */
  const fetchSubjects = useCallback(async () => {
    setLoadingSubj(true);
    const { data } = await supabase
      .from('subjects')
      .select('*, curriculums(id, name, code)')
      .order('grade_level', { ascending: true })
      .order('subject_name', { ascending: true });
    setSubjects(data ?? []);
    setLoadingSubj(false);
  }, [supabase]);

  useEffect(() => { fetchCurriculums(); }, [fetchCurriculums]);
  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

  /* ── Derived: active curriculum object ── */
  const activeCurriculum = useMemo(
    () => curriculums.find(c => c.id === activeCurrId) ?? null,
    [curriculums, activeCurrId]
  );

  /* ── Grade levels available for active curriculum ── */
  const gradeRange = useMemo(() => {
    if (!activeCurriculum) return range(1, 12);
    return range(activeCurriculum.grade_level_start, activeCurriculum.grade_level_end);
  }, [activeCurriculum]);

  /* ── Filtered subjects for current view ── */
  const filteredSubjects = useMemo(() => {
    let list = subjects;
    if (activeCurrId) list = list.filter(s => s.curriculum_id === activeCurrId);
    if (activeGrade !== null) list = list.filter(s => s.grade_level === activeGrade);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(s =>
        (s.subject_name ?? '').toLowerCase().includes(q) ||
        (s.subject_code ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [subjects, activeCurrId, activeGrade, search]);

  /* ── Stats ── */
  const totalSubjects  = subjects.length;
  const activeSubjects = subjects.filter(s => (s.status ?? '').toLowerCase() === 'active').length;

  /* ── Subject form helpers ── */
  function openAddSubject() {
    setEditSubj(null);
    setSubjForm({ ...EMPTY_SUBJECT_FORM, curriculum_id: activeCurrId ?? '' });
    setSubjError('');
    setSubjModal(true);
  }
  function openEditSubject(item) {
    setEditSubj(item);
    setSubjForm({
      subject_name:  item.subject_name  ?? '',
      subject_code:  item.subject_code  ?? '',
      curriculum_id: item.curriculum_id ?? '',
      grade_level:   item.grade_level   ?? '',
      semester:      item.semester      ?? '',
      description:   item.description   ?? '',
      status:        item.status        ?? 'Active',
    });
    setSubjError('');
    setSubjModal(true);
  }

  // Grade options restricted to selected curriculum
  const subjectGradeOptions = useMemo(() => {
    const selCurr = curriculums.find(c => c.id === subjForm.curriculum_id);
    if (!selCurr) return range(1, 12);
    return range(selCurr.grade_level_start, selCurr.grade_level_end);
  }, [curriculums, subjForm.curriculum_id]);

  async function handleSaveSubject(e) {
    e.preventDefault();
    if (!subjForm.subject_name.trim()) { setSubjError('Subject name is required.'); return; }
    if (!subjForm.curriculum_id) { setSubjError('Please select a curriculum.'); return; }
    if (!subjForm.grade_level) { setSubjError('Please select a grade level.'); return; }

    setSubjSaving(true);
    setSubjError('');
    const payload = {
      subject_name:  subjForm.subject_name.trim(),
      subject_code:  subjForm.subject_code.trim() || null,
      curriculum_id: subjForm.curriculum_id,
      grade_level:   Number(subjForm.grade_level),
      semester:      subjForm.semester || null,
      description:   subjForm.description.trim() || null,
      status:        subjForm.status,
    };

    if (editSubj) {
      const { error } = await supabase.from('subjects').update(payload).eq('subject_id', editSubj.subject_id);
      if (error) { setSubjError(error.message); setSubjSaving(false); return; }
    } else {
      const { error } = await supabase.from('subjects').insert([payload]);
      if (error) { setSubjError(error.message); setSubjSaving(false); return; }
    }

    setSubjSaving(false);
    setSubjModal(false);
    fetchSubjects();
  }

  async function handleDeleteSubject() {
    if (!deleteSubj) return;
    await supabase.from('subjects').delete().eq('subject_id', deleteSubj.subject_id);
    setDeleteSubj(null);
    fetchSubjects();
  }

  /* ── Curriculum management helpers ── */
  function openAddCurriculum() {
    setEditCurr(null);
    setCurrForm(EMPTY_CURRICULUM_FORM);
    setCurrError('');
  }
  function openEditCurriculum(c) {
    setEditCurr(c);
    setCurrForm({
      name:              c.name,
      code:              c.code,
      grade_level_start: c.grade_level_start,
      grade_level_end:   c.grade_level_end,
      description:       c.description ?? '',
      sort_order:        c.sort_order ?? 0,
      is_active:         c.is_active ?? true,
    });
    setCurrError('');
  }

  async function handleSaveCurriculum(e) {
    e.preventDefault();
    if (!currForm.name.trim() || !currForm.code.trim()) {
      setCurrError('Name and code are required.');
      return;
    }
    if (Number(currForm.grade_level_start) > Number(currForm.grade_level_end)) {
      setCurrError('Grade start must be ≤ grade end.');
      return;
    }
    setCurrSaving(true);
    setCurrError('');
    const payload = {
      name:              currForm.name.trim(),
      code:              currForm.code.trim().toUpperCase(),
      grade_level_start: Number(currForm.grade_level_start),
      grade_level_end:   Number(currForm.grade_level_end),
      description:       currForm.description.trim() || null,
      sort_order:        Number(currForm.sort_order),
      is_active:         currForm.is_active,
    };

    if (editCurr) {
      const { error } = await supabase.from('curriculums').update(payload).eq('id', editCurr.id);
      if (error) { setCurrError(error.message); setCurrSaving(false); return; }
    } else {
      const { error } = await supabase.from('curriculums').insert([payload]);
      if (error) { setCurrError(error.message); setCurrSaving(false); return; }
    }

    setCurrSaving(false);
    setEditCurr(null);
    setCurrForm(EMPTY_CURRICULUM_FORM);
    fetchCurriculums();
    fetchSubjects();
  }

  async function handleDeleteCurriculum() {
    if (!deleteCurr) return;
    await supabase.from('curriculums').delete().eq('id', deleteCurr.id);
    if (activeCurrId === deleteCurr.id) setActiveCurrId(null);
    setDeleteCurr(null);
    fetchCurriculums();
    fetchSubjects();
  }

  /* ── Reset grade filter when curriculum changes ── */
  function switchCurriculum(id) {
    setActiveCurrId(id);
    setActiveGrade(null);
    setSearch('');
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  /* ─────────────────────── Render ─────────────────────── */
  return (
    <>
      {/* Header */}
      <div className="top-header">
        <h1><IcoBook /> Subject Management</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">

        {/* Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><IcoBook /></div>
            <div className="stat-info">
              <div className="stat-number">{totalSubjects}</div>
              <div className="stat-label">Total Subjects</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon"><IcoBook /></div>
            <div className="stat-info">
              <div className="stat-number">{activeSubjects}</div>
              <div className="stat-label">Active Subjects</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><IcoBook /></div>
            <div className="stat-info">
              <div className="stat-number">{curriculums.filter(c => c.is_active).length}</div>
              <div className="stat-label">Curriculums</div>
            </div>
          </div>
        </div>

        {/* ── Curriculum Tabs ── */}
        <div className="card" style={{ marginBottom: '0', borderBottom: 'none', borderRadius: '8px 8px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', padding: '0 4px' }}>

            {/* "All" tab */}
            <button
              onClick={() => switchCurriculum(null)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: activeCurrId === null ? '3px solid #8B0000' : '3px solid transparent',
                background: 'transparent',
                fontWeight: activeCurrId === null ? '700' : '500',
                color: activeCurrId === null ? '#8B0000' : '#555',
                cursor: 'pointer',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              All Subjects
            </button>

            {loadingCurr ? (
              <span style={{ fontSize: '13px', color: '#888', padding: '10px' }}>Loading...</span>
            ) : (
              curriculums.filter(c => c.is_active).map(c => (
                <button
                  key={c.id}
                  onClick={() => switchCurriculum(c.id)}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderBottom: activeCurrId === c.id ? '3px solid #8B0000' : '3px solid transparent',
                    background: 'transparent',
                    fontWeight: activeCurrId === c.id ? '700' : '500',
                    color: activeCurrId === c.id ? '#8B0000' : '#555',
                    cursor: 'pointer',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                >
                  {c.name}
                  <span style={{
                    marginLeft: '6px',
                    background: activeCurrId === c.id ? '#8B0000' : '#e9ecef',
                    color: activeCurrId === c.id ? '#fff' : '#666',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '1px 7px',
                  }}>
                    {subjects.filter(s => s.curriculum_id === c.id).length}
                  </span>
                </button>
              ))
            )}

            {/* Manage Curriculums button */}
            <button
              onClick={() => setCurrPanel(v => !v)}
              style={{
                marginLeft: 'auto',
                padding: '8px 14px',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                background: currPanel ? '#8B0000' : '#fff',
                color: currPanel ? '#fff' : '#555',
                cursor: 'pointer',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              <IcoSettings /> Manage Curriculums
            </button>
          </div>
        </div>

        {/* ── Curriculum Management Panel ── */}
        {currPanel && (
          <div className="card" style={{ borderRadius: '0', borderTop: '1px solid #f0f0f0', background: '#fafbfc' }}>
            <div className="card-header" style={{ borderBottom: '1px solid #e9ecef' }}>
              <h2 className="card-title" style={{ fontSize: '15px' }}><IcoSettings /> Curriculum Configuration</h2>
              <span style={{ fontSize: '13px', color: '#888' }}>Define curricula — each sets the grade level range for its subjects.</span>
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', padding: '16px 0 8px' }}>

              {/* Existing curriculums list */}
              <div style={{ flex: '1 1 320px', minWidth: '260px' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table" style={{ fontSize: '13px' }}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Grades</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingCurr ? (
                        <tr><td colSpan={5} className="empty-message">Loading...</td></tr>
                      ) : curriculums.length === 0 ? (
                        <tr><td colSpan={5} className="empty-message">No curriculums yet.</td></tr>
                      ) : curriculums.map(c => (
                        <tr key={c.id}>
                          <td style={{ fontWeight: '600' }}>{c.name}</td>
                          <td><span style={{ background: '#f0f0f0', borderRadius: '4px', padding: '2px 7px', fontSize: '12px', fontWeight: '700', color: '#555' }}>{c.code}</span></td>
                          <td style={{ whiteSpace: 'nowrap' }}>Gr. {c.grade_level_start}–{c.grade_level_end}</td>
                          <td><StatusBadge status={c.is_active ? 'Active' : 'Inactive'} /></td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button className="btn btn-secondary btn-sm" onClick={() => openEditCurriculum(c)} title="Edit"><IcoEdit /></button>
                              <button className="btn btn-danger btn-sm" onClick={() => setDeleteCurr(c)} title="Delete"><IcoTrash /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add / Edit curriculum form */}
              <div style={{ flex: '1 1 280px', minWidth: '240px' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '700', color: '#333' }}>
                  {editCurr ? `Editing: ${editCurr.name}` : 'Add New Curriculum'}
                </h4>
                <form onSubmit={handleSaveCurriculum}>
                  {currError && <p style={{ color: '#dc3545', fontSize: '13px', marginBottom: '10px' }}>{currError}</p>}
                  <div className="form-group">
                    <label style={{ fontSize: '12px' }}>Curriculum Name *</label>
                    <input value={currForm.name} onChange={e => setCurrForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Junior High School" style={{ fontSize: '13px' }} />
                  </div>
                  <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '12px' }}>Code *</label>
                      <input value={currForm.code} onChange={e => setCurrForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. JHS" maxLength={20} style={{ fontSize: '13px' }} />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '12px' }}>Sort Order</label>
                      <input type="number" min={0} value={currForm.sort_order} onChange={e => setCurrForm(f => ({ ...f, sort_order: e.target.value }))} style={{ fontSize: '13px' }} />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '12px' }}>Grade Start *</label>
                      <select value={currForm.grade_level_start} onChange={e => setCurrForm(f => ({ ...f, grade_level_start: e.target.value }))} style={{ fontSize: '13px' }}>
                        {range(1, 12).map(g => <option key={g} value={g}>Grade {g}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '12px' }}>Grade End *</label>
                      <select value={currForm.grade_level_end} onChange={e => setCurrForm(f => ({ ...f, grade_level_end: e.target.value }))} style={{ fontSize: '13px' }}>
                        {range(1, 12).map(g => <option key={g} value={g}>Grade {g}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '12px' }}>Description</label>
                    <textarea value={currForm.description} onChange={e => setCurrForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ width: '100%', fontSize: '13px', padding: '7px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'inherit', resize: 'vertical' }} placeholder="Optional details..." />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={currForm.is_active} onChange={e => setCurrForm(f => ({ ...f, is_active: e.target.checked }))} />
                      Active (visible as tab)
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" className="btn btn-primary" disabled={currSaving} style={{ fontSize: '13px' }}>
                      {currSaving ? 'Saving...' : editCurr ? 'Save Changes' : 'Add Curriculum'}
                    </button>
                    {editCurr && (
                      <button type="button" className="btn btn-secondary" onClick={() => { setEditCurr(null); setCurrForm(EMPTY_CURRICULUM_FORM); }} style={{ fontSize: '13px' }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ── Grade Level Sub-tabs (only when a curriculum is selected) ── */}
        {activeCurriculum && (
          <div style={{
            background: '#f8f9fa',
            borderLeft: '1px solid #dee2e6',
            borderRight: '1px solid #dee2e6',
            padding: '8px 16px',
            display: 'flex',
            gap: '4px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '12px', color: '#888', marginRight: '8px', fontWeight: '600' }}>GRADE:</span>
            <button
              onClick={() => setActiveGrade(null)}
              style={{
                padding: '5px 14px',
                border: '1px solid',
                borderColor: activeGrade === null ? '#8B0000' : '#dee2e6',
                borderRadius: '20px',
                background: activeGrade === null ? '#8B0000' : '#fff',
                color: activeGrade === null ? '#fff' : '#555',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: activeGrade === null ? '700' : '500',
              }}
            >
              All
            </button>
            {gradeRange.map(g => {
              const count = subjects.filter(s => s.curriculum_id === activeCurrId && s.grade_level === g).length;
              return (
                <button
                  key={g}
                  onClick={() => setActiveGrade(g)}
                  style={{
                    padding: '5px 14px',
                    border: '1px solid',
                    borderColor: activeGrade === g ? '#8B0000' : '#dee2e6',
                    borderRadius: '20px',
                    background: activeGrade === g ? '#8B0000' : '#fff',
                    color: activeGrade === g ? '#fff' : '#555',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: activeGrade === g ? '700' : '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Gr. {g}
                  {count > 0 && (
                    <span style={{
                      background: activeGrade === g ? 'rgba(255,255,255,0.3)' : '#e9ecef',
                      borderRadius: '10px',
                      fontSize: '10px',
                      padding: '0 5px',
                      fontWeight: '700',
                    }}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Subjects Table Card ── */}
        <div className="card" style={{ borderRadius: activeCurriculum ? '0 0 8px 8px' : '0 0 8px 8px', borderTop: currPanel ? '1px solid #dee2e6' : 'none' }}>
          <div className="card-header">
            <h2 className="card-title">
              <IcoBook />
              {activeCurriculum
                ? `${activeCurriculum.name} Subjects${activeGrade ? ` — Grade ${activeGrade}` : ''}`
                : 'All Subjects'}
              <span style={{ marginLeft: '10px', fontSize: '13px', fontWeight: '400', color: '#888' }}>
                ({filteredSubjects.length})
              </span>
            </h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  className="search-input"
                  style={{ paddingRight: search ? '32px' : '10px', fontSize: '13px', minWidth: '180px' }}
                  placeholder="Search subjects..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    style={{
                      position: 'absolute', right: '8px',
                      background: '#e9ecef', border: 'none', color: '#666', cursor: 'pointer',
                      borderRadius: '50%', width: '20px', height: '20px',
                      fontSize: '11px', fontWeight: 'bold',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#8B0000'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#e9ecef'; e.currentTarget.style.color = '#666'; }}
                  >✕</button>
                )}
              </div>
              <button className="btn btn-primary" onClick={openAddSubject}>
                <IcoAdd /> Add Subject
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Subject Name</th>
                  <th>Curriculum</th>
                  <th>Grade Level</th>
                  <th>Semester</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingSubj ? (
                  <tr><td colSpan={8} className="empty-message">Loading...</td></tr>
                ) : filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="empty-message">
                      {activeCurrId ? 'No subjects found for this curriculum.' : 'No subjects found.'}
                      <button className="btn btn-primary" onClick={openAddSubject} style={{ marginLeft: '12px', padding: '5px 12px', fontSize: '12px' }}>
                        <IcoAdd /> Add Subject
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map(s => (
                    <tr key={s.subject_id}>
                      <td><span style={{ background: '#f0f0f0', borderRadius: '4px', padding: '2px 7px', fontSize: '12px', fontWeight: '700', color: '#555' }}>{s.subject_code ?? '—'}</span></td>
                      <td style={{ fontWeight: '600' }}>{s.subject_name}</td>
                      <td>
                        {s.curriculums?.name
                          ? <span style={{ fontSize: '12px', background: '#e8f4fd', color: '#1565c0', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>{s.curriculums.name}</span>
                          : <span style={{ color: '#aaa', fontSize: '12px' }}>—</span>}
                      </td>
                      <td>{s.grade_level ? `Grade ${s.grade_level}` : '—'}</td>
                      <td>{s.semester ?? '—'}</td>
                      <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.description ?? '—'}</td>
                      <td><StatusBadge status={s.status} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEditSubject(s)} title="Edit"><IcoEdit /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteSubj(s)} title="Delete"><IcoTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── Add / Edit Subject Modal ── */}
      {subjModal && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setSubjModal(false); }}>
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoBook /> {editSubj ? 'Edit Subject' : 'Add New Subject'}</h3>
              <button className="modal-close" onClick={() => setSubjModal(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleSaveSubject}>
              <div className="modal-body">
                {subjError && <p style={{ color: '#dc3545', marginBottom: '12px', fontSize: '14px' }}>{subjError}</p>}

                {/* Basic */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600', color: '#333', borderBottom: '2px solid #e9ecef', paddingBottom: '8px' }}>Basic Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Subject Name *</label>
                      <input value={subjForm.subject_name} onChange={e => setSubjForm(f => ({ ...f, subject_name: e.target.value }))} placeholder="e.g. Mathematics" />
                    </div>
                    <div className="form-group">
                      <label>Subject Code</label>
                      <input value={subjForm.subject_code} onChange={e => setSubjForm(f => ({ ...f, subject_code: e.target.value }))} placeholder="e.g. MATH7" />
                    </div>
                  </div>
                </div>

                {/* Curriculum & Grade */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600', color: '#333', borderBottom: '2px solid #e9ecef', paddingBottom: '8px' }}>Curriculum Classification</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Curriculum *</label>
                      <select value={subjForm.curriculum_id} onChange={e => setSubjForm(f => ({ ...f, curriculum_id: e.target.value, grade_level: '' }))}>
                        <option value="">Select curriculum</option>
                        {curriculums.filter(c => c.is_active).map(c => (
                          <option key={c.id} value={c.id}>{c.name} (Gr. {c.grade_level_start}–{c.grade_level_end})</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Grade Level *</label>
                      <select value={subjForm.grade_level} onChange={e => setSubjForm(f => ({ ...f, grade_level: e.target.value }))} disabled={!subjForm.curriculum_id}>
                        <option value="">{subjForm.curriculum_id ? 'Select grade' : 'Pick curriculum first'}</option>
                        {subjectGradeOptions.map(g => (
                          <option key={g} value={g}>Grade {g}</option>
                        ))}
                      </select>
                    </div>
                    {/* Semester — only shown for SHS (grade 11-12) */}
                    {Number(subjForm.grade_level) >= 11 && (
                      <div className="form-group">
                        <label>Semester</label>
                        <select value={subjForm.semester} onChange={e => setSubjForm(f => ({ ...f, semester: e.target.value }))}>
                          <option value="">— Any semester —</option>
                          <option value="1st Semester">1st Semester</option>
                          <option value="2nd Semester">2nd Semester</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600', color: '#333', borderBottom: '2px solid #e9ecef', paddingBottom: '8px' }}>Additional Information</h4>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={subjForm.description}
                      onChange={e => setSubjForm(f => ({ ...f, description: e.target.value }))}
                      rows={3}
                      placeholder="Brief description of the subject..."
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select value={subjForm.status} onChange={e => setSubjForm(f => ({ ...f, status: e.target.value }))}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSubjModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={subjSaving}>
                  {subjSaving ? 'Saving...' : editSubj ? 'Save Changes' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Subject Confirm ── */}
      {deleteSubj && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setDeleteSubj(null); }}>
          <div className="modal-content" style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoTrash /> Delete Subject</h3>
              <button className="modal-close" onClick={() => setDeleteSubj(null)}><IcoClose /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '15px', color: '#444' }}>
                Delete <strong>{deleteSubj.subject_name}</strong>? This cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteSubj(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteSubject}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Curriculum Confirm ── */}
      {deleteCurr && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setDeleteCurr(null); }}>
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoTrash /> Delete Curriculum</h3>
              <button className="modal-close" onClick={() => setDeleteCurr(null)}><IcoClose /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '15px', color: '#444' }}>
                Delete curriculum <strong>{deleteCurr.name}</strong>?<br />
                <span style={{ fontSize: '13px', color: '#888', marginTop: '8px', display: 'block' }}>
                  Subjects linked to this curriculum will have their curriculum unset (not deleted).
                </span>
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteCurr(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteCurriculum}>Delete Curriculum</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}