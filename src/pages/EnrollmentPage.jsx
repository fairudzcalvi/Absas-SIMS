import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
  scholarship_id:     '',
  enrollment_type:    'New Enrollee',
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
  const { supabase, activeSchoolYear, activeQuarter } = useAuth();

  const [enrollments, setEnrollments]   = useState([]);
  const [students, setStudents]         = useState([]);
  const [sections, setSections]         = useState([]);
  const [strands, setStrands]           = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [dbNotice, setDbNotice]         = useState('');

  // Filters
  const [gradeFilter, setGradeFilter]   = useState('');
  const [typeFilter, setTypeFilter]     = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
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

      if (activeSchoolYear?.id) {
        query = query.eq('school_year_id', activeSchoolYear.id);
      }

      const { data: enrData, error: enrErr } = await query;
      if (enrErr) {
        setDbNotice(enrErr.message);
        setEnrollments([]);
      } else {
        setEnrollments(enrData ?? []);
      }

      // 3. Fetch Sections
      const { data: secData } = await supabase
        .from('sections')
        .select('id, grade_level, section_name, room_number, strand_id, status')
        .eq('status', 'Active');
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

    } catch (err) {
      setDbNotice(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase, activeSchoolYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* Stats calculation */
  const totalEnrolled  = enrollments.filter(e => e.enrollment_status === 'Enrolled' || e.enrollment_status === 'Approved').length;
  const newEnrollees   = enrollments.filter(e => e.enrollment_type === 'New Enrollee').length;
  const continuing     = enrollments.filter(e => e.enrollment_type === 'Continuing').length;
  const shsEnrollees   = enrollments.filter(e => Number(e.grade_level) >= 11).length;

  /* Filtered Enrollments */
  const filteredEnrollments = enrollments.filter(e => {
    const student = students.find(s => s.student_record_id === e.student_record_id);

    if (gradeFilter && Number(e.grade_level) !== Number(gradeFilter)) return false;
    if (typeFilter && e.enrollment_type !== typeFilter) return false;
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
    setWizardForm({
      ...INITIAL_WIZARD_FORM,
      mode,
      enrollment_type: mode === 'new' ? 'New Enrollee' : 'Continuing',
      student_id: mode === 'new' ? `STU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : '',
    });
    setWizardStep(mode === 'continuing' ? 1 : 2);
    setWizardError('');
    setWizardOpen(true);
  }

  /* Handle Continuing Student Selection */
  function handleSelectExistingStudent(student) {
    const currentGrade = Number(student.grade_level || 1);
    const nextGrade = currentGrade < 12 ? currentGrade + 1 : 12;

    setWizardForm(f => ({
      ...f,
      student_record_id: student.student_record_id,
      student_id:        student.student_id        || '',
      lrn_id:            student.lrn_id            || '',
      first_name:        student.first_name        || '',
      middle_name:       student.middle_name       || '',
      last_name:         student.last_name         || '',
      gender:            student.gender            || '',
      birthdate:         student.birthdate         || '',
      age:               student.age               || '',
      email:             student.email             || '',
      contact_number:    student.contact_number    || '',
      address:           student.address           || '',
      guardian_name:     student.guardian_name     || '',
      guardian_contact:  student.guardian_contact  || '',
      guardian_relation: student.guardian_relation || 'Parent',
      grade_level:       nextGrade,
      strand_id:         student.current_strand_id || '',
      scholarship_id:    student.scholarship_id    || '',
      enrollment_type:   'Continuing',
    }));
    setWizardStep(2);
  }

  /* Submit Intake Wizard */
  async function handleSubmitIntake() {
    setSaving(true);
    setWizardError('');

    try {
      let targetRecordId = wizardForm.student_record_id;

      // 1. If New Student, insert into students table
      if (wizardForm.mode === 'new' || !targetRecordId) {
        const cleanId = wizardForm.student_id || (wizardForm.lrn_id ? wizardForm.lrn_id : `STU-${Date.now()}`);
        const studentPayload = {
          student_id:         cleanId,
          lrn_id:             wizardForm.lrn_id             || null,
          first_name:         wizardForm.first_name.trim(),
          middle_name:        wizardForm.middle_name        ? wizardForm.middle_name.trim() : null,
          last_name:          wizardForm.last_name.trim(),
          gender:             wizardForm.gender,
          birthdate:          wizardForm.birthdate          || null,
          age:                wizardForm.age                ? Number(wizardForm.age) : null,
          email:              wizardForm.email              || null,
          contact_number:     wizardForm.contact_number     || null,
          address:            wizardForm.address            || null,
          guardian_name:      wizardForm.guardian_name      || null,
          guardian_contact:   wizardForm.guardian_contact   || null,
          guardian_relation:  wizardForm.guardian_relation  || 'Parent',
          grade_level:        Number(wizardForm.grade_level),
          current_strand_id:  Number(wizardForm.grade_level) >= 11 && wizardForm.strand_id ? wizardForm.strand_id : null,
          current_section_id: wizardForm.section_id         || null,
          section_name:       wizardForm.section_name       || null,
          scholarship_id:     wizardForm.scholarship_id     || null,
          student_type:       wizardForm.enrollment_type,
          status:             'Active',
          is_archived:        false,
        };

        const { data: createdStudent, error: stuErr } = await supabase
          .from('students')
          .insert([studentPayload])
          .select()
          .single();

        if (stuErr) throw stuErr;
        targetRecordId = createdStudent.student_record_id;
      } else {
        // Update existing student record with updated Grade Level & Section
        await supabase
          .from('students')
          .update({
            grade_level:        Number(wizardForm.grade_level),
            current_strand_id:  Number(wizardForm.grade_level) >= 11 && wizardForm.strand_id ? wizardForm.strand_id : null,
            current_section_id: wizardForm.section_id || null,
            section_name:       wizardForm.section_name || null,
            scholarship_id:     wizardForm.scholarship_id || null,
            student_type:       wizardForm.enrollment_type,
            status:             'Active',
          })
          .eq('student_record_id', targetRecordId);
      }

      // 2. Log entry in enrollments table for active School Year
      const enrollmentPayload = {
        student_record_id:      targetRecordId,
        school_year_id:         activeSchoolYear?.id || null,
        grade_level:            Number(wizardForm.grade_level),
        strand_id:              Number(wizardForm.grade_level) >= 11 && wizardForm.strand_id ? wizardForm.strand_id : null,
        section_id:             wizardForm.section_id || null,
        enrollment_type:        wizardForm.enrollment_type,
        enrollment_status:      'Enrolled',
        scholarship_id:         wizardForm.scholarship_id || null,
        requirements_submitted: wizardForm.requirements,
        date_enrolled:          new Date().toISOString().split('T')[0],
        remarks:                wizardForm.remarks || null,
      };

      const { data: newEnrollment, error: enrErr } = await supabase
        .from('enrollments')
        .insert([enrollmentPayload])
        .select()
        .single();

      if (enrErr) throw enrErr;

      setWizardOpen(false);
      fetchData();

      // Open Confirmation Slip
      const studentObj = students.find(s => s.student_record_id === targetRecordId) || {
        first_name: wizardForm.first_name,
        last_name:  wizardForm.last_name,
        student_id: wizardForm.student_id,
        lrn_id:     wizardForm.lrn_id,
      };
      setViewSlip({ enrollment: newEnrollment, student: studentObj });

    } catch (err) {
      setWizardError(err.message || 'Error processing enrollment intake.');
    } finally {
      setSaving(false);
    }
  }

  const wizardSections = sections.filter(sec => Number(sec.grade_level) === Number(wizardForm.grade_level));

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
            <span>{activeSchoolYear?.year_label ? `S.Y. ${activeSchoolYear.year_label}` : 'S.Y. 2026-2027'}</span>
            {activeQuarter && (
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontSize: '11px' }}>
                {activeQuarter.quarter_name}
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
              <div className="stat-label">Total Enrolled ({activeSchoolYear?.year_label || 'Active S.Y.'})</div>
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
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary" onClick={() => openIntakeWizard('new')}>
                <IcoNewStudent /> + Enroll New Student (First Timer)
              </button>
              <button className="btn btn-secondary" onClick={() => openIntakeWizard('continuing')}>
                <IcoContinuing /> Re-Enroll Continuing Student
              </button>
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
              const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = `enrollment_masterlist_${activeSchoolYear?.year_label || 'active'}.csv`; a.click();
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
                <option value="New Enrollee">New Enrollee (First Timer)</option>
                <option value="Continuing">Continuing Student</option>
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
                    ✕
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
                          Grade {e.grade_level} {section ? ` - ${section.section_name}` : ''}
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
                          <span style={e.enrollment_type === 'New Enrollee' ? styles.badgeNew : styles.badgeContinuing}>
                            {e.enrollment_type}
                          </span>
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
              ].map(({ step, label }) => (
                <div
                  key={step}
                  onClick={() => { if (step < wizardStep || (wizardForm.first_name && step <= 4)) setWizardStep(step); }}
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
                      {studentLookupResults.map(s => (
                        <div
                          key={s.student_record_id}
                          onClick={() => handleSelectExistingStudent(s)}
                          style={{
                            padding: '12px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            background: '#fff',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseOver={e => e.currentTarget.style.borderColor = '#8B0000'}
                          onMouseOut={e => e.currentTarget.style.borderColor = '#e0e0e0'}
                        >
                          <div>
                            <div style={{ fontWeight: '700', color: '#8B0000' }}>{s.first_name} {s.last_name}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>ID: {s.student_id} | LRN: {s.lrn_id || 'N/A'} | Current: Grade {s.grade_level}</div>
                          </div>
                          <button className="btn btn-primary btn-sm">Select Student &rarr;</button>
                        </div>
                      ))}
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
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Enrollment Category *</label>
                      <select value={wizardForm.enrollment_type} onChange={e => setWizardForm(f => ({ ...f, enrollment_type: e.target.value }))}>
                        <option value="New Enrollee">New Enrollee (First Timer)</option>
                        <option value="Continuing">Continuing Student</option>
                        <option value="Transferee">Transferee from Other School</option>
                        <option value="Returnee">Returnee</option>
                      </select>
                    </div>
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
                </div>
              )}

              {/* ── STEP 3: Academic Placement & Strand ── */}
              {wizardStep === 3 && (
                <div>
                  <h4 style={{ margin: '0 0 14px 0', color: '#8B0000', borderBottom: '2px solid #e9ecef', paddingBottom: '6px' }}>
                    Academic Placement &amp; Grants (S.Y. {activeSchoolYear?.year_label || '2026-2027'})
                  </h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Enrolling Grade Level (1–12) *</label>
                      <select
                        value={wizardForm.grade_level}
                        onChange={e => setWizardForm(f => ({ ...f, grade_level: e.target.value, section_id: '', strand_id: '' }))}
                        required
                      >
                        <option value="">Select Grade Level...</option>
                        {GRADE_OPTIONS.map(g => (
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
                              section_name: secObj ? secObj.section_name : '',
                            }));
                          }}
                        >
                          <option value="">Select Section...</option>
                          {wizardSections.map(sec => (
                            <option key={sec.id} value={sec.id}>
                              {sec.section_name} {sec.room_number ? `(${sec.room_number})` : ''}
                            </option>
                          ))}
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

                    {/* Scholarship / Grant */}
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label>Scholarship Grant / Discount Program</label>
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
                      <div><strong>Assigned Section:</strong> {wizardForm.section_name || 'Unassigned'}</div>
                      <div><strong>SHS Strand:</strong> {strands.find(st => st.id === wizardForm.strand_id)?.strand_name || 'N/A'}</div>
                      <div><strong>Scholarship:</strong> {scholarships.find(sc => sc.id === wizardForm.scholarship_id)?.name || 'Regular'}</div>
                      <div><strong>Emergency Contact:</strong> {wizardForm.guardian_name} ({wizardForm.guardian_contact || 'N/A'})</div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                {wizardStep > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setWizardStep(s => s - 1)}
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
                    onClick={() => {
                      if (wizardStep === 2) {
                        if (!wizardForm.first_name || !wizardForm.last_name || !wizardForm.gender) {
                          setWizardError('First name, last name, and gender are required.');
                          return;
                        }
                      }
                      if (wizardStep === 3) {
                        if (!wizardForm.grade_level) {
                          setWizardError('Please select a grade level.');
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
                    {saving ? 'Confirming Enrollment...' : '✓ Confirm & Complete Enrollment'}
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
                <h2 style={{ color: '#8B0000', margin: '0 0 4px 0', fontSize: '20px' }}>ANGELICUM BIRMINGHAM SCHOOL OF ACADEMIC STUDIES</h2>
                <div style={{ fontSize: '13px', color: '#555' }}>OFFICIAL ENROLLMENT CERTIFICATE</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#8B0000', marginTop: '4px' }}>
                  ACADEMIC YEAR {activeSchoolYear?.year_label || '2026-2027'}
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
                <div><span style={{ fontWeight: 'bold' }}>Section:</span> {sections.find(s => s.id === viewSlip.enrollment?.section_id)?.section_name || 'Unassigned'}</div>
                <div><span style={{ fontWeight: 'bold' }}>SHS Strand:</span> {strands.find(st => st.id === viewSlip.enrollment?.strand_id)?.strand_name || 'N/A'}</div>
                <div><span style={{ fontWeight: 'bold' }}>Scholarship:</span> {scholarships.find(sc => sc.id === viewSlip.enrollment?.scholarship_id)?.name || 'Regular'}</div>
                <div><span style={{ fontWeight: 'bold' }}>Enrollment Type:</span> {viewSlip.enrollment?.enrollment_type}</div>
                <div><span style={{ fontWeight: 'bold' }}>Date Enrolled:</span> {viewSlip.enrollment?.date_enrolled}</div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed #ccc', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#555' }}>
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
};
