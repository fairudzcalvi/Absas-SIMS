import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cleanSectionName } from '../utils/formatters';

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

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const EMPTY_FORM = {
  subject:      '',
  teacher:      '',
  day_of_week:  'Monday',
  section_name: '',
  time_start:   '',
  time_end:     '',
  room:         '',
  school_year:  '2025-2026',
};

/* ── Page ──────────────────────────────────────────────── */
export default function SchedulesPage() {
  const { supabase, selectedSchoolYear, activeSchoolYear, isHistoricalYear } = useAuth();
  const currentSy = selectedSchoolYear || activeSchoolYear;
  const [searchParams] = useSearchParams();
  const teacherParam = searchParams.get('teacher');

  const [teachers, setTeachers]     = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(teacherParam || '');
  const [schedules, setSchedules]   = useState([]);
  const [loading, setLoading]       = useState(false);

  // Catalogs for connecting schedule to school subjects, sections & active school year
  const [allSubjects, setAllSubjects] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [activeSy, setActiveSy]       = useState(null);

  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [customSubjectMode, setCustomSubjectMode] = useState(false);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* fetch teachers, subjects, sections and active school year */
  useEffect(() => {
    let ignore = false;
    async function load() {
      // 1. Teachers
      const { data: fac } = await supabase
        .from('faculty')
        .select('*')
        .order('last_name', { ascending: true });
      if (!ignore) setTeachers(fac ?? []);

      // 2. Subjects Catalog
      const { data: subjs } = await supabase
        .from('subjects')
        .select('subject_id, subject_name, subject_code, grade_level, department')
        .order('subject_name', { ascending: true });
      if (!ignore) setAllSubjects(subjs ?? []);

      // 3. Sections Catalog
      const { data: secs } = await supabase
        .from('sections')
        .select('id, section_name, grade_level, room_number, status')
        .order('grade_level', { ascending: true });
      if (!ignore) setAllSections(secs ?? []);

      // 4. Active School Year
      const { data: sy } = await supabase
        .from('school_years')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();
      if (!ignore && sy) {
        setActiveSy(sy);
      }
    }
    load();
    return () => { ignore = true; };
  }, [supabase]);

  /* Helper to fetch schedules dynamically across possible column names (teacher, faculty_id, teacher_id, teacher_name) */
  const fetchSchedulesForTeacher = async (teacherRecord) => {
    if (!teacherRecord) return [];
    
    // Build array of candidate queries to handle different column names in Supabase schema
    const email = teacherRecord.email;
    const facId = teacherRecord.faculty_id || teacherRecord.faculty_record_id;
    const fullName = `${teacherRecord.first_name || ''} ${teacherRecord.last_name || ''}`.trim();

    const syMatches = (s) => {
      if (!currentSy) return true;
      if (s.school_year_id && currentSy.id) return s.school_year_id === currentSy.id;
      if (s.school_year && currentSy.year_label) return s.school_year === currentSy.year_label;
      return true;
    };

    // 1. Try 'teacher' column first
    if (email) {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('teacher', email)
        .order('day_of_week')
        .order('time_start');
      if (!error && data) return data.filter(syMatches);
    }

    // 2. Try 'faculty_id'
    if (facId) {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('faculty_id', facId)
        .order('day_of_week')
        .order('time_start');
      if (!error && data) return data.filter(syMatches);
    }

    // 3. Try 'teacher_id'
    if (facId) {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('teacher_id', facId)
        .order('day_of_week')
        .order('time_start');
      if (!error && data) return data.filter(syMatches);
    }

    // 4. Try 'teacher_name'
    if (fullName) {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('teacher_name', fullName)
        .order('day_of_week')
        .order('time_start');
      if (!error && data) return data.filter(syMatches);
    }

    // 5. Fallback: select all and filter in JS if columns differ
    const { data: allData, error: allErr } = await supabase
      .from('schedules')
      .select('*')
      .order('day_of_week')
      .order('time_start');

    if (!allErr && allData) {
      return allData.filter(s => {
        const tVal = s.teacher || s.faculty_id || s.teacher_id || s.teacher_name;
        const matchesTeacher = tVal === email || tVal === facId || tVal === fullName;
        return matchesTeacher && syMatches(s);
      });
    }

    return [];
  };

  useEffect(() => {
    let ignore = false;
    async function fetchSchedules() {
      if (!selectedTeacher) {
        setSchedules([]);
        return;
      }
      setLoading(true);
      const teacherObj = teachers.find(t => t.email === selectedTeacher || t.faculty_id === selectedTeacher) || { email: selectedTeacher };
      const data = await fetchSchedulesForTeacher(teacherObj);
      if (!ignore) {
        setSchedules(data ?? []);
        setLoading(false);
      }
    }
    fetchSchedules();
    return () => { ignore = true; };
  }, [supabase, selectedTeacher, teachers, currentSy]);

  /* open modals */
  function openAdd() {
    setEditItem(null);
    setForm({
      ...EMPTY_FORM,
      teacher: selectedTeacher,
      school_year: currentSy?.year_label || '2025-2026',
    });
    setCustomSubjectMode(false);
    setFormError('');
    setModalOpen(true);
  }
  function openEdit(item) {
    setEditItem(item);
    setForm({
      subject:      item.subject      ?? '',
      teacher:      item.teacher || item.faculty_id || item.teacher_name || selectedTeacher,
      day_of_week:  item.day_of_week  ?? 'Monday',
      section_name: item.section_name ?? '',
      grade_level:  item.grade_level  ?? '',
      time_start:   item.time_start   ?? '',
      time_end:     item.time_end     ?? '',
      room:         item.room         ?? '',
      school_year:  item.school_year  ?? (currentSy?.year_label || '2025-2026'),
    });
    const existsInCatalog = allSubjects.some(
      s => s.subject_name.toLowerCase() === (item.subject || '').toLowerCase()
    );
    setCustomSubjectMode(!existsInCatalog && Boolean(item.subject));
    setFormError('');
    setModalOpen(true);
  }

  /* save */
  async function handleSave(e) {
    e.preventDefault();
    if (!form.subject || !form.day_of_week || !form.time_start || !form.time_end) {
      setFormError('Subject, day, start time, and end time are required.');
      return;
    }
    setSaving(true);
    setFormError('');

    const teacherObj = teachers.find(t => t.email === selectedTeacher || t.faculty_id === selectedTeacher);
    const teacherEmail = teacherObj?.email || selectedTeacher;
    const teacherId = teacherObj?.faculty_id || teacherObj?.faculty_record_id;
    const teacherName = teacherObj ? `${teacherObj.first_name || ''} ${teacherObj.last_name || ''}`.trim() : selectedTeacher;

    const selectedSec = allSections.find(s => 
      s.section_name === form.section_name && 
      (!form.grade_level || Number(s.grade_level) === Number(form.grade_level))
    );
    const secId = selectedSec?.id || null;
    const syId = currentSy?.id || activeSy?.id || null;

    const basePayload = {
      subject: form.subject,
      section_name: form.section_name || null,
      grade_level: form.grade_level ? Number(form.grade_level) : null,
      day_of_week: form.day_of_week,
      time_start: form.time_start,
      time_end: form.time_end,
      room: form.room || null,
      school_year: form.school_year || currentSy?.year_label || '2025-2026',
    };

    // Construct adaptive payload prioritizing 'teacher' with fallbacks
    const candidatePayloads = [
      { ...basePayload, teacher: teacherEmail, faculty_id: teacherId, section_id: secId, school_year_id: syId },
      { ...basePayload, teacher: teacherEmail, section_id: secId },
      { ...basePayload, teacher: teacherEmail },
      { ...basePayload, faculty_id: teacherId },
      { ...basePayload, teacher_id: teacherId },
      { ...basePayload, teacher_name: teacherName },
    ];

    let saveSuccess = false;
    let lastError = null;

    for (const payload of candidatePayloads) {
      if (editItem) {
        const { error } = await supabase.from('schedules').update(payload).eq('schedule_id', editItem.schedule_id);
        if (!error) {
          saveSuccess = true;
          break;
        }
        lastError = error;
      } else {
        const { error } = await supabase.from('schedules').insert([payload]);
        if (!error) {
          saveSuccess = true;
          break;
        }
        lastError = error;
      }
    }

    if (!saveSuccess) {
      setFormError(lastError?.message || 'Failed to save schedule record.');
      setSaving(false);
      return;
    }

    setSaving(false);
    setModalOpen(false);

    // re-fetch
    const data = await fetchSchedulesForTeacher(teacherObj || { email: selectedTeacher });
    setSchedules(data ?? []);
  }

  /* delete */
  async function handleDelete() {
    if (!deleteTarget) return;
    await supabase.from('schedules').delete().eq('schedule_id', deleteTarget.schedule_id);
    setDeleteTarget(null);
    const teacherObj = teachers.find(t => t.email === selectedTeacher || t.faculty_id === selectedTeacher) || { email: selectedTeacher };
    const data = await fetchSchedulesForTeacher(teacherObj);
    setSchedules(data ?? []);
  }

  /* group schedules by day_of_week for timetable view */
  const byDay = DAYS.reduce((acc, d) => {
    acc[d] = schedules.filter(s => s.day_of_week === d);
    return acc;
  }, {});

  const selectedTeacherName = teachers.find(t => t.email === selectedTeacher) 
    ? `${teachers.find(t => t.email === selectedTeacher).first_name} ${teachers.find(t => t.email === selectedTeacher).last_name}`
    : selectedTeacher;

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <>
      {/* Header */}
      <div className="top-header">
        <h1><IcoCalendar /> Teacher Schedules</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">

        {/* Teacher Selector Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoFilter /> Select Teacher Schedule</h2>
            {selectedTeacher && (
              <button className="btn btn-primary" onClick={openAdd}>
                <IcoAdd /> Add Schedule
              </button>
            )}
          </div>
          <div className="form-group" style={{ marginBottom: 0, maxWidth: '100%' }}>
            <label>Teacher *</label>
            <select
              value={selectedTeacher}
              onChange={e => setSelectedTeacher(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">Select Teacher</option>
              {teachers.map(t => (
                <option key={t.faculty_record_id} value={t.email}>
                  {t.first_name} {t.last_name} {t.position ? `(${t.position})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule Display */}
        <div className="card">
          {!selectedTeacher ? (
            /* Empty state */
            <div style={styles.emptyState}>
              <IcoCalendarX />
              <h3 style={styles.emptyTitle}>No Teacher Selected</h3>
              <p style={styles.emptySub}>Please select a teacher to view their teaching schedule.</p>
            </div>
          ) : loading ? (
            <div style={styles.emptyState}>
              <p style={{ color: '#888' }}>Loading schedule...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div style={styles.emptyState}>
              <IcoCalendarX />
              <h3 style={styles.emptyTitle}>No Schedules Found</h3>
              <p style={styles.emptySub}>No schedules added for {selectedTeacherName} yet. Click "Add Schedule" to get started.</p>
            </div>
          ) : (
            /* Timetable by day */
            <div>
              <div className="card-header" style={{ marginBottom: '16px' }}>
                <h2 className="card-title"><IcoCalendar size={18} /> {selectedTeacherName} — Teaching Schedule</h2>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Subject</th>
                      <th>Section</th>
                      <th>Grade Level</th>
                      <th>Time</th>
                      <th>Room</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map(day =>
                      byDay[day].length === 0 ? null : (
                        byDay[day].map((s, i) => (
                          <tr key={s.schedule_id}>
                            {i === 0 && (
                              <td rowSpan={byDay[day].length} style={styles.dayCell}>
                                {day}
                              </td>
                            )}
                            <td>{s.subject}</td>
                            <td>{s.section_name ?? '—'}</td>
                            <td>{s.grade_level ? `Grade ${s.grade_level}` : '—'}</td>
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
                <IcoCalendar size={18} /> {editItem ? 'Edit Schedule' : `Add Schedule — ${selectedTeacherName}`}
              </h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {formError && <p style={{ color: '#dc3545', marginBottom: '12px', fontSize: '14px' }}>{formError}</p>}
                <div className="form-grid">
                  {/* Grade Level First */}
                  <div className="form-group">
                    <label>Grade Level</label>
                    <select
                      value={form.grade_level || ''}
                      onChange={e => {
                        const newGrade = e.target.value;
                        setForm(f => ({ ...f, grade_level: newGrade }));
                      }}
                    >
                      <option value="">Select Grade Level</option>
                      {GRADE_OPTIONS.map(g => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Section: Linked to database Sections catalog */}
                  <div className="form-group">
                    <label>Section</label>
                    <select
                      value={form.section_name || ''}
                      onChange={e => {
                        const secName = e.target.value;
                        const matchingSec = allSections.find(s => cleanSectionName(s.section_name, s.grade_level) === secName || s.section_name === secName);
                        setForm(f => ({
                          ...f,
                          section_name: secName,
                          room: (matchingSec?.room_number && !f.room) ? matchingSec.room_number : f.room,
                        }));
                      }}
                    >
                      <option value="">— Select Section —</option>
                      {(() => {
                        const filtered = allSections.filter(s => !form.grade_level || Number(s.grade_level) === Number(form.grade_level));
                        const seenSecs = new Set();
                        return filtered.filter(s => {
                          const name = cleanSectionName(s.section_name, s.grade_level);
                          if (!name || seenSecs.has(name.toLowerCase())) return false;
                          seenSecs.add(name.toLowerCase());
                          return true;
                        }).map(s => {
                          const displayName = cleanSectionName(s.section_name, s.grade_level);
                          return (
                            <option key={s.id} value={displayName}>
                              {displayName} {s.room_number ? `(${s.room_number})` : ''}
                            </option>
                          );
                        });
                      })()}
                    </select>
                  </div>

                  {/* Subject: Linked to database Subjects catalog */}
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ margin: 0 }}>Subject *</label>
                      <button
                        type="button"
                        onClick={() => setCustomSubjectMode(prev => !prev)}
                        style={{ background: 'none', border: 'none', color: '#8B0000', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {customSubjectMode ? 'Choose from Catalog' : '+ Custom Subject'}
                      </button>
                    </div>

                    {customSubjectMode ? (
                      <input
                        value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        placeholder="e.g. Mathematics"
                        autoFocus
                      />
                    ) : (
                      <select
                        value={form.subject}
                        onChange={e => {
                          if (e.target.value === '__custom__') {
                            setCustomSubjectMode(true);
                            setForm(f => ({ ...f, subject: '' }));
                          } else {
                            setForm(f => ({ ...f, subject: e.target.value }));
                          }
                        }}
                      >
                        <option value="">— Select Subject —</option>
                        {allSubjects
                          .filter(s => !form.grade_level || !s.grade_level || Number(s.grade_level) === Number(form.grade_level))
                          .map(s => (
                            <option key={s.subject_id} value={s.subject_name}>
                              {s.subject_name} {s.subject_code ? `(${s.subject_code})` : ''}
                            </option>
                          ))}
                        <option value="__custom__">+ Enter Custom Subject...</option>
                      </select>
                    )}
                  </div>

                  {/* Day of Week */}
                  <div className="form-group">
                    <label>Day *</label>
                    <select value={form.day_of_week} onChange={e => setForm(f => ({ ...f, day_of_week: e.target.value }))}>
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  {/* Room */}
                  <div className="form-group">
                    <label>Room</label>
                    <input value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} placeholder="e.g. Room 101" />
                  </div>

                  {/* Start & End Time */}
                  <div className="form-group">
                    <label>Start Time *</label>
                    <input type="time" value={form.time_start} onChange={e => setForm(f => ({ ...f, time_start: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>End Time *</label>
                    <input type="time" value={form.time_end} onChange={e => setForm(f => ({ ...f, time_end: e.target.value }))} />
                  </div>

                  {/* School Year */}
                  <div className="form-group">
                    <label>School Year</label>
                    <input value={form.school_year} onChange={e => setForm(f => ({ ...f, school_year: e.target.value }))} placeholder="e.g. 2025-2026" />
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
                Are you sure you want to delete the <strong>{deleteTarget.subject}</strong> schedule on <strong>{deleteTarget.day_of_week}</strong>? This cannot be undone.
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
