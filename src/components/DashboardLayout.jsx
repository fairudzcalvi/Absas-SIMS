import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import MobileNavbar from './MobileNavbar';

export default function DashboardLayout() {
  const { session, role, selectedSchoolYear, activeSchoolYear, setSelectedSchoolYear, isHistoricalYear } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Automatically close sidebar when navigating to a new route
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (session === undefined || (session && role === null)) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!session) return <Navigate to="/login" replace />;
  if (role === 'teacher') return <Navigate to="/teacher" replace />;
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

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="main-content">
          <MobileNavbar
            role={role || 'admin'}
            onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          />
          {isHistoricalYear && selectedSchoolYear && (
            <div style={{
              background: '#fffbe6',
              borderBottom: '1px solid #ffe58f',
              padding: '10px 20px',
              fontSize: '13px',
              color: '#873800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>
                  Viewing archived records for <strong>S.Y. {selectedSchoolYear.year_label}</strong>.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSchoolYear(activeSchoolYear)}
                style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  borderRadius: '4px',
                  background: '#8B0000',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Return to Active S.Y. ({activeSchoolYear?.year_label || 'Current'})
              </button>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#666' },
};
