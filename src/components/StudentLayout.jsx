import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StudentSidebar from './StudentSidebar';

export default function StudentLayout() {
  const { session, role } = useAuth();

  if (session === undefined || role === null) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!session) return <Navigate to="/login" replace />;
  if (role === 'admin')   return <Navigate to="/dashboard" replace />;
  if (role === 'teacher') return <Navigate to="/teacher" replace />;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <StudentSidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#666' },
};
