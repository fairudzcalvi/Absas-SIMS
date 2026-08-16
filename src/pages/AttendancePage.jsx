import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

/* ── Icons ─────────────────────────────────────────────── */
function IcoAttendance() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
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
function IcoSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IcoInfo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function IcoBarChart() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}
function IcoCalendarEmpty() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="15" x2="16" y2="15" />
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

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

/* ── Page ──────────────────────────────────────────────── */
export default function AttendancePage() {
  const { supabase } = useAuth();

  const [date, setDate]           = useState(todayISO());
  const [gradeFilter, setGrade]   = useState('');
  const [records, setRecords]     = useState(null); // null = not yet queried
  const [summary, setSummary]     = useState(null);
  const [loading, setLoading]     = useState(false);

  async function handleViewReport(e) {
    e.preventDefault();
    setLoading(true);

    // Query attendance joining students via FK on student_record_id
    let q = supabase
      .from('attendance')
      .select(`
        attendance_id, date, status, remarks,
        students ( student_record_id, first_name, last_name, grade_level, section_name )
      `)
      .eq('date', date)
      .order('date', { ascending: false });

    const { data } = await q;
    let rows = (data ?? []).filter(r => r.students); // guard nulls

    // Client-side grade filter — grade_level is SMALLINT (number)
    if (gradeFilter) {
      rows = rows.filter(r => r.students?.grade_level === Number(gradeFilter));
    }

    setRecords(rows);

    // Build monthly summary — attendance for the whole month
    const monthStart = date.slice(0, 7) + '-01';
    const monthEnd   = date.slice(0, 7) + '-31';
    let mq = supabase
      .from('attendance')
      .select('date, status, students ( grade_level )')
      .gte('date', monthStart)
      .lte('date', monthEnd);

    const { data: mData } = await mq;
    let mRows = (mData ?? []).filter(r => r.students);
    if (gradeFilter) {
      mRows = mRows.filter(r => r.students?.grade_level === Number(gradeFilter));
    }

    const present  = mRows.filter(r => (r.status ?? '').toLowerCase() === 'present').length;
    const absent   = mRows.filter(r => (r.status ?? '').toLowerCase() === 'absent').length;
    const late     = mRows.filter(r => (r.status ?? '').toLowerCase() === 'late').length;
    const excused  = mRows.filter(r => (r.status ?? '').toLowerCase() === 'excused').length;
    setSummary({ present, absent, late, excused, total: mRows.length });

    setLoading(false);
  }

  function exportCSV() {
    if (!records) return;
    const headers = ['Date', 'Student ID', 'Name', 'Grade', 'Section', 'Status', 'Remarks'];
    const rows = records.map(r => [
      r.date,
      r.students?.student_record_id,
      `${r.students?.first_name} ${r.students?.last_name}`,
      r.students?.grade_level,
      r.students?.section_name,
      r.status,
      r.remarks ?? '',
    ]);
    const csv = [headers, ...rows].map(row => row.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'attendance.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  const presentCount = records?.filter(r => (r.status ?? '').toLowerCase() === 'present').length ?? 0;
  const absentCount  = records?.filter(r => (r.status ?? '').toLowerCase() === 'absent').length ?? 0;
  const lateCount    = records?.filter(r => (r.status ?? '').toLowerCase() === 'late').length ?? 0;

  const selectedGradeLabel = GRADE_OPTIONS.find(g => g.value === Number(gradeFilter))?.label ?? '';

  return (
    <>
      {/* Header */}
      <div className="top-header">
        <h1><IcoAttendance /> Attendance Reports</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">

        {/* Info Banner */}
        <div style={styles.infoBanner}>
          <IcoInfo />
          <p style={{ margin: 0, fontSize: '14px' }}>
            <strong>Admin View:</strong> This module is for viewing attendance reports only. Teachers/Advisers record daily attendance for their assigned classes.
          </p>
        </div>

        {/* Filter Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoFilter /> Filter Reports</h2>
          </div>
          <form onSubmit={handleViewReport}>
            <div style={styles.filterRow}>
              <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                <label>Grade Level</label>
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={gradeFilter}
                  onChange={e => setGrade(e.target.value)}
                >
                  <option value="">All Grades</option>
                  {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
              <div style={{ alignSelf: 'flex-end', flexShrink: 0 }}>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ height: '46px' }}>
                  <IcoSearch /> {loading ? 'Loading...' : 'View Report'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Daily Report Table */}
        {records !== null && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <IcoAttendance />
                {selectedGradeLabel ? `${selectedGradeLabel} — ` : 'All Grades — '}
                {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {records.length > 0 && (
                  <>
                    <span className="badge badge-success">Present: {presentCount}</span>
                    <span className="badge badge-danger">Absent: {absentCount}</span>
                    <span className="badge badge-warning">Late: {lateCount}</span>
                  </>
                )}
                <button className="btn btn-secondary btn-sm" onClick={exportCSV} disabled={records.length === 0}>
                  <IcoExport /> Export
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Grade</th>
                    <th>Section</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr><td colSpan={6} className="empty-message">No attendance records for this date{selectedGradeLabel ? ` in ${selectedGradeLabel}` : ''}.</td></tr>
                  ) : (
                    records.map(r => (
                      <tr key={r.attendance_id}>
                        <td>{r.students?.student_record_id ?? '—'}</td>
                        <td>{r.students?.first_name} {r.students?.last_name}</td>
                        <td>{r.students?.grade_level ? `Grade ${r.students.grade_level}` : '—'}</td>
                        <td>{r.students?.section_name ?? '—'}</td>
                        <td><StatusBadge status={r.status} /></td>
                        <td>{r.remarks ?? '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Monthly Summary Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoBarChart /> Monthly Summary</h2>
            {summary && (
              <span style={{ fontSize: '13px', color: '#666' }}>
                {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                {selectedGradeLabel ? ` — ${selectedGradeLabel}` : ''}
              </span>
            )}
          </div>

          {!summary ? (
            <div style={styles.emptyState}>
              <IcoCalendarEmpty />
              <p style={styles.emptySub}>
                Monthly attendance summary will be displayed here once attendance data is recorded by teachers.
              </p>
            </div>
          ) : (
            <div style={styles.summaryGrid}>
              <SummaryTile label="Present"      value={summary.present}  color="#28a745" />
              <SummaryTile label="Absent"       value={summary.absent}   color="#dc3545" />
              <SummaryTile label="Late"         value={summary.late}     color="#ffc107" textColor="#000" />
              <SummaryTile label="Excused"      value={summary.excused}  color="#17a2b8" />
              <SummaryTile label="Total Records" value={summary.total}   color="#8B0000" />
            </div>
          )}
        </div>

      </div>
    </>
  );
}

/* ── Sub-components ── */
function StatusBadge({ status }) {
  const s = (status ?? '').toLowerCase();
  const cls =
    s === 'present' ? 'badge badge-success' :
    s === 'absent'  ? 'badge badge-danger'  :
    s === 'late'    ? 'badge badge-warning' :
    s === 'excused' ? 'badge badge-info'    :
                      'badge badge-info';
  return <span className={cls}>{status ?? '—'}</span>;
}

function SummaryTile({ label, value, color, textColor = '#fff' }) {
  return (
    <div style={{ ...styles.summaryTile, borderTop: `4px solid ${color}` }}>
      <div style={{ ...styles.summaryValue, color }}>{value}</div>
      <div style={styles.summaryLabel}>{label}</div>
    </div>
  );
}

/* ── Styles ── */
const styles = {
  infoBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    backgroundColor: '#e8f4f8',
    border: '1px solid #b8d9e8',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '20px',
    color: '#1a6080',
  },
  filterRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px 20px',
    gap: '14px',
  },
  emptySub: {
    fontSize: '14px',
    color: '#888',
    textAlign: 'center',
    maxWidth: '420px',
    margin: 0,
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '16px',
    marginTop: '4px',
  },
  summaryTile: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '20px 16px',
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: '32px',
    fontWeight: '700',
    lineHeight: 1,
    marginBottom: '6px',
  },
  summaryLabel: {
    fontSize: '13px',
    color: '#666',
  },
};
