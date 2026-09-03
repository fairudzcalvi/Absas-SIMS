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

export default function StudentGradesPage() {
  const { supabase, profile } = useAuth();
  const [grades, setGrades]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [quarter, setQuarter] = useState('1Q');

  useEffect(() => {
    if (!profile?.student_record_id) return;
    async function fetch() {
      setLoading(true);
      const { data } = await supabase
        .from('grades')
        .select('*')
        .eq('student_record_id', profile.student_record_id)
        .order('subject');
      setGrades(data ?? []);
      setLoading(false);
    }
    fetch();
  }, [supabase, profile]);

  const filtered = grades.filter(g => g.quarter === quarter);

  // Group by subject across all quarters for summary
  const subjects = [...new Set(grades.map(g => g.subject))].sort();
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
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={2} className="empty-message">No grades recorded for {Q_LABELS[quarter]}.</td></tr>
                ) : filtered.map(g => {
                  const qg = parseFloat(g.quarter_grade);
                  const pass = !isNaN(qg) && qg >= 75;
                  return (
                    <tr key={g.grade_id}>
                      <td style={{ fontWeight: '600' }}>{g.subject}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{
                          fontWeight: '700',
                          fontSize: '15px',
                          color: isNaN(qg) ? '#888' : pass ? '#137333' : '#dc3545',
                          background: isNaN(qg) ? 'transparent' : pass ? '#e6f4ea' : '#fce8e6',
                          padding: '4px 12px',
                          borderRadius: '12px'
                        }}>
                          {g.quarter_grade ?? '—'}
                        </span>
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
