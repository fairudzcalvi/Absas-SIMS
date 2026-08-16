import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TeacherSidebar from './TeacherSidebar';

export default function TeacherLayout() {
  const { session, role } = useAuth();

  if (session === undefined || role === null) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!session) return <Navigate to="/login" replace />;
  if (role === 'admin')   return <Navigate to="/dashboard" replace />;
  if (role === 'student') return <Navigate to="/student" replace />;

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

const styles = {
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#666' },
};
