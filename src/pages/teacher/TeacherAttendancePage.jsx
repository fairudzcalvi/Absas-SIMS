import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

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

const GRADE_OPTIONS = Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: `Grade ${i + 1}` }));
const STATUS_OPTIONS = ['Present', 'Absent', 'Late', 'Excused'];

const STATUS_COLORS = {
  present: '#28a745', absent: '#dc3545', late: '#ffc107', excused: '#17a2b8',
};

function todayISO() { return new Date().toISOString().split('T')[0]; }

export default function TeacherAttendancePage() {
  const { supabase } = useAuth();

  const [date, setDate]           = useState(todayISO());
  const [gradeFilter, setGrade]   = useState('');
  const [students, setStudents]   = useState([]);
  const [attendance, setAttendance] = useState({}); // { student_record_id: status }
  const [loading, setLoading]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);

  async function loadStudents() {
    if (!gradeFilter) return;
    setLoading(true);
    const { data: studs } = await supabase
      .from('students')
      .select('student_record_id, student_id, first_name, last_name, grade_level, section_name')
      .eq('grade_level', Number(gradeFilter))
      .order('last_name');

    const { data: existing } = await supabase
      .from('attendance')
      .select('student_record_id, status')
      .eq('date', date)
      .in('student_record_id', (studs ?? []).map(s => s.student_record_id));

    const map = {};
    (existing ?? []).forEach(r => { map[r.student_record_id] = r.status; });
    // default all to Present
    (studs ?? []).forEach(s => { if (!map[s.student_record_id]) map[s.student_record_id] = 'Present'; });

    setStudents(studs ?? []);
    setAttendance(map);
    setLoading(false);
  }

  useEffect(() => { loadStudents(); }, [gradeFilter, date]);

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
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '180px' }}>
              <label>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '180px' }}>
              <label>Grade Level</label>
              <select className="filter-select" style={{ width: '100%' }} value={gradeFilter} onChange={e => setGrade(e.target.value)}>
                <option value="">Select Grade</option>
                {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
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
                        <th>#</th><th>Student ID</th><th>Name</th>
                        <th>Section</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, i) => {
                        const status = attendance[s.student_record_id] ?? 'Present';
                        return (
                          <tr key={s.student_record_id}>
                            <td style={{ color: '#888', width: '36px' }}>{i + 1}</td>
                            <td>{s.student_id ?? '—'}</td>
                            <td style={{ fontWeight: '600' }}>{s.first_name} {s.last_name}</td>
                            <td>{s.section_name ?? '—'}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {STATUS_OPTIONS.map(opt => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setAttendance(a => ({ ...a, [s.student_record_id]: opt }))}
                                    style={{
                                      padding: '4px 12px',
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
