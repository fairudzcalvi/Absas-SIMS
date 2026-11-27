import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { emailPattern } from '../utils/email';

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
  const [schoolYears, setSchoolYears]                   = useState([]);
  const [activeSchoolYear, setActiveSchoolYear]         = useState(null);
  const [selectedSchoolYear, setSelectedSchoolYear]     = useState(null);
  const [activeQuarter, setActiveQuarter]               = useState(null);
  const [selectedQuarter, setSelectedQuarter]           = useState(null);
  const [availableQuarters, setAvailableQuarters]       = useState([]);
  const [activePolicy, setActivePolicy]                 = useState(null);
  const [academicPolicies, setAcademicPolicies]         = useState([]);
  const prevActiveIdRef = useRef(null);

  async function fetchAcademicInfo() {
    try {
      // 1. Fetch all school years
      const { data: allYears } = await supabase
        .from('school_years')
        .select('*')
        .order('created_at', { ascending: false });

      const yearsList = allYears || [];
      setSchoolYears(yearsList);

      const activeSy = yearsList.find(y => y.is_active) || yearsList[0] || null;
      const prevActiveId = prevActiveIdRef.current;
      prevActiveIdRef.current = activeSy?.id || null;
      setActiveSchoolYear(activeSy);

      // Default selectedSchoolYear to active; switch automatically if the user was viewing the active S.Y. and a new S.Y. became active
      setSelectedSchoolYear(prev => {
        if (!prev) return activeSy;
        const stillExists = yearsList.find(y => y.id === prev.id);
        if (!stillExists) return activeSy;
        if (prevActiveId && String(prev.id) === String(prevActiveId) && activeSy && String(activeSy.id) !== String(prev.id)) {
          return activeSy;
        }
        return stillExists;
      });

      // 2. Fetch active quarter for the active school year
      if (activeSy) {
        const { data: qData } = await supabase
          .from('quarters')
          .select('*')
          .eq('school_year_id', activeSy.id)
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
          const fallback = { year_label: settings.school_year, is_active: true };
          setActiveSchoolYear(fallback);
          setSelectedSchoolYear(prev => prev || fallback);
        }
      }

      // 3. Fetch active Academic grading policies (exclude Financial fee-matrix JSON and non-academic entries)
      const { data: polRows } = await supabase
        .from('school_policies')
        .select('*')
        .eq('is_active', true)
        .eq('category', 'Academic')
        .order('created_at', { ascending: false });

      const polList = polRows || [];
      setAcademicPolicies(polList);
      const defaultStandard = polList.find(p =>
        /standard|jhs|elementary|deped order/i.test(p.policy_name || '') &&
        !/stem|shs|senior high/i.test(p.policy_name || '')
      ) || polList[0] || null;

      setActivePolicy(defaultStandard || {
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

  // Fetch quarters whenever selectedSchoolYear changes
  useEffect(() => {
    async function loadSelectedSyQuarters() {
      if (!selectedSchoolYear?.id) {
        setAvailableQuarters([]);
        setSelectedQuarter(null);
        return;
      }
      try {
        const { data: qData } = await supabase
          .from('quarters')
          .select('*')
          .eq('school_year_id', selectedSchoolYear.id)
          .order('quarter_number', { ascending: true });

        const qList = qData || [];
        setAvailableQuarters(qList);
        const activeQ = qList.find(q => q.is_active) || qList[0] || null;
        setSelectedQuarter(activeQ);
      } catch (err) {
        console.error('Error loading quarters for selected school year:', err);
      }
    }
    loadSelectedSyQuarters();
  }, [selectedSchoolYear]);

  async function resolveRole(currentSession) {
    if (!currentSession) {
      setRole(null);
      setProfile(null);
      return;
    }

    // Case-insensitive match so legacy mixed-case emails in the DB still resolve a role
    const email = emailPattern(currentSession.user.email);

    // Check admins first
    const { data: admin } = await supabase
      .from('admins')
      .select('*')
      .ilike('email', email)
      .limit(1)
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
      .ilike('email', email)
      .limit(1)
      .maybeSingle();

    if (faculty) {
      const empStatus = (faculty.employment_status || 'active').toLowerCase();
      if (faculty.is_archived || ['archived', 'inactive', 'resigned', 'terminated'].includes(empStatus)) {
        setRole('inactive');
        setProfile(null);
        return;
      }
      setRole('teacher');
      setProfile(faculty);
      return;
    }

    // Then check students
    const { data: student } = await supabase
      .from('students')
      .select('*')
      .ilike('email', email)
      .limit(1)
      .maybeSingle();

    if (student) {
      const stuStatus = (student.status || 'active').toLowerCase();
      if (student.is_archived || ['archived', 'inactive', 'dropped', 'transferred', 'transferred out'].includes(stuStatus)) {
        setRole('inactive');
        setProfile(null);
        return;
      }
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
      schoolYears,
      activeSchoolYear,
      selectedSchoolYear,
      setSelectedSchoolYear,
      activeQuarter,
      selectedQuarter,
      setSelectedQuarter,
      availableQuarters,
      isHistoricalYear: Boolean(selectedSchoolYear && !selectedSchoolYear.is_active),
      activePolicy,
      academicPolicies,
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