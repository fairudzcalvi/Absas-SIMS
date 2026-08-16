import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TeacherSidebar from './TeacherSidebar';

export default function TeacherLayout() {
  const { session, role } = useAuth();

  // Still resolving
  if (session === undefined || role === null) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#666' }}>
        Loading...
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <TeacherSidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
