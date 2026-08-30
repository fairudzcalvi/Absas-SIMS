import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

/* ── Icons ─────────────────────────────────────────────── */
function IcoBook() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
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
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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
const DEPARTMENTS = ['Elementary', 'Junior High', 'Administration'];
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
  subject_name:    '',
  subject_code:    '',
  department:      '',
  grade_level:     '',
  description:     '',
  status:          'Active',
};

/* ── Page ──────────────────────────────────────────────── */
export default function SubjectsPage() {
  const { supabase } = useAuth();

  const [subjects, setSubjects]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [deptFilter, setDeptFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [search, setSearch]         = useState('');

  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);

  /* fetch */
  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('subjects').select('*').order('subject_name', { ascending: true });
    if (deptFilter) q = q.eq('department', deptFilter);
    if (gradeFilter) q = q.eq('grade_level', Number(gradeFilter));
    if (search)     q = q.or(`subject_name.ilike.%${search}%,subject_code.ilike.%${search}%`);
    const { data, error } = await q;
    
    if (error) {
      console.error("Error fetching subjects:", JSON.stringify(error, null, 2));
      console.error("Error details:", error.message, error.code, error.hint);
      setSubjects([]);
    } else {
      console.log("Fetched subjects:", data);
      setSubjects(data ?? []);
    }
    
    setLoading(false);
  }, [supabase, deptFilter, gradeFilter, search]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      let q = supabase.from('subjects').select('*').order('subject_name', { ascending: true });
      if (deptFilter) q = q.eq('department', deptFilter);
      if (gradeFilter) q = q.eq('grade_level', Number(gradeFilter));
      if (search)     q = q.or(`subject_name.ilike.%${search}%,subject_code.ilike.%${search}%`);
      const { data, error } = await q;
      
      if (!ignore) {
        if (error) {
          console.error("Error fetching subjects:", JSON.stringify(error, null, 2));
          console.error("Error details:", error.message, error.code, error.hint);
          setSubjects([]);
        } else {
          setSubjects(data ?? []);
        }
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [supabase, deptFilter, gradeFilter, search]);

  /* derived stats */
  const total = subjects.length;
  const active = subjects.filter(s => (s.status ?? '').toLowerCase() === 'active').length;
  const inactive = subjects.filter(s => (s.status ?? '').toLowerCase() === 'inactive').length;

  /* open modals */
  function openAdd() {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  }
  function openEdit(item) {
    setEditItem(item);
    setForm({
      subject_name: item.subject_name ?? '',
      subject_code: item.subject_code ?? '',
      department:   item.department   ?? '',
      grade_level:  item.grade_level  ?? '',
      description:  item.description  ?? '',
      status:       item.status       ?? 'Active',
    });
    setFormError('');
    setModalOpen(true);
  }

  /* save */
  async function handleSave(e) {
    e.preventDefault();
    if (!form.subject_name || !form.department) {
      setFormError('Subject name and department are required.');
      return;
    }
    setSaving(true);
    setFormError('');

    const payload = {
      subject_name: form.subject_name,
      subject_code: form.subject_code || null,
      department:   form.department,
      grade_level:  form.grade_level ? Number(form.grade_level) : null,
      description:  form.description || null,
      status:       form.status,
    };

    if (editItem) {
      const { error } = await supabase.from('subjects').update(payload).eq('subject_id', editItem.subject_id);
      if (error) { setFormError(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('subjects').insert([payload]);
      if (error) { setFormError(error.message); setSaving(false); return; }
    }

    setSaving(false);
    setModalOpen(false);
    fetchSubjects();
  }

  /* delete */
  async function handleDelete() {
    if (!deleteTarget) return;
    await supabase.from('subjects').delete().eq('subject_id', deleteTarget.subject_id);
    setDeleteTarget(null);
    fetchSubjects();
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

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
              <div className="stat-number">{total}</div>
              <div className="stat-label">Total Subjects</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon"><IcoBook /></div>
            <div className="stat-info">
              <div className="stat-number">{active}</div>
              <div className="stat-label">Active Subjects</div>
            </div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon"><IcoBook /></div>
            <div className="stat-info">
              <div className="stat-number">{inactive}</div>
              <div className="stat-label">Inactive Subjects</div>
            </div>
          </div>
        </div>

        {/* Filter Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoFilter /> Filter Subjects</h2>
            <button className="btn btn-primary" onClick={openAdd}>
              <IcoAdd /> Add Subject
            </button>
          </div>
          <div className="form-grid" style={{ alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Department</label>
              <select className="filter-select" style={{ width: '100%' }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                <option value="">All Departments</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Grade Level</label>
              <select className="filter-select" style={{ width: '100%' }} value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}>
                <option value="">All Grades</option>
                {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Search</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  className="search-input"
                  style={{ width: '100%', paddingRight: search ? '32px' : '10px' }}
                  placeholder="Subject name or code..."
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
            <h2 className="card-title">All Subjects</h2>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Subject Name</th>
                  <th>Department</th>
                  <th>Grade Level</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="empty-message">Loading...</td></tr>
                ) : subjects.length === 0 ? (
                  <tr><td colSpan={7} className="empty-message">No subjects found</td></tr>
                ) : (
                  subjects.map(s => (
                    <tr key={s.subject_id}>
                      <td>{s.subject_code ?? '—'}</td>
                      <td>{s.subject_name}</td>
                      <td>{s.department ?? '—'}</td>
                      <td>{s.grade_level ? `Grade ${s.grade_level}` : '—'}</td>
                      <td>{s.description ?? '—'}</td>
                      <td><StatusBadge status={s.status} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)} title="Edit"><IcoEdit /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(s)} title="Delete"><IcoTrash /></button>
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
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoAdd /> {editItem ? 'Edit Subject' : 'Add New Subject'}</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {formError && <p style={{ color: '#dc3545', marginBottom: '12px', fontSize: '14px' }}>{formError}</p>}
                
                {/* Basic Information */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#333', borderBottom: '2px solid #e9ecef', paddingBottom: '8px' }}>
                    Basic Information
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Subject Name *</label>
                      <input value={form.subject_name} onChange={e => setForm(f => ({ ...f, subject_name: e.target.value }))} placeholder="e.g. Mathematics" />
                    </div>
                    <div className="form-group">
                      <label>Subject Code</label>
                      <input value={form.subject_code} onChange={e => setForm(f => ({ ...f, subject_code: e.target.value }))} placeholder="e.g. MATH101" />
                    </div>
                  </div>
                </div>

                {/* Classification */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#333', borderBottom: '2px solid #e9ecef', paddingBottom: '8px' }}>
                    Classification
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Department *</label>
                      <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                        <option value="">Select department</option>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Grade Level</label>
                      <select value={form.grade_level} onChange={e => setForm(f => ({ ...f, grade_level: e.target.value }))}>
                        <option value="">All grades</option>
                        {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#333', borderBottom: '2px solid #e9ecef', paddingBottom: '8px' }}>
                    Additional Information
                  </h4>
                  <div className="form-grid">
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label>Description</label>
                      <textarea 
                        value={form.description} 
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                        placeholder="Brief description of the subject..."
                        rows={3}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editItem ? 'Save Changes' : 'Add Subject'}
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
              <h3 className="modal-title"><IcoTrash /> Delete Subject</h3>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}><IcoClose /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '15px', color: '#444' }}>
                Are you sure you want to delete <strong>{deleteTarget.subject_name}</strong>? This cannot be undone.
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
    s === 'active'   ? 'badge badge-success' :
    s === 'inactive' ? 'badge badge-warning' :
                       'badge badge-info';
  return <span className={cls}>{status ?? 'Active'}</span>;
}