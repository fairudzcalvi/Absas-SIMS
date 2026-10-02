import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

/* eslint-disable react-refresh/only-export-components */
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [role, setRole]       = useState(null);       // null = not resolved yet, 'admin' | 'teacher' | 'student' | 'unknown'
  const [profile, setProfile] = useState(null);        // the matching admins/faculty/students row
  const [activeSchoolYear, setActiveSchoolYear] = useState(null);
  const [activeQuarter, setActiveQuarter]       = useState(null);
  const [activePolicy, setActivePolicy]         = useState(null);

  async function fetchAcademicInfo() {
    try {
      // 1. Fetch active school year
      const { data: syData } = await supabase
        .from('school_years')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (syData) {
        setActiveSchoolYear(syData);
        // 2. Fetch active quarter for this SY
        const { data: qData } = await supabase
          .from('quarters')
          .select('*')
          .eq('school_year_id', syData.id)
          .eq('is_active', true)
          .maybeSingle();
        setActiveQuarter(qData || null);
      } else {
        // Fallback to school_settings if school_years table has no active record
        const { data: settings } = await supabase
          .from('school_settings')
          .select('school_year')
          .limit(1)
          .maybeSingle();
        if (settings?.school_year) {
          setActiveSchoolYear({ year_label: settings.school_year });
        }
      }

      // 3. Fetch active school policy (grading weights, passing mark, attendance threshold)
      const { data: polData } = await supabase
        .from('school_policies')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      setActivePolicy(polData || {
        policy_name: 'DepEd Standard Policy',
        written_work_pct: 30,
        performance_task_pct: 50,
        quarterly_exam_pct: 20,
        passing_grade: 75,
        attendance_warning_threshold: 10,
      });
    } catch (err) {
      console.error('Error fetching academic info and policies:', err);
    }
  }

  async function resolveRole(currentSession) {
    if (!currentSession) {
      setRole(null);
      setProfile(null);
      return;
    }

    const email = currentSession.user.email;

    // Check admins first
    const { data: admin } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (admin) {
      setRole('admin');
      setProfile(admin);
      return;
    }

    // Then check faculty (teachers)
    const { data: faculty } = await supabase
      .from('faculty')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (faculty) {
      setRole('teacher');
      setProfile(faculty);
      return;
    }

    // Then check students
    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (student) {
      setRole('student');
      setProfile(student);
      return;
    }

    // Logged in but not found in any table
    setRole('unknown');
    setProfile(null);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      resolveRole(session);
      fetchAcademicInfo();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      resolveRole(session);
      fetchAcademicInfo();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setRole(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{
      session,
      supabase,
      role,
      profile,
      activeSchoolYear,
      activeQuarter,
      activePolicy,
      refreshAcademicInfo: fetchAcademicInfo,
      refreshAcademicYear: fetchAcademicInfo,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}