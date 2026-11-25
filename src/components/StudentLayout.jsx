import { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StudentSidebar from './StudentSidebar';
import MobileNavbar from './MobileNavbar';

export default function StudentLayout() {
  const { session, role } = useAuth();
  const location = useLocation();
  // Sidebar is open only for the route it was opened on, so navigating closes it
  // automatically without resetting state inside an effect.
  const [openPath, setOpenPath] = useState(null);
  const sidebarOpen = openPath === location.pathname;
  const setSidebarOpen = (v) => setOpenPath(prev => {
    const cur = prev === location.pathname;
    const next = typeof v === 'function' ? v(cur) : v;
    return next ? location.pathname : null;
  });

  // Show loading only while session is being resolved (undefined)
  // or while session exists but role hasn't been determined yet
  if (session === undefined || (session && role === null)) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!session) return <Navigate to="/login" replace />;
  if (role === 'admin')   return <Navigate to="/dashboard" replace />;
  if (role === 'teacher') return <Navigate to="/teacher" replace />;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Backdrop for mobile drawer */}
        <div
          className={`sidebar-backdrop ${sidebarOpen ? 'active' : ''}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />

        <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="main-content">
          <MobileNavbar
            role="student"
            onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#666' },
};
