import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cleanSectionName } from '../../utils/formatters';

function IcoAttendance() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
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
function IcoCalendar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

const GRADE_OPTIONS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `Grade ${i + 1}` }));
const STATUS_OPTIONS = ['Present', 'Absent', 'Late', 'Excused'];

const STATUS_COLORS = {
  present: '#28a745', absent: '#dc3545', late: '#ffc107', excused: '#17a2b8',
};

function todayISO() { return new Date().toISOString().split('T')[0]; }

export default function TeacherAttendancePage() {
  const { supabase, profile, selectedSchoolYear, activeSchoolYear } = useAuth();
  const currentSy = selectedSchoolYear || activeSchoolYear;
  const location = useLocation();

  const [date, setDate]           = useState(todayISO());
  const [gradeFilter, setGrade]   = useState(location.state?.presetGrade ? String(location.state.presetGrade) : '');
  const [sectionFilter, setSectionFilter] = useState(location.state?.presetSection || '');
  const [availableSections, setAvailableSections] = useState([]);
  const [teacherSchedules, setTeacherSchedules]   = useState([]);
  const [students, setStudents]   = useState([]);
  const [attendance, setAttendance] = useState({}); // { student_record_id: status }
  const [loading, setLoading]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);

  // Load teacher's personal schedules
  useEffect(() => {
    async function loadTeacherSchedules() {
      if (!profile) return;
      const email = profile.email;
      const facId = profile.faculty_id || profile.faculty_record_id;
      const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();

      const { data } = await supabase
        .from('schedules')
        .select('*')
        .order('day_of_week')
        .order('time_start');

      if (data) {
        const mySch = data.filter(s => {
          const t = s.teacher || s.faculty_id || s.teacher_id || s.teacher_name;
          return t === email || t === facId || t === fullName;
        });
        setTeacherSchedules(mySch);
      }
    }
    loadTeacherSchedules();
  }, [supabase, profile]);

  // Load sections for selected grade
  useEffect(() => {
    async function loadSections() {
      if (!gradeFilter) {
        setAvailableSections([]);
        return;
      }
      let secQuery = supabase
        .from('sections')
        .select('id, section_name, grade_level')
        .eq('grade_level', Number(gradeFilter))
        .eq('status', 'Active')
        .order('section_name');

      if (currentSy?.id) {
        secQuery = secQuery.eq('school_year_id', currentSy.id);
      }

      const { data } = await secQuery;

      const seen = new Set();
      const unique = (data || []).filter(sec => {
        const name = cleanSectionName(sec.section_name, sec.grade_level).toLowerCase().trim();
        if (!name || seen.has(name)) return false;
        seen.add(name);
        return true;
      });
      setAvailableSections(unique);
    }
    loadSections();
  }, [supabase, gradeFilter, currentSy]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!gradeFilter) return;
      setLoading(true);

      let q = supabase
        .from('students')
        .select('student_record_id, student_id, first_name, last_name, grade_level, section_name')
        .eq('grade_level', Number(gradeFilter));

      if (sectionFilter) {
        q = q.eq('section_name', sectionFilter);
      }

      const { data: studs } = await q.order('last_name');

      const { data: existing } = await supabase
        .from('attendance')
        .select('student_record_id, status')
        .eq('date', date)
        .in('student_record_id', (studs ?? []).map(s => s.student_record_id));

      const map = {};
      (existing ?? []).forEach(r => { map[r.student_record_id] = r.status; });
      // default all to Present
      (studs ?? []).forEach(s => { if (!map[s.student_record_id]) map[s.student_record_id] = 'Present'; });

      if (!ignore) {
        setStudents(studs ?? []);
        setAttendance(map);
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [supabase, gradeFilter, sectionFilter, date]);

  async function handleSave() {
    if (students.length === 0) return;
    setSaving(true);
    const rows = students.map(s => ({
      student_record_id: s.student_record_id,
      date,
      status: attendance[s.student_record_id] ?? 'Present',
    }));
    await supabase.from('attendance').upsert(rows, { onConflict: 'student_record_id,date' });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const counts = students.reduce((acc, s) => {
    const st = (attendance[s.student_record_id] ?? 'Present').toLowerCase();
    acc[st] = (acc[st] ?? 0) + 1;
    return acc;
  }, {});

  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <>
      <div className="top-header">
        <h1><IcoAttendance /> Students Attendance</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">
        {/* Filter */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoAttendance /> Record Attendance</h2>
          </div>

          {/* Quick-Select from My Teaching Schedules */}
          {teacherSchedules.length > 0 && (
            <div style={{
              marginBottom: '16px',
              padding: '12px 14px',
              background: '#fff8f6',
              border: '1px solid #f2dede',
              borderRadius: '8px',
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#8B0000',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <IcoCalendar /> My Scheduled Classes (Click to quick-select):
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {teacherSchedules.map(sch => {
                  const isSelected =
                    String(gradeFilter) === String(sch.grade_level) &&
                    (!sch.section_name || sectionFilter === sch.section_name);
                  return (
                    <button
                      key={sch.schedule_id}
                      type="button"
                      onClick={() => {
                        setGrade(String(sch.grade_level || ''));
                        setSectionFilter(sch.section_name || '');
                      }}
                      className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '12px', padding: '4px 10px' }}
                    >
                      {sch.grade_level ? `Grade ${sch.grade_level}` : ''}
                      {sch.section_name ? ` (${cleanSectionName(sch.section_name, sch.grade_level)})` : ''} — {sch.subject}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '180px' }}>
              <label>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '180px' }}>
              <label>Grade Level</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={gradeFilter}
                onChange={e => {
                  setGrade(e.target.value);
                  setSectionFilter('');
                }}
              >
                <option value="">Select Grade</option>
                {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '180px' }}>
              <label>Section</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={sectionFilter}
                onChange={e => setSectionFilter(e.target.value)}
                disabled={!gradeFilter}
              >
                <option value="">All Sections</option>
                {availableSections.map(sec => {
                  const displayName = cleanSectionName(sec.section_name, gradeFilter);
                  return (
                    <option key={sec.id} value={displayName}>
                      {displayName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        {gradeFilter && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                Grade {gradeFilter} — {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>
              {students.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {Object.entries(counts).map(([s, n]) => (
                    <span key={s} className="badge" style={{ backgroundColor: STATUS_COLORS[s] ?? '#888', color: s === 'late' ? '#000' : '#fff' }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}: {n}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <p className="empty-message">Loading students...</p>
            ) : students.length === 0 ? (
              <p className="empty-message">No students in this grade level.</p>
            ) : (
              <>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th><th>DepEd LRN</th><th>Student Name</th>
                        <th>Section</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, i) => {
                        const status = attendance[s.student_record_id] ?? 'Present';
                        return (
                          <tr key={s.student_record_id}>
                            <td style={{ color: '#888', width: '36px' }}>{i + 1}</td>
                            <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#8B0000' }}>{s.lrn_id || s.student_id || '—'}</td>
                            <td style={{ fontWeight: '600' }}>{s.first_name} {s.last_name}</td>
                            <td>{s.section_name ?? '—'}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {STATUS_OPTIONS.map(opt => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                      // Toggle: if already selected, deselect; otherwise select
                                      if (status === opt) {
                                        setAttendance(a => ({ ...a, [s.student_record_id]: 'Present' })); // default back to Present
                                      } else {
                                        setAttendance(a => ({ ...a, [s.student_record_id]: opt }));
                                      }
                                    }}
                                    onMouseEnter={(e) => {
                                      if (status !== opt) {
                                        e.target.style.backgroundColor = `${STATUS_COLORS[opt.toLowerCase()]}20`;
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (status !== opt) {
                                        e.target.style.backgroundColor = 'transparent';
                                      }
                                    }}
                                    style={{
                                      padding: '6px 12px',
                                      borderRadius: '20px',
                                      border: '2px solid',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      borderColor: STATUS_COLORS[opt.toLowerCase()] ?? '#888',
                                      backgroundColor: status === opt ? STATUS_COLORS[opt.toLowerCase()] : 'transparent',
                                      color: status === opt ? (opt === 'Late' ? '#000' : '#fff') : STATUS_COLORS[opt.toLowerCase()],
                                      transition: 'all 0.15s',
                                    }}
                                    title={`Click to set as ${opt}`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    <IcoSave /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Attendance'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {!gradeFilter && (
          <div className="card">
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#888' }}>
              <IcoAttendance />
              <p style={{ marginTop: '12px' }}>Select a grade level to start recording attendance.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
