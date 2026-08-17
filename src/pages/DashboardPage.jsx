import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/* ── SVG Icons ─────────────────────────────────────────── */
function IcoHome() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IcoStudent() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function IcoFaculty() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IcoLayers() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IcoClock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IcoEye() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IcoBolt() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

/* Quick action icons */
function IcoAddStudent() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

function IcoGrades() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IcoPayment() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function IcoTranscript() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function IcoMasterList() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M20 12v9H4V3h11" />
    </svg>
  );
}

/* ── Helpers ───────────────────────────────────────────── */
function formatDateTime(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const QUICK_ACTIONS = [
  { label: 'Add Student',         Icon: IcoAddStudent,  path: '/dashboard/students/new' },
  { label: 'Manage Grades',       Icon: IcoGrades,      path: '/dashboard/transcripts'  },
  { label: 'Record Payment',      Icon: IcoPayment,     path: '/dashboard/finance'      },
  { label: 'Generate Transcript', Icon: IcoTranscript,  path: '/dashboard/transcripts'  },
  { label: 'Master List',         Icon: IcoMasterList,  path: '/dashboard/students'     },
];

/* ── Page ──────────────────────────────────────────────── */
export default function DashboardPage() {
  const { supabase } = useAuth();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [stats, setStats] = useState({ students: 0, faculty: 0, gradeLevels: 10 });
  const [enrollments, setEnrollments] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchStats() {
      setLoadingStats(true);
      const [studentsRes, facultyRes, enrollRes] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('faculty').select('*', { count: 'exact', head: true }),
        supabase
          .from('students')
          .select('student_record_id, student_id, first_name, last_name, grade_level, section_name, created_at, status')
          .order('created_at', { ascending: false })
          .limit(10),
      ]);
      setStats({ students: studentsRes.count ?? 0, faculty: facultyRes.count ?? 0, gradeLevels: 10 });
      setEnrollments(enrollRes.data ?? []);
      setLoadingStats(false);
    }
    fetchStats();
  }, [supabase]);

  return (
    <>
      {/* Top Header */}
      <div className="top-header">
        <h1><IcoHome /> Dashboard Overview</h1>
        <div className="header-actions">
          <span className="date-time">{formatDateTime(now)}</span>
        </div>
      </div>

      {/* Page Body */}
      <div className="content-area">

        {/* Stat Cards */}
        <div className="stats-grid">
          <StatCard Icon={IcoStudent}  value={loadingStats ? '…' : stats.students}  label="Total Students" variant=""      />
          <StatCard Icon={IcoFaculty}  value={loadingStats ? '…' : stats.faculty}   label="Total Faculty"  variant="gold"  />
          <StatCard Icon={IcoLayers}   value={stats.gradeLevels}                    label="Grade Levels"   variant="green" />
        </div>

        {/* Recent Enrollments */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoClock /> Recent Enrollments</h2>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard/students')}>
              <IcoEye /> View All
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Grade</th>
                  <th>Section</th><th>Enrolled</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-message">No recent enrollments</td>
                  </tr>
                ) : (
                  enrollments.map((s) => (
                    <tr key={s.student_record_id}>
                      <td>{s.student_id ?? s.student_record_id}</td>
                      <td>{s.first_name} {s.last_name}</td>
                      <td>{s.grade_level}</td>
                      <td>{s.section_name}</td>
                      <td>{s.created_at ? new Date(s.created_at).toLocaleDateString() : '—'}</td>
                      <td><StatusBadge status={s.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoBolt /> Quick Actions</h2>
          </div>
          <div className="quick-actions-grid">
            {QUICK_ACTIONS.map(({ label, Icon, path }) => (
              <button key={label} className="quick-action-card" onClick={() => navigate(path)}>
                <div className="action-icon"><Icon /></div>
                <span className="action-label">{label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}

/* ── Sub-components ────────────────────────────────────── */
function StatCard({ Icon, value, label, variant }) {
  return (
    <div className={`stat-card${variant ? ` ${variant}` : ''}`}>
      <div className="stat-icon"><Icon /></div>
      <div className="stat-info">
        <div className="stat-number">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = (status ?? 'active').toLowerCase();
  const cls =
    s === 'active'     ? 'badge badge-success' :
    s === 'inactive'   ? 'badge badge-warning' :
    s === 'graduated'  ? 'badge badge-info'    :
    s === 'transferred'? 'badge badge-info'    :
                         'badge badge-info';
  return <span className={cls}>{status ?? 'Active'}</span>;
}
