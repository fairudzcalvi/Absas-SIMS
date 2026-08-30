import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function IcoClassList() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
function IcoAttendance() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
function IcoGrades() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function IcoLogout() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

const NAV_ITEMS = [
  { label: 'Class List',          path: '/teacher',             Icon: IcoClassList,  end: true },
  { label: 'Students Attendance', path: '/teacher/attendance',  Icon: IcoAttendance, end: false },
  { label: 'Students Grades',     path: '/teacher/grades',      Icon: IcoGrades,     end: false },
];

export default function TeacherSidebar() {
  const { profile, logout, activeSchoolYear, activeQuarter } = useAuth();
  const name = profile
    ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()
    : 'Teacher';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>ABSAS-SIMS</h2>
        <div style={{
          marginTop: '6px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#FFD700',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
          <span>{activeSchoolYear?.year_label ? `S.Y. ${activeSchoolYear.year_label}` : 'S.Y. 2025-2026'}</span>
          {activeQuarter && (
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>
              • {activeQuarter.quarter_name}
            </span>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ label, path, Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="icon"><Icon /></span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-name">{name || 'System Administrator'}</div>
          <div className="user-role">{profile?.role ?? 'Administrator'}</div>
        </div>
        <button className="logout-btn-sidebar" onClick={logout}>
          <IcoLogout /> Logout
        </button>
      </div>
    </aside>
  );
}
