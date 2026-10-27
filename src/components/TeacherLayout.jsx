import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TeacherSidebar from './TeacherSidebar';
import MobileNavbar from './MobileNavbar';

export default function TeacherLayout() {
  const { session, role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Automatically close sidebar when navigating to a new route
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Show loading only while session is being resolved (undefined)
  // or while session exists but role hasn't been determined yet
  if (session === undefined || (session && role === null)) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!session) return <Navigate to="/login" replace />;
  if (role === 'admin')   return <Navigate to="/dashboard" replace />;
  if (role === 'student') return <Navigate to="/student" replace />;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Backdrop for mobile drawer */}
        <div
          className={`sidebar-backdrop ${sidebarOpen ? 'active' : ''}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />

        <TeacherSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="main-content">
          <MobileNavbar
            role="teacher"
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
