import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { buildStudentSubjectList } from '../../utils/curriculum';

function IcoGrades() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}

const DEFAULT_QUARTERS = ['1Q', '2Q', '3Q', '4Q'];
const DEFAULT_Q_LABELS = { '1Q': '1st Quarter', '2Q': '2nd Quarter', '3Q': '3rd Quarter', '4Q': '4th Quarter' };

export default function StudentGradesPage() {
  const { supabase, profile, activePolicy, selectedSchoolYear, activeSchoolYear } = useAuth();
  const currentSy = selectedSchoolYear || activeSchoolYear;
  const passingMark = activePolicy?.passing_grade != null ? Number(activePolicy.passing_grade) : 75;
  const [grades, setGrades]         = useState([]);
  const [dbSubjects, setDbSubjects] = useState([]);
  const [strandCode, setStrandCode] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [quarter, setQuarter]       = useState('1Q');
  const [quarterList, setQuarterList] = useState(DEFAULT_QUARTERS);
  const [quarterLabels, setQuarterLabels] = useState(DEFAULT_Q_LABELS);

  useEffect(() => {
    if (!profile?.student_record_id) return;
    async function fetch() {
      setLoading(true);
      try {
        let gQuery = supabase
          .from('grades')
          .select('*')
          .eq('student_record_id', profile.student_record_id);

        if (currentSy?.id) {
          gQuery = gQuery.or(`school_year_id.eq.${currentSy.id},school_year.eq.${currentSy.year_label}`);
        }

        const [{ data: gData }, { data: sData }, { data: strData }] = await Promise.all([
          gQuery,
          supabase
            .from('subjects')
            .select('subject_name, grade_level, strand_id, status')
            .eq('status', 'Active'),
          profile.current_strand_id
            ? supabase
                .from('shs_strands')
                .select('strand_code')
                .eq('id', profile.current_strand_id)
                .maybeSingle()
            : Promise.resolve({ data: null }),
        ]);

        if (currentSy?.id) {
          const { data: qData } = await supabase
            .from('quarters')
            .select('*')
            .eq('school_year_id', currentSy.id)
            .order('quarter_number', { ascending: true });

          if (qData && qData.length > 0) {
            const keys = qData.map(q => `${q.quarter_number}Q`);
            const labels = {};
            qData.forEach(q => {
              labels[`${q.quarter_number}Q`] = q.quarter_name + (q.semester_name ? ` (${q.semester_name})` : '');
            });
            setQuarterList(keys);
            setQuarterLabels(labels);
            if (!keys.includes(quarter)) {
              setQuarter(keys[0]);
            }
          }
        }

        setGrades(gData ?? []);
        setDbSubjects(sData ?? []);
        if (strData?.strand_code) {
          setStrandCode(strData.strand_code);
        }
      } catch (err) {
        console.error('Error fetching grades and subjects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [supabase, profile, currentSy]);

  // Derive complete subject list strictly ordered by DepEd curriculum
  const studentGrade = profile?.grade_level ? Number(profile.grade_level) : null;
  const subjects = buildStudentSubjectList({
    gradeLevel: studentGrade,
    strandCode: strandCode || profile?.strand_code,
    dbSubjects,
    grades,
  });

  // Group by subject across all quarters for summary
  const summary = subjects.map(subj => {
    const row = { subject: subj };
    quarterList.forEach(q => {
      const g = grades.find(x => x.subject === subj && x.quarter === q);
      row[q] = g?.quarter_grade ?? null;
    });
    const vals = quarterList.map(q => row[q]).filter(v => v != null && !isNaN(v));
    row.avg = vals.length ? (vals.reduce((a, b) => a + Number(b), 0) / vals.length).toFixed(2) : null;
    return row;
  });

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <>
      <div className="top-header">
        <h1><IcoGrades /> My Grades</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">
        {/* Quarter selector */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoGrades /> Grade Report</h2>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {quarterList.map(q => (
              <button
                key={q}
                className={`btn ${quarter === q ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setQuarter(q)}
              >
                {quarterLabels[q] || q}
              </button>
            ))}
          </div>
        </div>

        {/* Quarter grades */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">{quarterLabels[quarter] || quarter} Grades</h2>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th style={{ textAlign: 'center', width: '180px' }}>Quarter Grade</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={2} className="empty-message">Loading...</td></tr>
                ) : subjects.length === 0 ? (
                  <tr><td colSpan={2} className="empty-message">No subjects found.</td></tr>
                ) : subjects.map(subj => {
                  const g = grades.find(x => x.subject === subj && x.quarter === quarter);
                  const qg = g?.quarter_grade != null ? parseFloat(g.quarter_grade) : null;
                  const hasGrade = qg != null && !isNaN(qg);
                  const pass = hasGrade && qg >= passingMark;
                  return (
                    <tr key={subj}>
                      <td style={{ fontWeight: '600' }}>{subj}</td>
                      <td style={{ textAlign: 'center' }}>
                        {hasGrade ? (
                          <span style={{
                            fontWeight: '700',
                            fontSize: '15px',
                            color: pass ? '#137333' : '#dc3545',
                            background: pass ? '#e6f4ea' : '#fce8e6',
                            padding: '4px 12px',
                            borderRadius: '12px'
                          }}>
                            {g.quarter_grade}
                          </span>
                        ) : (
                          <span style={{ color: '#aaa', fontSize: '15px' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary across all quarters */}
        {summary.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Grade Summary (All Quarters)</h2>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    {quarterList.map(q => <th key={q}>{quarterLabels[q] || q}</th>)}
                    <th>General Average</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map(row => (
                    <tr key={row.subject}>
                      <td style={{ fontWeight: '600' }}>{row.subject}</td>
                      {quarterList.map(q => (
                        <td key={q} style={{ textAlign: 'center' }}>
                          {row[q] != null ? (
                            <span style={{
                              fontWeight: '600',
                              color: Number(row[q]) >= passingMark ? '#137333' : '#dc3545',
                            }}>
                              {row[q]}
                            </span>
                          ) : (
                            <span style={{ color: '#aaa' }}>—</span>
                          )}
                        </td>
                      ))}
                      <td style={{ textAlign: 'center', fontWeight: '700' }}>
                        {row.avg != null ? (
                          <span style={{
                            color: Number(row.avg) >= passingMark ? '#137333' : '#dc3545',
                            background: Number(row.avg) >= passingMark ? '#e6f4ea' : '#fce8e6',
                            padding: '2px 8px',
                            borderRadius: '8px',
                          }}>
                            {row.avg}
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
