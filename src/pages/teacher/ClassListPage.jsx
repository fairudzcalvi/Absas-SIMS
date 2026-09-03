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
  const { supabase } = useAuth();

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

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      let q = supabase.from('students').select('*').order('last_name');
      if (gradeFilter) q = q.eq('grade_level', Number(gradeFilter));
      if (genderFilter) q = q.eq('gender', genderFilter);
      if (search) q = q.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,student_id.ilike.%${search}%,lrn_id.ilike.%${search}%`);
      const { data } = await q;
      if (!ignore) {
        setStudents(data ?? []);
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [supabase, gradeFilter, genderFilter, search]);

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
      photo_url:        s.photo_url        ?? '',
    });
    setFormError('');
    setModalOpen(true);
  }

  /* Handle Student Photo Upload */
  function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo file is too large. Please select an image under 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setForm(f => ({ ...f, photo_url: dataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.first_name || !form.last_name) { setFormError('First and last name required.'); return; }
    setSaving(true);
    const cleanId = form.student_id || (form.lrn_id ? form.lrn_id : `STU-${Date.now()}`);
    const payload = {
      ...form,
      student_id:  cleanId,
      grade_level: form.grade_level ? Number(form.grade_level) : null,
      age:         form.age         ? Number(form.age)         : null,
      photo_url:   form.photo_url   || null,
    };
    if (editStudent) {
      const { error } = await supabase.from('students').update(payload).eq('student_record_id', editStudent.student_record_id);
      if (error) { setFormError(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('students').insert([payload]);
      if (error) { setFormError(error.message); setSaving(false); return; }
    }
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
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  className="search-input"
                  style={{ width: '100%', paddingRight: search ? '32px' : '10px' }}
                  placeholder="Name, LRN, or ID..."
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
                  <th>DepEd LRN</th><th>Name</th>
                  <th>Grade &amp; Section</th><th>Gender</th><th>Age</th>
                  <th>Guardian</th><th>Contact</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="empty-message">Loading...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={8} className="empty-message">No students found</td></tr>
                ) : students.map(s => (
                  <tr key={s.student_record_id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#8B0000' }}>{s.lrn_id || s.student_id || '—'}</td>
                    <td style={{ fontWeight: '600' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          border: '1.5px solid #8B0000',
                          backgroundColor: '#fff8f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0,
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: '#8B0000'
                        }}>
                          {s.photo_url ? (
                            <img src={s.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            `${s.first_name?.[0] ?? ''}${s.last_name?.[0] ?? ''}`
                          )}
                        </div>
                        <span>{s.first_name} {s.middle_name ? s.middle_name[0] + '. ' : ''}{s.last_name}</span>
                      </div>
                    </td>
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
              {/* Photo Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 16px',
                backgroundColor: '#fff8f6',
                border: '1px solid #f2dede',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '8px',
                  border: '2px solid #8B0000',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                  flexShrink: 0
                }}>
                  {viewStudent.photo_url ? (
                    <img src={viewStudent.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#8B0000', fontSize: '10px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      <span>No Photo</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#8B0000', fontSize: '16px' }}>
                    {viewStudent.first_name} {viewStudent.middle_name ? viewStudent.middle_name + ' ' : ''}{viewStudent.last_name}
                  </h4>
                  <div style={{ fontSize: '12px', color: '#555' }}>
                    <strong>DepEd LRN:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#8B0000' }}>{viewStudent.lrn_id || 'Not assigned'}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', fontSize: '14px' }}>
                {[
                  ['DepEd LRN', viewStudent.lrn_id || viewStudent.student_id || 'N/A'],
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

                {/* Photo Upload Section */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 16px',
                  backgroundColor: '#fff8f6',
                  border: '1px solid #f2dede',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '8px',
                    border: '2px solid #8B0000',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    flexShrink: 0,
                  }}>
                    {form.photo_url ? (
                      <img src={form.photo_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#8B0000', fontSize: '10px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                        <span>No Photo</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#8B0000', marginBottom: '2px' }}>
                      Student ID Picture (Portrait)
                    </label>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                      Upload student 2x2 portrait photo.
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                        Upload Photo
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                      </label>
                      {form.photo_url && (
                        <button type="button" className="btn btn-sm" style={{ background: '#dc3545', color: '#fff', border: 'none' }} onClick={() => setForm(f => ({ ...f, photo_url: '' }))}>
                          ✕ Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-grid">
                  {[
                    ['DepEd LRN (12 Digits)', 'lrn_id', 'text', 'Learner Reference Number'],
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
