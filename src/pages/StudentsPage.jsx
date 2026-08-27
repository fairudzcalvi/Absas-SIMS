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
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="14" r="5" />
      <line x1="14.5" y1="9.5" x2="21" y2="3" />
      <polyline points="16 3 21 3 21 8" />
    </svg>
  );
}
function IcoFemale() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <line x1="12" y1="13" x2="12" y2="21" />
      <line x1="9" y1="18" x2="15" y2="18" />
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
function IcoClose() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── Constants ─────────────────────────────────────────── */
const GRADE_OPTIONS = [
  { value: 1,  label: 'Grade 1'  },
  { value: 2,  label: 'Grade 2'  },
  { value: 3,  label: 'Grade 3'  },
  { value: 4,  label: 'Grade 4'  },
  { value: 5,  label: 'Grade 5'  },
  { value: 6,  label: 'Grade 6'  },
  { value: 7,  label: 'Grade 7'  },
  { value: 8,  label: 'Grade 8'  },
  { value: 9,  label: 'Grade 9'  },
  { value: 10, label: 'Grade 10' },
];

const EMPTY_FORM = {
  student_id:       '',
  first_name:       '',
  last_name:        '',
  middle_name:      '',
  lrn_id:           '',
  grade_level:      '',
  section_name:     '',
  gender:           '',
  birthdate:        '',
  age:              '',
  email:            '',
  contact_number:   '',
  guardian_name:    '',
  guardian_contact: '',
  status:           'Active',
};

