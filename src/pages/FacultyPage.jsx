import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

/* ── Icons ─────────────────────────────────────────────── */
function IcoFaculty() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IcoPrincipal() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}
function IcoDeptHead() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
function IcoAdviser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}
function IcoTeacher() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}
function IcoArchive() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}
function IcoRestore() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4" />
    </svg>
  );
}
function IcoAdd() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}
function IcoExport() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
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
function IcoView() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
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

/* ── Constants ─────────────────────────────────────────── */
const DEPARTMENTS = [
  'Elementary Department',
  'Junior High School',
  'Senior High School',
  'Administrative & Support Staff',
];

const POSITIONS = [
  'Principal / School Head',
  'Department Head',
  'Section Adviser',
  'Subject Teacher',
  'Registrar / Academic Head',
  'Finance / Cashier Officer',
  'Guidance Counselor',
];

const ROLES = ['Teacher', 'Adviser', 'Both', 'Administrator'];

const GRADE_LEVELS = [
  { value: 1,  label: 'Grade 1 (Elementary)' },
  { value: 2,  label: 'Grade 2 (Elementary)' },
  { value: 3,  label: 'Grade 3 (Elementary)' },
  { value: 4,  label: 'Grade 4 (Elementary)' },
  { value: 5,  label: 'Grade 5 (Elementary)' },
  { value: 6,  label: 'Grade 6 (Elementary)' },
  { value: 7,  label: 'Grade 7 (Junior High)' },
  { value: 8,  label: 'Grade 8 (Junior High)' },
  { value: 9,  label: 'Grade 9 (Junior High)' },
  { value: 10, label: 'Grade 10 (Junior High)' },
  { value: 11, label: 'Grade 11 (Senior High)' },
  { value: 12, label: 'Grade 12 (Senior High)' },
];

const EMPTY_FORM = {
  faculty_id:          '',
  first_name:          '',
  last_name:           '',
  middle_name:         '',
  email:               '',
  contact_number:      '',
  birthdate:           '',
  address:             '',
  department:          'Junior High School',
  position:            'Subject Teacher',
  role:                'Teacher',
  adviser_grade_level: '',
  subjects_taught:     '',
  employment_status:   'Active',
  hire_date:           '',
  is_archived:         false,
};

