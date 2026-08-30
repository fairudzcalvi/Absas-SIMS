import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

/* ── Icons ─────────────────────────────────────────────── */
function IcoStudents() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
function IcoMale() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="14" r="5" />
      <line x1="14.5" y1="9.5" x2="21" y2="3" />
      <polyline points="16 3 21 3 21 8" />
    </svg>
  );
}
function IcoFemale() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <line x1="12" y1="13" x2="12" y2="21" />
      <line x1="9" y1="18" x2="15" y2="18" />
    </svg>
  );
}
function IcoSHS() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
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
function IcoFilter() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
function IcoAddStudent() {
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
function IcoRestore() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4" />
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

/* ── Grade Level Definitions (Grades 1 to 12) ───────────── */
const GRADE_OPTIONS = [
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
  student_id:         '',
  first_name:         '',
  last_name:          '',
  middle_name:        '',
  lrn_id:             '',
  grade_level:        '',
  current_strand_id:  '',
  current_section_id: '',
  section_name:       '',
  scholarship_id:     '',
  student_type:       'Continuing',
  gender:             '',
  birthdate:          '',
  age:                '',
  email:              '',
  contact_number:     '',
  address:            '',
  guardian_name:      '',
  guardian_contact:   '',
  guardian_relation:  'Parent',
  status:             'Active',
  is_archived:        false,
};

/* ── Main Students Page ─────────────────────────────────── */
export default function StudentsPage() {
  const { supabase, activeSchoolYear, activeQuarter } = useAuth();

  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [strands, setStrands] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbNotice, setDbNotice] = useState('');

  // Filters
  const [gradeFilter, setGradeFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [statusTab, setStatusTab] = useState('active'); // 'active' | 'archived' | 'all'
  const [search, setSearch] = useState('');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null); // { student, shouldArchive }

  /* Fetch all supporting masterdata & students */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setDbNotice('');

    try {
      // 1. Fetch Students
      const { data: stuData, error: stuErr } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (stuErr) {
        setDbNotice(stuErr.message);
        setStudents([]);
      } else {
        setStudents(stuData ?? []);
      }

      // 2. Fetch Sections
      const { data: secData } = await supabase
        .from('sections')
        .select('id, grade_level, section_name, room_number, strand_id, status')
        .eq('status', 'Active')
        .order('section_name', { ascending: true });
      setSections(secData ?? []);

      // 3. Fetch SHS Strands
      const { data: strData } = await supabase
        .from('shs_strands')
        .select('id, strand_code, strand_name')
        .eq('status', 'Active')
        .order('strand_code', { ascending: true });
      setStrands(strData ?? []);

      // 4. Fetch Scholarships
      const { data: schData } = await supabase
        .from('scholarships')
        .select('id, name, code, discount_type, discount_value')
        .eq('is_active', true)
        .order('name', { ascending: true });
      setScholarships(schData ?? []);

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
  const totalActive   = students.filter(s => !s.is_archived && (s.status ?? 'Active').toLowerCase() !== 'archived').length;
  const maleActive    = students.filter(s => !s.is_archived && (s.gender ?? '').toLowerCase() === 'male').length;
  const femaleActive  = students.filter(s => !s.is_archived && (s.gender ?? '').toLowerCase() === 'female').length;
  const shsCount      = students.filter(s => !s.is_archived && Number(s.grade_level) >= 11).length;
  const archivedCount = students.filter(s => s.is_archived || (s.status ?? '').toLowerCase() === 'archived').length;

  /* Filtered students list */
  const filteredStudents = students.filter(s => {
    const isArchived = s.is_archived === true || (s.status ?? '').toLowerCase() === 'archived';

    // Status Tab filter
    if (statusTab === 'active' && isArchived) return false;
    if (statusTab === 'archived' && !isArchived) return false;

    // Grade filter
    if (gradeFilter && Number(s.grade_level) !== Number(gradeFilter)) return false;

    // Gender filter
    if (genderFilter && (s.gender ?? '').toLowerCase() !== genderFilter.toLowerCase()) return false;

    // Search query
    if (search) {
      const searchLower = search.toLowerCase();
      const fullName = `${s.first_name || ''} ${s.middle_name || ''} ${s.last_name || ''}`.toLowerCase();
      const studentId = (s.student_id ?? '').toLowerCase();
      const lrnId = (s.lrn_id ?? '').toLowerCase();
      const secName = (s.section_name ?? '').toLowerCase();

      if (!fullName.includes(searchLower) && !studentId.includes(searchLower) && !lrnId.includes(searchLower) && !secName.includes(searchLower)) {
        return false;
      }
    }

    return true;
  });

  /* Open Add Modal */
  function openAdd() {
    setEditStudent(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  }

  /* Open Edit Modal */
  function openEdit(student) {
    setEditStudent(student);
    setForm({
      student_id:         student.student_id         ?? '',
      first_name:         student.first_name         ?? '',
      last_name:          student.last_name          ?? '',
      middle_name:        student.middle_name        ?? '',
      lrn_id:             student.lrn_id             ?? '',
      grade_level:        student.grade_level        ?? '',
      current_strand_id:  student.current_strand_id  ?? '',
      current_section_id: student.current_section_id ?? '',
      section_name:       student.section_name       ?? '',
      scholarship_id:     student.scholarship_id     ?? '',
      student_type:       student.student_type       ?? 'Continuing',
      gender:             student.gender             ?? '',
      birthdate:          student.birthdate          ?? '',
      age:                student.age                ?? '',
      email:              student.email              ?? '',
      contact_number:     student.contact_number     ?? '',
      address:            student.address            ?? '',
      guardian_name:      student.guardian_name      ?? '',
      guardian_contact:   student.guardian_contact   ?? '',
      guardian_relation:  student.guardian_relation  ?? 'Parent',
      status:             student.status             ?? 'Active',
      is_archived:        student.is_archived        ?? false,
    });
    setFormError('');
    setModalOpen(true);
  }

  /* Handle Save / Update Student */
  async function handleSave(e) {
    e.preventDefault();
    if (!form.student_id || !form.first_name || !form.last_name || !form.grade_level || !form.gender) {
      setFormError('Student ID, first name, last name, grade level, and gender are required.');
      return;
    }
    if (form.lrn_id && form.lrn_id.length !== 12) {
      setFormError('Learner Reference Number (LRN) must be exactly 12 digits.');
      return;
    }
    if (Number(form.grade_level) >= 11 && !form.current_strand_id) {
      setFormError('Please select a Senior High School Strand for Grades 11 and 12.');
      return;
    }

    setSaving(true);
    setFormError('');

    // Determine section name if selected from dropdown
    let sectionDisplayName = form.section_name;
    if (form.current_section_id) {
      const matchedSec = sections.find(sec => String(sec.id) === String(form.current_section_id));
      if (matchedSec) sectionDisplayName = matchedSec.section_name;
    }

    const payload = {
      student_id:         form.student_id,
      first_name:         form.first_name,
      last_name:          form.last_name,
      middle_name:        form.middle_name        || null,
      lrn_id:             form.lrn_id             || null,
      grade_level:        Number(form.grade_level),
      current_strand_id:  Number(form.grade_level) >= 11 && form.current_strand_id ? form.current_strand_id : null,
      current_section_id: form.current_section_id || null,
      section_name:       sectionDisplayName     || null,
      scholarship_id:     form.scholarship_id     || null,
      student_type:       form.student_type       || 'Continuing',
      gender:             form.gender,
      birthdate:          form.birthdate          || null,
      age:                form.age                ? Number(form.age) : null,
      email:              form.email              || null,
      contact_number:     form.contact_number     || null,
      address:            form.address            || null,
      guardian_name:      form.guardian_name      || null,
      guardian_contact:   form.guardian_contact   || null,
      guardian_relation:  form.guardian_relation  || null,
      status:             form.status             || 'Active',
      is_archived:        form.status === 'Archived' || form.is_archived === true,
    };

    async function executeSave(cleanPayload) {
      if (editStudent) {
        return await supabase
          .from('students')
          .update(cleanPayload)
          .eq('student_record_id', editStudent.student_record_id);
      } else {
        return await supabase.from('students').insert([cleanPayload]);
      }
    }

    try {
      let res = await executeSave(payload);

      // If Supabase complains about a column not in schema cache / relation
      if (res.error && res.error.message && (res.error.message.includes('schema cache') || res.error.message.includes('column'))) {
        const fallbackPayload = { ...payload };
        delete fallbackPayload.address;
        delete fallbackPayload.guardian_relation;
        delete fallbackPayload.current_strand_id;
        delete fallbackPayload.current_section_id;
        delete fallbackPayload.scholarship_id;
        delete fallbackPayload.student_type;
        delete fallbackPayload.is_archived;

        res = await executeSave(fallbackPayload);
      }

      if (res.error) throw res.error;

      setModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.message || 'Error saving student record.');
    } finally {
      setSaving(false);
    }
  }

  /* Open Archive / Restore Modal */
  function openArchiveModal(student, shouldArchive) {
    setArchiveTarget({ student, shouldArchive });
  }

  async function confirmArchive() {
    if (!archiveTarget) return;
    const { student, shouldArchive } = archiveTarget;
    try {
      await supabase
        .from('students')
        .update({
          is_archived: shouldArchive,
          status: shouldArchive ? 'Archived' : 'Active',
        })
        .eq('student_record_id', student.student_record_id);
      setArchiveTarget(null);
      fetchData();
    } catch (err) {
      console.error('Error archiving student:', err);
    }
  }

  /* Permanent Delete */
  async function handleDelete() {
    if (!deleteTarget) return;
    await supabase.from('students').delete().eq('student_record_id', deleteTarget.student_record_id);
    setDeleteTarget(null);
    fetchData();
  }

  /* Export CSV */
  function exportCSV() {
    const headers = ['Student ID', 'LRN', 'Full Name', 'Grade Level', 'Strand', 'Section', 'Gender', 'Scholarship', 'Student Type', 'Status', 'Contact', 'Guardian'];
    const rows = filteredStudents.map(s => {
      const strandCode = strands.find(st => st.id === s.current_strand_id)?.strand_code || '—';
      const schName = scholarships.find(sc => sc.id === s.scholarship_id)?.name || 'None';
      return [
        s.student_id ?? s.student_record_id,
        s.lrn_id ?? '—',
        `${s.first_name} ${s.middle_name ? s.middle_name + ' ' : ''}${s.last_name}`,
        s.grade_level ? `Grade ${s.grade_level}` : '—',
        strandCode,
        s.section_name ?? '—',
        s.gender ?? '—',
        schName,
        s.student_type ?? 'Continuing',
        s.status ?? 'Active',
        s.contact_number ?? '—',
        s.guardian_name ?? '—',
      ];
    });
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `students_masterlist_${statusTab}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  // Filter sections dynamically for the current selected grade level in the modal
  const availableSections = sections.filter(sec => Number(sec.grade_level) === Number(form.grade_level));

  return (
    <>
      {/* Top Header */}
      <div className="top-header">
        <h1><IcoStudents /> Student Information & Records</h1>
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
            <span>📅 {activeSchoolYear?.year_label ? `S.Y. ${activeSchoolYear.year_label}` : 'S.Y. 2025-2026'}</span>
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
            <div className="stat-icon"><IcoStudents /></div>
            <div className="stat-info">
              <div className="stat-number">{totalActive}</div>
              <div className="stat-label">Active Enrollees</div>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon"><IcoMale /></div>
            <div className="stat-info">
              <div className="stat-number">{maleActive}</div>
              <div className="stat-label">Male Students</div>
            </div>
          </div>
          <div className="stat-card gold">
            <div className="stat-icon"><IcoFemale /></div>
            <div className="stat-info">
              <div className="stat-number">{femaleActive}</div>
              <div className="stat-label">Female Students</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#0056b3' }}><IcoSHS /></div>
            <div className="stat-info">
              <div className="stat-number">{shsCount}</div>
              <div className="stat-label">Senior High (Gr 11–12)</div>
            </div>
          </div>
        </div>

        {/* Filter & Action Card */}
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
            {/* Status View Switcher Tabs */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className={`btn btn-sm ${statusTab === 'active' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusTab('active')}
              >
                Active Students ({totalActive})
              </button>
              <button
                className={`btn btn-sm ${statusTab === 'archived' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusTab('archived')}
              >
                <IcoArchive /> Archived &amp; Graduated ({archivedCount})
              </button>
              <button
                className={`btn btn-sm ${statusTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusTab('all')}
              >
                All Records ({students.length})
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary btn-sm" onClick={exportCSV}>
                <IcoExport /> Export CSV
              </button>
              <button className="btn btn-primary btn-sm" onClick={openAdd}>
                <IcoAddStudent /> Add Student Record
              </button>
            </div>
          </div>

          <div className="form-grid" style={{ alignItems: 'flex-end', marginTop: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Grade Level</label>
              <select className="filter-select" style={{ width: '100%' }} value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}>
                <option value="">All Grade Levels (1–12)</option>
                {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Gender</label>
              <select className="filter-select" style={{ width: '100%' }} value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Search Student</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  className="search-input"
                  style={{ width: '100%', paddingRight: search ? '32px' : '10px' }}
                  placeholder="Name, LRN, Student ID, or Section..."
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

        {/* Students Table */}
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>DepEd LRN</th>
                  <th>Student Name</th>
                  <th>Grade &amp; Section</th>
                  <th>SHS Strand</th>
                  <th>Scholarship</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="empty-message">Loading student records...</td></tr>
                ) : filteredStudents.length === 0 ? (
                  <tr><td colSpan={9} className="empty-message">No student records found matching the filters.</td></tr>
                ) : (
                  filteredStudents.map(s => {
                    const strand = strands.find(st => st.id === s.current_strand_id);
                    const sch = scholarships.find(sc => sc.id === s.scholarship_id);
                    const isArch = s.is_archived === true || (s.status ?? '').toLowerCase() === 'archived';

                    return (
                      <tr key={s.student_record_id} style={{ opacity: isArch ? 0.75 : 1 }}>
                        <td style={{ fontWeight: '700', color: '#8B0000' }}>{s.student_id ?? '—'}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{s.lrn_id ?? '—'}</td>
                        <td style={{ fontWeight: '600' }}>
                          {s.first_name} {s.middle_name ? s.middle_name[0] + '. ' : ''}{s.last_name}
                        </td>
                        <td>
                          {s.grade_level ? `Grade ${s.grade_level}` : '—'}
                          {s.section_name ? ` - ${s.section_name}` : ''}
                        </td>
                        <td>
                          {strand ? (
                            <span style={styles.badgeNeutral}>{strand.strand_code}</span>
                          ) : Number(s.grade_level) >= 11 ? (
                            <span style={{ color: '#dc3545', fontSize: '12px' }}>Unassigned</span>
                          ) : (
                            <span style={{ color: '#aaa' }}>—</span>
                          )}
                        </td>
                        <td>
                          {sch ? (
                            <span style={styles.badgeScholarship}>{sch.code}</span>
                          ) : (
                            <span style={{ color: '#888', fontSize: '12px' }}>None</span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', color: '#555' }}>{s.student_type || 'Continuing'}</span>
                        </td>
                        <td><StatusBadge status={s.status} isArchived={isArch} /></td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setViewStudent(s)} title="View Profile">
                              <IcoView />
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)} title="Edit Record">
                              <IcoEdit />
                            </button>
                            {isArch ? (
                              <button className="btn btn-secondary btn-sm" onClick={() => openArchiveModal(s, false)} title="Restore Student">
                                <IcoRestore />
                              </button>
                            ) : (
                              <button className="btn btn-secondary btn-sm" onClick={() => openArchiveModal(s, true)} title="Archive Record">
                                <IcoArchive />
                              </button>
                            )}
                            <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(s)} title="Delete Record">
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
      {viewStudent && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setViewStudent(null); }}>
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <IcoStudents /> Student Profile: {viewStudent.first_name} {viewStudent.last_name}
              </h3>
              <button className="modal-close" onClick={() => setViewStudent(null)}><IcoClose /></button>
            </div>
            <div className="modal-body" style={{ fontSize: '14px', lineHeight: '1.7' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px', paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                <div><span style={{ fontWeight: '600', color: '#8B0000' }}>Student ID:</span> {viewStudent.student_id}</div>
                <div><span style={{ fontWeight: '600', color: '#8B0000' }}>DepEd LRN:</span> {viewStudent.lrn_id || 'Not provided'}</div>
                <div><span style={{ fontWeight: '600', color: '#8B0000' }}>Grade Level:</span> Grade {viewStudent.grade_level}</div>
                <div><span style={{ fontWeight: '600', color: '#8B0000' }}>Section:</span> {viewStudent.section_name || 'Unassigned'}</div>
                <div><span style={{ fontWeight: '600', color: '#8B0000' }}>Senior High Strand:</span> {strands.find(st => st.id === viewStudent.current_strand_id)?.strand_name || 'N/A'}</div>
                <div><span style={{ fontWeight: '600', color: '#8B0000' }}>Scholarship / Grant:</span> {scholarships.find(sc => sc.id === viewStudent.scholarship_id)?.name || 'None'}</div>
                <div><span style={{ fontWeight: '600', color: '#8B0000' }}>Student Category:</span> {viewStudent.student_type || 'Continuing'}</div>
                <div><span style={{ fontWeight: '600', color: '#8B0000' }}>Enrollment Status:</span> {viewStudent.status || 'Active'}</div>
              </div>

              <h4 style={{ margin: '14px 0 8px 0', color: '#8B0000' }}>Personal &amp; Contact Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                <div><span style={{ fontWeight: '600' }}>Gender:</span> {viewStudent.gender || '—'}</div>
                <div><span style={{ fontWeight: '600' }}>Birthdate:</span> {viewStudent.birthdate || '—'} ({viewStudent.age ? `${viewStudent.age} yrs` : '—'})</div>
                <div><span style={{ fontWeight: '600' }}>Email:</span> {viewStudent.email || '—'}</div>
                <div><span style={{ fontWeight: '600' }}>Contact #:</span> {viewStudent.contact_number || '—'}</div>
                <div style={{ gridColumn: '1 / -1' }}><span style={{ fontWeight: '600' }}>Home Address:</span> {viewStudent.address || '—'}</div>
              </div>

              <h4 style={{ margin: '14px 0 8px 0', color: '#8B0000' }}>Parent / Guardian Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                <div><span style={{ fontWeight: '600' }}>Guardian Name:</span> {viewStudent.guardian_name || '—'}</div>
                <div><span style={{ fontWeight: '600' }}>Relationship:</span> {viewStudent.guardian_relation || 'Parent'}</div>
                <div><span style={{ fontWeight: '600' }}>Emergency Contact:</span> {viewStudent.guardian_contact || '—'}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewStudent(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => { const target = viewStudent; setViewStudent(null); openEdit(target); }}>
                <IcoEdit /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Student Modal ── */}
      {modalOpen && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <IcoAddStudent /> {editStudent ? 'Edit Student Record' : 'Register Student (First-Timer / Continuing)'}
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

                {/* Section 1: Identification & Registration Type */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#8B0000', borderBottom: '2px solid #e9ecef', paddingBottom: '6px' }}>
                    1. DepEd Identification &amp; Enrollment Type
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Student ID (Permanent) *</label>
                      <input
                        value={form.student_id}
                        onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))}
                        placeholder="e.g. STU-2025-001"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>DepEd LRN (12 Digits)</label>
                      <input
                        value={form.lrn_id}
                        onChange={e => setForm(f => ({ ...f, lrn_id: e.target.value.replace(/\D/g, '') }))}
                        placeholder="12-digit Learner Reference Number"
                        maxLength={12}
                      />
                    </div>
                    <div className="form-group">
                      <label>Student Enrollment Type</label>
                      <select
                        value={form.student_type}
                        onChange={e => setForm(f => ({ ...f, student_type: e.target.value }))}
                      >
                        <option value="New Enrollee">New Enrollee (First Timer)</option>
                        <option value="Continuing">Continuing (Old Student)</option>
                        <option value="Transferee">Transferee</option>
                        <option value="Returnee">Returnee</option>
                      </select>
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
                      <label>Gender *</label>
                      <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} required>
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Birthdate (DD/MM/YYYY)</label>
                      <input type="date" value={form.birthdate} onChange={e => setForm(f => ({ ...f, birthdate: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Age</label>
                      <input type="number" min="3" max="30" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
                    </div>
                  </div>
                </div>

                {/* Section 3: Academic Placement & Section */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#8B0000', borderBottom: '2px solid #e9ecef', paddingBottom: '6px' }}>
                    3. Academic Placement &amp; Grants
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Grade Level (1–12) *</label>
                      <select
                        value={form.grade_level}
                        onChange={e => setForm(f => ({ ...f, grade_level: e.target.value, current_section_id: '', current_strand_id: '' }))}
                        required
                      >
                        <option value="">Select Grade Level...</option>
                        {GRADE_OPTIONS.map(g => (
                          <option key={g.value} value={g.value}>{g.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Section Selector */}
                    <div className="form-group">
                      <label>Assigned Section</label>
                      {availableSections.length > 0 ? (
                        <select
                          value={form.current_section_id}
                          onChange={e => {
                            const secId = e.target.value;
                            const secObj = sections.find(s => String(s.id) === String(secId));
                            setForm(f => ({
                              ...f,
                              current_section_id: secId,
                              section_name: secObj ? secObj.section_name : '',
                            }));
                          }}
                        >
                          <option value="">Select Section...</option>
                          {availableSections.map(sec => (
                            <option key={sec.id} value={sec.id}>
                              {sec.section_name} {sec.room_number ? `(${sec.room_number})` : ''}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          value={form.section_name}
                          onChange={e => setForm(f => ({ ...f, section_name: e.target.value }))}
                          placeholder="e.g. Diamond, Emerald"
                        />
                      )}
                    </div>

                    {/* SHS Strand (If Grade 11 or 12) */}
                    {Number(form.grade_level) >= 11 && (
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ color: '#0056b3', fontWeight: '600' }}>Senior High School (SHS) Strand *</label>
                        <select
                          value={form.current_strand_id}
                          onChange={e => setForm(f => ({ ...f, current_strand_id: e.target.value }))}
                          required
                        >
                          <option value="">Select SHS Strand...</option>
                          {strands.map(st => (
                            <option key={st.id} value={st.id}>{st.strand_code} — {st.strand_name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Scholarship / Grant */}
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label>Scholarship Grant / Discount Program</label>
                      <select
                        value={form.scholarship_id}
                        onChange={e => setForm(f => ({ ...f, scholarship_id: e.target.value }))}
                      >
                        <option value="">No Scholarship (Standard Tuition)</option>
                        {scholarships.map(sc => (
                          <option key={sc.id} value={sc.id}>
                            {sc.name} ({sc.discount_type === 'percentage' ? `${sc.discount_value}% OFF` : `₱${sc.discount_value} Subsidy`})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 4: Contact & Guardian Details */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#8B0000', borderBottom: '2px solid #e9ecef', paddingBottom: '6px' }}>
                    4. Contact &amp; Guardian Information
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Student Email</label>
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="student@gmail.com" />
                    </div>
                    <div className="form-group">
                      <label>Student Mobile Contact</label>
                      <input value={form.contact_number} onChange={e => setForm(f => ({ ...f, contact_number: e.target.value }))} placeholder="09XX-XXX-XXXX" />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label>Home Address</label>
                      <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Barangay, City, Province" />
                    </div>
                    <div className="form-group">
                      <label>Parent / Guardian Name</label>
                      <input value={form.guardian_name} onChange={e => setForm(f => ({ ...f, guardian_name: e.target.value }))} placeholder="Full Name" />
                    </div>
                    <div className="form-group">
                      <label>Relationship</label>
                      <select value={form.guardian_relation} onChange={e => setForm(f => ({ ...f, guardian_relation: e.target.value }))}>
                        <option value="Parent">Parent (Mother/Father)</option>
                        <option value="Guardian">Legal Guardian</option>
                        <option value="Grandparent">Grandparent</option>
                        <option value="Sibling">Elder Sibling</option>
                        <option value="Relative">Relative</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Guardian Emergency Contact</label>
                      <input value={form.guardian_contact} onChange={e => setForm(f => ({ ...f, guardian_contact: e.target.value }))} placeholder="09XX-XXX-XXXX" />
                    </div>
                  </div>
                </div>

                {/* Section 5: Account Status & Lifecycle */}
                <div style={{ marginBottom: '10px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#8B0000', borderBottom: '2px solid #e9ecef', paddingBottom: '6px' }}>
                    5. Student Lifecycle &amp; Archiving
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Status</label>
                      <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                        <option value="Active">Active Enrollee</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Graduated">Graduated (Completed)</option>
                        <option value="Transferred">Transferred Out</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving Record...' : editStudent ? 'Save Changes' : 'Register Student'}
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
                  <><IcoArchive /> Archive Student Record</>
                ) : (
                  <><IcoRestore /> Restore Student Record</>
                )}
              </h3>
              <button className="modal-close" onClick={() => setArchiveTarget(null)}><IcoClose /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '15px', color: '#222', lineHeight: '1.6' }}>
                Are you sure you want to {archiveTarget.shouldArchive ? 'archive' : 'restore'}{' '}
                <strong>{archiveTarget.student.first_name} {archiveTarget.student.last_name}</strong>?
              </p>
              <div style={{ fontSize: '13px', color: '#555', marginTop: '12px', background: '#f8f9fa', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e9ecef', lineHeight: '1.5' }}>
                {archiveTarget.shouldArchive ? (
                  <>
                    📦 <strong>What happens when archived:</strong> The student is removed from active class lists, but their full academic history, past grades, and payment receipts are <strong>permanently preserved</strong>.
                  </>
                ) : (
                  <>
                    🔄 <strong>What happens when restored:</strong> The student returns to the active enrollment roster.
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
                {archiveTarget.shouldArchive ? 'Yes, Archive Student' : 'Yes, Restore Student'}
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
              <h3 className="modal-title"><IcoTrash /> Delete Student Record</h3>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}><IcoClose /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.6' }}>
                Are you sure you want to permanently delete <strong>{deleteTarget.first_name} {deleteTarget.last_name}</strong>?
              </p>
              <p style={{ fontSize: '12px', color: '#dc3545', marginTop: '8px' }}>
                💡 <em>Tip: If this student has graduated or transferred, use the <strong>Archive</strong> button instead to preserve their historical transcript.</em>
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
  if (s === 'active') return <span style={styles.badgeActive}>Active</span>;
  if (s === 'graduated') return <span style={styles.badgeGraduated}>Graduated</span>;
  if (s === 'transferred') return <span style={styles.badgeTransferred}>Transferred</span>;
  if (s === 'inactive') return <span style={styles.badgeInactive}>Inactive</span>;
  return <span style={styles.badgeInactive}>{status ?? 'Active'}</span>;
}

/* ── Inline Styles ── */
const styles = {
  badgeActive: {
    display: 'inline-block',
    background: '#e6f4ea',
    color: '#137333',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeGraduated: {
    display: 'inline-block',
    background: '#e8f0fe',
    color: '#1a73e8',
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
  badgeNeutral: {
    display: 'inline-block',
    background: '#e8f0fe',
    color: '#1a73e8',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeScholarship: {
    display: 'inline-block',
    background: '#e6f4ea',
    color: '#0d652d',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
  },
};
