import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function IcoGrades() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}

const QUARTERS = ['1Q', '2Q', '3Q', '4Q'];
const Q_LABELS = { '1Q': '1st Quarter', '2Q': '2nd Quarter', '3Q': '3rd Quarter', '4Q': '4th Quarter' };

function getStandardSubjects(gradeLevel) {
  const gl = Number(gradeLevel);
  if (gl >= 1 && gl <= 3) {
    return [
      'Mother Tongue',
      'Filipino',
      'English',
      'Mathematics',
      'Araling Panlipunan',
      'Edukasyon sa Pagpapakatao (EsP)',
      'MAPEH',
    ];
  }
  if (gl >= 4 && gl <= 6) {
    return [
      'Filipino',
      'English',
      'Mathematics',
      'Science',
      'Araling Panlipunan',
      'Edukasyon sa Pagpapakatao (EsP)',
      'Edukasyong Pantahanan at Pangkabuhayan (EPP)',
      'MAPEH',
    ];
  }
  if (gl >= 7 && gl <= 10) {
    return [
      'Filipino',
      'English',
      'Mathematics',
      'Science',
      'Araling Panlipunan',
      'Edukasyon sa Pagpapakatao (EsP)',
      'Technology and Livelihood Education (TLE)',
      'MAPEH',
    ];
  }
  if (gl >= 11 && gl <= 12) {
    return [
      'Oral Communication',
      'Komunikasyon at Pananaliksik',
      'General Mathematics',
      'Earth and Life Science',
      '21st Century Literature',
      'Personal Development',
      'Physical Education and Health',
      'Empowerment Technologies',
    ];
  }
  return [
    'English',
    'Mathematics',
    'Science',
    'Filipino',
    'Araling Panlipunan',
    'MAPEH',
    'Edukasyon sa Pagpapakatao (EsP)',
  ];
}

export default function StudentGradesPage() {
  const { supabase, profile } = useAuth();
  const [grades, setGrades]         = useState([]);
  const [dbSubjects, setDbSubjects] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [quarter, setQuarter]       = useState('1Q');

  useEffect(() => {
    if (!profile?.student_record_id) return;
    async function fetch() {
      setLoading(true);
      try {
        const [{ data: gData }, { data: sData }] = await Promise.all([
          supabase
            .from('grades')
            .select('*')
            .eq('student_record_id', profile.student_record_id)
            .order('subject'),
          supabase
            .from('subjects')
            .select('subject_name, grade_level, strand_id, status')
            .eq('status', 'Active'),
        ]);
        setGrades(gData ?? []);
        setDbSubjects(sData ?? []);
      } catch (err) {
        console.error('Error fetching grades and subjects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [supabase, profile]);

  // Derive complete subject list: DepEd standard + active DB subjects + previously graded subjects
  const studentGrade = profile?.grade_level ? Number(profile.grade_level) : null;
  const dbMatching = dbSubjects
    .filter(s => !s.grade_level || s.grade_level === studentGrade)
    .filter(s => !s.strand_id || !profile?.current_strand_id || s.strand_id === profile.current_strand_id)
    .map(s => s.subject_name);

  const stdSubjects = getStandardSubjects(studentGrade);
  const gradedSubjects = grades.map(g => g.subject).filter(Boolean);

  const subjects = Array.from(
    new Set([...stdSubjects, ...dbMatching, ...gradedSubjects])
  ).sort();

  // Group by subject across all quarters for summary
  const summary = subjects.map(subj => {
    const row = { subject: subj };
    QUARTERS.forEach(q => {
      const g = grades.find(x => x.subject === subj && x.quarter === q);
      row[q] = g?.quarter_grade ?? null;
    });
    const vals = QUARTERS.map(q => row[q]).filter(v => v != null && !isNaN(v));
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
            {QUARTERS.map(q => (
              <button
                key={q}
                className={`btn ${quarter === q ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setQuarter(q)}
              >
                {Q_LABELS[q]}
              </button>
            ))}
          </div>
        </div>

        {/* Quarter grades */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">{Q_LABELS[quarter]} Grades</h2>
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
                  const pass = hasGrade && qg >= 75;
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
                          <span style={{
                            color: '#888',
                            fontSize: '13px',
                            background: '#f1f3f4',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontStyle: 'italic'
                          }}>
                            — Not yet encoded —
                          </span>
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
                    {QUARTERS.map(q => <th key={q}>{Q_LABELS[q]}</th>)}
                    <th>General Average</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map(row => {
                    const avg = parseFloat(row.avg);
                    const pass = !isNaN(avg) && avg >= 75;
                    return (
                      <tr key={row.subject}>
                        <td style={{ fontWeight: '600' }}>{row.subject}</td>
                        {QUARTERS.map(q => <td key={q}>{row[q] ?? '—'}</td>)}
                        <td>
                          <span style={{ fontWeight: '700', color: isNaN(avg) ? '#888' : pass ? '#28a745' : '#dc3545' }}>
                            {row.avg ?? '—'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
