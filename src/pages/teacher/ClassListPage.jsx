import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

/* ── Icons ── */
function IcoStudents() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
function IcoAdd() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}
function IcoExport() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function IcoView() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IcoEdit() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function IcoTrash() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
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
function IcoSave() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

const GRADE_OPTIONS = Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: `Grade ${i + 1}` }));

const GRADE_COLORS = {
  1: '#e74c3c', 2: '#e67e22', 3: '#f1c40f', 4: '#2ecc71',
  5: '#1abc9c', 6: '#3498db', 7: '#9b59b6', 8: '#e91e63',
  9: '#00bcd4', 10: '#ff5722',
};

const EMPTY_FORM = {
  student_id: '', lrn_id: '', first_name: '', last_name: '', middle_name: '',
  grade_level: '', section_name: '', gender: '', age: '', birthdate: '',
  contact_number: '', guardian_name: '', guardian_contact: '', status: 'Active',
};

export default function ClassListPage() {
  const { supabase, profile } = useAuth();

  const [students, setStudents]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [gradeFilter, setGrade]     = useState('');
  const [genderFilter, setGender]   = useState('');
  const [search, setSearch]         = useState('');

  const [modalOpen, setModalOpen]   = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saved, setSaved]           = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('students').select('*').order('last_name');
    if (gradeFilter) q = q.eq('grade_level', Number(gradeFilter));
    if (genderFilter) q = q.eq('gender', genderFilter);
    if (search) q = q.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,student_id.ilike.%${search}%,lrn_id.ilike.%${search}%`);
    const { data } = await q;
    setStudents(data ?? []);
    setLoading(false);
  }, [supabase, gradeFilter, genderFilter, search]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  function openEdit(s) {
    setEditStudent(s);
    setForm({
      student_id:       s.student_id       ?? '',
      lrn_id:           s.lrn_id           ?? '',
      first_name:       s.first_name       ?? '',
      last_name:        s.last_name        ?? '',
      middle_name:      s.middle_name      ?? '',
      grade_level:      s.grade_level      ?? '',
      section_name:     s.section_name     ?? '',
      gender:           s.gender           ?? '',
      age:              s.age              ?? '',
      birthdate:        s.birthdate        ?? '',
      contact_number:   s.contact_number   ?? '',
      guardian_name:    s.guardian_name    ?? '',
      guardian_contact: s.guardian_contact ?? '',
      status:           s.status           ?? 'Active',
    });
    setFormError('');
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.first_name || !form.last_name) { setFormError('First and last name required.'); return; }
    setSaving(true);
    const payload = {
      ...form,
      grade_level: form.grade_level ? Number(form.grade_level) : null,
      age:         form.age         ? Number(form.age)         : null,
    };
    const { error } = await supabase.from('students').update(payload).eq('student_record_id', editStudent.student_record_id);
    if (error) { setFormError(error.message); setSaving(false); return; }
    setSaving(false);
    setModalOpen(false);
    fetchStudents();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await supabase.from('students').delete().eq('student_record_id', deleteTarget.student_record_id);
    setDeleteTarget(null);
    fetchStudents();
  }

  function exportCSV() {
    const headers = ['Student ID', 'LRN', 'Name', 'Grade', 'Section', 'Gender', 'Age', 'Contact', 'Guardian', 'Status'];
    const rows = students.map(s => [s.student_id, s.lrn_id, `${s.first_name} ${s.last_name}`, s.grade_level, s.section_name, s.gender, s.age, s.contact_number, s.guardian_name, s.status]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'class_list.csv'; a.click(); URL.revokeObjectURL(url);
  }

  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <>
      <div className="top-header">
        <h1><IcoStudents /> Student Informations</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">
        {/* Filters */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoFilter /> Filter Students</h2>
          </div>
          <div className="form-grid" style={{ alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Grade Level</label>
              <select className="filter-select" style={{ width: '100%' }} value={gradeFilter} onChange={e => setGrade(e.target.value)}>
                <option value="">All Grades</option>
                {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Gender</label>
              <select className="filter-select" style={{ width: '100%' }} value={genderFilter} onChange={e => setGender(e.target.value)}>
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Search</label>
              <input className="search-input" style={{ width: '100%' }} placeholder="Name, LRN, or ID..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoStudents /> All Students</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary btn-sm" onClick={() => { setEditStudent(null); setForm(EMPTY_FORM); setFormError(''); setModalOpen(true); }}>
                <IcoAdd /> Add Student
              </button>
              <button className="btn btn-secondary btn-sm" onClick={exportCSV}>
                <IcoExport /> Export
              </button>
            </div>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th><th>LRN</th><th>Name</th>
                  <th>Grade &amp; Section</th><th>Gender</th><th>Age</th>
                  <th>Guardian</th><th>Contact</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="empty-message">Loading...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={9} className="empty-message">No students found</td></tr>
                ) : students.map(s => (
                  <tr key={s.student_record_id}>
                    <td>{s.student_id ?? '—'}</td>
                    <td>{s.lrn_id ?? 'N/A'}</td>
                    <td style={{ fontWeight: '600' }}>{s.first_name} {s.last_name}</td>
                    <td>
                      {s.grade_level && (
                        <span style={{
                          backgroundColor: GRADE_COLORS[s.grade_level] ?? '#8B0000',
                          color: '#fff',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                        }}>
                          Grade {s.grade_level}{s.section_name ? ` - ${s.section_name.toUpperCase()}` : ''}
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                        {s.gender === 'Male' ? '♂' : s.gender === 'Female' ? '♀' : '—'} {s.gender ?? 'undefined'}
                      </span>
                    </td>
                    <td>{s.age ?? 'undefined'}</td>
                    <td>{s.guardian_name ?? 'N/A'}</td>
                    <td>{s.contact_number ?? 'N/A'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-secondary btn-sm" style={{ padding: '5px 8px' }} onClick={() => setViewStudent(s)} title="View"><IcoView /></button>
                        <button className="btn btn-secondary btn-sm" style={{ padding: '5px 8px' }} onClick={() => openEdit(s)} title="Edit"><IcoEdit /></button>
                        <button className="btn btn-danger btn-sm" style={{ padding: '5px 8px' }} onClick={() => setDeleteTarget(s)} title="Delete"><IcoTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Save button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
              <IcoSave /> {saved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewStudent && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setViewStudent(null); }}>
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoStudents /> Student Details</h3>
              <button className="modal-close" onClick={() => setViewStudent(null)}><IcoClose /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', fontSize: '14px' }}>
                {[
                  ['Student ID', viewStudent.student_id],
                  ['LRN', viewStudent.lrn_id],
                  ['Full Name', `${viewStudent.first_name} ${viewStudent.middle_name ? viewStudent.middle_name + ' ' : ''}${viewStudent.last_name}`],
                  ['Grade Level', viewStudent.grade_level ? `Grade ${viewStudent.grade_level}` : '—'],
                  ['Section', viewStudent.section_name],
                  ['Gender', viewStudent.gender],
                  ['Age', viewStudent.age],
                  ['Birthdate', viewStudent.birthdate],
                  ['Contact', viewStudent.contact_number],
                  ['Email', viewStudent.email],
                  ['Guardian', viewStudent.guardian_name],
                  ['Guardian Contact', viewStudent.guardian_contact],
                  ['Status', viewStudent.status],
                ].map(([label, val]) => (
                  <div key={label}>
                    <span style={{ color: '#8B0000', fontWeight: '600' }}>{label}: </span>
                    <span>{val ?? '—'}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewStudent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modalOpen && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoEdit /> {editStudent ? 'Edit Student' : 'Add Student'}</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {formError && <p style={{ color: '#dc3545', fontSize: '14px', marginBottom: '12px' }}>{formError}</p>}
                <div className="form-grid">
                  {[
                    ['Student ID', 'student_id', 'text', 'e.g. G01S001'],
                    ['LRN', 'lrn_id', 'text', 'Learner Reference Number'],
                    ['First Name *', 'first_name', 'text', 'First name'],
                    ['Middle Name', 'middle_name', 'text', 'Middle name'],
                    ['Last Name *', 'last_name', 'text', 'Last name'],
                    ['Age', 'age', 'number', 'Age'],
                    ['Birthdate', 'birthdate', 'date', ''],
                    ['Contact Number', 'contact_number', 'text', 'Contact'],
                    ['Guardian Name', 'guardian_name', 'text', 'Guardian full name'],
                    ['Guardian Contact', 'guardian_contact', 'text', 'Guardian contact'],
                  ].map(([label, field, type, placeholder]) => (
                    <div className="form-group" key={field}>
                      <label>{label}</label>
                      <input type={type} value={form[field]} placeholder={placeholder} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="form-group">
                    <label>Grade Level</label>
                    <select value={form.grade_level} onChange={e => setForm(f => ({ ...f, grade_level: e.target.value }))}>
                      <option value="">Select grade</option>
                      {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Section</label>
                    <input value={form.section_name} placeholder="Section name" onChange={e => setForm(f => ({ ...f, section_name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
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
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoTrash /> Delete Student</h3>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}><IcoClose /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '15px', color: '#444' }}>Delete <strong>{deleteTarget.first_name} {deleteTarget.last_name}</strong>? This cannot be undone.</p>
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
