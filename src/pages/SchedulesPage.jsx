import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

/* ── Icons ─────────────────────────────────────────────── */
function IcoCalendar({ size = 26 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IcoCalendarX() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="10" y1="14" x2="14" y2="18" />
      <line x1="14" y1="14" x2="10" y2="18" />
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
const GRADES = [
  'Nursery', 'Kinder',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const EMPTY_FORM = {
  subject: '',
  teacher: '',
  day: 'Monday',
  time_start: '',
  time_end: '',
  room: '',
};

/* ── Page ──────────────────────────────────────────────── */
export default function SchedulesPage() {
  const { supabase } = useAuth();

  const [gradeLevel, setGradeLevel] = useState('');
  const [schedules, setSchedules]   = useState([]);
  const [loading, setLoading]       = useState(false);

  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* fetch schedules when grade changes */
  useEffect(() => {
    if (!gradeLevel) { setSchedules([]); return; }
    async function fetch() {
      setLoading(true);
      const { data } = await supabase
        .from('class_schedules')
        .select('*')
        .eq('grade_level', gradeLevel)
        .order('day')
        .order('time_start');
      setSchedules(data ?? []);
      setLoading(false);
    }
    fetch();
  }, [supabase, gradeLevel]);

  /* open modals */
  function openAdd() {
    setEditItem(null);
    setForm({ ...EMPTY_FORM, grade_level: gradeLevel });
    setFormError('');
    setModalOpen(true);
  }
  function openEdit(item) {
    setEditItem(item);
    setForm({
      subject:    item.subject    ?? '',
      teacher:    item.teacher    ?? '',
      day:        item.day        ?? 'Monday',
      time_start: item.time_start ?? '',
      time_end:   item.time_end   ?? '',
      room:       item.room       ?? '',
    });
    setFormError('');
    setModalOpen(true);
  }

  /* save */
  async function handleSave(e) {
    e.preventDefault();
    if (!form.subject || !form.day || !form.time_start || !form.time_end) {
      setFormError('Subject, day, start time, and end time are required.');
      return;
    }
    setSaving(true);
    setFormError('');
    const payload = { ...form, grade_level: gradeLevel };

    if (editItem) {
      const { error } = await supabase.from('class_schedules').update(payload).eq('id', editItem.id);
      if (error) { setFormError(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('class_schedules').insert([payload]);
      if (error) { setFormError(error.message); setSaving(false); return; }
    }

    setSaving(false);
    setModalOpen(false);
    // re-fetch
    const { data } = await supabase
      .from('class_schedules').select('*')
      .eq('grade_level', gradeLevel).order('day').order('time_start');
    setSchedules(data ?? []);
  }

  /* delete */
  async function handleDelete() {
    if (!deleteTarget) return;
    await supabase.from('class_schedules').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    const { data } = await supabase
      .from('class_schedules').select('*')
      .eq('grade_level', gradeLevel).order('day').order('time_start');
    setSchedules(data ?? []);
  }

  /* group schedules by day for the timetable view */
  const byDay = DAYS.reduce((acc, d) => {
    acc[d] = schedules.filter(s => s.day === d);
    return acc;
  }, {});

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <>
      {/* Header */}
      <div className="top-header">
        <h1><IcoCalendar /> Class Schedules</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">

        {/* Grade Selector Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoFilter /> Select Class Schedule</h2>
            {gradeLevel && (
              <button className="btn btn-primary" onClick={openAdd}>
                <IcoAdd /> Add Schedule
              </button>
            )}
          </div>
          <div className="form-group" style={{ marginBottom: 0, maxWidth: '100%' }}>
            <label>Grade Level *</label>
            <select
              value={gradeLevel}
              onChange={e => setGradeLevel(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">Select Grade Level</option>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Schedule Display */}
        <div className="card">
          {!gradeLevel ? (
            /* Empty state */
            <div style={styles.emptyState}>
              <IcoCalendarX />
              <h3 style={styles.emptyTitle}>No Schedule Selected</h3>
              <p style={styles.emptySub}>Please select a grade level to view the class schedule.</p>
            </div>
          ) : loading ? (
            <div style={styles.emptyState}>
              <p style={{ color: '#888' }}>Loading schedule...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div style={styles.emptyState}>
              <IcoCalendarX />
              <h3 style={styles.emptyTitle}>No Schedules Found</h3>
              <p style={styles.emptySub}>No schedules added for {gradeLevel} yet. Click "Add Schedule" to get started.</p>
            </div>
          ) : (
            /* Timetable by day */
            <div>
              <div className="card-header" style={{ marginBottom: '16px' }}>
                <h2 className="card-title"><IcoCalendar size={18} /> {gradeLevel} — Weekly Schedule</h2>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Subject</th>
                      <th>Teacher</th>
                      <th>Time</th>
                      <th>Room</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map(day =>
                      byDay[day].length === 0 ? null : (
                        byDay[day].map((s, i) => (
                          <tr key={s.id}>
                            {i === 0 && (
                              <td rowSpan={byDay[day].length} style={styles.dayCell}>
                                {day}
                              </td>
                            )}
                            <td>{s.subject}</td>
                            <td>{s.teacher ?? '—'}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                              {formatTime(s.time_start)} – {formatTime(s.time_end)}
                            </td>
                            <td>{s.room ?? '—'}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)} title="Edit"><IcoEdit /></button>
                                <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(s)} title="Delete"><IcoTrash /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <IcoCalendar size={18} /> {editItem ? 'Edit Schedule' : `Add Schedule — ${gradeLevel}`}
              </h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {formError && <p style={{ color: '#dc3545', marginBottom: '12px', fontSize: '14px' }}>{formError}</p>}
                <div className="form-grid">
                  <div className="form-group">
                    <label>Subject *</label>
                    <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Mathematics" />
                  </div>
                  <div className="form-group">
                    <label>Teacher</label>
                    <input value={form.teacher} onChange={e => setForm(f => ({ ...f, teacher: e.target.value }))} placeholder="Teacher name" />
                  </div>
                  <div className="form-group">
                    <label>Day *</label>
                    <select value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))}>
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Room</label>
                    <input value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} placeholder="e.g. Room 101" />
                  </div>
                  <div className="form-group">
                    <label>Start Time *</label>
                    <input type="time" value={form.time_start} onChange={e => setForm(f => ({ ...f, time_start: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>End Time *</label>
                    <input type="time" value={form.time_end} onChange={e => setForm(f => ({ ...f, time_end: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editItem ? 'Save Changes' : 'Add Schedule'}
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
              <h3 className="modal-title"><IcoTrash /> Delete Schedule</h3>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}><IcoClose /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '15px', color: '#444' }}>
                Are you sure you want to delete the <strong>{deleteTarget.subject}</strong> schedule on <strong>{deleteTarget.day}</strong>? This cannot be undone.
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

/* ── Helpers ── */
function formatTime(t) {
  if (!t) return '—';
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12  = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

const styles = {
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '12px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#8B0000',
    margin: 0,
  },
  emptySub: {
    fontSize: '14px',
    color: '#888',
    textAlign: 'center',
    maxWidth: '320px',
  },
  dayCell: {
    fontWeight: '700',
    color: '#8B0000',
    verticalAlign: 'top',
    paddingTop: '14px',
    whiteSpace: 'nowrap',
  },
};
