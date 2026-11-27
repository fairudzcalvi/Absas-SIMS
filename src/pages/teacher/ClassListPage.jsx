import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { cleanSectionName } from '../../utils/formatters';

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
function IcoClose() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const GRADE_OPTIONS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `Grade ${i + 1}` }));

const GRADE_COLORS = {
  1: '#e74c3c', 2: '#e67e22', 3: '#f1c40f', 4: '#2ecc71',
  5: '#1abc9c', 6: '#3498db', 7: '#9b59b6', 8: '#e91e63',
  9: '#00bcd4', 10: '#ff5722', 11: '#673ab7', 12: '#3f51b5',
};

const EMPTY_FORM = {
  student_id: '', lrn_id: '', first_name: '', last_name: '', middle_name: '',
  grade_level: '', section_name: '', gender: '', age: '', birthdate: '',
  contact_number: '', guardian_name: '', guardian_contact: '', status: 'Active',
};

export default function ClassListPage() {
  const { supabase, selectedSchoolYear, activeSchoolYear, isHistoricalYear } = useAuth();
  const currentSy = selectedSchoolYear || activeSchoolYear;

  const [students, setStudents]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [gradeFilter, setGrade]         = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [sectionsList, setSectionsList]   = useState([]);
  const [genderFilter, setGender]       = useState('');
  const [search, setSearch]             = useState('');

  const [modalOpen, setModalOpen]   = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState('');

  useEffect(() => {
    async function loadSections() {
      try {
        let secQuery = supabase.from('sections').select('*').order('grade_level');
        if (currentSy?.id) {
          secQuery = secQuery.eq('school_year_id', currentSy.id);
        }
        const { data } = await secQuery;
        setSectionsList(data ?? []);
      } catch (err) {
        console.error('Error fetching sections:', err);
      }
    }
    loadSections();
  }, [supabase, currentSy]);

  const loadStudentsList = useCallback(async () => {
    const excludedStatuses = ['archived', 'inactive', 'dropped', 'transferred', 'transferred out', 'graduated'];
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('last_name');
    if (error) {
      console.error('Error loading class list:', error);
      return [];
    }

    let list = data ?? [];
    if (currentSy?.id) {
      const [{ data: enrRows }, { data: sySecs }] = await Promise.all([
        supabase.from('enrollments').select('student_record_id, grade_level, section_id, enrollment_status').eq('school_year_id', currentSy.id),
        supabase.from('sections').select('id, section_name').eq('school_year_id', currentSy.id),
      ]);
      const activeEnrs = (enrRows || []).filter(e => !['Dropped', 'Transferred Out'].includes(e.enrollment_status));
      if (activeEnrs.length > 0 || isHistoricalYear) {
        const secById = new Map((sySecs || []).map(sc => [String(sc.id), sc.section_name]));
        const enrByStu = new Map(activeEnrs.map(e => [e.student_record_id, e]));
        list = list
          .filter(s => enrByStu.has(s.student_record_id))
          .map(s => {
            const e = enrByStu.get(s.student_record_id);
            const secName = e.section_id ? secById.get(String(e.section_id)) : null;
            return {
              ...s,
              grade_level: e.grade_level ?? s.grade_level,
              section_name: secName || (isHistoricalYear ? '' : s.section_name),
            };
          });
      }
    }

    list = list.filter(s => {
      if (!isHistoricalYear && (s.is_archived || excludedStatuses.includes((s.status || 'Active').toLowerCase()))) {
        return false;
      }
      if (gradeFilter && Number(s.grade_level) !== Number(gradeFilter)) return false;
      if (genderFilter && s.gender !== genderFilter) return false;
      if (sectionFilter) {
        const cleanSec = s.section_name ? cleanSectionName(s.section_name, s.grade_level).toLowerCase().trim() : '';
        if (cleanSec !== sectionFilter.toLowerCase().trim()) return false;
      }
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = [s.first_name, s.middle_name, s.last_name, `${s.first_name || ''} ${s.last_name || ''}`, s.student_id, s.lrn_id]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return list;
  }, [supabase, currentSy, isHistoricalYear, gradeFilter, sectionFilter, genderFilter, search]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const list = await loadStudentsList();
    setStudents(list);
    setLoading(false);
  }, [loadStudentsList]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      const list = await loadStudentsList();
      if (!ignore) {
        setStudents(list);
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [loadStudentsList]);

  function openEdit(s) {
    if (isHistoricalYear) {
      alert(`Archived School Year (${currentSy?.year_label}): Student records are read-only.`);
      return;
    }
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
    if (!editStudent) return;
    if (isHistoricalYear) {
      setFormError(`Cannot edit students while viewing archived S.Y. ${currentSy?.year_label}.`);
      return;
    }
    if (!form.first_name || !form.last_name) { setFormError('First and last name required.'); return; }
    setSaving(true);
    // Teachers can only update contact, guardian, demographic details & portrait photo;
    // admissions fields (grade, section, enrollment type, LRN, status) are locked to Admin/Registrar.
    const payload = {
      age:              form.age ? Number(form.age) : null,
      birthdate:        form.birthdate || null,
      contact_number:   form.contact_number ? form.contact_number.trim() : null,
      guardian_name:    form.guardian_name ? form.guardian_name.trim() : null,
      guardian_contact: form.guardian_contact ? form.guardian_contact.trim() : null,
      photo_url:        form.photo_url || null,
    };
    const { error } = await supabase
      .from('students')
      .update(payload)
      .eq('student_record_id', editStudent.student_record_id);
    if (error) { setFormError(error.message); setSaving(false); return; }
    setSaving(false);
    setModalOpen(false);
    fetchStudents();
  }

  function exportCSV() {
    const headers = ['Student ID', 'LRN', 'Name', 'Grade', 'Section', 'Gender', 'Age', 'Contact', 'Guardian', 'Status'];
    const rows = students.map(s => [s.student_id, s.lrn_id, `${s.first_name} ${s.last_name}`, s.grade_level, s.section_name, s.gender, s.age, s.contact_number, s.guardian_name, s.status]);
    const csv = [headers, ...rows]
      .map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'class_list.csv'; a.click(); URL.revokeObjectURL(url);
  }

  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

  const availableSections = Array.from(
    new Set([
      ...sectionsList
        .filter(sec => !gradeFilter || sec.grade_level === Number(gradeFilter))
        .map(sec => cleanSectionName(sec.section_name, sec.grade_level)),
      ...students
        .filter(s => !gradeFilter || s.grade_level === Number(gradeFilter))
        .map(s => s.section_name ? cleanSectionName(s.section_name, s.grade_level) : null)
        .filter(Boolean),
    ])
  ).sort();

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
              <select className="filter-select" style={{ width: '100%' }} value={gradeFilter} onChange={e => { setGrade(e.target.value); setSectionFilter(''); }}>
                <option value="">All Grades</option>
                {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Section</label>
              <select className="filter-select" style={{ width: '100%' }} value={sectionFilter} onChange={e => setSectionFilter(e.target.value)}>
                <option value="">All Sections</option>
                {availableSections.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
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
                    x
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoStudents /> Class List Students</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
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
                          Grade {s.grade_level}{s.section_name ? ` - ${cleanSectionName(s.section_name, s.grade_level).toUpperCase()}` : ''}
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '13px' }}>
                        {s.gender || '—'}
                      </span>
                    </td>
                    <td>{s.age ?? '—'}</td>
                    <td>{s.guardian_name ?? 'N/A'}</td>
                    <td>{s.contact_number ?? 'N/A'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-secondary btn-sm" style={{ padding: '5px 8px' }} onClick={() => setViewStudent(s)} title="View"><IcoView /></button>
                        {!isHistoricalYear && (
                          <button className="btn btn-secondary btn-sm" style={{ padding: '5px 8px' }} onClick={() => openEdit(s)} title="Update Contact & Photo"><IcoEdit /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  ['Section', cleanSectionName(viewStudent.section_name, viewStudent.grade_level)],
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
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '8px 12px', borderRadius: '6px', marginBottom: '14px', fontSize: '12px' }}>
                  <strong>Note:</strong> Enrollment, Grade Level, and Section changes are managed by the Registrar/Admin in Enrollment &amp; Student Records. Teachers may update student portrait photos and parent/guardian contact info here.
                </div>

                <div className="form-grid">
                  {[
                    ['DepEd LRN (Read-Only)', 'lrn_id', 'text', '', true],
                    ['First Name (Read-Only)', 'first_name', 'text', '', true],
                    ['Last Name (Read-Only)', 'last_name', 'text', '', true],
                    ['Age', 'age', 'number', 'Age', false],
                    ['Birthdate', 'birthdate', 'date', '', false],
                    ['Contact Number', 'contact_number', 'text', 'Contact', false],
                    ['Guardian Name', 'guardian_name', 'text', 'Guardian full name', false],
                    ['Guardian Contact', 'guardian_contact', 'text', 'Guardian contact', false],
                  ].map(([label, field, type, placeholder, locked]) => (
                    <div className="form-group" key={field}>
                      <label>{label}</label>
                      <input
                        type={type}
                        value={form[field]}
                        placeholder={placeholder}
                        disabled={locked}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div className="form-group">
                    <label>Grade &amp; Section (Read-Only)</label>
                    <input
                      value={`${form.grade_level ? `Grade ${form.grade_level}` : '—'}${form.section_name ? ` - ${cleanSectionName(form.section_name, form.grade_level)}` : ''}`}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Contact Info'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