/* ── Main Faculty Page ─────────────────────────────────── */
export default function FacultyPage() {
  const { supabase, activeSchoolYear, activeQuarter } = useAuth();

  const [faculty, setFaculty]               = useState([]);
  const [sections, setSections]             = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [dbNotice, setDbNotice]             = useState('');

  // Filters
  const [deptFilter, setDeptFilter]         = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [statusTab, setStatusTab]           = useState('active'); // 'active' | 'archived' | 'all'
  const [search, setSearch]                 = useState('');

  // Modals
  const [modalOpen, setModalOpen]         = useState(false);
  const [viewFaculty, setViewFaculty]     = useState(null);
  const [editItem, setEditItem]           = useState(null);
  const [form, setForm]                   = useState(EMPTY_FORM);
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [showCustomInput, setShowCustomInput]       = useState(false);
  const [saving, setSaving]               = useState(false);
  const [formError, setFormError]         = useState('');
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null); // { faculty, shouldArchive }

  /* Fetch faculty, sections & subjects */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setDbNotice('');

    try {
      // 1. Fetch Faculty
      const { data: facData, error: facErr } = await supabase
        .from('faculty')
        .select('*')
        .order('last_name', { ascending: true });

      if (facErr) {
        setDbNotice(facErr.message);
        setFaculty([]);
      } else {
        setFaculty(facData ?? []);
      }

      // 2. Fetch Sections for advisory class lookup
      const { data: secData } = await supabase
        .from('sections')
        .select('id, grade_level, section_name, adviser_id, room_number')
        .eq('status', 'Active');
      setSections(secData ?? []);

      // 3. Fetch Subjects catalog for multi-select dropdown
      const { data: subData } = await supabase
        .from('subjects')
        .select('subject_id, subject_name, subject_code, grade_level')
        .order('subject_name', { ascending: true });
      setAvailableSubjects(subData ?? []);

    } catch (err) {
      setDbNotice(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* Stats calculation */
  const totalActive   = faculty.filter(f => !f.is_archived && (f.employment_status ?? 'Active').toLowerCase() !== 'archived').length;
  const principals    = faculty.filter(f => !f.is_archived && (f.position ?? '').toLowerCase().includes('principal')).length;
  const deptHeads     = faculty.filter(f => !f.is_archived && (f.position ?? '').toLowerCase().includes('head')).length;
  const advisers      = faculty.filter(f => !f.is_archived && ((f.role ?? '').toLowerCase() === 'adviser' || (f.role ?? '').toLowerCase() === 'both' || (f.position ?? '').toLowerCase().includes('adviser'))).length;
  const archivedCount = faculty.filter(f => f.is_archived || (f.employment_status ?? '').toLowerCase() === 'archived').length;

  /* Filtered Faculty List */
  const filteredFaculty = faculty.filter(f => {
    const isArch = f.is_archived === true || (f.employment_status ?? '').toLowerCase() === 'archived';

    // Status Tab filter
    if (statusTab === 'active' && isArch) return false;
    if (statusTab === 'archived' && !isArch) return false;

    // Department filter
    if (deptFilter && f.department !== deptFilter) return false;

    // Position filter
    if (positionFilter && f.position !== positionFilter) return false;

    // Search query
    if (search) {
      const searchLower = search.toLowerCase();
      const fullName = `${f.first_name || ''} ${f.middle_name || ''} ${f.last_name || ''}`.toLowerCase();
      const facId = (f.faculty_id ?? '').toLowerCase();
      const email = (f.email ?? '').toLowerCase();
      const subjects = (f.subjects_taught ?? '').toLowerCase();

      if (!fullName.includes(searchLower) && !facId.includes(searchLower) && !email.includes(searchLower) && !subjects.includes(searchLower)) {
        return false;
      }
    }

    return true;
  });

  /* Open Add Modal */
  function openAdd() {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  }

  /* Open Edit Modal */
  function openEdit(item) {
    setEditItem(item);
    setForm({
      faculty_id:          item.faculty_id          ?? '',
      first_name:          item.first_name          ?? '',
      last_name:           item.last_name           ?? '',
      middle_name:         item.middle_name         ?? '',
      email:               item.email               ?? '',
      contact_number:      item.contact_number      ?? '',
      birthdate:           item.birthdate           ?? '',
      address:             item.address             ?? '',
      department:          item.department          ?? 'Junior High School',
      position:            item.position            ?? 'Subject Teacher',
      role:                item.role                ?? 'Teacher',
      adviser_grade_level: item.adviser_grade_level ?? '',
      subjects_taught:     item.subjects_taught     ?? '',
      employment_status:   item.employment_status   ?? 'Active',
      hire_date:           item.hire_date           ?? '',
      is_archived:         item.is_archived         ?? false,
    });
    setFormError('');
    setModalOpen(true);
  }

  /* Subject multi-select helpers */
  function getSubjectList() {
    if (!form.subjects_taught) return [];
    return form.subjects_taught.split(',').map(s => s.trim()).filter(Boolean);
  }

  function handleAddSubject(subjectName) {
    if (!subjectName) return;
    const current = getSubjectList();
    if (!current.includes(subjectName)) {
      const updated = [...current, subjectName];
      setForm(f => ({ ...f, subjects_taught: updated.join(', ') }));
    }
  }

  function handleRemoveSubject(subjectName) {
    const current = getSubjectList();
    const updated = current.filter(s => s !== subjectName);
    setForm(f => ({ ...f, subjects_taught: updated.join(', ') }));
  }

  /* Handle Save / Update Faculty */
  async function handleSave(e) {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.position) {
      setFormError('First name, last name, and faculty position are required.');
      return;
    }

    setSaving(true);
    setFormError('');

    // Fallback email if empty so NOT NULL constraint doesn't fail
    const cleanFirstName = form.first_name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanLastName = form.last_name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const finalEmail = form.email && form.email.trim()
      ? form.email.trim()
      : `${cleanFirstName}.${cleanLastName}@absas.edu.ph`;

    const payload = {
      faculty_id:          form.faculty_id          || null,
      first_name:          form.first_name.trim(),
      last_name:           form.last_name.trim(),
      middle_name:         form.middle_name         ? form.middle_name.trim() : null,
      email:               finalEmail,
      contact_number:      form.contact_number      || null,
      birthdate:           form.birthdate           || null,
      address:             form.address             || null,
      department:          form.department          || null,
      position:            form.position            || 'Subject Teacher',
      role:                form.role                || 'Teacher',
      adviser_grade_level: form.adviser_grade_level ? Number(form.adviser_grade_level) : null,
      subjects_taught:     form.subjects_taught     || null,
      employment_status:   form.employment_status   || 'Active',
      hire_date:           form.hire_date           || null,
      is_archived:         form.employment_status === 'Archived' || form.is_archived === true,
    };

    async function executeSave(cleanPayload) {
      if (editItem) {
        return await supabase
          .from('faculty')
          .update(cleanPayload)
          .eq('faculty_record_id', editItem.faculty_record_id);
      } else {
        return await supabase.from('faculty').insert([cleanPayload]);
      }
    }

    try {
      let res = await executeSave(payload);

      // Resilient fallback if schema cache lacks optional columns or old check constraint is present
      if (res.error && res.error.message) {
        if (res.error.message.includes('faculty_adviser_grade_level_check')) {
          const fallback = { ...payload };
          fallback.adviser_grade_level = null;
          res = await executeSave(fallback);
        } else if (res.error.message.includes('faculty_department_check')) {
          const fallback = { ...payload };
          fallback.department = 'Junior High'; // Fallback to classic allowed department value
          res = await executeSave(fallback);
        } else if (res.error.message.includes('faculty_employment_status_check')) {
          const fallback = { ...payload };
          fallback.employment_status = 'Active'; // Fallback to classic allowed status value
          res = await executeSave(fallback);
        } else if (res.error.message.includes('schema cache') || res.error.message.includes('column')) {
          const fallback = { ...payload };
          delete fallback.is_archived;
          res = await executeSave(fallback);
        }
      }

      if (res.error) throw res.error;

      setModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.message || 'Error saving faculty record.');
    } finally {
      setSaving(false);
    }
  }

  /* Open Archive / Restore Modal */
  function openArchiveModal(fac, shouldArchive) {
    setArchiveTarget({ faculty: fac, shouldArchive });
  }

  async function confirmArchive() {
    if (!archiveTarget) return;
    const { faculty: fac, shouldArchive } = archiveTarget;
    try {
      await supabase
        .from('faculty')
        .update({
          is_archived: shouldArchive,
          employment_status: shouldArchive ? 'Archived' : 'Active',
        })
        .eq('faculty_record_id', fac.faculty_record_id);
      setArchiveTarget(null);
      fetchData();
    } catch (err) {
      console.error('Error archiving faculty:', err);
    }
  }

  /* Permanent Delete */
  async function handleDelete() {
    if (!deleteTarget) return;
    await supabase.from('faculty').delete().eq('faculty_record_id', deleteTarget.faculty_record_id);
    setDeleteTarget(null);
    fetchData();
  }

  /* Export CSV */
  function exportCSV() {
    const headers = ['Faculty ID', 'Full Name', 'Position', 'Department', 'Role', 'Adviser Grade', 'Subjects', 'Email', 'Contact', 'Status'];
    const rows = filteredFaculty.map(f => [
      f.faculty_id ?? f.faculty_record_id,
      `${f.first_name} ${f.middle_name ? f.middle_name + ' ' : ''}${f.last_name}`,
      f.position ?? 'Subject Teacher',
      f.department ?? 'Junior High School',
      f.role ?? 'Teacher',
      f.adviser_grade_level ? `Grade ${f.adviser_grade_level}` : '—',
      f.subjects_taught ?? '—',
      f.email ?? '—',
      f.contact_number ?? '—',
      f.employment_status ?? 'Active',
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `faculty_roster_${statusTab}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Top Header */}
      <div className="top-header">
        <h1><IcoFaculty /> Faculty &amp; Staff Directory</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#8B0000',
            color: '#FFD700',
            padding: '5px 12px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(139,0,0,0.15)',
          }}>
            <span>{activeSchoolYear?.year_label ? `S.Y. ${activeSchoolYear.year_label}` : 'S.Y. 2025-2026'}</span>
            {activeQuarter && (
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontSize: '11px' }}>
                {activeQuarter.quarter_name}
              </span>
            )}
          </div>
          <span className="date-time">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
        </div>
      </div>

      <div className="content-area">
        {/* Database Warning */}
        {dbNotice && (
          <div style={{ background: '#fff3cd', border: '1px solid #ffeeba', color: '#856404', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
            <strong>Notice:</strong> {dbNotice}
          </div>
        )}

        {/* Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><IcoFaculty /></div>
            <div className="stat-info">
              <div className="stat-number">{totalActive}</div>
              <div className="stat-label">Active Faculty &amp; Staff</div>
            </div>
          </div>
          <div className="stat-card" style={{ borderColor: '#8B0000' }}>
            <div className="stat-icon" style={{ color: '#8B0000' }}><IcoPrincipal /></div>
            <div className="stat-info">
              <div className="stat-number">{principals}</div>
              <div className="stat-label">School Heads &amp; Principals</div>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon"><IcoDeptHead /></div>
            <div className="stat-info">
              <div className="stat-number">{deptHeads}</div>
              <div className="stat-label">Department Heads</div>
            </div>
          </div>
          <div className="stat-card gold">
            <div className="stat-icon"><IcoAdviser /></div>
            <div className="stat-info">
              <div className="stat-number">{advisers}</div>
              <div className="stat-label">Class Advisers</div>
            </div>
          </div>
        </div>

        {/* Filters & Actions Card */}
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
            {/* Status View Switcher */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className={`btn btn-sm ${statusTab === 'active' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusTab('active')}
              >
                Active Faculty ({totalActive})
              </button>
              <button
                className={`btn btn-sm ${statusTab === 'archived' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusTab('archived')}
              >
                <IcoArchive /> Archived &amp; Retired ({archivedCount})
              </button>
              <button
                className={`btn btn-sm ${statusTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusTab('all')}
              >
                All Records ({faculty.length})
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary btn-sm" onClick={exportCSV}>
                <IcoExport /> Export CSV
              </button>
              <button className="btn btn-primary btn-sm" onClick={openAdd}>
                <IcoAdd /> Register Faculty Member
              </button>
            </div>
          </div>

          <div className="form-grid" style={{ alignItems: 'flex-end', marginTop: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Department</label>
              <select className="filter-select" style={{ width: '100%' }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                <option value="">All Departments</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Position</label>
              <select className="filter-select" style={{ width: '100%' }} value={positionFilter} onChange={e => setPositionFilter(e.target.value)}>
                <option value="">All Positions</option>
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Search Directory</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  className="search-input"
                  style={{ width: '100%', paddingRight: search ? '32px' : '10px' }}
                  placeholder="Name, Faculty ID, Email, Subjects..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      background: '#e9ecef',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: '1',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#8B0000'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#e9ecef'; e.currentTarget.style.color = '#666'; }}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Faculty Table */}
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Faculty ID</th>
                  <th>Faculty Name</th>
                  <th>Position &amp; Role</th>
                  <th>Department</th>
                  <th>Advisory / Teaching</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="empty-message">Loading faculty directory...</td></tr>
                ) : filteredFaculty.length === 0 ? (
                  <tr><td colSpan={8} className="empty-message">No faculty members found matching the filters.</td></tr>
                ) : (
                  filteredFaculty.map(f => {
                    const isArch = f.is_archived === true || (f.employment_status ?? '').toLowerCase() === 'archived';
                    const isPrincipal = (f.position ?? '').toLowerCase().includes('principal');
                    const isDeptHead = (f.position ?? '').toLowerCase().includes('head');

                    // Find assigned section
                    const advisedSection = sections.find(s => String(s.adviser_id) === String(f.faculty_record_id));

                    return (
                      <tr key={f.faculty_record_id} style={{ opacity: isArch ? 0.75 : 1 }}>
                        <td style={{ fontWeight: '700', color: '#8B0000' }}>{f.faculty_id ?? '—'}</td>
                        <td style={{ fontWeight: '600' }}>
                          {f.first_name} {f.middle_name ? f.middle_name[0] + '. ' : ''}{f.last_name}
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={isPrincipal ? styles.badgePrincipal : isDeptHead ? styles.badgeDeptHead : styles.badgePosition}>
                              {f.position || 'Subject Teacher'}
                            </span>
                            <span style={{ fontSize: '11px', color: '#666' }}>Role: {f.role || 'Teacher'}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', color: '#444' }}>{f.department || '—'}</span>
                        </td>
                        <td>
                          {advisedSection ? (
                            <span style={styles.badgeAdviser}>
                              Adviser: Gr {advisedSection.grade_level} - {advisedSection.section_name}
                            </span>
                          ) : f.adviser_grade_level ? (
                            <span style={styles.badgeAdviser}>Adviser: Grade {f.adviser_grade_level}</span>
                          ) : f.subjects_taught ? (
                            <span style={{ fontSize: '12px', color: '#333' }}>{f.subjects_taught}</span>
                          ) : (
                            <span style={{ color: '#aaa', fontSize: '12px' }}>—</span>
                          )}
                        </td>
                        <td>
                          <div style={{ fontSize: '12px' }}>
                            <div>{f.contact_number || '—'}</div>
                            <div style={{ color: '#777', fontSize: '11px' }}>{f.email || ''}</div>
                          </div>
                        </td>
                        <td><StatusBadge status={f.employment_status} isArchived={isArch} /></td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setViewFaculty(f)} title="View Profile">
                              <IcoView />
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(f)} title="Edit Record">
                              <IcoEdit />
                            </button>
                            {isArch ? (
                              <button className="btn btn-secondary btn-sm" onClick={() => openArchiveModal(f, false)} title="Restore Faculty">
                                <IcoRestore />
                              </button>
                            ) : (
                              <button className="btn btn-secondary btn-sm" onClick={() => openArchiveModal(f, true)} title="Archive Record">
                                <IcoArchive />
                              </button>
                            )}
                            <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(f)} title="Delete Record">
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

      </div>

      {/* ── View Profile Modal ── */}
      {viewFaculty && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setViewFaculty(null); }}>
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <IcoFaculty /> Faculty Profile: {viewFaculty.first_name} {viewFaculty.last_name}
              </h3>
              <button className="modal-close" onClick={() => setViewFaculty(null)}><IcoClose /></button>
            </div>
            <div className="modal-body" style={{ fontSize: '14px', lineHeight: '1.7' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px', paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                <div><span style={{ fontWeight: '600', color: '#8B0000' }}>Faculty ID:</span> {viewFaculty.faculty_id || 'Not assigned'}</div>
                <div><span style={{ fontWeight: '600', color: '#8B0000' }}>Position:</span> {viewFaculty.position || 'Subject Teacher'}</div>
                <div><span style={{ fontWeight: '600', color: '#8B0000' }}>Department:</span> {viewFaculty.department || '—'}</div>
                <div><span style={{ fontWeight: '600', color: '#8B0000' }}>Academic Role:</span> {viewFaculty.role || 'Teacher'}</div>
                <div><span style={{ fontWeight: '600', color: '#8B0000' }}>Advisory Grade:</span> {viewFaculty.adviser_grade_level ? `Grade ${viewFaculty.adviser_grade_level}` : 'None'}</div>
                <div><span style={{ fontWeight: '600', color: '#8B0000' }}>Employment Status:</span> {viewFaculty.employment_status || 'Active'}</div>
                <div><span style={{ fontWeight: '600', color: '#8B0000' }}>Date of Employment:</span> {viewFaculty.hire_date || '—'}</div>
                <div><span style={{ fontWeight: '600', color: '#8B0000' }}>Subjects Handled:</span> {viewFaculty.subjects_taught || '—'}</div>
              </div>

              <h4 style={{ margin: '14px 0 8px 0', color: '#8B0000' }}>Personal &amp; Contact Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                <div><span style={{ fontWeight: '600' }}>Email Address:</span> {viewFaculty.email || '—'}</div>
                <div><span style={{ fontWeight: '600' }}>Mobile Contact:</span> {viewFaculty.contact_number || '—'}</div>
                <div><span style={{ fontWeight: '600' }}>Birthdate:</span> {viewFaculty.birthdate || '—'}</div>
                <div style={{ gridColumn: '1 / -1' }}><span style={{ fontWeight: '600' }}>Home Address:</span> {viewFaculty.address || '—'}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewFaculty(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => { const target = viewFaculty; setViewFaculty(null); openEdit(target); }}>
                <IcoEdit /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Faculty Modal ── */}
      {modalOpen && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="modal-content" style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <IcoAdd /> {editItem ? 'Edit Faculty Member' : 'Register Faculty Member (First-Timer)'}
              </h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {formError && (
                  <div style={{ color: '#dc3545', background: '#f8d7da', padding: '10px 14px', borderRadius: '6px', marginBottom: '14px', fontSize: '13px' }}>
                    {formError}
                  </div>
                )}

                {/* Section 1: Identification */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#8B0000', borderBottom: '2px solid #e9ecef', paddingBottom: '6px' }}>
                    1. Faculty Identification
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Faculty ID (Permanent) *</label>
                      <input
                        value={form.faculty_id}
                        onChange={e => setForm(f => ({ ...f, faculty_id: e.target.value }))}
                        placeholder="e.g. FAC-2025-001"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Hire / Appointment Date</label>
                      <input type="date" value={form.hire_date} onChange={e => setForm(f => ({ ...f, hire_date: e.target.value }))} />
                    </div>
                  </div>
                </div>

                {/* Section 2: Personal Information */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#8B0000', borderBottom: '2px solid #e9ecef', paddingBottom: '6px' }}>
                    2. Personal Demographics
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label>Middle Name</label>
                      <input value={form.middle_name} onChange={e => setForm(f => ({ ...f, middle_name: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label>Birthdate</label>
                      <input type="date" value={form.birthdate} onChange={e => setForm(f => ({ ...f, birthdate: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="e.g. maria.santos@absas.edu.ph"
                      />
                    </div>
                    <div className="form-group">
                      <label>Mobile Contact Number</label>
                      <input value={form.contact_number} onChange={e => setForm(f => ({ ...f, contact_number: e.target.value }))} placeholder="09XX-XXX-XXXX" />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label>Residential Address</label>
                      <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Barangay, Municipality, Province" />
                    </div>
                  </div>
                </div>

                {/* Section 3: Academic Position & Department Hierarchy */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#8B0000', borderBottom: '2px solid #e9ecef', paddingBottom: '6px' }}>
                    3. Academic Position &amp; Department Hierarchy
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Faculty Position *</label>
                      <select value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} required>
                        {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Department Assigned *</label>
                      <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Role Designation *</label>
                      <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Advisory Grade Level (If Adviser)</label>
                      <select value={form.adviser_grade_level} onChange={e => setForm(f => ({ ...f, adviser_grade_level: e.target.value }))}>
                        <option value="">No Advisory Class</option>
                        {GRADE_LEVELS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Subjects Taught (Multi-Select Dropdown)</span>
                        <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                          {getSubjectList().length} subject(s) assigned
                        </span>
                      </label>

                      {/* Active Subject Pills */}
                      {getSubjectList().length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px', background: '#f8f9fa', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                          {getSubjectList().map((sub, idx) => (
                            <span
                              key={idx}
                              style={{
                                background: '#8B0000',
                                color: '#FFD700',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 1px 3px rgba(139,0,0,0.2)',
                              }}
                            >
                              {sub}
                              <button
                                type="button"
                                onClick={() => handleRemoveSubject(sub)}
                                style={{
                                  background: 'rgba(255,255,255,0.25)',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '16px',
                                  height: '16px',
                                  color: '#fff',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '10px',
                                  lineHeight: 1,
                                  padding: 0,
                                }}
                                title={`Remove ${sub}`}
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Subject Picker Controls */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <select
                          style={{ flex: '1', minWidth: '220px' }}
                          value=""
                          onChange={e => {
                            if (e.target.value) handleAddSubject(e.target.value);
                          }}
                        >
                          <option value="">+ Choose a subject from catalog to add...</option>
                          {availableSubjects.map(sub => {
                            const isSelected = getSubjectList().includes(sub.subject_name);
                            return (
                              <option key={sub.subject_id} value={sub.subject_name} disabled={isSelected}>
                                {isSelected ? '✓ ' : ''}{sub.subject_name} {sub.subject_code ? `(${sub.subject_code})` : ''} {sub.grade_level ? `• Gr ${sub.grade_level}` : ''}
                              </option>
                            );
                          })}
                        </select>

                        {/* Custom Subject Adder */}
                        {!showCustomInput ? (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setShowCustomInput(true)}
                          >
                            + Type Custom Subject
                          </button>
                        ) : (
                          <div style={{ display: 'flex', gap: '6px', flex: '1', minWidth: '240px' }}>
                            <input
                              placeholder="Enter subject name..."
                              value={customSubjectInput}
                              onChange={e => setCustomSubjectInput(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (customSubjectInput.trim()) {
                                    handleAddSubject(customSubjectInput.trim());
                                    setCustomSubjectInput('');
                                    setShowCustomInput(false);
                                  }
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                if (customSubjectInput.trim()) {
                                  handleAddSubject(customSubjectInput.trim());
                                  setCustomSubjectInput('');
                                  setShowCustomInput(false);
                                }
                              }}
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setCustomSubjectInput('');
                                setShowCustomInput(false);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Lifecycle & Employment Status */}
                <div style={{ marginBottom: '10px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#8B0000', borderBottom: '2px solid #e9ecef', paddingBottom: '6px' }}>
                    4. Employment Status &amp; Archiving
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Employment Status</label>
                      <select value={form.employment_status} onChange={e => setForm(f => ({ ...f, employment_status: e.target.value }))}>
                        <option value="Active">Active (Full-Time)</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Transferred">Transferred Out</option>
                        <option value="Retired">Retired</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving Record...' : editItem ? 'Save Changes' : 'Register Faculty Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Archive / Restore Confirm Modal ── */}
      {archiveTarget && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setArchiveTarget(null); }}>
          <div className="modal-content" style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {archiveTarget.shouldArchive ? (
                  <><IcoArchive /> Archive Faculty Member</>
                ) : (
                  <><IcoRestore /> Restore Faculty Member</>
                )}
              </h3>
              <button className="modal-close" onClick={() => setArchiveTarget(null)}><IcoClose /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '15px', color: '#222', lineHeight: '1.6' }}>
                Are you sure you want to {archiveTarget.shouldArchive ? 'archive' : 'restore'}{' '}
                <strong>{archiveTarget.faculty.first_name} {archiveTarget.faculty.last_name}</strong>?
              </p>
              <div style={{ fontSize: '13px', color: '#555', marginTop: '12px', background: '#f8f9fa', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e9ecef', lineHeight: '1.5' }}>
                {archiveTarget.shouldArchive ? (
                  <>
                    📦 <strong>Historical Preservation:</strong> Archiving removes the faculty member from active teaching rosters while <strong>permanently preserving</strong> past schedules, student grades they submitted, and class records.
                  </>
                ) : (
                  <>
                    🔄 <strong>Restoration:</strong> Restoring returns the faculty member back to active teaching assignments.
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setArchiveTarget(null)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={confirmArchive}
              >
                {archiveTarget.shouldArchive ? 'Yes, Archive Faculty' : 'Yes, Restore Faculty'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Permanent Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
          <div className="modal-content" style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoTrash /> Delete Faculty Record</h3>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}><IcoClose /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.6' }}>
                Are you sure you want to permanently delete <strong>{deleteTarget.first_name} {deleteTarget.last_name}</strong>?
              </p>
              <p style={{ fontSize: '12px', color: '#dc3545', marginTop: '8px' }}>
                💡 <em>Tip: If this teacher has retired or transferred, use the <strong>Archive</strong> button instead so historical student grades remain intact.</em>
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete Permanently</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Status Badge Subcomponent ── */
function StatusBadge({ status, isArchived }) {
  if (isArchived) return <span style={styles.badgeArchived}>Archived</span>;

  const s = (status ?? 'active').toLowerCase();
  if (s === 'active' || s === 'full-time') return <span style={styles.badgeActive}>Active</span>;
  if (s === 'part-time') return <span style={styles.badgePartTime}>Part-Time</span>;
  if (s === 'on leave') return <span style={styles.badgeOnLeave}>On Leave</span>;
  if (s === 'retired') return <span style={styles.badgeRetired}>Retired</span>;
  if (s === 'transferred') return <span style={styles.badgeTransferred}>Transferred</span>;
  return <span style={styles.badgeInactive}>{status ?? 'Active'}</span>;
}

/* ── Inline Styles ── */
const styles = {
  badgePrincipal: {
    display: 'inline-block',
    background: '#8B0000',
    color: '#FFD700',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    width: 'fit-content',
  },
  badgeDeptHead: {
    display: 'inline-block',
    background: '#e8f0fe',
    color: '#1a73e8',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    width: 'fit-content',
  },
  badgePosition: {
    display: 'inline-block',
    background: '#f1f3f4',
    color: '#333',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    width: 'fit-content',
  },
  badgeAdviser: {
    display: 'inline-block',
    background: '#fef7e0',
    color: '#b06000',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeActive: {
    display: 'inline-block',
    background: '#e6f4ea',
    color: '#137333',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgePartTime: {
    display: 'inline-block',
    background: '#e8f0fe',
    color: '#1a73e8',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeOnLeave: {
    display: 'inline-block',
    background: '#fef7e0',
    color: '#b06000',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeRetired: {
    display: 'inline-block',
    background: '#e8eaed',
    color: '#3c4043',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeTransferred: {
    display: 'inline-block',
    background: '#fef7e0',
    color: '#b06000',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeInactive: {
    display: 'inline-block',
    background: '#f1f3f4',
    color: '#5f6368',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
  },
  badgeArchived: {
    display: 'inline-block',
    background: '#f8d7da',
    color: '#721c24',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
};
