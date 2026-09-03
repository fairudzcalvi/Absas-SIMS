import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

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

const GRADE_OPTIONS  = Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: `Grade ${i + 1}` }));
const QUARTERS       = ['1Q', '2Q', '3Q', '4Q'];
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
  const { supabase } = useAuth();

  const [gradeFilter, setGrade]   = useState('');
  const [subject, setSubject]     = useState('');
  const [quarter, setQuarter]     = useState('1Q');
  const [students, setStudents]   = useState([]);
  const [gradeMap, setGradeMap]   = useState({}); // { student_record_id: { written_works, performance_tasks, quarterly_assessment, quarter_grade } }
  const [loading, setLoading]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [subjects, setSubjects]   = useState(DEFAULT_SUBJECTS);
  const [customSubjectMode, setCustomSubjectMode] = useState(false);
  const [gradingLocked, setGradingLocked] = useState(false);

  // Check if grading is locked for the selected quarter
  useEffect(() => {
    async function checkGradingLock() {
      // Map quarter filter (1Q, 2Q, 3Q, 4Q) to quarter_number (1, 2, 3, 4)
      const qNum = parseInt(quarter?.replace('Q', ''));
      if (!qNum) return;

      // Get the active school year
      const { data: syData } = await supabase
        .from('school_years')
        .select('id')
        .eq('is_active', true)
        .limit(1)
        .single();

      if (!syData) {
        setGradingLocked(false);
        return;
      }

      // Get the quarter record for this school year and quarter number
      const { data: qData } = await supabase
        .from('quarters')
        .select('is_grading_open')
        .eq('school_year_id', syData.id)
        .eq('quarter_number', qNum)
        .limit(1)
        .single();

      // If is_grading_open is false, grading is locked
      setGradingLocked(qData ? !qData.is_grading_open : false);
    }
    checkGradingLock();
  }, [supabase, quarter]);

  // Load subjects from the subjects table + default list
  useEffect(() => {
    async function loadSubjects() {
      const { data, error } = await supabase
        .from('subjects')
        .select('subject_name, grade_level')
        .eq('status', 'Active');
      
      const dbSubjects = (!error && data) 
        ? data.filter(s => !gradeFilter || !s.grade_level || s.grade_level === Number(gradeFilter)).map(s => s.subject_name)
        : [];

      const { data: gradeSubjs } = await supabase
        .from('grades')
        .select('subject');
      
      const prevSubjs = gradeSubjs ? gradeSubjs.map(g => g.subject).filter(Boolean) : [];
      const unique = [...new Set([...DEFAULT_SUBJECTS, ...dbSubjects, ...prevSubjs])].sort();
      setSubjects(unique);
    }
    loadSubjects();
  }, [supabase, gradeFilter]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!gradeFilter || !subject || !quarter) return;
      setLoading(true);

      const { data: studs, error: studsError } = await supabase
        .from('students')
        .select('student_record_id, student_id, first_name, last_name, section_name')
        .eq('grade_level', Number(gradeFilter))
        .order('last_name');

      if (studsError) {
        console.error("Error loading students:", studsError);
        if (!ignore) setLoading(false);
        return;
      }

      const ids = (studs ?? []).map(s => s.student_record_id);
      const { data: existing, error: gradesError } = await supabase
        .from('grades')
        .select('grade_id, student_record_id, written_works, performance_tasks, quarterly_assessment, participation, quarter_grade, remarks')
        .eq('subject', subject)
        .eq('quarter', quarter)
        .in('student_record_id', ids);

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
  }, [supabase, gradeFilter, subject, quarter]);

  function updateGrade(studentId, field, value) {
    setGradeMap(prev => {
      const updated = { ...prev[studentId], [field]: value };
      // Compute the "Initial Grade" as the average of non-empty components,
      // then run it through the DepEd transmutation table to get the
      // official Quarter Grade.
      const vals = ['written_works', 'performance_tasks', 'quarterly_assessment', 'participation']
        .map(f => parseFloat(updated[f]))
        .filter(v => !isNaN(v));
      const initialGrade = vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length) : NaN;
      updated.initial_grade = vals.length > 0 ? initialGrade.toFixed(2) : '';
      updated.quarter_grade = vals.length > 0 ? String(transmuteGrade(initialGrade)) : '';
      return { ...prev, [studentId]: updated };
    });
  }

  async function handleSave() {
    if (students.length === 0 || !subject) return;
    setSaving(true);

    const rows = students.map(s => ({
      student_record_id:    s.student_record_id,
      subject,
      quarter,
      written_works:        gradeMap[s.student_record_id]?.written_works        ? Number(gradeMap[s.student_record_id].written_works)        : 0,
      performance_tasks:    gradeMap[s.student_record_id]?.performance_tasks    ? Number(gradeMap[s.student_record_id].performance_tasks)    : 0,
      quarterly_assessment: gradeMap[s.student_record_id]?.quarterly_assessment ? Number(gradeMap[s.student_record_id].quarterly_assessment) : 0,
      participation:        gradeMap[s.student_record_id]?.participation        ? Number(gradeMap[s.student_record_id].participation)        : 0,
      quarter_grade:        gradeMap[s.student_record_id]?.quarter_grade        ? Number(gradeMap[s.student_record_id].quarter_grade)        : 0,
      remarks:              gradeMap[s.student_record_id]?.remarks              ?? null,
    }));

    await supabase.from('grades').upsert(rows, { onConflict: 'student_record_id,subject,quarter' });
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
          <div className="card-header">
            <h2 className="card-title"><IcoGrades /> Grade Entry</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Grade Level</label>
              <select className="filter-select" style={{ width: '100%' }} value={gradeFilter} onChange={e => { setGrade(e.target.value); setSubject(''); }}>
                <option value="">Select Grade</option>
                {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
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
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Quarter</label>
              <select className="filter-select" style={{ width: '100%' }} value={quarter} onChange={e => setQuarter(e.target.value)}>
                {QUARTERS.map(q => <option key={q} value={q}>{QUARTER_LABELS[q]}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        {gradeFilter && subject ? (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                Grade {gradeFilter} — {subject} — {QUARTER_LABELS[quarter]}
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Grading for the {QUARTER_LABELS[quarter]} is locked by the administrator. Grade inputs are read-only.
              </div>
            )}
            {loading ? (
              <p className="empty-message">Loading...</p>
            ) : students.length === 0 ? (
              <p className="empty-message">No students in this grade level.</p>
            ) : (
              <>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th><th>DepEd LRN</th><th>Name</th><th>Section</th>
                        <th>Written Works</th><th>Performance Tasks</th>
                        <th>Quarterly Assessment</th><th>Participation</th>
                        <th>Initial Grade</th>
                        <th style={{ color: '#8B0000' }}>Quarter Grade</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, i) => {
                        const g = gradeMap[s.student_record_id] ?? {};
                        const qg = parseFloat(g.quarter_grade);
                        const isPassing = !isNaN(qg) && qg >= 75;
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
                                  disabled={gradingLocked}
                                  style={{
                                    width: '70px', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', textAlign: 'center',
                                    ...(gradingLocked ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed', opacity: 0.7 } : {}),
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
                                disabled={gradingLocked}
                                style={{
                                  width: '110px', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px',
                                  ...(gradingLocked ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed', opacity: 0.7 } : {}),
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
                  <button className="btn btn-primary" onClick={handleSave} disabled={saving || gradingLocked}>
                    <IcoSave /> {gradingLocked ? 'Locked' : saving ? 'Saving...' : saved ? 'Saved!' : 'Save Grades'}
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