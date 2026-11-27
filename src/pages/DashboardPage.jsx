import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cleanSectionName } from '../utils/formatters';

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
  { label: 'Enroll Student',      Icon: IcoAddStudent,  path: '/dashboard/enrollment'   },
  { label: 'Manage Grades',       Icon: IcoGrades,      path: '/dashboard/transcripts'  },
  { label: 'Record Payment',      Icon: IcoPayment,     path: '/dashboard/finance'      },
  { label: 'Generate Transcript', Icon: IcoTranscript,  path: '/dashboard/transcripts'  },
  { label: 'Master List',         Icon: IcoMasterList,  path: '/dashboard/students'     },
];

/* ── Page ──────────────────────────────────────────────── */
export default function DashboardPage() {
  const { supabase, selectedSchoolYear, activeSchoolYear, activeQuarter, selectedQuarter, isHistoricalYear } = useAuth();
  const currentSy = selectedSchoolYear || activeSchoolYear;
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [stats, setStats] = useState({ students: 0, faculty: 0, gradeLevels: 12 });
  const [enrollments, setEnrollments] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchStats() {
      setLoadingStats(true);
      const [studentsRes, facultyRes, secRes, enrRes] = await Promise.all([
        supabase
          .from('students')
          .select('student_record_id, student_id, lrn_id, first_name, last_name, grade_level, section_name, created_at, status, is_archived')
          .order('created_at', { ascending: false }),
        supabase
          .from('faculty')
          .select('faculty_record_id, employment_status, is_archived'),
        currentSy?.id
          ? supabase.from('sections').select('id, section_name').eq('school_year_id', currentSy.id)
          : Promise.resolve({ data: [] }),
        currentSy?.id
          ? supabase.from('enrollments').select('*').eq('school_year_id', currentSy.id).order('created_at', { ascending: false })
          : Promise.resolve({ data: [] }),
      ]);

      const allStu = studentsRes.data ?? [];
      const activeStu = allStu.filter(s => !s.is_archived && !['archived', 'inactive', 'graduated', 'dropped', 'transferred', 'transferred out'].includes((s.status || 'active').toLowerCase()));
      const activeStuIds = new Set(activeStu.map(s => s.student_record_id));
      const activeFacCount = (facultyRes.data ?? []).filter(
        f => !f.is_archived && !['archived', 'inactive', 'resigned', 'terminated', 'retired', 'transferred'].includes((f.employment_status || 'active').toLowerCase())
      ).length;
      const syEnrs = enrRes.data ?? [];
      const uniqueSyEnrIds = new Set(
        syEnrs
          .filter(e => !['Dropped', 'Transferred Out'].includes(e.enrollment_status))
          .filter(e => isHistoricalYear || activeStuIds.has(e.student_record_id))
          .map(e => e.student_record_id)
      );

      // If enrollments exist for the selected S.Y., show recent 10 S.Y. enrollments; otherwise recent active students (active year only)
      const recentList = syEnrs.length > 0
        ? syEnrs.slice(0, 10).map(e => {
            const stu = allStu.find(s => s.student_record_id === e.student_record_id) || {};
            const sec = (secRes.data ?? []).find(sc => sc.id === e.section_id);
            return {
              student_record_id: `${e.id}-${e.student_record_id}`,
              lrn_id: stu.lrn_id,
              student_id: stu.student_id,
              first_name: stu.first_name || 'Student',
              last_name: stu.last_name || '',
              grade_level: e.grade_level || stu.grade_level,
              section_name: sec?.section_name || (!isHistoricalYear ? stu.section_name : ''),
              created_at: e.date_enrolled || e.created_at,
              status: e.enrollment_status || 'Enrolled',
            };
          })
        : (!isHistoricalYear ? activeStu.slice(0, 10) : []);

      setStats({
        students: isHistoricalYear
          ? uniqueSyEnrIds.size
          : (uniqueSyEnrIds.size > 0 ? Math.max(activeStu.length, uniqueSyEnrIds.size) : activeStu.length),
        faculty: activeFacCount,
        gradeLevels: 12,
      });
      setEnrollments(recentList);
      setLoadingStats(false);
    }
    fetchStats();
  }, [supabase, currentSy, isHistoricalYear]);

  return (
    <>
      {/* Top Header */}
      <div className="top-header">
        <h1><IcoHome /> Dashboard Overview</h1>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#8B0000',
            color: '#FFD700',
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(139,0,0,0.15)',
          }}>
            <span>{currentSy?.year_label ? `S.Y. ${currentSy.year_label}` : 'S.Y. 2026-2027'}</span>
            {!isHistoricalYear && (selectedQuarter || activeQuarter) && (
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontSize: '11px' }}>
                {(selectedQuarter || activeQuarter).quarter_name}
              </span>
            )}
            {isHistoricalYear && (
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontSize: '11px' }}>
                Archived
              </span>
            )}
          </div>
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
                  <th>DepEd LRN</th><th>Student Name</th><th>Grade</th>
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
                      <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#8B0000' }}>{s.lrn_id || s.student_id || '—'}</td>
                      <td>{s.first_name} {s.last_name}</td>
                      <td>{s.grade_level ? `Grade ${s.grade_level}` : '—'}</td>
                      <td>{cleanSectionName(s.section_name, s.grade_level) || '—'}</td>
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
