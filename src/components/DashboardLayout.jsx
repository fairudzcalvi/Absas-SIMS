import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const { session, role } = useAuth();

  // Still resolving session or role
  if (session === undefined || role === null) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#666' }}>
        Loading...
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but not an admin → send to their portal (or login if unrecognized)
  if (role !== 'admin') {
    return <Navigate to={role === 'teacher' ? '/teacher' : '/login'} replace />;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}