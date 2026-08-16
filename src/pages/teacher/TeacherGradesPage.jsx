import { useState, useEffect, useCallback } from 'react';
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
  const [subjects, setSubjects]   = useState([]);

  // Load distinct subjects for the selected grade from existing grades table
  useEffect(() => {
    if (!gradeFilter) return;
    async function loadSubjects() {
      const { data } = await supabase
        .from('grades')
        .select('subject')
        .in('student_record_id',
          (await supabase.from('students').select('student_record_id').eq('grade_level', Number(gradeFilter))).data?.map(s => s.student_record_id) ?? []
        );
      const unique = [...new Set((data ?? []).map(r => r.subject))].sort();
      setSubjects(unique);
    }
    loadSubjects();
  }, [supabase, gradeFilter]);

  const loadGrades = useCallback(async () => {
    if (!gradeFilter || !subject || !quarter) return;
    setLoading(true);

    const { data: studs } = await supabase
      .from('students')
      .select('student_record_id, student_id, first_name, last_name, section_name')
      .eq('grade_level', Number(gradeFilter))
      .order('last_name');

    const ids = (studs ?? []).map(s => s.student_record_id);
    const { data: existing } = await supabase
      .from('grades')
      .select('grade_id, student_record_id, written_works, performance_tasks, quarterly_assessment, participation, quarter_grade, remarks')
      .eq('subject', subject)
      .eq('quarter', quarter)
      .in('student_record_id', ids);

    const map = {};
    (existing ?? []).forEach(g => { map[g.student_record_id] = { ...g }; });
    (studs ?? []).forEach(s => {
      if (!map[s.student_record_id]) {
        map[s.student_record_id] = { written_works: '', performance_tasks: '', quarterly_assessment: '', participation: '', quarter_grade: '', remarks: '' };
      }
    });

    setStudents(studs ?? []);
    setGradeMap(map);
    setLoading(false);
  }, [supabase, gradeFilter, subject, quarter]);

  useEffect(() => { loadGrades(); }, [loadGrades]);

  function updateGrade(studentId, field, value) {
    setGradeMap(prev => {
      const updated = { ...prev[studentId], [field]: value };
      // Auto-compute quarter grade as average of non-empty components
      const vals = ['written_works', 'performance_tasks', 'quarterly_assessment', 'participation']
        .map(f => parseFloat(updated[f]))
        .filter(v => !isNaN(v));
      updated.quarter_grade = vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : '';
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
              <label>Subject</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select className="filter-select" style={{ flex: 1 }} value={subject} onChange={e => setSubject(e.target.value)}>
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input placeholder="or type..." value={subject} onChange={e => setSubject(e.target.value)} style={{ flex: 1, padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
              </div>
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
                        <th>#</th><th>Student ID</th><th>Name</th><th>Section</th>
                        <th>Written Works</th><th>Performance Tasks</th>
                        <th>Quarterly Assessment</th><th>Participation</th>
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
                            <td>{s.student_id ?? '—'}</td>
                            <td style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>{s.first_name} {s.last_name}</td>
                            <td>{s.section_name ?? '—'}</td>
                            {['written_works', 'performance_tasks', 'quarterly_assessment', 'participation'].map(field => (
                              <td key={field}>
                                <input
                                  type="number" min="0" max="100" step="0.01"
                                  value={g[field] ?? ''}
                                  onChange={e => updateGrade(s.student_record_id, field, e.target.value)}
                                  style={{ width: '70px', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', textAlign: 'center' }}
                                />
                              </td>
                            ))}
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
                                style={{ width: '110px', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    <IcoSave /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Grades'}
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
