import { useEffect, useState, useCallback } from 'react';
import { normalizeEmailOrNull } from '../utils/email';
import { getNextStudentId, findStudentByStudentId, isStudentIdViolation, isLrnViolation, duplicateStudentIdMessage } from '../utils/studentId';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cleanSectionName, formatGradeSection } from '../utils/formatters';
import { getBaseFees, fetchFeeMatrix } from '../utils/feeMatrix';
import {
  NO_REFUND_DISCLAIMER,
  calculateProratedTuition,
  calculateStackedDiscount,
} from '../utils/financeRules';

/* ── SVG Icons ─────────────────────────────────────────── */
function IcoEnrollment() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}
function IcoNewStudent() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}
function IcoContinuing() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}
function IcoChecklist() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
function IcoExport() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function IcoPrint() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}
function IcoClose() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── Grade Level Options ────────────────────────────────── */
const GRADE_OPTIONS = [
  { value: 1,  label: 'Grade 1 (Elementary)' },
  { value: 2,  label: 'Grade 2 (Elementary)' },
  { value: 3,  label: 'Grade 3 (Elementary)' },
  { value: 4,  label: 'Grade 4 (Elementary)' },
  { value: 5,  label: 'Grade 5 (Elementary)' },
  { value: 6,  label: 'Grade 6 (Elementary)' },
  { value: 7,  label: 'Grade 7 (Junior High)' },
  { value: 8,  label: 'Grade 8 (Junior High)' },
  { value: 9,  label: 'Grade 9 (Junior High)' },
  { value: 10, label: 'Grade 10 (Junior High)' },
  { value: 11, label: 'Grade 11 (Senior High)' },
  { value: 12, label: 'Grade 12 (Senior High)' },
];

const INITIAL_WIZARD_FORM = {
  mode: 'new',
  student_record_id: '',
  existing_student_search: '',
  prior_grade_level:  '',
  student_id:         '',
  lrn_id:             '',
  first_name:         '',
  middle_name:        '',
  last_name:          '',
  gender:             '',
  birthdate:          '',
  age:                '',
  email:              '',
  contact_number:     '',
  address:            '',
  guardian_name:      '',
  guardian_contact:   '',
  guardian_relation:  'Parent',
  grade_level:        '',
  strand_id:          '',
  section_id:         '',
  section_name:       '',
  scholarship_id:           '',
  secondary_scholarship_id: '',
  enrollment_type:          'New Enrollee',
  previous_school:          '',
  previous_school_address:  '',
  last_grade_completed:     '',
  last_school_year:         '',
  months_elapsed:           0,
  is_repeater:              false,
  completion_confirmed:     false,
  requirements: {
    psa_birth_cert:   false,
    form_138:         false,
    form_137:         false,
    good_moral:       false,
    medical_clearance: false,
  },
  remarks: '',
};

