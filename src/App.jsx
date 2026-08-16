console.log("🔍 Checking .env variables:");
console.log("URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Admin
import DashboardLayout    from './components/DashboardLayout';
import LoginPage          from './pages/LoginPage';
import DashboardPage      from './pages/DashboardPage';
import StudentsPage       from './pages/StudentsPage';
import FacultyPage        from './pages/FacultyPage';
import SchedulesPage      from './pages/SchedulesPage';
import AttendancePage     from './pages/AttendancePage';
import TranscriptsPage    from './pages/TranscriptsPage';
import FinancePage        from './pages/FinancePage';
import SettingsPage       from './pages/SettingsPage';

// Teacher
import TeacherLayout          from './components/TeacherLayout';
import ClassListPage          from './pages/teacher/ClassListPage';
import TeacherAttendancePage  from './pages/teacher/TeacherAttendancePage';
import TeacherGradesPage      from './pages/teacher/TeacherGradesPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin dashboard */}
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

          {/* Teacher portal */}
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<ClassListPage />} />
            <Route path="attendance" element={<TeacherAttendancePage />} />
            <Route path="grades"     element={<TeacherGradesPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