/* ── Page ──────────────────────────────────────────────── */
export default function StudentsPage() {
  const { supabase } = useAuth();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null); // null = add mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);

  /* fetch */
  const fetchStudents = useCallback(async () => {
  setLoading(true);
  
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching students:", error);
    setStudents([]);
  } else {
    setStudents(data);
  }
  
  setLoading(false);
}, [supabase]);

  /* Initial fetch on mount */
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  /* derived stats */
  const total   = students.length;
  const males   = students.filter(s => (s.gender ?? '').toLowerCase() === 'male').length;
  const females = students.filter(s => (s.gender ?? '').toLowerCase() === 'female').length;

  /* filtered students */
  const filteredStudents = students.filter(s => {
    // Grade filter
    if (gradeFilter && s.grade_level !== Number(gradeFilter)) return false;
    
    // Gender filter
    if (genderFilter && (s.gender ?? '').toLowerCase() !== genderFilter.toLowerCase()) return false;
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      const fullName = `${s.first_name} ${s.middle_name ? s.middle_name + ' ' : ''}${s.last_name}`.toLowerCase();
      const studentId = (s.student_id ?? '').toLowerCase();
      const lrnId = (s.lrn_id ?? '').toLowerCase();
      
      if (!fullName.includes(searchLower) && 
          !studentId.includes(searchLower) && 
          !lrnId.includes(searchLower)) {
        return false;
      }
    }
    
    return true;
  });

  /* open add modal */
  function openAdd() {
    setEditStudent(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  }

  /* open edit modal */
  function openEdit(student) {
    setEditStudent(student);
    setForm({
      student_id:       student.student_id       ?? '',
      first_name:       student.first_name       ?? '',
      last_name:        student.last_name        ?? '',
      middle_name:      student.middle_name      ?? '',
      lrn_id:           student.lrn_id           ?? '',
      grade_level:      student.grade_level      ?? '',
      section_name:     student.section_name     ?? '',
      gender:           student.gender           ?? '',
      birthdate:        student.birthdate        ?? '',
      age:              student.age              ?? '',
      email:            student.email            ?? '',
      contact_number:   student.contact_number   ?? '',
      guardian_name:    student.guardian_name    ?? '',
      guardian_contact: student.guardian_contact ?? '',
      status:           student.status           ?? 'Active',
    });
    setFormError('');
    setModalOpen(true);
  }

  /* save */
  async function handleSave(e) {
    e.preventDefault();
    if (!form.student_id || !form.first_name || !form.last_name || !form.grade_level || !form.gender) {
      setFormError('Student ID, first name, last name, grade level, and gender are required.');
      return;
    }
    if (form.lrn_id && form.lrn_id.length !== 12) {
      setFormError('LRN must be exactly 12 digits.');
      return;
    }
    setSaving(true);
    setFormError('');

    const payload = {
      student_id:       form.student_id,
      first_name:       form.first_name,
      last_name:        form.last_name,
      middle_name:      form.middle_name      || null,
      lrn_id:           form.lrn_id           || null,
      grade_level:      Number(form.grade_level),
      section_name:     form.section_name     || null,
      gender:           form.gender,
      birthdate:        form.birthdate        || null,
      age:              form.age              ? Number(form.age) : null,
      email:            form.email            || null,
      contact_number:   form.contact_number   || null,
      guardian_name:    form.guardian_name    || null,
      guardian_contact: form.guardian_contact || null,
      status:           form.status,
    };

    if (editStudent) {
      const { error } = await supabase
        .from('students')
        .update(payload)
        .eq('student_record_id', editStudent.student_record_id);
      if (error) { setFormError(error.message); setSaving(false); return; }
    } else {
      // Do not include student_record_id — it's SERIAL auto-generated
      const { error } = await supabase.from('students').insert([payload]);
      if (error) { setFormError(error.message); setSaving(false); return; }
    }

    setSaving(false);
    setModalOpen(false);
    fetchStudents();
  }

  /* delete */
  async function handleDelete() {
    if (!deleteTarget) return;
    await supabase.from('students').delete().eq('student_record_id', deleteTarget.student_record_id);
    setDeleteTarget(null);
    fetchStudents();
  }

  /* export CSV */
  function exportCSV() {
    const headers = ['Student ID', 'LRN', 'Name', 'Grade', 'Section', 'Gender', 'Age', 'Contact', 'Guardian', 'Status'];
    const rows = students.map(s => [
      s.student_id ?? s.student_record_id,
      s.lrn_id,
      `${s.first_name} ${s.last_name}`,
      s.grade_level, s.section_name,
      s.gender, s.age, s.contact_number, s.guardian_name, s.status,
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'students.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Header */}
      <div className="top-header">
        <h1><IcoStudents /> Student Records</h1>
        <span className="date-time">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
      </div>

      <div className="content-area">

        {/* Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><IcoStudents /></div>
            <div className="stat-info">
              <div className="stat-number">{total}</div>
              <div className="stat-label">Total Students</div>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon"><IcoMale /></div>
            <div className="stat-info">
              <div className="stat-number">{males}</div>
              <div className="stat-label">Male Students</div>
            </div>
          </div>
          <div className="stat-card gold">
            <div className="stat-icon"><IcoFemale /></div>
            <div className="stat-info">
              <div className="stat-number">{females}</div>
              <div className="stat-label">Female Students</div>
            </div>
          </div>
        </div>

        {/* Filter Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoFilter /> Filter Students</h2>
            <button className="btn btn-primary" onClick={openAdd}>
              <IcoAddStudent /> Add Student
            </button>
          </div>
          <div className="form-grid" style={{ alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Grade Level</label>
              <select className="filter-select" style={{ width: '100%' }} value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}>
                <option value="">All Grades</option>
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
              <label>Search</label>
              <input
                className="search-input"
                style={{ width: '100%' }}
                placeholder="Name, LRN, or Student ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Students</h2>
            <button className="btn btn-secondary btn-sm" onClick={exportCSV}>
              <IcoExport /> Export
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>LRN</th>
                  <th>Name</th>
                  <th>Grade &amp; Section</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="empty-message">Loading...</td></tr>
                ) : filteredStudents.length === 0 ? (
                  <tr><td colSpan={9} className="empty-message">No students found</td></tr>
                ) : (
                  filteredStudents.map(s => (
                    <tr key={s.student_record_id}>
                      <td>{s.student_id ?? '—'}</td>
                      <td>{s.lrn_id ?? '—'}</td>
                      <td>{s.first_name} {s.middle_name ? s.middle_name[0] + '. ' : ''}{s.last_name}</td>
                      <td>{s.grade_level ? `Grade ${s.grade_level}` : '—'} {s.section_name}</td>
                      <td>{s.gender}</td>
                      <td>{s.age ?? '—'}</td>
                      <td>{s.contact_number ?? '—'}</td>
                      <td><StatusBadge status={s.status} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)} title="Edit">
                            <IcoEdit />
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(s)} title="Delete">
                            <IcoTrash />
                          </button>
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

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <IcoAddStudent /> {editStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {formError && (
                  <p style={{ color: '#dc3545', marginBottom: '12px', fontSize: '14px' }}>{formError}</p>
                )}
                
                {/* Identification Section */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#333', borderBottom: '2px solid #e9ecef', paddingBottom: '8px' }}>
                    Identification
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Student ID *</label>
                      <input value={form.student_id} onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))} placeholder="e.g. STU-001" />
                    </div>
                    <div className="form-group">
                      <label>LRN</label>
                      <input 
                        value={form.lrn_id} 
                        onChange={e => {
                          const value = e.target.value.replace(/\D/g, '');
                          setForm(f => ({ ...f, lrn_id: value }));
                        }} 
                        placeholder="Learner Reference Number (12 digits)" 
                        maxLength={12}
                      />
                    </div>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#333', borderBottom: '2px solid #e9ecef', paddingBottom: '8px' }}>
                    Personal Information
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} placeholder="First name" />
                    </div>
                    <div className="form-group">
                      <label>Middle Name</label>
                      <input value={form.middle_name} onChange={e => setForm(f => ({ ...f, middle_name: e.target.value }))} placeholder="Middle name" />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} placeholder="Last name" />
                    </div>
                    <div className="form-group">
                      <label>Gender *</label>
                      <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Birthdate</label>
                      <input type="date" value={form.birthdate} onChange={e => setForm(f => ({ ...f, birthdate: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Age</label>
                      <input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="Age" min="3" max="25" />
                    </div>
                  </div>
                </div>

                {/* Academic Information Section */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#333', borderBottom: '2px solid #e9ecef', paddingBottom: '8px' }}>
                    Academic Information
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Grade Level *</label>
                      <select value={form.grade_level} onChange={e => setForm(f => ({ ...f, grade_level: e.target.value }))}>
                        <option value="">Select grade</option>
                        {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Section</label>
                      <input value={form.section_name} onChange={e => setForm(f => ({ ...f, section_name: e.target.value }))} placeholder="Section name" />
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#333', borderBottom: '2px solid #e9ecef', paddingBottom: '8px' }}>
                    Contact Information
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email address" />
                    </div>
                    <div className="form-group">
                      <label>Contact Number</label>
                      <input value={form.contact_number} onChange={e => setForm(f => ({ ...f, contact_number: e.target.value }))} placeholder="Contact number" />
                    </div>
                  </div>
                </div>

                {/* Guardian Information Section */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#333', borderBottom: '2px solid #e9ecef', paddingBottom: '8px' }}>
                    Guardian Information
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Guardian Name</label>
                      <input value={form.guardian_name} onChange={e => setForm(f => ({ ...f, guardian_name: e.target.value }))} placeholder="Guardian full name" />
                    </div>
                    <div className="form-group">
                      <label>Guardian Contact</label>
                      <input value={form.guardian_contact} onChange={e => setForm(f => ({ ...f, guardian_contact: e.target.value }))} placeholder="Guardian contact number" />
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#333', borderBottom: '2px solid #e9ecef', paddingBottom: '8px' }}>
                    Enrollment Status
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Status</label>
                      <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Transferred">Transferred</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editStudent ? 'Save Changes' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
          <div className="modal-content" style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoTrash /> Delete Student</h3>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}><IcoClose /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '15px', color: '#444' }}>
                Are you sure you want to delete <strong>{deleteTarget.first_name} {deleteTarget.last_name}</strong>? This cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Sub-components ── */
function StatusBadge({ status }) {
  const s = (status ?? 'active').toLowerCase();
  const cls =
    s === 'active'      ? 'badge badge-success' :
    s === 'inactive'    ? 'badge badge-warning' :
    s === 'graduated'   ? 'badge badge-info'    :
    s === 'transferred' ? 'badge badge-info'    :
                          'badge badge-info';
  return <span className={cls}>{status ?? 'Active'}</span>;
}
