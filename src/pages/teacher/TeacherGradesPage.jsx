import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCurriculumSubjects, sortSubjectsByCurriculum } from '../../utils/curriculum';
import { cleanSectionName } from '../../utils/formatters';

function IcoGrades() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function IcoSave() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
  );
}
function IcoCalendar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IcoLock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
function IcoShield() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}
function IcoUserCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="8.5" cy="7" r="4"/>
      <polyline points="17 11 19 13 23 9"/>
    </svg>
  );
}

const GRADE_OPTIONS  = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `Grade ${i + 1}` }));
const QUARTER_LABELS = { '1Q': '1st Quarter', '2Q': '2nd Quarter', '3Q': '3rd Quarter', '4Q': '4th Quarter' };

// DepEd Transmutation Table (Initial Grade -> Transmuted Grade)
// Sorted descending by the lower bound of each range.
const TRANSMUTATION_TABLE = [
  { min: 100.00, grade: 100 },
  { min: 98.40,  grade: 99 },
  { min: 96.80,  grade: 98 },
  { min: 95.20,  grade: 97 },
  { min: 93.60,  grade: 96 },
  { min: 92.00,  grade: 95 },
  { min: 90.40,  grade: 94 },
  { min: 88.80,  grade: 93 },
  { min: 87.20,  grade: 92 },
  { min: 85.60,  grade: 91 },
  { min: 84.00,  grade: 90 },
  { min: 82.40,  grade: 89 },
  { min: 80.80,  grade: 88 },
  { min: 79.20,  grade: 87 },
  { min: 77.60,  grade: 86 },
  { min: 76.00,  grade: 85 },
  { min: 74.40,  grade: 84 },
  { min: 72.80,  grade: 83 },
  { min: 71.20,  grade: 82 },
  { min: 69.60,  grade: 81 },
  { min: 68.00,  grade: 80 },
  { min: 66.40,  grade: 79 },
  { min: 64.80,  grade: 78 },
  { min: 63.20,  grade: 77 },
  { min: 61.60,  grade: 76 },
  { min: 60.00,  grade: 75 },
  { min: 56.00,  grade: 74 },
  { min: 52.00,  grade: 73 },
  { min: 48.00,  grade: 72 },
  { min: 44.00,  grade: 71 },
  { min: 40.00,  grade: 70 },
  { min: 36.00,  grade: 69 },
  { min: 32.00,  grade: 68 },
  { min: 28.00,  grade: 67 },
  { min: 24.00,  grade: 66 },
  { min: 20.00,  grade: 65 },
  { min: 16.00,  grade: 64 },
  { min: 12.00,  grade: 63 },
  { min: 8.00,   grade: 62 },
  { min: 4.00,   grade: 61 },
  { min: 0.00,   grade: 60 },
];

// Converts a raw "Initial Grade" (0-100) into its DepEd "Transmuted Grade".
function transmuteGrade(initialGrade) {
  if (initialGrade === null || initialGrade === undefined || isNaN(initialGrade)) return '';
  const clamped = Math.min(100, Math.max(0, initialGrade));
  const row = TRANSMUTATION_TABLE.find(r => clamped >= r.min);
  return row ? row.grade : 60;
}

const DEFAULT_SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Filipino',
  'Araling Panlipunan',
  'MAPEH',
  'Edukasyon sa Pagpapakatao (EsP)',
  'Technology and Livelihood Education (TLE)',
  'Computer / ICT',
  'Music',
  'Arts',
  'Physical Education',
  'Health',
];

