import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import FacultyPage from './pages/FacultyPage';
import SchedulesPage from './pages/SchedulesPage';
import AttendancePage from './pages/AttendancePage';
import TranscriptsPage from './pages/TranscriptsPage';
import FinancePage from './pages/FinancePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected — all dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="students"     element={<StudentsPage />} />
            <Route path="students/new" element={<StudentsPage />} />
            <Route path="faculty"      element={<FacultyPage />} />
            <Route path="schedules"    element={<SchedulesPage />} />
            <Route path="attendance"   element={<AttendancePage />} />
            <Route path="transcripts"  element={<TranscriptsPage />} />
            <Route path="finance"      element={<FinancePage />} />
            <Route path="settings"     element={<SettingsPage />} />
          </Route>

          {/* Catch-all → login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
