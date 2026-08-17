import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Admin
import DashboardLayout   from './components/DashboardLayout';
import LoginPage         from './pages/LoginPage';
import DashboardPage     from './pages/DashboardPage';
import StudentsPage      from './pages/StudentsPage';
import FacultyPage       from './pages/FacultyPage';
import SchedulesPage     from './pages/SchedulesPage';
import TranscriptsPage   from './pages/TranscriptsPage';
import FinancePage       from './pages/FinancePage';
import SettingsPage      from './pages/SettingsPage';

// Teacher
import TeacherLayout         from './components/TeacherLayout';
import ClassListPage         from './pages/teacher/ClassListPage';
import TeacherAttendancePage from './pages/teacher/TeacherAttendancePage';
import TeacherGradesPage     from './pages/teacher/TeacherGradesPage';

// Student
import StudentLayout          from './components/StudentLayout';
import StudentProfilePage     from './pages/student/StudentProfilePage';
import StudentGradesPage      from './pages/student/StudentGradesPage';
import StudentSchedulesPage   from './pages/student/StudentSchedulesPage';
import StudentAttendancePage  from './pages/student/StudentAttendancePage';
import StudentTranscriptPage  from './pages/student/StudentTranscriptPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="students"     element={<StudentsPage />} />
            <Route path="students/new" element={<StudentsPage />} />
            <Route path="faculty"      element={<FacultyPage />} />
            <Route path="schedules"    element={<SchedulesPage />} />
            <Route path="transcripts"  element={<TranscriptsPage />} />
            <Route path="finance"      element={<FinancePage />} />
            <Route path="settings"     element={<SettingsPage />} />
          </Route>

          {/* Teacher */}
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<ClassListPage />} />
            <Route path="attendance" element={<TeacherAttendancePage />} />
            <Route path="grades"     element={<TeacherGradesPage />} />
          </Route>

          {/* Student */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentProfilePage />} />
            <Route path="grades"     element={<StudentGradesPage />} />
            <Route path="schedules"  element={<StudentSchedulesPage />} />
            <Route path="attendance" element={<StudentAttendancePage />} />
            <Route path="transcript" element={<StudentTranscriptPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
