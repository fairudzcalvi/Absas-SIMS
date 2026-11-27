import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cleanSectionName } from '../../utils/formatters';
import { formatDaysShort } from '../../utils/scheduleDays';

function IcoAttendance() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
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

const GRADE_OPTIONS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `Grade ${i + 1}` }));
const STATUS_OPTIONS = ['Present', 'Absent', 'Late', 'Excused'];

const STATUS_COLORS = {
  present: '#28a745', absent: '#dc3545', late: '#ffc107', excused: '#17a2b8',
};

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function TeacherAttendancePage() {
  const { supabase, profile, selectedSchoolYear, activeSchoolYear, isHistoricalYear } = useAuth();
  const currentSy = selectedSchoolYear || activeSchoolYear;
  const location = useLocation();

  const [date, setDate]           = useState(todayISO());
  const [gradeFilter, setGrade]   = useState(location.state?.presetGrade ? String(location.state.presetGrade) : '');
  const [sectionFilter, setSectionFilter] = useState(
    location.state?.presetSection
      ? cleanSectionName(location.state.presetSection, location.state?.presetGrade)
      : ''
  );
  const [availableSections, setAvailableSections] = useState([]);
  const [teacherSchedules, setTeacherSchedules]   = useState([]);
  const [students, setStudents]   = useState([]);
  const [attendance, setAttendance] = useState({}); // { student_record_id: status }
  const [loading, setLoading]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [saveError, setSaveError] = useState('');

  // Load teacher's personal schedules
  useEffect(() => {
    let ignore = false;
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

      if (!ignore && data) {
        const syMatches = (s) => {
          if (!currentSy) return true;
          if (s.school_year_id && currentSy.id) return String(s.school_year_id) === String(currentSy.id);
          if (s.school_year && currentSy.year_label) return s.school_year === currentSy.year_label;
          return true;
        };
        const mySch = data.filter(s => {
          const t = (s.teacher || '').toLowerCase().trim();
          const fId = String(s.faculty_id ?? '').toLowerCase().trim();
          const fRecId = s.faculty_record_id ? String(s.faculty_record_id) : '';
          const tn = (s.teacher_name || '').toLowerCase().trim();

          const matchesTeacher = (
            (email && (t === email || tn === email)) ||
            (facId && (fId === facId || t === facId)) ||
            (facRecId && (fRecId === facRecId || fId === facRecId)) ||
            (fullName && (t === fullName || tn === fullName))
          );
          return matchesTeacher && syMatches(s);
        });
        setTeacherSchedules(mySch);
      }
    }
    loadTeacherSchedules();
    return () => { ignore = true; };
  }, [supabase, profile, currentSy]);

  // Load sections for selected grade
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

  const isLeadership = useMemo(() => {
    if (!profile) return false;
    if (profile.can_edit_all_grades || profile.coverage_authorized || profile.is_admin || profile.is_leadership) {
      return true;
    }
    const role = (profile.role || '').toLowerCase();
    const pos = (profile.position || '').toLowerCase();
    return ['principal', 'head', 'coordinator', 'admin', 'dean', 'director', 'lead', 'coverage']
      .some(kw => role.includes(kw) || pos.includes(kw));
  }, [profile]);

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
      (!secAdv && profile.adviser_grade_level && Number(profile.adviser_grade_level) === Number(gradeFilter) && (profile.role === 'Adviser' || profile.role === 'Both'))
    );
  }, [profile, sectionFilter, availableSections, gradeFilter]);

  const isAssignedTeacher = useMemo(() => {
    if (!teacherSchedules.length || !gradeFilter) return false;
    const gl = Number(gradeFilter);
    return teacherSchedules.some(sch => {
      if (Number(sch.grade_level) !== gl) return false;
      if (sectionFilter) {
        if (!sch.section_name) return true;
        return cleanSectionName(sch.section_name, gl).toLowerCase().trim() === cleanSectionName(sectionFilter, gl).toLowerCase().trim();
      }
      return !sch.section_name;
    });
  }, [teacherSchedules, gradeFilter, sectionFilter]);

  const isAuthorizedToRecord = Boolean(isLeadership || isAssignedTeacher || isAdvisoryForSection);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!gradeFilter || !date) {
        if (!ignore) {
          setStudents([]);
          setAttendance({});
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      setSaveError('');

      const glNum = Number(gradeFilter);
      const targetSecNorm = sectionFilter
        ? cleanSectionName(sectionFilter, gradeFilter).toLowerCase().trim()
        : '';
      const excludedStatuses = ['archived', 'inactive', 'dropped', 'transferred', 'transferred out', 'graduated'];

      let studs = [];
      let usedEnrollmentRoster = false;

      if (currentSy?.id) {
        const [{ data: enrRows }, { data: sySecs }] = await Promise.all([
          supabase
            .from('enrollments')
            .select('student_record_id, grade_level, section_id, enrollment_status')
            .eq('school_year_id', currentSy.id)
            .eq('grade_level', glNum),
          supabase
            .from('sections')
            .select('id, section_name')
            .eq('school_year_id', currentSy.id),
        ]);

        const activeEnrs = (enrRows || []).filter(
          e => !['Dropped', 'Transferred Out'].includes(e.enrollment_status)
        );
        if (activeEnrs.length > 0) {
          usedEnrollmentRoster = true;
          const enrIds = Array.from(new Set(activeEnrs.map(e => e.student_record_id).filter(Boolean)));
          const { data: enrStuds } = await supabase
            .from('students')
            .select('student_record_id, student_id, lrn_id, first_name, last_name, grade_level, section_name, status, is_archived')
            .in('student_record_id', enrIds)
            .order('last_name');

          const secById = new Map((sySecs || []).map(s => [String(s.id), s.section_name]));
          const enrByStu = new Map(activeEnrs.map(e => [e.student_record_id, e]));
          studs = (enrStuds || [])
            .map(s => {
              const e = enrByStu.get(s.student_record_id);
              const resolvedSec = e?.section_id ? secById.get(String(e.section_id)) : null;
              return {
                ...s,
                section_name: resolvedSec || (isHistoricalYear ? '' : s.section_name),
              };
            })
            .filter(s => {
              if (!isHistoricalYear) {
                if (s.is_archived || excludedStatuses.includes((s.status || 'Active').toLowerCase())) return false;
              }
              if (!targetSecNorm) return true;
              return cleanSectionName(s.section_name, gradeFilter).toLowerCase().trim() === targetSecNorm;
            });
        }
      }

      if (!usedEnrollmentRoster && !isHistoricalYear) {
        const { data: allStuds } = await supabase
          .from('students')
          .select('student_record_id, student_id, lrn_id, first_name, last_name, grade_level, section_name, status, is_archived')
          .eq('grade_level', glNum)
          .order('last_name');

        studs = (allStuds ?? []).filter(s => {
          if (s.is_archived || excludedStatuses.includes((s.status || 'Active').toLowerCase())) return false;
          if (!targetSecNorm) return true;
          return cleanSectionName(s.section_name, gradeFilter).toLowerCase().trim() === targetSecNorm;
        });
      }

      const map = {};
      if (studs.length > 0) {
        const { data: existing } = await supabase
          .from('attendance')
          .select('student_record_id, status')
          .eq('date', date)
          .in('student_record_id', studs.map(s => s.student_record_id));

        (existing ?? []).forEach(r => { map[r.student_record_id] = r.status; });
        studs.forEach(s => { if (!map[s.student_record_id]) map[s.student_record_id] = 'Present'; });
      }

      if (!ignore) {
        setStudents(studs);
        setAttendance(map);
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [supabase, gradeFilter, sectionFilter, date, currentSy, isHistoricalYear]);

  async function handleSave() {
    if (students.length === 0) return;
    if (!date) {
      setSaveError('Please select a valid date before saving attendance.');
      return;
    }
    if (isHistoricalYear) {
      alert(`Attendance cannot be modified for archived S.Y. ${currentSy?.year_label}.`);
      return;
    }
    if (!isAuthorizedToRecord) {
      alert('Attendance recording is restricted to assigned class teachers or advisers. Please select your assigned section or request coverage authorization.');
      return;
    }

    setSaving(true);
    setSaved(false);
    setSaveError('');
    try {
      const rowsWithSy = students.map(s => ({
        student_record_id: s.student_record_id,
        date,
        status: attendance[s.student_record_id] ?? 'Present',
        school_year_id: currentSy?.id || null,
        school_year: currentSy?.year_label || '2026-2027',
      }));

      let { error: finalError } = await supabase
        .from('attendance')
        .upsert(rowsWithSy, { onConflict: 'student_record_id,date' });

      if (finalError && /column|schema cache|42703/i.test(finalError.message || '')) {
        const baseRows = rowsWithSy.map(({ student_record_id, date: d, status }) => ({ student_record_id, date: d, status }));
        const fbRes = await supabase
          .from('attendance')
          .upsert(baseRows, { onConflict: 'student_record_id,date' });
        finalError = fbRes.error;
      }

      if (finalError) throw finalError;
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Error saving attendance:', err);
      setSaveError(err?.message || 'Failed to save attendance to database.');
    } finally {
      setSaving(false);
    }
  }

  const counts = students.reduce((acc, s) => {
    const st = (attendance[s.student_record_id] ?? 'Present').toLowerCase();
    acc[st] = (acc[st] ?? 0) + 1;
    return acc;
  }, {});

  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <>
      <div className="top-header">
        <h1><IcoAttendance /> Students Attendance</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">
        {/* Filter */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoAttendance /> Record Attendance</h2>
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
                  const schSecClean = sch.section_name ? cleanSectionName(sch.section_name, sch.grade_level) : '';
                  const isSelected =
                    String(gradeFilter) === String(sch.grade_level) &&
                    (!schSecClean || cleanSectionName(sectionFilter, gradeFilter).toLowerCase().trim() === schSecClean.toLowerCase().trim());
                  return (
                    <button
                      key={sch.schedule_id}
                      type="button"
                      onClick={() => {
                        setGrade(String(sch.grade_level || ''));
                        setSectionFilter(schSecClean);
                      }}
                      className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '12px', padding: '4px 10px' }}
                    >
                      {sch.grade_level ? `Grade ${sch.grade_level}` : ''}
                      {schSecClean ? ` (${schSecClean})` : ''} — {sch.subject}
                      {sch.day_of_week ? ` [${formatDaysShort(sch.day_of_week)}]` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '180px' }}>
              <label>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '180px' }}>
              <label>Grade Level</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={gradeFilter}
                onChange={e => {
                  setGrade(e.target.value);
                  setSectionFilter('');
                }}
              >
                <option value="">Select Grade</option>
                {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '180px' }}>
              <label>Section</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={sectionFilter}
                onChange={e => setSectionFilter(e.target.value)}
                disabled={!gradeFilter}
              >
                <option value="">All Sections</option>
                {availableSections.map(sec => {
                  const displayName = cleanSectionName(sec.section_name, gradeFilter);
                  return (
                    <option key={sec.id} value={displayName}>
                      {displayName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        {gradeFilter && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                Grade {gradeFilter} — {date ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Select Date'}
              </h2>
              {students.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {Object.entries(counts).map(([s, n]) => (
                    <span key={s} className="badge" style={{ backgroundColor: STATUS_COLORS[s] ?? '#888', color: s === 'late' ? '#000' : '#fff' }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}: {n}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {!isHistoricalYear && !isAuthorizedToRecord && (
              <div style={{ margin: '0 16px 12px 16px', padding: '10px 14px', background: '#fff8f6', border: '1px solid #fecaca', borderLeft: '4px solid #b91c1c', borderRadius: '6px', color: '#991b1b', fontSize: '13px' }}>
                <strong>Read-Only Mode:</strong> You are not scheduled or assigned as adviser for this grade/section. Select your assigned section or contact leadership for coverage authorization.
              </div>
            )}

            {loading ? (
              <p className="empty-message">Loading students...</p>
            ) : students.length === 0 ? (
              <p className="empty-message">No students in this grade level.</p>
            ) : (
              <>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th><th>DepEd LRN</th><th>Student Name</th>
                        <th>Section</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, i) => {
                        const status = attendance[s.student_record_id] ?? 'Present';
                        return (
                          <tr key={s.student_record_id}>
                            <td style={{ color: '#888', width: '36px' }}>{i + 1}</td>
                            <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#8B0000' }}>{s.lrn_id || s.student_id || '—'}</td>
                            <td style={{ fontWeight: '600' }}>{s.first_name} {s.last_name}</td>
                            <td>{s.section_name ?? '—'}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {STATUS_OPTIONS.map(opt => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                      // Toggle: if already selected, deselect; otherwise select
                                      if (status === opt) {
                                        setAttendance(a => ({ ...a, [s.student_record_id]: 'Present' })); // default back to Present
                                      } else {
                                        setAttendance(a => ({ ...a, [s.student_record_id]: opt }));
                                      }
                                    }}
                                    onMouseEnter={(e) => {
                                      if (status !== opt) {
                                        e.target.style.backgroundColor = `${STATUS_COLORS[opt.toLowerCase()]}20`;
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (status !== opt) {
                                        e.target.style.backgroundColor = 'transparent';
                                      }
                                    }}
                                    style={{
                                      padding: '6px 12px',
                                      borderRadius: '20px',
                                      border: '2px solid',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      borderColor: STATUS_COLORS[opt.toLowerCase()] ?? '#888',
                                      backgroundColor: status === opt ? STATUS_COLORS[opt.toLowerCase()] : 'transparent',
                                      color: status === opt ? (opt === 'Late' ? '#000' : '#fff') : STATUS_COLORS[opt.toLowerCase()],
                                      transition: 'all 0.15s',
                                    }}
                                    title={`Click to set as ${opt}`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {saveError && (
                  <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b', fontSize: '13px', fontWeight: '600' }}>
                    Error saving attendance: {saveError}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '12px', alignItems: 'center' }}>
                  {isHistoricalYear && (
                    <span style={{ fontSize: '13px', color: '#856404', fontWeight: '600' }}>
                      Read-Only (Archived School Year)
                    </span>
                  )}
                  <button className="btn btn-primary" onClick={handleSave} disabled={saving || isHistoricalYear || !isAuthorizedToRecord || !date}>
                    <IcoSave /> {isHistoricalYear ? 'Locked (Archived S.Y.)' : !isAuthorizedToRecord ? 'Read-Only (Unauthorized)' : saving ? 'Saving...' : saved ? 'Saved!' : 'Save Attendance'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {!gradeFilter && (
          <div className="card">
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#888' }}>
              <IcoAttendance />
              <p style={{ marginTop: '12px' }}>Select a grade level to start recording attendance.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
