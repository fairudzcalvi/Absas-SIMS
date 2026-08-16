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
function IcoAdviser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}
function IcoTeacher() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
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
const DEPARTMENTS = ['Elementary', 'Junior High', 'Administration'];

const ROLES = ['Teacher', 'Adviser', 'Both'];

const EMPTY_FORM = {
  faculty_id:        '',
  employee_number:   '',
  first_name:        '',
  last_name:         '',
  middle_name:       '',
  email:             '',
  contact_number:    '',
  birthdate:         '',
  address:           '',
  department:        '',
  position:          '',
  role:              '',
  adviser_grade_level: '',
  subjects_taught:   '',
  employment_status: 'Active',
  hire_date:         '',
};

/* ── Page ──────────────────────────────────────────────── */
export default function FacultyPage() {
  const { supabase } = useAuth();

  const [faculty, setFaculty]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [deptFilter, setDeptFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch]         = useState('');

  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);

  /* fetch */
  const fetchFaculty = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('faculty').select('*').order('last_name', { ascending: true });
    if (deptFilter) q = q.eq('department', deptFilter);
    if (roleFilter) q = q.eq('role', roleFilter);
    if (search)     q = q.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,contact_number.ilike.%${search}%,faculty_id.ilike.%${search}%`);
    const { data } = await q;
    setFaculty(data ?? []);
    setLoading(false);
  }, [supabase, deptFilter, roleFilter, search]);

  useEffect(() => { fetchFaculty(); }, [fetchFaculty]);

  /* derived stats */
  const total    = faculty.length;
  // Adviser = role is 'Adviser' or 'Both'
  const advisers = faculty.filter(f => {
    const r = (f.role ?? '').toLowerCase();
    return r === 'adviser' || r === 'both';
  }).length;
  // Teacher = role is 'Teacher' or 'Both'
  const teachers = faculty.filter(f => {
    const r = (f.role ?? '').toLowerCase();
    return r === 'teacher' || r === 'both';
  }).length;

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
      faculty_id:          item.faculty_id          ?? '',
      employee_number:     item.employee_number     ?? '',
      first_name:          item.first_name          ?? '',
      last_name:           item.last_name           ?? '',
      middle_name:         item.middle_name         ?? '',
      email:               item.email               ?? '',
      contact_number:      item.contact_number      ?? '',
      birthdate:           item.birthdate           ?? '',
      address:             item.address             ?? '',
      department:          item.department          ?? '',
      position:            item.position            ?? '',
      role:                item.role                ?? '',
      adviser_grade_level: item.adviser_grade_level ?? '',
      subjects_taught:     item.subjects_taught     ?? '',
      employment_status:   item.employment_status   ?? 'Active',
      hire_date:           item.hire_date           ?? '',
    });
    setFormError('');
    setModalOpen(true);
  }

  /* save */
  async function handleSave(e) {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.role) {
      setFormError('First name, last name, and role are required.');
      return;
    }
    setSaving(true);
    setFormError('');

    const payload = {
      faculty_id:          form.faculty_id          || undefined,
      employee_number:     form.employee_number     || null,
      first_name:          form.first_name,
      last_name:           form.last_name,
      middle_name:         form.middle_name         || null,
      email:               form.email               || null,
      contact_number:      form.contact_number      || null,
      birthdate:           form.birthdate           || null,
      address:             form.address             || null,
      department:          form.department          || null,
      position:            form.position            || null,
      role:                form.role,
      adviser_grade_level: form.adviser_grade_level ? Number(form.adviser_grade_level) : null,
      subjects_taught:     form.subjects_taught     || null,
      employment_status:   form.employment_status,
      hire_date:           form.hire_date           || null,
    };

    if (editItem) {
      const { error } = await supabase.from('faculty').update(payload).eq('faculty_record_id', editItem.faculty_record_id);
      if (error) { setFormError(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('faculty').insert([payload]);
      if (error) { setFormError(error.message); setSaving(false); return; }
    }

    setSaving(false);
    setModalOpen(false);
    fetchFaculty();
  }

  /* delete */
  async function handleDelete() {
    if (!deleteTarget) return;
    await supabase.from('faculty').delete().eq('faculty_record_id', deleteTarget.faculty_record_id);
    setDeleteTarget(null);
    fetchFaculty();
  }

  /* export CSV */
  function exportCSV() {
    const headers = ['Faculty ID', 'Employee No.', 'Name', 'Department', 'Position', 'Role', 'Subjects', 'Email', 'Contact', 'Status'];
    const rows = faculty.map(f => [
      f.faculty_id,
      f.employee_number,
      `${f.first_name} ${f.last_name}`,
      f.department, f.position, f.role,
      f.subjects_taught,
      f.email, f.contact_number, f.employment_status,
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'faculty.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <>
      {/* Header */}
      <div className="top-header">
        <h1><IcoFaculty /> Faculty Records</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">

        {/* Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><IcoFaculty /></div>
            <div className="stat-info">
              <div className="stat-number">{total}</div>
              <div className="stat-label">Total Faculty</div>
            </div>
          </div>
          <div className="stat-card gold">
            <div className="stat-icon"><IcoAdviser /></div>
            <div className="stat-info">
              <div className="stat-number">{advisers}</div>
              <div className="stat-label">Class Advisers</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon"><IcoTeacher /></div>
            <div className="stat-info">
              <div className="stat-number">{teachers}</div>
              <div className="stat-label">Subject Teachers</div>
            </div>
          </div>
        </div>

        {/* Filter Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoFilter /> Filter Faculty</h2>
            <button className="btn btn-primary" onClick={openAdd}>
              <IcoAdd /> Add Faculty
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
              <label>Role</label>
              <select className="filter-select" style={{ width: '100%' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                <option value="">All Roles</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Search</label>
              <input
                className="search-input"
                style={{ width: '100%' }}
                placeholder="Name, ID, or Email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Faculty Members</h2>
            <button className="btn btn-secondary btn-sm" onClick={exportCSV}>
              <IcoExport /> Export
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Faculty ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Role</th>
                  <th>Subjects</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="empty-message">Loading...</td></tr>
                ) : faculty.length === 0 ? (
                  <tr><td colSpan={9} className="empty-message">No faculty records found</td></tr>
                ) : (
                  faculty.map(f => (
                    <tr key={f.faculty_record_id}>
                      <td>{f.faculty_id ?? '—'}</td>
                      <td>{f.first_name} {f.middle_name ? f.middle_name[0] + '. ' : ''}{f.last_name}</td>
                      <td>{f.department ?? '—'}</td>
                      <td>{f.position ?? '—'}</td>
                      <td>{f.role ?? '—'}</td>
                      <td>{f.subjects_taught ?? '—'}</td>
                      <td>{f.contact_number ?? f.email ?? '—'}</td>
                      <td><StatusBadge status={f.employment_status} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(f)} title="Edit"><IcoEdit /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(f)} title="Delete"><IcoTrash /></button>
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
              <h3 className="modal-title"><IcoAdd /> {editItem ? 'Edit Faculty' : 'Add New Faculty'}</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {formError && <p style={{ color: '#dc3545', marginBottom: '12px', fontSize: '14px' }}>{formError}</p>}
                <div className="form-grid">
                  <div className="form-group">
                    <label>Faculty ID</label>
                    <input value={form.faculty_id} onChange={e => setForm(f => ({ ...f, faculty_id: e.target.value }))} placeholder="e.g. FAC-001" />
                  </div>
                  <div className="form-group">
                    <label>Employee Number</label>
                    <input value={form.employee_number} onChange={e => setForm(f => ({ ...f, employee_number: e.target.value }))} placeholder="Employee number" />
                  </div>
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
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email address" />
                  </div>
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input value={form.contact_number} onChange={e => setForm(f => ({ ...f, contact_number: e.target.value }))} placeholder="Contact number" />
                  </div>
                  <div className="form-group">
                    <label>Birthdate</label>
                    <input type="date" value={form.birthdate} onChange={e => setForm(f => ({ ...f, birthdate: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Address" />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                      <option value="">Select department</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Position</label>
                    <input value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} placeholder="e.g. Head Teacher" />
                  </div>
                  <div className="form-group">
                    <label>Role *</label>
                    <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                      <option value="">Select role</option>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Adviser Grade Level</label>
                    <input type="number" min="1" max="10" value={form.adviser_grade_level} onChange={e => setForm(f => ({ ...f, adviser_grade_level: e.target.value }))} placeholder="Grade level advised (1-10)" />
                  </div>
                  <div className="form-group">
                    <label>Subjects Taught</label>
                    <input value={form.subjects_taught} onChange={e => setForm(f => ({ ...f, subjects_taught: e.target.value }))} placeholder="e.g. Math, Science" />
                  </div>
                  <div className="form-group">
                    <label>Hire Date</label>
                    <input type="date" value={form.hire_date} onChange={e => setForm(f => ({ ...f, hire_date: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Employment Status</label>
                    <select value={form.employment_status} onChange={e => setForm(f => ({ ...f, employment_status: e.target.value }))}>
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editItem ? 'Save Changes' : 'Add Faculty'}
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
              <h3 className="modal-title"><IcoTrash /> Delete Faculty</h3>
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
    s === 'active'   ? 'badge badge-success' :
    s === 'on leave' ? 'badge badge-warning' :
                       'badge badge-danger';
  return <span className={cls}>{status ?? 'Active'}</span>;
}