export default function TeacherGradesPage() {
  const { supabase, profile, activePolicy, selectedSchoolYear, activeSchoolYear, isHistoricalYear } = useAuth();
  const location = useLocation();

  const currentSy = selectedSchoolYear || activeSchoolYear;

  const [gradeFilter, setGrade]   = useState(location.state?.presetGrade ? String(location.state.presetGrade) : '');
  const [subject, setSubject]     = useState(location.state?.presetSubject || '');
  const [sectionFilter, setSectionFilter] = useState(location.state?.presetSection || '');
  const [quarter, setQuarter]     = useState('1Q');
  const [availableQuarters, setAvailableQuarters] = useState([
    { key: '1Q', num: 1, label: '1st Quarter' },
    { key: '2Q', num: 2, label: '2nd Quarter' },
    { key: '3Q', num: 3, label: '3rd Quarter' },
    { key: '4Q', num: 4, label: '4th Quarter' },
  ]);
  const [students, setStudents]   = useState([]);
  const [gradeMap, setGradeMap]   = useState({}); // { student_record_id: { written_works, performance_tasks, quarterly_assessment, quarter_grade } }
  const [loading, setLoading]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [subjects, setSubjects]   = useState(DEFAULT_SUBJECTS);
  const [availableSections, setAvailableSections] = useState([]);
  const [teacherSchedules, setTeacherSchedules]   = useState([]);
  const [customSubjectMode, setCustomSubjectMode] = useState(false);
  const [gradingLocked, setGradingLocked] = useState(false);

  // Fetch configured quarters for the selected/active school year
  useEffect(() => {
    async function loadQuarters() {
      if (!currentSy?.id) return;

      const { data: qData } = await supabase
        .from('quarters')
        .select('*')
        .eq('school_year_id', currentSy.id)
        .order('quarter_number', { ascending: true });

      if (qData && qData.length > 0) {
        const mapped = qData.map(q => ({
          key: `${q.quarter_number}Q`,
          num: q.quarter_number,
          label: q.quarter_name,
          semester: q.semester_name || (q.quarter_number <= 2 ? '1st Semester' : '2nd Semester'),
        }));
        setAvailableQuarters(mapped);
        setQuarter(q => (mapped.some(m => m.key === q) ? q : mapped[0].key));
      }
    }
    loadQuarters();
  }, [supabase, currentSy]);

  // Check if grading is locked for the selected quarter and school year
  useEffect(() => {
    async function checkGradingLock() {
      if (isHistoricalYear) {
        setGradingLocked(true);
        return;
      }

      const qNum = parseInt(quarter?.replace('Q', ''));
      if (!qNum || !currentSy?.id) return;

      const { data: qData } = await supabase
        .from('quarters')
        .select('is_grading_open')
        .eq('school_year_id', currentSy.id)
        .eq('quarter_number', qNum)
        .limit(1)
        .maybeSingle();

      setGradingLocked(qData ? !qData.is_grading_open : false);
    }
    checkGradingLock();
  }, [supabase, quarter, currentSy, isHistoricalYear]);

  // Load subjects according to grade level curriculum + db subjects
  useEffect(() => {
    async function loadSubjects() {
      const gl = gradeFilter ? Number(gradeFilter) : null;
      const baseList = gl ? getCurriculumSubjects(gl) : DEFAULT_SUBJECTS;

      const { data, error } = await supabase
        .from('subjects')
        .select('subject_name, grade_level')
        .eq('status', 'Active');
      
      const dbSubjects = (!error && data) 
        ? data.filter(s => !gl || !s.grade_level || s.grade_level === gl).map(s => s.subject_name)
        : [];

      const { data: gradeSubjs } = await supabase
        .from('grades')
        .select('subject');
      
      const prevSubjs = gradeSubjs ? gradeSubjs.map(g => g.subject).filter(Boolean) : [];
      const unique = [...new Set([...baseList, ...dbSubjects, ...prevSubjs])];
      const sorted = sortSubjectsByCurriculum(unique, gl);
      setSubjects(sorted);
    }
    loadSubjects();
  }, [supabase, gradeFilter]);

  // Leadership & Coverage Authorization determination
  const isLeadership = useMemo(() => {
    if (!profile) return false;
    if (profile.can_edit_all_grades || profile.coverage_authorized || profile.is_admin || profile.is_leadership) {
      return true;
    }
    const role = (profile.role || '').toLowerCase();
    const pos = (profile.position || '').toLowerCase();
    const leadershipKeywords = ['principal', 'head', 'coordinator', 'admin', 'dean', 'director', 'lead'];
    return leadershipKeywords.some(kw => role.includes(kw) || pos.includes(kw));
  }, [profile]);

  // Load teacher's personal schedules
  useEffect(() => {
    async function loadTeacherSchedules() {
      if (!profile) return;
      const email = (profile.email || '').toLowerCase().trim();
      const facId = (profile.faculty_id || '').toLowerCase().trim();
      const facRecId = profile.faculty_record_id ? String(profile.faculty_record_id) : '';
      const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.toLowerCase().trim();

      const { data } = await supabase
        .from('schedules')
        .select('*')
        .order('day_of_week')
        .order('time_start');

      if (data) {
        const mySch = data.filter(s => {
          const t = (s.teacher || '').toLowerCase().trim();
          const fId = (s.faculty_id || '').toLowerCase().trim();
          const fRecId = s.faculty_record_id ? String(s.faculty_record_id) : '';
          const tn = (s.teacher_name || '').toLowerCase().trim();

          return (
            (email && (t === email || tn === email)) ||
            (facId && (fId === facId || t === facId)) ||
            (facRecId && fRecId === facRecId) ||
            (fullName && (t === fullName || tn === fullName))
          );
        });
        setTeacherSchedules(mySch);
      }
    }
    loadTeacherSchedules();
  }, [supabase, profile]);

  // Load sections for selected grade level
  useEffect(() => {
    async function loadSections() {
      if (!gradeFilter) {
        setAvailableSections([]);
        return;
      }
      let secQuery = supabase
        .from('sections')
        .select('id, section_name, grade_level, adviser_id')
        .eq('grade_level', Number(gradeFilter))
        .eq('status', 'Active')
        .order('section_name');

      if (currentSy?.id) {
        secQuery = secQuery.eq('school_year_id', currentSy.id);
      }

      const { data } = await secQuery;

      const seen = new Set();
      const unique = (data || []).filter(sec => {
        const name = cleanSectionName(sec.section_name, sec.grade_level).toLowerCase().trim();
        if (!name || seen.has(name)) return false;
        seen.add(name);
        return true;
      });
      setAvailableSections(unique);
    }
    loadSections();
  }, [supabase, gradeFilter, currentSy]);

  // Check if current teacher is the designated class adviser for the selected section
  const isAdvisoryForSection = useMemo(() => {
    if (!profile || !sectionFilter || !availableSections.length) return false;
    const currentSection = availableSections.find(sec =>
      cleanSectionName(sec.section_name, gradeFilter).toLowerCase().trim() === cleanSectionName(sectionFilter, gradeFilter).toLowerCase().trim()
    );
    if (!currentSection) return false;

    const facRecId = profile.faculty_record_id ? String(profile.faculty_record_id) : '';
    const facId = (profile.faculty_id || '').toLowerCase().trim();
    const secAdv = currentSection.adviser_id ? String(currentSection.adviser_id) : '';

    return (
      (facRecId && secAdv === facRecId) ||
      (facId && secAdv.toLowerCase() === facId) ||
      (profile.adviser_grade_level && Number(profile.adviser_grade_level) === Number(gradeFilter) && (profile.role === 'Adviser' || profile.role === 'Both'))
    );
  }, [profile, sectionFilter, availableSections, gradeFilter]);

  // Check if current teacher is assigned in schedules for this grade, subject, and section
  const isAssignedTeacher = useMemo(() => {
    if (!teacherSchedules.length || !gradeFilter || !subject) return false;
    const gl = Number(gradeFilter);
    const cleanSubj = subject.toLowerCase().trim();

    return teacherSchedules.some(sch => {
      if (Number(sch.grade_level) !== gl) return false;
      if ((sch.subject || '').toLowerCase().trim() !== cleanSubj) return false;

      if (sectionFilter) {
        if (!sch.section_name) return true; // grade-wide schedule assignment
        return cleanSectionName(sch.section_name, gl).toLowerCase().trim() === cleanSectionName(sectionFilter, gl).toLowerCase().trim();
      }

      // If "All Sections" is chosen, teacher is only authorized if schedule has no section restriction (grade-wide)
      return !sch.section_name;
    });
  }, [teacherSchedules, gradeFilter, subject, sectionFilter]);

  // Combined authorization check
  const isAuthorizedToGrade = Boolean(isLeadership || isAssignedTeacher || isAdvisoryForSection);

  // Auto-select assigned section if teacher only has one assigned section for this grade and subject
  useEffect(() => {
    if (!gradeFilter || !subject || sectionFilter || isLeadership) return;
    const gl = Number(gradeFilter);
    const cleanSubj = subject.toLowerCase().trim();
    const matchingSchedules = teacherSchedules.filter(sch =>
      Number(sch.grade_level) === gl &&
      (sch.subject || '').toLowerCase().trim() === cleanSubj &&
      sch.section_name
    );
    if (matchingSchedules.length === 1) {
      const targetSec = cleanSectionName(matchingSchedules[0].section_name, gl);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- guarded; runs only when deps change
      setSectionFilter(targetSec);
    }
  }, [gradeFilter, subject, sectionFilter, teacherSchedules, isLeadership]);

  // Look up who the officially assigned teacher is for this section and subject (for informative notices)
  const [assignedTeacherInfo, setAssignedTeacherInfo] = useState(null);

  useEffect(() => {
    async function checkAssignedTeacher() {
      if (!gradeFilter || !subject || !sectionFilter) {
        setAssignedTeacherInfo(null);
        return;
      }
      const gl = Number(gradeFilter);
      let q = supabase
        .from('schedules')
        .select('teacher, teacher_name, faculty_id, section_name')
        .eq('grade_level', gl)
        .eq('subject', subject);

      if (currentSy?.id) {
        q = q.or(`school_year_id.eq.${currentSy.id},school_year.eq.${currentSy.year_label}`);
      }

      const { data } = await q;
      if (data && data.length > 0) {
        const secLower = cleanSectionName(sectionFilter, gl).toLowerCase().trim();
        const match = data.find(s => {
          if (!s.section_name) return true;
          return cleanSectionName(s.section_name, gl).toLowerCase().trim() === secLower;
        });
        if (match) {
          setAssignedTeacherInfo(match.teacher_name || match.teacher || match.faculty_id || 'Another Faculty Member');
        } else {
          setAssignedTeacherInfo(null);
        }
      } else {
        setAssignedTeacherInfo(null);
      }
    }
    checkAssignedTeacher();
  }, [supabase, gradeFilter, subject, sectionFilter, currentSy]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!gradeFilter || !subject || !quarter) return;
      setLoading(true);

      let q = supabase
        .from('students')
        .select('student_record_id, student_id, first_name, last_name, section_name')
        .eq('grade_level', Number(gradeFilter));

      if (sectionFilter) {
        q = q.eq('section_name', sectionFilter);
      }

      const { data: studs, error: studsError } = await q.order('last_name');

      if (studsError) {
        console.error("Error loading students:", studsError);
        if (!ignore) setLoading(false);
        return;
      }

      const ids = (studs ?? []).map(s => s.student_record_id);
      let gQuery = supabase
        .from('grades')
        .select('grade_id, student_record_id, written_works, performance_tasks, quarterly_assessment, participation, quarter_grade, remarks, school_year, school_year_id')
        .eq('subject', subject)
        .eq('quarter', quarter)
        .in('student_record_id', ids);

      if (currentSy?.id) {
        gQuery = gQuery.or(`school_year_id.eq.${currentSy.id},school_year.eq.${currentSy.year_label}`);
      }

      const { data: existing, error: gradesError } = await gQuery;

      if (gradesError) {
        console.error("Error loading grades:", gradesError);
      }

      const map = {};
      (existing ?? []).forEach(g => { map[g.student_record_id] = { ...g }; });
      (studs ?? []).forEach(s => {
        if (!map[s.student_record_id]) {
          map[s.student_record_id] = { written_works: '', performance_tasks: '', quarterly_assessment: '', participation: '', quarter_grade: '', remarks: '' };
        }
      });

      if (!ignore) {
        setStudents(studs ?? []);
        setGradeMap(map);
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [supabase, gradeFilter, subject, quarter, sectionFilter, currentSy]);

  const passingMark = activePolicy?.passing_grade != null ? Number(activePolicy.passing_grade) : 75;
  const wwWeight = activePolicy?.written_work_pct != null ? Number(activePolicy.written_work_pct) / 100 : 0.30;
  const ptWeight = activePolicy?.performance_task_pct != null ? Number(activePolicy.performance_task_pct) / 100 : 0.50;
  const qaWeight = activePolicy?.quarterly_exam_pct != null ? Number(activePolicy.quarterly_exam_pct) / 100 : 0.20;

  function updateGrade(studentId, field, value) {
    setGradeMap(prev => {
      const updated = { ...prev[studentId], [field]: value };
      
      const ww = parseFloat(updated.written_works);
      const pt = parseFloat(updated.performance_tasks);
      const qa = parseFloat(updated.quarterly_assessment);

      let weightedSum = 0;
      let totalWeight = 0;

      if (!isNaN(ww)) {
        weightedSum += ww * wwWeight;
        totalWeight += wwWeight;
      }
      if (!isNaN(pt)) {
        weightedSum += pt * ptWeight;
        totalWeight += ptWeight;
      }
      if (!isNaN(qa)) {
        weightedSum += qa * qaWeight;
        totalWeight += qaWeight;
      }

      // If only participation is provided
      if (isNaN(ww) && isNaN(pt) && isNaN(qa)) {
        const part = parseFloat(updated.participation);
        if (!isNaN(part)) {
          weightedSum = part;
          totalWeight = 1;
        }
      }

      const initialGrade = totalWeight > 0 ? (weightedSum / totalWeight) : NaN;
      updated.initial_grade = !isNaN(initialGrade) ? initialGrade.toFixed(2) : '';
      updated.quarter_grade = !isNaN(initialGrade) ? String(transmuteGrade(initialGrade)) : '';
      return { ...prev, [studentId]: updated };
    });
  }

  async function handleSave() {
    if (students.length === 0 || !subject) return;
    if (isHistoricalYear) {
      alert(`Cannot edit grades for archived S.Y. ${currentSy?.year_label}. Past school years are read-only.`);
      return;
    }
    if (!isAuthorizedToGrade) {
      alert("Grade editing is restricted to assigned section teachers. Please contact school leadership for coverage or administrative authorization.");
      return;
    }
    setSaving(true);

    const rows = students.map(s => ({
      student_record_id:    s.student_record_id,
      subject,
      quarter,
      school_year_id:       currentSy?.id || null,
      school_year:          currentSy?.year_label || '2025-2026',
      written_works:        gradeMap[s.student_record_id]?.written_works        ? Number(gradeMap[s.student_record_id].written_works)        : 0,
      performance_tasks:    gradeMap[s.student_record_id]?.performance_tasks    ? Number(gradeMap[s.student_record_id].performance_tasks)    : 0,
      quarterly_assessment: gradeMap[s.student_record_id]?.quarterly_assessment ? Number(gradeMap[s.student_record_id].quarterly_assessment) : 0,
      participation:        gradeMap[s.student_record_id]?.participation        ? Number(gradeMap[s.student_record_id].participation)        : 0,
      quarter_grade:        gradeMap[s.student_record_id]?.quarter_grade        ? Number(gradeMap[s.student_record_id].quarter_grade)        : 0,
      remarks:              gradeMap[s.student_record_id]?.remarks              ?? null,
    }));

    try {
      // 1. Try upserting with multi-year conflict resolution
      const { error: err1 } = await supabase.from('grades').upsert(rows, { onConflict: 'student_record_id,subject,quarter,school_year' });
      if (err1) {
        // Fallback to legacy constraint if multi-year constraint not active in db
        const { error: err2 } = await supabase.from('grades').upsert(rows, { onConflict: 'student_record_id,subject,quarter' });
        if (err2 && (err2.message?.includes('school_year') || err2.code === '42703')) {
          const fallbackRows = rows.map(r => { const rest = { ...r }; delete rest.school_year_id; delete rest.school_year; return rest; });
          await supabase.from('grades').upsert(fallbackRows, { onConflict: 'student_record_id,subject,quarter' });
        }
      }
    } catch (e) {
      console.error('Error saving grades:', e);
    }
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  }

  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <>
      <div className="top-header">
        <h1><IcoGrades /> Students Grades</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">
        {/* Filters */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <IcoGrades /> Grade Entry
              {currentSy && (
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: currentSy.is_active ? '#e6f7ed' : '#fff3cd',
                  color: currentSy.is_active ? '#0f5132' : '#856404',
                }}>
                  S.Y. {currentSy.year_label} {currentSy.is_active ? '(Active)' : '(Archived)'}
                </span>
              )}
            </h2>
          </div>

          {/* Quick-Select from My Teaching Schedules */}
          {teacherSchedules.length > 0 && (
            <div style={{
              marginBottom: '16px',
              padding: '12px 14px',
              background: '#fff8f6',
              border: '1px solid #f2dede',
              borderRadius: '8px',
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#8B0000',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <IcoCalendar /> My Scheduled Classes (Click to quick-select):
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {teacherSchedules.map(sch => {
                  const isSelected =
                    String(gradeFilter) === String(sch.grade_level) &&
                    subject === sch.subject &&
                    (!sch.section_name || sectionFilter === sch.section_name);
                  return (
                    <button
                      key={sch.schedule_id}
                      type="button"
                      onClick={() => {
                        setGrade(String(sch.grade_level || ''));
                        setSubject(sch.subject || '');
                        setSectionFilter(sch.section_name || '');
                      }}
                      className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '12px', padding: '4px 10px' }}
                    >
                      {sch.grade_level ? `Grade ${sch.grade_level}` : ''}
                      {sch.section_name ? ` (${cleanSectionName(sch.section_name, sch.grade_level)})` : ''} — {sch.subject}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
            {/* Grade Level */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Grade Level</label>
              <select className="filter-select" style={{ width: '100%' }} value={gradeFilter} onChange={e => { setGrade(e.target.value); setSubject(''); setSectionFilter(''); }}>
                <option value="">Select Grade</option>
                {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>

            {/* Section Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Section</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={sectionFilter}
                onChange={e => setSectionFilter(e.target.value)}
                disabled={!gradeFilter}
              >
                <option value="">
                  {isLeadership ? 'All Sections' : 'All Sections (Overview)'}
                </option>
                {availableSections.map(sec => {
                  const displayName = cleanSectionName(sec.section_name, gradeFilter);
                  let tag = '';
                  if (!isLeadership) {
                    const secNameLower = displayName.toLowerCase().trim();
                    const isSecAssigned = teacherSchedules.some(sch => {
                      if (Number(sch.grade_level) !== Number(gradeFilter)) return false;
                      if (subject && (sch.subject || '').toLowerCase().trim() !== subject.toLowerCase().trim()) return false;
                      if (!sch.section_name) return true;
                      return cleanSectionName(sch.section_name, gradeFilter).toLowerCase().trim() === secNameLower;
                    });
                    const facRecId = profile?.faculty_record_id ? String(profile.faculty_record_id) : '';
                    const facId = (profile?.faculty_id || '').toLowerCase().trim();
                    const secAdv = sec.adviser_id ? String(sec.adviser_id) : '';
                    const isAdviser = (facRecId && secAdv === facRecId) || (facId && secAdv.toLowerCase() === facId);

                    if (isSecAssigned) tag = ' (Assigned)';
                    else if (isAdviser) tag = ' (Advisory)';
                    else tag = ' (Read-Only)';
                  }
                  return (
                    <option key={sec.id} value={displayName}>
                      {displayName}{tag}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Subject */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ margin: 0 }}>Subject</label>
                <button
                  type="button"
                  onClick={() => {
                    setCustomSubjectMode(prev => !prev);
                    if (customSubjectMode) setSubject('');
                  }}
                  style={{ background: 'none', border: 'none', color: '#8B0000', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {customSubjectMode ? 'Select from list' : '+ Enter custom'}
                </button>
              </div>
              {customSubjectMode ? (
                <input
                  className="filter-select"
                  style={{ width: '100%' }}
                  placeholder="Type subject name..."
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  autoFocus
                />
              ) : (
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={subject}
                  onChange={e => {
                    if (e.target.value === '__custom__') {
                      setCustomSubjectMode(true);
                      setSubject('');
                    } else {
                      setSubject(e.target.value);
                    }
                  }}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="__custom__">+ Enter Custom Subject...</option>
                </select>
              )}
            </div>

            {/* Quarter / Period */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Quarter / Period</label>
              <select className="filter-select" style={{ width: '100%' }} value={quarter} onChange={e => setQuarter(e.target.value)}>
                {availableQuarters.map(q => (
                  <option key={q.key} value={q.key}>
                    {q.label} {q.semester ? `(${q.semester})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        {gradeFilter && subject ? (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                Grade {gradeFilter} — {subject} — {availableQuarters.find(q => q.key === quarter)?.label || quarter}
              </h2>
            </div>

            {/* Grading Lock Banner */}
            {gradingLocked && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '8px',
                margin: '0 16px 12px 16px',
                fontSize: '14px',
                color: '#856404',
                fontWeight: '600',
              }}>
                <IcoLock />
                Grading for the {QUARTER_LABELS[quarter]} is locked by the administrator. Grade inputs are read-only.
              </div>
            )}

            {/* Read-Only Authorization Warning Banner */}
            {!gradingLocked && !isAuthorizedToGrade && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px 18px',
                backgroundColor: '#fff8f6',
                border: '1px solid #fecaca',
                borderLeft: '5px solid #b91c1c',
                borderRadius: '8px',
                margin: '0 16px 14px 16px',
                fontSize: '13px',
                color: '#991b1b',
                lineHeight: '1.5',
              }}>
                <div style={{ marginTop: '2px', flexShrink: 0 }}>
                  <IcoLock />
                </div>
                <div>
                  <strong>Read-Only Mode:</strong> You are not scheduled to teach {sectionFilter ? <strong>{sectionFilter}</strong> : 'all sections'} for <strong>{subject}</strong>.
                  {assignedTeacherInfo && (
                    <div style={{ margin: '4px 0', fontSize: '12px', color: '#7f1d1d' }}>
                      Officially Assigned Faculty: <strong>{assignedTeacherInfo}</strong>
                    </div>
                  )}
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#991b1b' }}>
                    Grade editing is restricted to assigned section teachers unless explicitly authorized by school leadership for specific administrative or coverage duties.
                  </div>
                  {!sectionFilter && availableSections.length > 0 && (
                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#b91c1c' }}>
                      Tip: Please select your assigned section from the Section dropdown above to enter grades.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Leadership Authorization Info Banner */}
            {isLeadership && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderLeft: '4px solid #16a34a',
                borderRadius: '8px',
                margin: '0 16px 12px 16px',
                fontSize: '12px',
                color: '#166534',
              }}>
                <IcoShield />
                <span>
                  <strong>Leadership Authorization Active:</strong> You have administrative and coverage grade editing permissions ({profile?.position || profile?.role || 'School Leadership'}).
                </span>
              </div>
            )}

            {/* Advisory Class Notice */}
            {!isLeadership && isAdvisoryForSection && !isAssignedTeacher && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderLeft: '4px solid #16a34a',
                borderRadius: '8px',
                margin: '0 16px 12px 16px',
                fontSize: '12px',
                color: '#166534',
              }}>
                <IcoUserCheck />
                <span>
                  <strong>Class Adviser Authorization:</strong> Grade editing enabled as designated Class Adviser for <strong>{sectionFilter}</strong>.
                </span>
              </div>
            )}
            {loading ? (
              <p className="empty-message">Loading...</p>
            ) : students.length === 0 ? (
              <p className="empty-message">No students in this grade level.</p>
            ) : (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '13px',
                  color: '#475569',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}>
                  <div>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>Active Grading Policy:</span>{' '}
                    <span>{activePolicy?.policy_name || 'Standard DepEd Policy'}</span>
                    <span style={{ margin: '0 8px', color: '#cbd5e1' }}>•</span>
                    <span>Weights: Written <strong>{(wwWeight * 100).toFixed(0)}%</strong> | Performance <strong>{(ptWeight * 100).toFixed(0)}%</strong> | Exam <strong>{(qaWeight * 100).toFixed(0)}%</strong></span>
                  </div>
                  <div>
                    Passing Mark: <strong style={{ color: '#137333' }}>{passingMark}</strong>
                  </div>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th><th>DepEd LRN</th><th>Name</th><th>Section</th>
                        <th>Written Works ({(wwWeight * 100).toFixed(0)}%)</th>
                        <th>Performance Tasks ({(ptWeight * 100).toFixed(0)}%)</th>
                        <th>Quarterly Assessment ({(qaWeight * 100).toFixed(0)}%)</th>
                        <th>Participation</th>
                        <th>Initial Grade</th>
                        <th style={{ color: '#8B0000' }}>Quarter Grade</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, i) => {
                        const g = gradeMap[s.student_record_id] ?? {};
                        const qg = parseFloat(g.quarter_grade);
                        const isPassing = !isNaN(qg) && qg >= passingMark;
                        return (
                          <tr key={s.student_record_id}>
                            <td style={{ color: '#888' }}>{i + 1}</td>
                            <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#8B0000' }}>{s.lrn_id || s.student_id || '—'}</td>
                            <td style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>{s.first_name} {s.last_name}</td>
                            <td>{s.section_name ?? '—'}</td>
                            {['written_works', 'performance_tasks', 'quarterly_assessment', 'participation'].map(field => (
                              <td key={field}>
                                <input
                                  type="number" min="0" max="100" step="0.01"
                                  value={g[field] ?? ''}
                                  onChange={e => updateGrade(s.student_record_id, field, e.target.value)}
                                  disabled={gradingLocked || !isAuthorizedToGrade}
                                  style={{
                                    width: '70px', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', textAlign: 'center',
                                    ...((gradingLocked || !isAuthorizedToGrade) ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed', opacity: 0.7 } : {}),
                                  }}
                                />
                              </td>
                            ))}
                            <td style={{ color: '#555', fontSize: '13px', textAlign: 'center' }}>
                              {g.initial_grade || '—'}
                            </td>
                            <td>
                              <span style={{
                                fontWeight: '700', fontSize: '15px',
                                color: isNaN(qg) ? '#888' : isPassing ? '#28a745' : '#dc3545',
                              }}>
                                {g.quarter_grade || '—'}
                              </span>
                            </td>
                            <td>
                              <input
                                value={g.remarks ?? ''}
                                onChange={e => setGradeMap(prev => ({ ...prev, [s.student_record_id]: { ...prev[s.student_record_id], remarks: e.target.value } }))}
                                placeholder="Optional"
                                disabled={gradingLocked || !isAuthorizedToGrade}
                                style={{
                                  width: '110px', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px',
                                  ...((gradingLocked || !isAuthorizedToGrade) ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed', opacity: 0.7 } : {}),
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '12px', alignItems: 'center' }}>
                  {gradingLocked && (
                    <span style={{ fontSize: '13px', color: '#856404', fontWeight: '600' }}>
                      Grading is locked
                    </span>
                  )}
                  {!gradingLocked && !isAuthorizedToGrade && (
                    <span style={{ fontSize: '13px', color: '#b91c1c', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IcoLock /> Read-Only: Not assigned to this section
                    </span>
                  )}
                  <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving || gradingLocked || !isAuthorizedToGrade}
                  >
                    <IcoSave /> {gradingLocked ? 'Locked' : !isAuthorizedToGrade ? 'Read-Only (Unauthorized)' : saving ? 'Saving...' : saved ? 'Saved!' : 'Save Grades'}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="card">
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#888' }}>
              <IcoGrades />
              <p style={{ marginTop: '12px' }}>Select a grade level and subject to start entering grades.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}