/* ── Main Enrollment Page ───────────────────────────────── */
export default function EnrollmentPage() {
  const { supabase, selectedSchoolYear, activeSchoolYear, activeQuarter, selectedQuarter, isHistoricalYear } = useAuth();
  const currentSy = selectedSchoolYear || activeSchoolYear;

  const [enrollments, setEnrollments]   = useState([]);
  const [students, setStudents]         = useState([]);
  const [sections, setSections]         = useState([]);
  const [strands, setStrands]           = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [feeMatrix, setFeeMatrix]       = useState(null);
  const [priorGradesInfo, setPriorGradesInfo] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [dbNotice, setDbNotice]         = useState('');

  // Filters
  const [gradeFilter, setGradeFilter]   = useState('');
  const [typeFilter, setTypeFilter]     = useState('');
  const [statusFilter] = useState('All');
  const [search, setSearch]             = useState('');

  // Intake Wizard Modal
  const [wizardOpen, setWizardOpen]   = useState(false);
  const [wizardStep, setWizardStep]   = useState(1);
  const [wizardForm, setWizardForm]   = useState(INITIAL_WIZARD_FORM);
  const [saving, setSaving]           = useState(false);
  const [wizardError, setWizardError] = useState('');

  // View / Print Slip Modal
  const [viewSlip, setViewSlip] = useState(null);

  /* Fetch all supporting datasets */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setDbNotice('');

    try {
      // 1. Fetch Students
      const { data: stuData } = await supabase
        .from('students')
        .select('*')
        .order('last_name', { ascending: true });
      setStudents(stuData ?? []);

      // 2. Fetch Enrollments
      let query = supabase
        .from('enrollments')
        .select('*')
        .order('created_at', { ascending: false });

      if (currentSy?.id) {
        query = query.eq('school_year_id', currentSy.id);
      }

      const { data: enrData, error: enrErr } = await query;
      if (enrErr) {
        setDbNotice(enrErr.message);
        setEnrollments([]);
      } else {
        setEnrollments(enrData ?? []);
      }

      // 3. Fetch Sections (including capacity limit)
      let secQuery = supabase
        .from('sections')
        .select('id, grade_level, section_name, room_number, strand_id, max_capacity, status')
        .eq('status', 'Active');
      if (currentSy?.id) {
        secQuery = secQuery.eq('school_year_id', currentSy.id);
      }
      const { data: secData } = await secQuery;
      setSections(secData ?? []);

      // 4. Fetch SHS Strands
      const { data: strData } = await supabase
        .from('shs_strands')
        .select('id, strand_code, strand_name')
        .eq('status', 'Active');
      setStrands(strData ?? []);

      // 5. Fetch Scholarships (active & non-archived only)
      const { data: schData } = await supabase
        .from('scholarships')
        .select('id, name, code, discount_type, discount_value')
        .eq('is_active', true)
        .not('is_archived', 'eq', true);
      setScholarships(schData ?? []);

      // 6. Fetch Fee Matrix for tuition proration previews
      const feesData = await fetchFeeMatrix(supabase);
      setFeeMatrix(feesData);

    } catch (err) {
      setDbNotice(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase, currentSy]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- guarded; runs only when deps change
    fetchData();
  }, [fetchData]);

  /* Helper to identify effective enrollment category label (supports Repeater fallback tag) */
  function getEffectiveEnrollmentType(enr) {
    if (!enr) return 'Continuing';
    if (enr.enrollment_type === 'Repeater' || enr.is_repeater || (enr.remarks || '').includes('[REPEATER]')) {
      return 'Repeater';
    }
    return enr.enrollment_type || 'Continuing';
  }

  /* Stats calculation (aligned with effective Repeater/Transferee/Continuing tags) */
  const totalEnrolled  = enrollments.filter(e => e.enrollment_status === 'Enrolled' || e.enrollment_status === 'Approved').length;
  const newEnrollees   = enrollments.filter(e => getEffectiveEnrollmentType(e) === 'New Enrollee').length;
  const continuing     = enrollments.filter(e => getEffectiveEnrollmentType(e) === 'Continuing').length;
  const shsEnrollees   = enrollments.filter(e => Number(e.grade_level) >= 11).length;

  /* Filtered Enrollments */
  const filteredEnrollments = enrollments.filter(e => {
    const student = students.find(s => s.student_record_id === e.student_record_id);
    const effType = getEffectiveEnrollmentType(e);

    if (gradeFilter && Number(e.grade_level) !== Number(gradeFilter)) return false;
    if (typeFilter && effType !== typeFilter) return false;
    if (statusFilter !== 'All' && e.enrollment_status !== statusFilter) return false;

    if (search) {
      const q = search.toLowerCase();
      const name = student ? `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase() : '';
      const stuId = student ? (student.student_id || '').toLowerCase() : '';
      const lrn = student ? (student.lrn_id || '').toLowerCase() : '';
      if (!name.includes(q) && !stuId.includes(q) && !lrn.includes(q)) return false;
    }

    return true;
  });

  /* Open Wizard Modal */
  function openIntakeWizard(mode = 'new') {
    const isRepeater = mode === 'repeater';
    setWizardForm({
      ...INITIAL_WIZARD_FORM,
      mode: isRepeater ? 'continuing' : mode,
      enrollment_type: mode === 'new' ? 'New Enrollee' : isRepeater ? 'Repeater' : 'Continuing',
      is_repeater: isRepeater,
      student_id: '',
      student_id_auto: true,
    });
    if (mode === 'new') {
      getNextStudentId(supabase)
        .then(id => setWizardForm(f => (f.student_id ? f : { ...f, student_id: id, student_id_auto: true })))
        .catch(() => { /* ID will be generated on save instead */ });
    }
    setPriorGradesInfo(null);
    setWizardStep(mode === 'continuing' || mode === 'repeater' ? 1 : 2);
    setWizardError('');
    setWizardOpen(true);
  }

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const isNew = searchParams.get('new');
    const isContinuing = searchParams.get('continuing');
    if (isNew === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- guarded; runs only when deps change
      openIntakeWizard('new');
      setSearchParams({}, { replace: true });
    } else if (isContinuing === 'true') {
      openIntakeWizard('continuing');
      setSearchParams({}, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run only when the query string changes
  }, [searchParams]);

  /* Handle Continuing / Repeater Student Selection */
  async function handleSelectExistingStudent(student, asRepeater = null) {
    const currentGrade = Number(student.grade_level || 1);
    const repeaterMode = asRepeater !== null ? asRepeater : wizardForm.is_repeater || wizardForm.enrollment_type === 'Repeater';
    const isGraduated = (student.status || '').toLowerCase() === 'graduated';

    if (isGraduated) {
      setWizardError(`${student.first_name} ${student.last_name} is already marked Graduated and cannot be re-enrolled in basic education.`);
      return;
    }
    if (!repeaterMode && currentGrade >= 12) {
      setWizardError(`${student.first_name} ${student.last_name} is already at Grade 12 and cannot be promoted further. Use "Retain (Repeater)" if repeating Grade 12.`);
      return;
    }

    const nextGrade = repeaterMode ? currentGrade : currentGrade + 1;

    setWizardForm(f => ({
      ...f,
      mode:                     'continuing',
      student_record_id:        student.student_record_id,
      prior_grade_level:        currentGrade,
      student_id:               student.student_id        || '',
      lrn_id:                   student.lrn_id            || '',
      first_name:               student.first_name        || '',
      middle_name:              student.middle_name       || '',
      last_name:                student.last_name         || '',
      gender:                   student.gender            || '',
      birthdate:                student.birthdate         || '',
      age:                      student.age               || '',
      email:                    student.email             || '',
      contact_number:           student.contact_number    || '',
      address:                  student.address           || '',
      guardian_name:            student.guardian_name     || '',
      guardian_contact:         student.guardian_contact  || '',
      guardian_relation:        student.guardian_relation || 'Parent',
      grade_level:              nextGrade,
      section_id:               '',
      section_name:             '',
      strand_id:                nextGrade >= 11 ? (currentGrade === 10 && !repeaterMode ? '' : (student.current_strand_id || '')) : '',
      scholarship_id:           student.scholarship_id    || '',
      secondary_scholarship_id: student.secondary_scholarship_id || '',
      enrollment_type:          repeaterMode ? 'Repeater' : 'Continuing',
      is_repeater:              repeaterMode,
      completion_confirmed:     false,
      previous_school:          student.previous_school || '',
      previous_school_address:  student.previous_school_address || '',
      last_grade_completed:     student.last_grade_completed || '',
      last_school_year:         student.last_school_year || '',
      months_elapsed:           Number(student.months_elapsed || 0),
      requirements:             { ...INITIAL_WIZARD_FORM.requirements },
      remarks:                  '',
    }));
    setWizardError('');
    setWizardStep(2);

    setPriorGradesInfo({ loading: true, count: 0, avg: null, passedCount: 0, failedCount: 0 });
    try {
      const { data: gData } = await supabase
        .from('grades')
        .select('grade_id, quarter_grade')
        .eq('student_record_id', student.student_record_id);
      const valid = (gData ?? []).filter(g => g.quarter_grade != null && !Number.isNaN(Number(g.quarter_grade)));
      const avg = valid.length > 0
        ? (valid.reduce((sum, g) => sum + Number(g.quarter_grade), 0) / valid.length).toFixed(2)
        : null;
      const failedCount = valid.filter(g => Number(g.quarter_grade) < 75).length;
      setPriorGradesInfo({
        loading: false,
        count: valid.length,
        avg,
        passedCount: valid.length - failedCount,
        failedCount,
      });
    } catch {
      setPriorGradesInfo({ loading: false, count: 0, avg: null, passedCount: 0, failedCount: 0 });
    }
  }

  /* Submit Intake Wizard */
  async function handleSubmitIntake() {
    setSaving(true);
    setWizardError('');

    try {
      if (isHistoricalYear) {
        throw new Error('Cannot submit new enrollments while viewing an archived school year. Switch back to the Active School Year first.');
      }

      const gradeNum = Number(wizardForm.grade_level);
      const isRepeater = wizardForm.enrollment_type === 'Repeater' || wizardForm.is_repeater;
      const isTransferee = wizardForm.enrollment_type === 'Transferee';

      if (!wizardForm.first_name?.trim() || !wizardForm.last_name?.trim() || !wizardForm.gender) {
        throw new Error('First name, last name, and gender are required.');
      }

      if (wizardForm.lrn_id?.trim() && wizardForm.lrn_id.trim().length !== 12) {
        throw new Error('Learner Reference Number (LRN) must be exactly 12 digits.');
      }

      if (!wizardForm.grade_level || Number.isNaN(gradeNum) || gradeNum < 1 || gradeNum > 12) {
        throw new Error('Please select a valid Grade Level (1-12).');
      }

      if (gradeNum >= 11 && !wizardForm.strand_id) {
        throw new Error('Please select a Senior High School strand.');
      }

      // Enforce Grade 1 and Grade 7 only for New Enrollees; other levels strictly for Transferees or Continuing/Repeater
      if (wizardForm.enrollment_type === 'New Enrollee' && ![1, 7].includes(gradeNum)) {
        throw new Error('New regular enrollment is restricted to Grade 1 and Grade 7 only. Other grade levels are strictly for Transferees or Continuing/Repeater students.');
      }

      if (isTransferee && !wizardForm.previous_school?.trim()) {
        throw new Error('Transferees must provide their Previous School Name.');
      }

      const isPromotion =
        Boolean(wizardForm.student_record_id) &&
        !isRepeater &&
        wizardForm.prior_grade_level !== '' &&
        gradeNum > Number(wizardForm.prior_grade_level);
      if (isPromotion && !wizardForm.completion_confirmed) {
        throw new Error(`Admin verification required: Confirm Grade ${wizardForm.prior_grade_level} completion before promoting this student to Grade ${gradeNum}.`);
      }

      let targetRecordId = wizardForm.student_record_id;

      // Enforce One Section Limit per active school year
      if (targetRecordId && activeSchoolYear?.id) {
        const { data: existingEnrs } = await supabase
          .from('enrollments')
          .select('id, grade_level, section_id, enrollment_status')
          .eq('student_record_id', targetRecordId)
          .eq('school_year_id', activeSchoolYear.id);

        const activeConflict = (existingEnrs ?? []).find(
          enr => !['Dropped', 'Transferred Out'].includes(enr.enrollment_status)
        );
        if (activeConflict) {
          const secObj = sections.find(s => String(s.id) === String(activeConflict.section_id));
          const secLabel = secObj ? secObj.section_name : 'an assigned section';
          throw new Error(
            `One Section Limit: This student is already enrolled in Grade ${activeConflict.grade_level} (${secLabel}) for S.Y. ${activeSchoolYear.year_label}. A student can only belong to one section at a time.`
          );
        }
      }

      // Enforce Section max_capacity for active school year
      if (wizardForm.section_id && activeSchoolYear?.id) {
        const targetSec = sections.find(s => String(s.id) === String(wizardForm.section_id));
        const maxCap = Number(targetSec?.max_capacity || 0);
        if (maxCap > 0) {
          const { data: secEnrs } = await supabase
            .from('enrollments')
            .select('student_record_id, enrollment_status')
            .eq('school_year_id', activeSchoolYear.id)
            .eq('section_id', wizardForm.section_id);
          const filled = (secEnrs ?? []).filter(
            enr => !['Dropped', 'Transferred Out'].includes(enr.enrollment_status) &&
              String(enr.student_record_id) !== String(targetRecordId || '')
          ).length;
          if (filled >= maxCap) {
            throw new Error(
              `Section Full: ${targetSec.section_name} has reached its capacity (${filled}/${maxCap} students). Select another section or increase capacity in Settings.`
            );
          }
        }
      }

      const elapsedMonths = isTransferee ? Math.min(9, Math.max(0, Number(wizardForm.months_elapsed) || 0)) : 0;
      const cleanSec = cleanSectionName(wizardForm.section_name, wizardForm.grade_level) || null;
      let createdStudent = null;

      // 1. If New Student (never for Repeater!), insert into students table
      if ((wizardForm.mode === 'new' && !isRepeater) || !targetRecordId) {
        const isAutoId = wizardForm.student_id_auto !== false;
        let cleanId = (wizardForm.student_id || '').trim();
        if (!cleanId) cleanId = await getNextStudentId(supabase);
        const studentPayload = {
          student_id:               cleanId,
          lrn_id:                   wizardForm.lrn_id             || null,
          first_name:               wizardForm.first_name.trim(),
          middle_name:              wizardForm.middle_name        ? wizardForm.middle_name.trim() : null,
          last_name:                wizardForm.last_name.trim(),
          gender:                   wizardForm.gender,
          birthdate:                wizardForm.birthdate          || null,
          age:                      wizardForm.age                ? Number(wizardForm.age) : null,
          email:                    normalizeEmailOrNull(wizardForm.email),
          contact_number:           wizardForm.contact_number     || null,
          address:                  wizardForm.address            || null,
          guardian_name:            wizardForm.guardian_name      || null,
          guardian_contact:         wizardForm.guardian_contact   || null,
          guardian_relation:        wizardForm.guardian_relation  || 'Parent',
          grade_level:              gradeNum,
          current_strand_id:        gradeNum >= 11 && wizardForm.strand_id ? wizardForm.strand_id : null,
          current_section_id:       wizardForm.section_id         || null,
          section_name:             cleanSec,
          scholarship_id:           wizardForm.scholarship_id     || null,
          secondary_scholarship_id: wizardForm.secondary_scholarship_id || null,
          previous_school:          isTransferee ? (wizardForm.previous_school?.trim() || null) : null,
          previous_school_address:  isTransferee ? (wizardForm.previous_school_address?.trim() || null) : null,
          last_grade_completed:     isTransferee ? (wizardForm.last_grade_completed?.trim() || null) : null,
          last_school_year:         isTransferee ? (wizardForm.last_school_year?.trim() || null) : null,
          months_elapsed:           elapsedMonths,
          is_repeater:              false,
          completion_confirmed:     Boolean(wizardForm.completion_confirmed),
          student_type:             wizardForm.enrollment_type,
          status:                   'Active',
          is_archived:              false,
        };

        const coreStudentPayload = {
          student_id:         cleanId,
          lrn_id:             wizardForm.lrn_id             || null,
          first_name:         wizardForm.first_name.trim(),
          middle_name:        wizardForm.middle_name        ? wizardForm.middle_name.trim() : null,
          last_name:          wizardForm.last_name.trim(),
          gender:             wizardForm.gender,
          birthdate:          wizardForm.birthdate          || null,
          age:                wizardForm.age                ? Number(wizardForm.age) : null,
          email:              normalizeEmailOrNull(wizardForm.email),
          contact_number:     wizardForm.contact_number     || null,
          address:            wizardForm.address            || null,
          guardian_name:      wizardForm.guardian_name      || null,
          guardian_contact:   wizardForm.guardian_contact   || null,
          guardian_relation:  wizardForm.guardian_relation  || 'Parent',
          grade_level:        gradeNum,
          current_strand_id:  gradeNum >= 11 && wizardForm.strand_id ? wizardForm.strand_id : null,
          current_section_id: wizardForm.section_id         || null,
          section_name:       cleanSec,
          scholarship_id:     wizardForm.scholarship_id     || null,
          student_type:       wizardForm.enrollment_type,
          status:             'Active',
          is_archived:        false,
        };

        // Manually typed ID that already exists: stop with a clear message
        if (!isAutoId) {
          const clash = await findStudentByStudentId(supabase, cleanId);
          if (clash) throw new Error(duplicateStudentIdMessage(cleanId, clash));
        }

        // Insert; if an auto-generated ID collides, retry with the next free number
        let stuErr = null;
        let useCoreOnly = false;
        for (let attempt = 0; attempt < 5; attempt++) {
          const payloadAttempt = useCoreOnly
            ? { ...coreStudentPayload, student_id: cleanId }
            : { ...studentPayload, student_id: cleanId };
          const res = await supabase.from('students').insert([payloadAttempt]).select().single();
          if (res.error && /22P02|invalid input syntax/i.test(res.error.message || '') && studentPayload.last_grade_completed) {
            const digits = String(studentPayload.last_grade_completed).replace(/\D/g, '');
            studentPayload.last_grade_completed = digits ? Number(digits) : null;
            attempt--;
            continue;
          }
          if (res.error && !useCoreOnly && /column|schema cache|42703/i.test(res.error.message || '')) {
            useCoreOnly = true;
            attempt--;
            continue;
          }
          createdStudent = res.data;
          stuErr = res.error;
          if (!stuErr) break;
          if (isStudentIdViolation(stuErr)) {
            if (!isAutoId) {
              const clash = await findStudentByStudentId(supabase, cleanId).catch(() => null);
              throw new Error(duplicateStudentIdMessage(cleanId, clash));
            }
            cleanId = await getNextStudentId(supabase, new Date().getFullYear(), attempt);
            continue;
          }
          if (isLrnViolation(stuErr)) {
            throw new Error(`A student with LRN "${studentPayload.lrn_id}" already exists. Use "Re-Enroll Continuing / Repeater" lookup instead of enrolling a duplicate.`);
          }
          break;
        }
        if (stuErr) throw stuErr;
        targetRecordId = createdStudent.student_record_id;
      } else {
        // Update existing student record with updated Grade Level, Single Section, Status & Step 2 edits
        const coreUpdate = {
          lrn_id:             wizardForm.lrn_id?.trim() || null,
          first_name:         wizardForm.first_name.trim(),
          middle_name:        wizardForm.middle_name ? wizardForm.middle_name.trim() : null,
          last_name:          wizardForm.last_name.trim(),
          gender:             wizardForm.gender,
          birthdate:          wizardForm.birthdate || null,
          email:              normalizeEmailOrNull(wizardForm.email),
          contact_number:     wizardForm.contact_number ? wizardForm.contact_number.trim() : null,
          guardian_name:      wizardForm.guardian_name ? wizardForm.guardian_name.trim() : null,
          guardian_contact:   wizardForm.guardian_contact ? wizardForm.guardian_contact.trim() : null,
          grade_level:        gradeNum,
          current_strand_id:  gradeNum >= 11 && wizardForm.strand_id ? wizardForm.strand_id : null,
          current_section_id: wizardForm.section_id || null,
          section_name:       cleanSec,
          scholarship_id:     wizardForm.scholarship_id || null,
          student_type:       isRepeater ? 'Repeater' : wizardForm.enrollment_type,
          status:             'Active',
          is_archived:        false,
        };
        const extUpdate = {
          ...coreUpdate,
          address:                  wizardForm.address ? wizardForm.address.trim() : null,
          guardian_relation:        wizardForm.guardian_relation || 'Parent',
          secondary_scholarship_id: wizardForm.secondary_scholarship_id || null,
          months_elapsed:           elapsedMonths,
          is_repeater:              isRepeater,
          completion_confirmed:     Boolean(wizardForm.completion_confirmed),
          ...(isTransferee ? {
            previous_school:         wizardForm.previous_school?.trim() || null,
            previous_school_address: wizardForm.previous_school_address?.trim() || null,
            last_grade_completed:    wizardForm.last_grade_completed?.trim() || null,
            last_school_year:        wizardForm.last_school_year?.trim() || null,
          } : {}),
        };
        let updRes = await supabase
          .from('students')
          .update(extUpdate)
          .eq('student_record_id', targetRecordId);
        if (updRes.error && /22P02|invalid input syntax/i.test(updRes.error.message || '') && extUpdate.last_grade_completed) {
          const digits = String(extUpdate.last_grade_completed).replace(/\D/g, '');
          updRes = await supabase
            .from('students')
            .update({ ...extUpdate, last_grade_completed: digits ? Number(digits) : null })
            .eq('student_record_id', targetRecordId);
        }
        if (updRes.error && /column|schema cache|42703/i.test(updRes.error.message || '')) {
          updRes = await supabase
            .from('students')
            .update({ ...coreUpdate, student_type: isRepeater ? 'Continuing' : wizardForm.enrollment_type })
            .eq('student_record_id', targetRecordId);
        }
        if (updRes.error) {
          if (isLrnViolation(updRes.error)) {
            throw new Error(`That LRN (${extUpdate.lrn_id}) is already registered to another student.`);
          }
          throw updRes.error;
        }
      }

      const remarkTags = [];
      if (isRepeater) remarkTags.push('[REPEATER]');
      if (isTransferee && wizardForm.previous_school?.trim()) {
        remarkTags.push(`[TRANSFEREE: ${wizardForm.previous_school.trim()}${elapsedMonths > 0 ? `, ${elapsedMonths} mos elapsed` : ''}]`);
      }
      if (wizardForm.remarks?.trim()) remarkTags.push(wizardForm.remarks.trim());
      const combinedRemarks = remarkTags.join(' ') || null;

      // 2. Log entry in enrollments table for active School Year
      const coreEnrollmentPayload = {
        student_record_id:      targetRecordId,
        school_year_id:         activeSchoolYear?.id || null,
        grade_level:            gradeNum,
        strand_id:              gradeNum >= 11 && wizardForm.strand_id ? wizardForm.strand_id : null,
        section_id:             wizardForm.section_id || null,
        enrollment_type:        wizardForm.enrollment_type,
        enrollment_status:      'Enrolled',
        scholarship_id:         wizardForm.scholarship_id || null,
        requirements_submitted: wizardForm.requirements,
        date_enrolled:          new Date().toISOString().split('T')[0],
        remarks:                combinedRemarks,
      };
      const extEnrollmentPayload = {
        ...coreEnrollmentPayload,
        secondary_scholarship_id: wizardForm.secondary_scholarship_id || null,
        previous_school:          isTransferee ? (wizardForm.previous_school?.trim() || null) : null,
        previous_school_address:  isTransferee ? (wizardForm.previous_school_address?.trim() || null) : null,
        last_grade_completed:     isTransferee ? (wizardForm.last_grade_completed?.trim() || null) : null,
        last_school_year:         isTransferee ? (wizardForm.last_school_year?.trim() || null) : null,
        months_elapsed:           elapsedMonths,
        is_repeater:              isRepeater,
        completion_confirmed:     Boolean(wizardForm.completion_confirmed),
      };

      let { data: newEnrollment, error: enrErr } = await supabase
        .from('enrollments')
        .insert([extEnrollmentPayload])
        .select()
        .single();

      if (enrErr && /22P02|invalid input syntax/i.test(enrErr.message || '') && extEnrollmentPayload.last_grade_completed) {
        const digits = String(extEnrollmentPayload.last_grade_completed).replace(/\D/g, '');
        ({ data: newEnrollment, error: enrErr } = await supabase
          .from('enrollments')
          .insert([{ ...extEnrollmentPayload, last_grade_completed: digits ? Number(digits) : null }])
          .select()
          .single());
      }

      if (enrErr && /column|schema cache|42703|enrollments_enrollment_type_check|23514/i.test(enrErr.message || '')) {
        ({ data: newEnrollment, error: enrErr } = await supabase
          .from('enrollments')
          .insert([{
            ...coreEnrollmentPayload,
            enrollment_type: isRepeater ? 'Continuing' : wizardForm.enrollment_type,
          }])
          .select()
          .single());
      }

      if (enrErr) throw enrErr;

      // 3. Initialize/Sync student_finances assessment if proration or scholarships apply
      if (isTransferee || wizardForm.scholarship_id || wizardForm.secondary_scholarship_id) {
        const base = getBaseFees(gradeNum, feeMatrix);
        const { proratedTuition } = isTransferee && elapsedMonths > 0
          ? calculateProratedTuition(base.tuition, elapsedMonths)
          : { proratedTuition: base.tuition };
        const grossTotal = proratedTuition + base.misc;
        const priSch = scholarships.find(s => String(s.id) === String(wizardForm.scholarship_id)) || null;
        const secSch = scholarships.find(s => String(s.id) === String(wizardForm.secondary_scholarship_id)) || null;
        const stacked = calculateStackedDiscount({
          tuition: proratedTuition,
          grossTotal,
          primaryScholarship: priSch,
          secondaryScholarship: secSch,
        });
        const syId = activeSchoolYear?.id || null;
        const syLabel = activeSchoolYear?.year_label || '2026-2027';
        let finCheckQuery = supabase
          .from('student_finances')
          .select('*')
          .eq('student_record_id', targetRecordId);
        if (syId && syLabel) {
          finCheckQuery = finCheckQuery.or(`school_year_id.eq.${syId},school_year.eq.${syLabel}`);
        } else if (syId) {
          finCheckQuery = finCheckQuery.eq('school_year_id', syId);
        } else {
          finCheckQuery = finCheckQuery.eq('school_year', syLabel);
        }
        const finCheck = await finCheckQuery;
        if (finCheck.error) throw finCheck.error;

        const finFull = {
          student_record_id:        targetRecordId,
          tuition_fee:              proratedTuition,
          miscellaneous_fee:        base.misc,
          scholarship_id:           priSch?.id || null,
          secondary_scholarship_id: secSch?.id || null,
          discount_amount:          stacked.discount,
          discount_breakdown:       stacked.breakdown,
          is_transferee_prorated:   Boolean(isTransferee && elapsedMonths > 0),
          months_elapsed:           elapsedMonths,
          prorated_months:          Math.max(1, 10 - elapsedMonths),
          school_year:              syLabel,
          school_year_id:           syId,
        };
        const finCore = {
          student_record_id: targetRecordId,
          tuition_fee:       proratedTuition,
          miscellaneous_fee: base.misc,
          scholarship_id:    priSch?.id || null,
          discount_amount:   stacked.discount,
          school_year:       syLabel,
        };

        if (!finCheck.data || finCheck.data.length === 0) {
          const insFin = await supabase.from('student_finances').insert([{ ...finFull, amount_paid: 0, status: 'unpaid' }]);
          if (insFin.error && /column|schema cache|42703/i.test(insFin.error.message || '')) {
            await supabase.from('student_finances').insert([{ ...finCore, amount_paid: 0, status: 'unpaid' }]);
          }
        } else {
          const exFin = finCheck.data[0];
          const paidAmt = Number(exFin.amount_paid || 0);
          const netDue = Math.max(0, (proratedTuition + base.misc) - stacked.discount);
          const updSt = (netDue <= 0 || paidAmt >= netDue) ? 'paid' : paidAmt > 0 ? 'partial' : 'unpaid';
          const keyCol = exFin.finance_id ? 'finance_id' : 'id';
          const keyVal = exFin.finance_id || exFin.id;
          let updFin = supabase.from('student_finances').update({ ...finFull, status: updSt });
          updFin = keyVal ? updFin.eq(keyCol, keyVal) : updFin.eq('student_record_id', targetRecordId);
          const updFinRes = await updFin;
          if (updFinRes.error && /column|schema cache|42703/i.test(updFinRes.error.message || '')) {
            let fbFin = supabase.from('student_finances').update({ ...finCore, status: updSt });
            fbFin = keyVal ? fbFin.eq(keyCol, keyVal) : fbFin.eq('student_record_id', targetRecordId);
            await fbFin;
          }
        }
      }

      const studentObj = createdStudent || {
        student_record_id: targetRecordId,
        first_name: wizardForm.first_name.trim(),
        last_name:  wizardForm.last_name.trim(),
        student_id: wizardForm.student_id,
        lrn_id:     wizardForm.lrn_id?.trim() || '',
      };

      setWizardOpen(false);
      await fetchData();

      // Open Confirmation Slip with up-to-date student details
      setViewSlip({ enrollment: newEnrollment, student: studentObj });

    } catch (err) {
      setWizardError(err.message || 'Error processing enrollment intake.');
    } finally {
      setSaving(false);
    }
  }

  const wizardSections = (() => {
    const list = sections.filter(sec => Number(sec.grade_level) === Number(wizardForm.grade_level));
    const seen = new Set();
    return list.filter(sec => {
      const key = cleanSectionName(sec.section_name, sec.grade_level).toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  })();

  const studentLookupResults = wizardForm.existing_student_search
    ? students.filter(s => {
        const q = wizardForm.existing_student_search.toLowerCase();
        const fullName = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase();
        const stuId = (s.student_id || '').toLowerCase();
        const lrn = (s.lrn_id || '').toLowerCase();
        return fullName.includes(q) || stuId.includes(q) || lrn.includes(q);
      }).slice(0, 5)
    : [];

  return (
    <>
      {/* Top Header */}
      <div className="top-header">
        <h1><IcoEnrollment /> Student Enrollment &amp; Intake Process</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#8B0000',
            color: '#FFD700',
            padding: '5px 12px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(139,0,0,0.15)',
          }}>
            <span>{currentSy?.year_label ? `S.Y. ${currentSy.year_label}` : activeSchoolYear?.year_label ? `S.Y. ${activeSchoolYear.year_label}` : 'S.Y. 2026-2027'}</span>
            {!isHistoricalYear && (selectedQuarter || activeQuarter) && (
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontSize: '11px' }}>
                {(selectedQuarter || activeQuarter).quarter_name}
              </span>
            )}
            {isHistoricalYear && (
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontSize: '11px' }}>
                Archived
              </span>
            )}
          </div>
          <span className="date-time">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
        </div>
      </div>

      <div className="content-area">
        {/* Database Notice */}
        {dbNotice && (
          <div style={{ background: '#fff3cd', border: '1px solid #ffeeba', color: '#856404', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
            <strong>Notice:</strong> {dbNotice}
          </div>
        )}

        {/* Enrollment Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><IcoEnrollment /></div>
            <div className="stat-info">
              <div className="stat-number">{totalEnrolled}</div>
              <div className="stat-label">Total Enrolled ({currentSy?.year_label || 'Active S.Y.'})</div>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon"><IcoNewStudent /></div>
            <div className="stat-info">
              <div className="stat-number">{newEnrollees}</div>
              <div className="stat-label">New Enrollees (First-Timers)</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon"><IcoContinuing /></div>
            <div className="stat-info">
              <div className="stat-number">{continuing}</div>
              <div className="stat-label">Continuing Students</div>
            </div>
          </div>
          <div className="stat-card gold">
            <div className="stat-icon"><IcoChecklist /></div>
            <div className="stat-info">
              <div className="stat-number">{shsEnrollees}</div>
              <div className="stat-label">Senior High Enrollees</div>
            </div>
          </div>
        </div>

        {/* Enrollment Intake Trigger & Filters */}
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button className="btn btn-primary" disabled={isHistoricalYear} onClick={() => openIntakeWizard('new')}>
                <IcoNewStudent /> + Enroll New / Transferee
              </button>
              <button className="btn btn-secondary" disabled={isHistoricalYear} onClick={() => openIntakeWizard('continuing')}>
                <IcoContinuing /> Re-Enroll Continuing Student
              </button>
              <button
                className="btn btn-secondary"
                disabled={isHistoricalYear}
                style={{ borderColor: '#6d28d9', color: '#6d28d9' }}
                onClick={() => openIntakeWizard('repeater')}
              >
                <IcoContinuing /> Process Repeater (Retained)
              </button>
              {isHistoricalYear && (
                <span style={{ fontSize: '12px', color: '#991b1b', fontWeight: '600' }}>
                  Switch to Active S.Y. to process new enrollments.
                </span>
              )}
            </div>

            <button className="btn btn-secondary btn-sm" onClick={() => {
              const headers = ['DepEd LRN', 'Student Name', 'Grade Level', 'Strand', 'Section', 'Enrollment Type', 'Status', 'Scholarship', 'Date Enrolled'];
              const rows = filteredEnrollments.map(e => {
                const stu = students.find(s => s.student_record_id === e.student_record_id);
                const str = strands.find(st => st.id === e.strand_id);
                const sec = sections.find(sc => sc.id === e.section_id);
                const sch = scholarships.find(sc => sc.id === e.scholarship_id);
                return [
                  stu?.lrn_id || stu?.student_id || '—',
                  stu ? `${stu.first_name} ${stu.last_name}` : '—',
                  `Grade ${e.grade_level}`,
                  str?.strand_code || 'N/A',
                  sec?.section_name || '—',
                  e.enrollment_type,
                  e.enrollment_status,
                  sch?.name || 'Regular',
                  e.date_enrolled || '—',
                ];
              });
              const csv = [headers, ...rows].map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = `enrollment_masterlist_${currentSy?.year_label || activeSchoolYear?.year_label || 'active'}.csv`; a.click();
              URL.revokeObjectURL(url);
            }}>
              <IcoExport /> Export Enrollment List (CSV)
            </button>
          </div>

          <div className="form-grid" style={{ alignItems: 'flex-end', marginTop: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Grade Level</label>
              <select className="filter-select" style={{ width: '100%' }} value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}>
                <option value="">All Grade Levels (1–12)</option>
                {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Enrollment Type</label>
              <select className="filter-select" style={{ width: '100%' }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="">All Types</option>
                <option value="New Enrollee">New Enrollee (Grade 1 &amp; 7)</option>
                <option value="Continuing">Continuing Student</option>
                <option value="Repeater">Repeater (Retained)</option>
                <option value="Transferee">Transferee</option>
                <option value="Returnee">Returnee</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Search Enrollees</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  className="search-input"
                  style={{ width: '100%', paddingRight: search ? '32px' : '10px' }}
                  placeholder="Student name, LRN, or Section..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      background: '#e9ecef',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: '1',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#8B0000'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#e9ecef'; e.currentTarget.style.color = '#666'; }}
                    title="Clear search"
                  >
                    x
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enrollments Masterlist Table */}
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>DepEd LRN</th>
                  <th>Student Name</th>
                  <th>Grade &amp; Section</th>
                  <th>SHS Strand</th>
                  <th>Type</th>
                  <th>Scholarship</th>
                  <th>Requirements Status</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="empty-message">Loading enrollment records...</td></tr>
                ) : filteredEnrollments.length === 0 ? (
                  <tr><td colSpan={9} className="empty-message">No student enrollments found for the selected school year.</td></tr>
                ) : (
                  filteredEnrollments.map(e => {
                    const student = students.find(s => s.student_record_id === e.student_record_id);
                    const strand = strands.find(st => st.id === e.strand_id);
                    const section = sections.find(sec => sec.id === e.section_id);
                    const sch = scholarships.find(sc => sc.id === e.scholarship_id);

                    // Calculate requirements completeness
                    const req = e.requirements_submitted || {};
                    const totalReq = 5;
                    const completedReq = Object.values(req).filter(Boolean).length;

                    return (
                      <tr key={e.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: '700', color: '#8B0000' }}>
                          {student?.lrn_id || student?.student_id || '—'}
                        </td>
                        <td style={{ fontWeight: '600' }}>
                          {student ? `${student.first_name} ${student.last_name}` : 'Student Record'}
                        </td>
                        <td>
                          {formatGradeSection(e.grade_level, section?.section_name || (!isHistoricalYear ? student?.section_name : ''))}
                        </td>
                        <td>
                          {strand ? (
                            <span style={styles.badgeNeutral}>{strand.strand_code}</span>
                          ) : Number(e.grade_level) >= 11 ? (
                            <span style={{ color: '#dc3545', fontSize: '12px' }}>Unassigned</span>
                          ) : (
                            <span style={{ color: '#aaa' }}>—</span>
                          )}
                        </td>
                        <td>
                          {(() => {
                            const effType = getEffectiveEnrollmentType(e);
                            const badgeStyle =
                              effType === 'New Enrollee' ? styles.badgeNew :
                              effType === 'Transferee' ? styles.badgeTransferee :
                              effType === 'Repeater' ? styles.badgeRepeater : styles.badgeContinuing;
                            const prevSchool = e.previous_school || student?.previous_school;
                            return (
                              <div>
                                <span style={badgeStyle}>{effType}</span>
                                {effType === 'Transferee' && prevSchool && (
                                  <div style={{ fontSize: '11px', color: '#92400e', marginTop: '2px' }}>
                                    From: {prevSchool}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </td>
                        <td>
                          {sch ? (
                            <span style={styles.badgeScholarship}>{sch.code}</span>
                          ) : (
                            <span style={{ color: '#888', fontSize: '12px' }}>Regular</span>
                          )}
                        </td>
                        <td>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: completedReq === totalReq ? '#e6f4ea' : '#fef7e0',
                            color: completedReq === totalReq ? '#137333' : '#b06000',
                          }}>
                            {completedReq}/{totalReq} Submitted
                          </span>
                        </td>
                        <td>
                          <span style={styles.badgeEnrolled}>{e.enrollment_status}</span>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setViewSlip({ enrollment: e, student })}
                            title="View / Print Certificate of Matriculation"
                          >
                            <IcoPrint /> Print Slip
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── Enrollment Intake Wizard Modal ── */}
      {wizardOpen && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setWizardOpen(false); }}>
          <div className="modal-content" style={{ maxWidth: '780px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <IcoEnrollment /> Enrollment Intake Wizard — S.Y. {activeSchoolYear?.year_label || '2026-2027'}
              </h3>
              <button className="modal-close" onClick={() => setWizardOpen(false)}><IcoClose /></button>
            </div>

            {/* Stepper Header */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e9ecef', background: '#f8f9fa', padding: '10px 16px', gap: '8px', overflowX: 'auto' }}>
              {[
                { step: 1, label: wizardForm.mode === 'continuing' ? '1. Student Lookup' : '1. Student Type' },
                { step: 2, label: '2. Demographics' },
                { step: 3, label: '3. Placement & Strand' },
                { step: 4, label: '4. DepEd Requirements' },
                { step: 5, label: '5. Review & Confirm' },
              ].filter(({ step }) => wizardForm.mode !== 'new' || step >= 2).map(({ step, label }) => (
                <div
                  key={step}
                  onClick={() => { const minStep = wizardForm.mode === 'new' ? 2 : 1; if (step < wizardStep && step >= minStep) setWizardStep(step); }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: wizardStep === step ? '#8B0000' : wizardStep > step ? '#e6f4ea' : 'transparent',
                    color: wizardStep === step ? '#FFD700' : wizardStep > step ? '#137333' : '#666',
                    border: wizardStep === step ? 'none' : '1px solid #ddd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              {wizardError && (
                <div style={{ color: '#dc3545', background: '#f8d7da', padding: '10px 14px', borderRadius: '6px', marginBottom: '14px', fontSize: '13px' }}>
                  {wizardError}
                </div>
              )}

              {/* ── STEP 1: Lookup for Continuing Student ── */}
              {wizardStep === 1 && (
                <div>
                  <h4 style={{ margin: '0 0 12px 0', color: '#8B0000' }}>Search &amp; Select Existing Student</h4>
                  <p style={{ fontSize: '13px', color: '#555', marginBottom: '14px' }}>
                    Type the student name, DepEd LRN, or Student ID to retrieve their permanent profile for promotion:
                  </p>
                  <div className="form-group">
                    <input
                      placeholder="Search existing student..."
                      value={wizardForm.existing_student_search}
                      onChange={e => setWizardForm(f => ({ ...f, existing_student_search: e.target.value }))}
                      autoFocus
                    />
                  </div>

                  {studentLookupResults.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                      {studentLookupResults.map(s => {
                        const existingEnr = enrollments.find(
                          e => e.student_record_id === s.student_record_id && !['Dropped', 'Transferred Out'].includes(e.enrollment_status)
                        );
                        const isGrad = (s.status || '').toLowerCase() === 'graduated';
                        const isArch = Boolean(s.is_archived);
                        const canPromote = !existingEnr && !isGrad && !isArch && Number(s.grade_level) < 12;
                        const canRepeat = !existingEnr && !isGrad && !isArch;

                        return (
                          <div
                            key={s.student_record_id}
                            style={{
                              padding: '12px',
                              border: '1px solid #e0e0e0',
                              borderRadius: '8px',
                              background: existingEnr || isGrad || isArch ? '#f9fafb' : '#fff',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '10px',
                              flexWrap: 'wrap',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: '700', color: '#8B0000' }}>
                                {s.first_name} {s.last_name}
                                {existingEnr && (
                                  <span style={{ marginLeft: '8px', background: '#e6f4ea', color: '#137333', fontSize: '11px', padding: '1px 6px', borderRadius: '4px' }}>
                                    Already Enrolled (Gr {existingEnr.grade_level})
                                  </span>
                                )}
                                {isGrad && (
                                  <span style={{ marginLeft: '8px', background: '#e8f0fe', color: '#1a73e8', fontSize: '11px', padding: '1px 6px', borderRadius: '4px' }}>
                                    Graduated
                                  </span>
                                )}
                                {isArch && !isGrad && (
                                  <span style={{ marginLeft: '8px', background: '#f8d7da', color: '#721c24', fontSize: '11px', padding: '1px 6px', borderRadius: '4px' }}>
                                    Archived
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                ID: {s.student_id} | LRN: {s.lrn_id || 'N/A'} | Current: Grade {s.grade_level}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                disabled={!canPromote}
                                title={Number(s.grade_level) >= 12 ? 'Grade 12 students cannot advance higher; use Repeater if repeating' : ''}
                                onClick={() => handleSelectExistingStudent(s, false)}
                              >
                                Promote (Continuing) &rarr;
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                disabled={!canRepeat}
                                style={{ borderColor: '#6d28d9', color: '#6d28d9' }}
                                onClick={() => handleSelectExistingStudent(s, true)}
                              >
                                Retain (Repeater) &rarr;
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 2: Demographics & Personal Info ── */}
              {wizardStep === 2 && (
                <div>
                  <h4 style={{ margin: '0 0 14px 0', color: '#8B0000', borderBottom: '2px solid #e9ecef', paddingBottom: '6px' }}>
                    Student Identification &amp; Demographics
                  </h4>
                  <div style={{
                    background: '#e8f4fd',
                    border: '1px solid #b8daff',
                    color: '#004085',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    lineHeight: '1.4'
                  }}>
                    <div>
                      <strong>Fast Intake:</strong> Only Name and Grade Level are required to process admissions and assess fees. Additional demographic details, home address, and 2x2 portrait photo can be completed post-enrollment in <strong>Student Records</strong>.
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Enrollment Category *</label>
                      <select
                        value={wizardForm.enrollment_type}
                        onChange={e => {
                          const cat = e.target.value;
                          setWizardForm(f => {
                            const next = {
                              ...f,
                              enrollment_type: cat,
                              is_repeater: cat === 'Repeater',
                            };
                            if (cat === 'New Enrollee' && f.grade_level && ![1, 7].includes(Number(f.grade_level))) {
                              next.grade_level = '';
                              next.section_id = '';
                              next.section_name = '';
                              next.strand_id = '';
                            }
                            if (cat === 'Repeater' && f.prior_grade_level) {
                              next.grade_level = Number(f.prior_grade_level);
                              next.section_id = '';
                              next.section_name = '';
                              next.strand_id = Number(f.prior_grade_level) >= 11 ? f.strand_id : '';
                              next.completion_confirmed = false;
                            }
                            if (cat === 'Continuing' && f.prior_grade_level) {
                              const prevG = Number(f.prior_grade_level);
                              if (prevG >= 12) {
                                setWizardError('Grade 12 students cannot be promoted further. Keep Category on Repeater.');
                                return f;
                              }
                              next.grade_level = prevG + 1;
                              next.section_id = '';
                              next.section_name = '';
                              next.strand_id = (prevG + 1) >= 11 ? (prevG === 10 ? '' : f.strand_id) : '';
                            }
                            return next;
                          });
                        }}
                      >
                        {wizardForm.mode === 'new' ? (
                          <>
                            <option value="New Enrollee">New Enrollee (Grade 1 &amp; Grade 7 Only)</option>
                            <option value="Transferee">Transferee from Other School (Grades 1–12)</option>
                          </>
                        ) : (
                          <>
                            <option value="Continuing">Continuing Student (Promoted)</option>
                            <option value="Repeater">Repeater (Retained in Current Grade)</option>
                            <option value="Returnee">Returnee</option>
                            <option value="Transferee">Transferee</option>
                          </>
                        )}
                      </select>
                    </div>
                    {wizardForm.mode === 'new' && (
                      <div className="form-group">
                        <label>Student ID *</label>
                        <input
                          value={wizardForm.student_id}
                          onChange={e => { setWizardError(''); setWizardForm(f => ({ ...f, student_id: e.target.value, student_id_auto: false })); }}
                          placeholder="Auto-generated (e.g. STU-2026-0001)"
                        />
                        <div style={{ fontSize: '11px', color: '#6c757d', marginTop: '4px' }}>
                          Auto-assigned as the next free number. You may type your own; it must be unique.
                        </div>
                      </div>
                    )}
                    <div className="form-group">
                      <label>DepEd LRN (12 Digits)</label>
                      <input
                        value={wizardForm.lrn_id}
                        onChange={e => setWizardForm(f => ({ ...f, lrn_id: e.target.value.replace(/\D/g, '') }))}
                        placeholder="12-digit Learner Reference Number"
                        maxLength={12}
                      />
                    </div>
                    <div className="form-group">
                      <label>First Name *</label>
                      <input value={wizardForm.first_name} onChange={e => setWizardForm(f => ({ ...f, first_name: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label>Middle Name</label>
                      <input value={wizardForm.middle_name} onChange={e => setWizardForm(f => ({ ...f, middle_name: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input value={wizardForm.last_name} onChange={e => setWizardForm(f => ({ ...f, last_name: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label>Gender *</label>
                      <select value={wizardForm.gender} onChange={e => setWizardForm(f => ({ ...f, gender: e.target.value }))} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Birthdate</label>
                      <input type="date" value={wizardForm.birthdate} onChange={e => setWizardForm(f => ({ ...f, birthdate: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" value={wizardForm.email} onChange={e => setWizardForm(f => ({ ...f, email: e.target.value }))} placeholder="student@gmail.com" />
                    </div>
                    <div className="form-group">
                      <label>Mobile Contact</label>
                      <input value={wizardForm.contact_number} onChange={e => setWizardForm(f => ({ ...f, contact_number: e.target.value }))} placeholder="09XX-XXX-XXXX" />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label>Residential Address</label>
                      <input value={wizardForm.address} onChange={e => setWizardForm(f => ({ ...f, address: e.target.value }))} placeholder="Barangay, Municipality, Province" />
                    </div>
                    <div className="form-group">
                      <label>Parent / Guardian Full Name</label>
                      <input value={wizardForm.guardian_name} onChange={e => setWizardForm(f => ({ ...f, guardian_name: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Guardian Contact Number</label>
                      <input value={wizardForm.guardian_contact} onChange={e => setWizardForm(f => ({ ...f, guardian_contact: e.target.value }))} placeholder="09XX-XXX-XXXX" />
                    </div>
                  </div>

                  {wizardForm.enrollment_type === 'Transferee' && (
                    <div style={{ marginTop: '14px', padding: '14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px' }}>
                      <h5 style={{ margin: '0 0 10px 0', color: '#92400e', fontSize: '13px', fontWeight: '700' }}>
                        Transferee Previous School Records &amp; 10-Month Proration
                      </h5>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Previous School Name *</label>
                          <input
                            value={wizardForm.previous_school}
                            onChange={e => setWizardForm(f => ({ ...f, previous_school: e.target.value }))}
                            placeholder="Name of previous school attended"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Previous School Address</label>
                          <input
                            value={wizardForm.previous_school_address}
                            onChange={e => setWizardForm(f => ({ ...f, previous_school_address: e.target.value }))}
                            placeholder="City / Municipality / Province"
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label>Last Grade Level Completed</label>
                          <input
                            value={wizardForm.last_grade_completed}
                            onChange={e => setWizardForm(f => ({ ...f, last_grade_completed: e.target.value }))}
                            placeholder="e.g. Grade 4"
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label>Last School Year Attended</label>
                          <input
                            value={wizardForm.last_school_year}
                            onChange={e => setWizardForm(f => ({ ...f, last_school_year: e.target.value }))}
                            placeholder="e.g. 2025-2026"
                          />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                          <label>Months Elapsed Before Transfer (0–9, out of 10-month school year)</label>
                          <input
                            type="number"
                            min="0"
                            max="9"
                            value={wizardForm.months_elapsed}
                            onChange={e => setWizardForm(f => ({ ...f, months_elapsed: Math.min(9, Math.max(0, Number(e.target.value) || 0)) }))}
                          />
                          <div style={{ fontSize: '11px', color: '#78350f', marginTop: '4px' }}>
                            Tuition will be prorated for {10 - Math.min(9, Math.max(0, Number(wizardForm.months_elapsed) || 0))} / 10 remaining months.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {wizardForm.enrollment_type === 'Repeater' && (
                    <div style={{ marginTop: '14px', padding: '12px 14px', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '8px', fontSize: '12px', color: '#5b21b6' }}>
                      <strong>Repeater Status:</strong> Retaining existing Student ID ({wizardForm.student_id || 'On File'}) for Grade {wizardForm.grade_level || wizardForm.prior_grade_level}. No duplicate enrollee profile will be created.
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 3: Academic Placement & Strand ── */}
              {wizardStep === 3 && (
                <div>
                  <h4 style={{ margin: '0 0 14px 0', color: '#8B0000', borderBottom: '2px solid #e9ecef', paddingBottom: '6px' }}>
                    Academic Placement &amp; Grants (S.Y. {activeSchoolYear?.year_label || '2026-2027'})
                  </h4>

                  {wizardForm.enrollment_type === 'New Enrollee' && (
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>
                      <strong>Admissions Rule:</strong> New regular enrollees are restricted to <strong>Grade 1</strong> and <strong>Grade 7</strong> only. Other grade levels (Grades 2–6, 8–12) are strictly open to <strong>Transferees</strong> (switch category in Step 2) or Continuing/Repeater students.
                    </div>
                  )}

                  {wizardForm.student_record_id &&
                    wizardForm.enrollment_type !== 'Repeater' &&
                    wizardForm.prior_grade_level !== '' &&
                    Number(wizardForm.grade_level) > Number(wizardForm.prior_grade_level) && (
                    <div style={{ background: wizardForm.completion_confirmed ? '#f0fdf4' : '#fef2f2', border: `1px solid ${wizardForm.completion_confirmed ? '#86efac' : '#fecaca'}`, borderRadius: '8px', padding: '12px 14px', marginBottom: '14px' }}>
                      <div style={{ fontWeight: '700', fontSize: '13px', color: wizardForm.completion_confirmed ? '#166534' : '#991b1b', marginBottom: '6px' }}>
                        Grade Completion Verification Required (Grade {wizardForm.prior_grade_level} &rarr; Grade {wizardForm.grade_level})
                      </div>
                      <div style={{ fontSize: '12px', color: '#444', marginBottom: '10px' }}>
                        {priorGradesInfo?.loading
                          ? 'Checking recorded grades for prior grade level...'
                          : priorGradesInfo && priorGradesInfo.count > 0
                            ? `Recorded Grades on File: ${priorGradesInfo.count} entry(s) | Avg: ${priorGradesInfo.avg} | Passed: ${priorGradesInfo.passedCount}, Below 75: ${priorGradesInfo.failedCount}`
                            : 'No prior digital grade entries found on file. Verify physical Form 138 / Report Card before authorizing promotion.'}
                      </div>
                      <button
                        type="button"
                        className={`btn btn-sm ${wizardForm.completion_confirmed ? 'btn-secondary' : 'btn-primary'}`}
                        style={wizardForm.completion_confirmed ? { background: '#16a34a', color: '#fff', borderColor: '#16a34a' } : {}}
                        onClick={() => setWizardForm(f => ({ ...f, completion_confirmed: !f.completion_confirmed }))}
                      >
                        {wizardForm.completion_confirmed
                          ? `Verified: Grade ${wizardForm.prior_grade_level} Completion Confirmed`
                          : `Verify Grade ${wizardForm.prior_grade_level} Completion & Authorize Promotion`}
                      </button>
                    </div>
                  )}

                  <div className="form-grid">
                    <div className="form-group">
                      <label>
                        {wizardForm.enrollment_type === 'New Enrollee'
                          ? 'Enrolling Grade Level (Grade 1 or 7 Only) *'
                          : 'Enrolling Grade Level (1–12) *'}
                      </label>
                      <select
                        value={wizardForm.grade_level}
                        onChange={e => setWizardForm(f => ({ ...f, grade_level: e.target.value, section_id: '', section_name: '', strand_id: '' }))}
                        required
                      >
                        <option value="">Select Grade Level...</option>
                        {(wizardForm.enrollment_type === 'New Enrollee'
                          ? GRADE_OPTIONS.filter(g => g.value === 1 || g.value === 7)
                          : GRADE_OPTIONS
                        ).map(g => (
                          <option key={g.value} value={g.value}>{g.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Section Assignment */}
                    <div className="form-group">
                      <label>Assigned Section</label>
                      {wizardSections.length > 0 ? (
                        <select
                          value={wizardForm.section_id}
                          onChange={e => {
                            const secId = e.target.value;
                            const secObj = sections.find(s => String(s.id) === String(secId));
                            setWizardForm(f => ({
                              ...f,
                              section_id: secId,
                              section_name: secObj ? cleanSectionName(secObj.section_name, wizardForm.grade_level) : '',
                            }));
                          }}
                        >
                          <option value="">Select Section...</option>
                          {wizardSections.map(sec => {
                            const secCount = enrollments.filter(
                              e => String(e.section_id) === String(sec.id) && !['Dropped', 'Transferred Out'].includes(e.enrollment_status)
                            ).length;
                            const maxCap = Number(sec.max_capacity || 0);
                            const isFull = maxCap > 0 && secCount >= maxCap;
                            const capLabel = maxCap > 0 ? ` — ${secCount}/${maxCap}${isFull ? ' FULL' : ''}` : '';
                            return (
                              <option key={sec.id} value={sec.id} disabled={isFull}>
                                {cleanSectionName(sec.section_name, wizardForm.grade_level)}{sec.room_number ? ` (${sec.room_number})` : ''}{capLabel}
                              </option>
                            );
                          })}
                        </select>
                      ) : (
                        <input
                          value={wizardForm.section_name}
                          onChange={e => setWizardForm(f => ({ ...f, section_name: e.target.value }))}
                          placeholder="e.g. Diamond, Emerald"
                        />
                      )}
                    </div>

                    {/* SHS Strand (If Grade 11 or 12) */}
                    {Number(wizardForm.grade_level) >= 11 && (
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ color: '#0056b3', fontWeight: '600' }}>Senior High School (SHS) Strand *</label>
                        <select
                          value={wizardForm.strand_id}
                          onChange={e => setWizardForm(f => ({ ...f, strand_id: e.target.value }))}
                          required
                        >
                          <option value="">Select SHS Strand...</option>
                          {strands.map(st => (
                            <option key={st.id} value={st.id}>{st.strand_code} — {st.strand_name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Stacked Scholarships / Grants */}
                    <div className="form-group">
                      <label>Primary Scholarship Grant (e.g. ESC Voucher)</label>
                      <select
                        value={wizardForm.scholarship_id}
                        onChange={e => setWizardForm(f => ({ ...f, scholarship_id: e.target.value }))}
                      >
                        <option value="">Regular Tuition (No Discount)</option>
                        {scholarships.map(sc => (
                          <option key={sc.id} value={sc.id}>
                            {sc.name} ({sc.discount_type === 'percentage' ? `${sc.discount_value}% OFF` : `₱${sc.discount_value} Grant`})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Secondary Stackable Discount (e.g. Sibling Discount)</label>
                      <select
                        value={wizardForm.secondary_scholarship_id}
                        onChange={e => setWizardForm(f => ({ ...f, secondary_scholarship_id: e.target.value }))}
                      >
                        <option value="">None</option>
                        {scholarships
                          .filter(sc => String(sc.id) !== String(wizardForm.scholarship_id))
                          .map(sc => (
                            <option key={sc.id} value={sc.id}>
                              {sc.name} ({sc.discount_type === 'percentage' ? `${sc.discount_value}% OFF` : `₱${sc.discount_value} Grant`})
                            </option>
                          ))}
                      </select>
                    </div>

                    {wizardForm.enrollment_type === 'Transferee' && wizardForm.grade_level && (
                      <div className="form-group" style={{ gridColumn: '1 / -1', background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', color: '#78350f' }}>
                        {(() => {
                          const base = getBaseFees(wizardForm.grade_level, feeMatrix);
                          const { remainingMonths, proratedTuition } = calculateProratedTuition(base.tuition, wizardForm.months_elapsed);
                          return (
                            <div>
                              <strong>Prorated Tuition Assessment:</strong> Base ₱{Number(base.tuition).toLocaleString()} &times; ({remainingMonths}/10 mos) ={' '}
                              <strong>₱{Number(proratedTuition).toLocaleString()}</strong> + Misc ₱{Number(base.misc).toLocaleString()}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label>Enrollment Remarks / Special Notes</label>
                      <input
                        value={wizardForm.remarks}
                        onChange={e => setWizardForm(f => ({ ...f, remarks: e.target.value }))}
                        placeholder="e.g. Transferee from St. Jude, pending Form 137"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4: DepEd Requirements Checklist ── */}
              {wizardStep === 4 && (
                <div>
                  <h4 style={{ margin: '0 0 14px 0', color: '#8B0000', borderBottom: '2px solid #e9ecef', paddingBottom: '6px' }}>
                    DepEd Documentary Requirements Checklist
                  </h4>
                  <p style={{ fontSize: '13px', color: '#555', marginBottom: '16px' }}>
                    Check off all credentials and documents submitted during intake:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { key: 'psa_birth_cert',   label: 'PSA / NSO Birth Certificate (Original / Photocopy)' },
                      { key: 'form_138',         label: 'Form 138 / SF9 (Previous Grade Level Report Card)' },
                      { key: 'form_137',         label: 'Form 137 / SF10 (Learner Permanent Academic Record)' },
                      { key: 'good_moral',       label: 'Certificate of Good Moral Character' },
                      { key: 'medical_clearance', label: 'Medical & Dental Clearance / Health Certificate' },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 14px',
                          background: wizardForm.requirements[key] ? '#e6f4ea' : '#f8f9fa',
                          border: wizardForm.requirements[key] ? '1px solid #b7e1cd' : '1px solid #e9ecef',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: wizardForm.requirements[key] ? '600' : 'normal',
                          color: wizardForm.requirements[key] ? '#137333' : '#333',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={wizardForm.requirements[key] || false}
                          onChange={e => {
                            const val = e.target.checked;
                            setWizardForm(f => ({
                              ...f,
                              requirements: { ...f.requirements, [key]: val },
                            }));
                          }}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 5: Review & Confirm ── */}
              {wizardStep === 5 && (
                <div>
                  <h4 style={{ margin: '0 0 14px 0', color: '#8B0000', borderBottom: '2px solid #e9ecef', paddingBottom: '6px' }}>
                    Review Enrollment Summary
                  </h4>
                  <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', border: '1px solid #e9ecef', fontSize: '14px', lineHeight: '1.8' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                      <div><strong>Student Name:</strong> {wizardForm.first_name} {wizardForm.last_name}</div>
                      <div><strong>DepEd LRN:</strong> {wizardForm.lrn_id || 'Not specified'}</div>
                      <div><strong>Enrollment Type:</strong> {wizardForm.enrollment_type}</div>
                      <div><strong>Target School Year:</strong> S.Y. {activeSchoolYear?.year_label || '2026-2027'}</div>
                      <div><strong>Enrolling Grade Level:</strong> Grade {wizardForm.grade_level}</div>
                      <div><strong>Assigned Section:</strong> {cleanSectionName(wizardForm.section_name, wizardForm.grade_level) || 'Unassigned'}</div>
                      <div><strong>SHS Strand:</strong> {strands.find(st => st.id === wizardForm.strand_id)?.strand_name || 'N/A'}</div>
                      <div>
                        <strong>Scholarship / Grants:</strong>{' '}
                        {[
                          scholarships.find(sc => String(sc.id) === String(wizardForm.scholarship_id))?.name,
                          scholarships.find(sc => String(sc.id) === String(wizardForm.secondary_scholarship_id))?.name,
                        ].filter(Boolean).join(' + ') || 'Regular'}
                      </div>
                      <div><strong>Emergency Contact:</strong> {wizardForm.guardian_name} ({wizardForm.guardian_contact || 'N/A'})</div>
                      {wizardForm.enrollment_type === 'Transferee' && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <strong>Previous School:</strong> {wizardForm.previous_school || '—'}{' '}
                          {wizardForm.last_grade_completed ? `(Completed: ${wizardForm.last_grade_completed})` : ''} • Months Elapsed: {wizardForm.months_elapsed || 0}
                        </div>
                      )}
                      {wizardForm.completion_confirmed && (
                        <div style={{ gridColumn: '1 / -1', color: '#166534', fontWeight: '600' }}>
                          Grade {wizardForm.prior_grade_level} Completion Verified &amp; Promotion Authorized
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ marginTop: '14px', padding: '10px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '11px', color: '#7f1d1d', lineHeight: '1.45' }}>
                    {NO_REFUND_DISCLAIMER}
                  </div>
                </div>
              )}

            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                {wizardStep > (wizardForm.mode === 'new' ? 2 : 1) && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setWizardStep(s => Math.max(wizardForm.mode === 'new' ? 2 : 1, s - 1))}
                  >
                    &larr; Back
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setWizardOpen(false)}>
                  Cancel
                </button>
                {wizardStep < 5 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={async () => {
                      if (wizardStep === 2) {
                        if (!wizardForm.first_name || !wizardForm.last_name || !wizardForm.gender) {
                          setWizardError('First name, last name, and gender are required.');
                          return;
                        }
                        if (wizardForm.lrn_id?.trim() && wizardForm.lrn_id.trim().length !== 12) {
                          setWizardError('Learner Reference Number (LRN) must be exactly 12 digits.');
                          return;
                        }
                        if (wizardForm.enrollment_type === 'Transferee' && !wizardForm.previous_school?.trim()) {
                          setWizardError('Please enter the Previous School Name for this Transferee.');
                          return;
                        }
                        if (wizardForm.mode === 'new' && wizardForm.enrollment_type !== 'Repeater' && wizardForm.student_id?.trim()) {
                          try {
                            const clash = await findStudentByStudentId(supabase, wizardForm.student_id);
                            if (clash) {
                              setWizardError(duplicateStudentIdMessage(wizardForm.student_id.trim(), clash));
                              return;
                            }
                          } catch { /* fall through; the save step re-checks */ }
                        }
                      }
                      if (wizardStep === 3) {
                        if (!wizardForm.grade_level) {
                          setWizardError('Please select a grade level.');
                          return;
                        }
                        if (wizardForm.enrollment_type === 'New Enrollee' && ![1, 7].includes(Number(wizardForm.grade_level))) {
                          setWizardError('New regular intake is limited strictly to Grade 1 and Grade 7. Switch Category to Transferee for other grade levels.');
                          return;
                        }
                        const isProm =
                          Boolean(wizardForm.student_record_id) &&
                          wizardForm.enrollment_type !== 'Repeater' &&
                          wizardForm.prior_grade_level !== '' &&
                          Number(wizardForm.grade_level) > Number(wizardForm.prior_grade_level);
                        if (isProm && !wizardForm.completion_confirmed) {
                          setWizardError(`Please click "Verify Grade ${wizardForm.prior_grade_level} Completion & Authorize Promotion" before proceeding.`);
                          return;
                        }
                        if (Number(wizardForm.grade_level) >= 11 && !wizardForm.strand_id) {
                          setWizardError('Please select a Senior High School strand.');
                          return;
                        }
                      }
                      setWizardError('');
                      setWizardStep(s => s + 1);
                    }}
                  >
                    Next &rarr;
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={saving}
                    onClick={handleSubmitIntake}
                  >
                    {saving ? 'Confirming Enrollment...' : 'Confirm & Complete Enrollment'}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Certificate of Matriculation / Print Slip Modal ── */}
      {viewSlip && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setViewSlip(null); }}>
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoPrint /> Certificate of Matriculation / Enrollment Slip</h3>
              <button className="modal-close" onClick={() => setViewSlip(null)}><IcoClose /></button>
            </div>
            <div className="modal-body" id="printable-matriculation-slip" style={{ padding: '24px', background: '#fff', border: '2px solid #8B0000', borderRadius: '8px' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #8B0000', paddingBottom: '12px', marginBottom: '16px' }}>
                <h2 style={{ color: '#8B0000', margin: '0 0 4px 0', fontSize: '20px' }}>A.B SIMPSON ALLIANCE SCHOOL, INC</h2>
                <div style={{ fontSize: '13px', color: '#555' }}>OFFICIAL ENROLLMENT CERTIFICATE</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#8B0000', marginTop: '4px' }}>
                  ACADEMIC YEAR {currentSy?.year_label || activeSchoolYear?.year_label || '2026-2027'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px', lineHeight: '1.6' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ fontWeight: 'bold' }}>DepEd LRN (Learner Reference Number): </span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '15px', color: '#8B0000' }}>
                    {viewSlip.student?.lrn_id || viewSlip.student?.student_id || '—'}
                  </span>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ fontWeight: 'bold' }}>Student Full Name:</span> {viewSlip.student?.first_name} {viewSlip.student?.last_name}
                </div>
                <div><span style={{ fontWeight: 'bold' }}>Grade Level:</span> Grade {viewSlip.enrollment?.grade_level}</div>
                <div><span style={{ fontWeight: 'bold' }}>Section:</span> {cleanSectionName(sections.find(s => s.id === viewSlip.enrollment?.section_id)?.section_name || viewSlip.student?.section_name, viewSlip.enrollment?.grade_level) || 'Unassigned'}</div>
                <div><span style={{ fontWeight: 'bold' }}>SHS Strand:</span> {strands.find(st => st.id === viewSlip.enrollment?.strand_id)?.strand_name || 'N/A'}</div>
                <div>
                  <span style={{ fontWeight: 'bold' }}>Scholarship / Grants:</span>{' '}
                  {[
                    scholarships.find(sc => String(sc.id) === String(viewSlip.enrollment?.scholarship_id))?.name,
                    scholarships.find(sc => String(sc.id) === String(viewSlip.enrollment?.secondary_scholarship_id))?.name,
                  ].filter(Boolean).join(' + ') || 'Regular'}
                </div>
                <div><span style={{ fontWeight: 'bold' }}>Enrollment Type:</span> {getEffectiveEnrollmentType(viewSlip.enrollment)}</div>
                <div><span style={{ fontWeight: 'bold' }}>Date Enrolled:</span> {viewSlip.enrollment?.date_enrolled}</div>
                {(viewSlip.enrollment?.previous_school || viewSlip.student?.previous_school) && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ fontWeight: 'bold' }}>Previous School:</span>{' '}
                    {viewSlip.enrollment?.previous_school || viewSlip.student?.previous_school}
                  </div>
                )}
              </div>

              <div style={{ marginTop: '14px', padding: '8px 10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '10px', color: '#7f1d1d', lineHeight: '1.4' }}>
                {NO_REFUND_DISCLAIMER}
              </div>

              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed #ccc', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#555' }}>
                <div>Verified by: Registrar / Admissions Officer</div>
                <div>Status: <strong style={{ color: '#137333' }}>OFFICIALLY ENROLLED</strong></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewSlip(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <IcoPrint /> Print Enrollment Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Inline Styles ── */
const styles = {
  badgeNew: {
    display: 'inline-block',
    background: '#e8f0fe',
    color: '#1a73e8',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeContinuing: {
    display: 'inline-block',
    background: '#e6f4ea',
    color: '#137333',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeEnrolled: {
    display: 'inline-block',
    background: '#e6f4ea',
    color: '#137333',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
  },
  badgeNeutral: {
    display: 'inline-block',
    background: '#e8f0fe',
    color: '#1a73e8',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeScholarship: {
    display: 'inline-block',
    background: '#e6f4ea',
    color: '#0d652d',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
  },
  badgeTransferee: {
    display: 'inline-block',
    background: '#fef3c7',
    color: '#92400e',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
  },
  badgeRepeater: {
    display: 'inline-block',
    background: '#ede9fe',
    color: '#5b21b6',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
  },
};
