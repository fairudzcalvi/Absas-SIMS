import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function IcoTranscript() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

const QUARTERS = ['1Q', '2Q', '3Q', '4Q'];
const Q_LABELS = { '1Q': '1st Qtr', '2Q': '2nd Qtr', '3Q': '3rd Qtr', '4Q': '4th Qtr' };

export default function StudentTranscriptPage() {
  const { supabase, profile } = useAuth();
  const [grades, setGrades]       = useState([]);
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading]     = useState(true);

  const s = profile ?? {};

  useEffect(() => {
    if (!profile?.student_record_id) return;
    async function fetch() {
      setLoading(true);
      const [{ data: g }, { data: t }] = await Promise.all([
        supabase.from('grades').select('*').eq('student_record_id', profile.student_record_id).order('subject'),
        supabase.from('transcripts').select('*').eq('student_record_id', profile.student_record_id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      ]);
      setGrades(g ?? []);
      setTranscript(t);
      setLoading(false);
    }
    fetch();
  }, [supabase, profile]);

  // Group by subject
  const subjects = [...new Set(grades.map(g => g.subject))].sort();
  const rows = subjects.map(subj => {
    const row = { subject: subj };
    QUARTERS.forEach(q => {
      const g = grades.find(x => x.subject === subj && x.quarter === q);
      row[q] = g?.quarter_grade ?? null;
    });
    const vals = QUARTERS.map(q => row[q]).filter(v => v != null && !isNaN(Number(v)));
    row.avg = vals.length ? (vals.reduce((a, b) => a + Number(b), 0) / vals.length).toFixed(2) : null;
    return row;
  });

  const overallAvg = rows.length
    ? (rows.filter(r => r.avg).reduce((a, r) => a + Number(r.avg), 0) / rows.filter(r => r.avg).length).toFixed(2)
    : null;

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <>
      <div className="top-header">
        <h1><IcoTranscript /> Transcript</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">
        {/* Student info */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoTranscript /> Academic Transcript</h2>
            {transcript && (
              <span className="badge badge-success">
                Generated: {new Date(transcript.generated_date).toLocaleDateString()}
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 32px', fontSize: '14px', marginBottom: '20px', backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
            {[
              ['Student Name', `${s.first_name ?? ''} ${s.last_name ?? ''}`],
              ['DepEd LRN',    s.lrn_id || s.student_id || '—'],
              ['Grade Level',  s.grade_level ? `Grade ${s.grade_level}` : '—'],
              ['Section',      s.section_name],
              ['School Year',  transcript?.school_year ?? '2026-2027'],
            ].map(([label, val]) => (
              <div key={label}>
                <span style={{ color: '#8B0000', fontWeight: '600' }}>{label}: </span>
                <span>{val ?? '—'}</span>
              </div>
            ))}
          </div>

          {loading ? (
            <p className="empty-message">Loading grades...</p>
          ) : rows.length === 0 ? (
            <p className="empty-message">No grade records found.</p>
          ) : (
            <>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      {QUARTERS.map(q => <th key={q}>{Q_LABELS[q]}</th>)}
                      <th style={{ color: '#8B0000' }}>Final Average</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => {
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
                          <td>
                            <span className={`badge ${isNaN(avg) ? 'badge-info' : pass ? 'badge-success' : 'badge-danger'}`}>
                              {isNaN(avg) ? '—' : pass ? 'Passed' : 'Failed'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <td colSpan={5} style={{ fontWeight: '700', textAlign: 'right', color: '#8B0000' }}>General Average:</td>
                      <td>
                        <span style={{ fontWeight: '700', fontSize: '16px', color: parseFloat(overallAvg) >= 75 ? '#28a745' : '#dc3545' }}>
                          {overallAvg ?? '—'}
                        </span>
                      </td>
                      <td>
                        {overallAvg && (
                          <span className={`badge ${parseFloat(overallAvg) >= 75 ? 'badge-success' : 'badge-danger'}`}>
                            {parseFloat(overallAvg) >= 75 ? 'Promoted' : 'Failed'}
                          </span>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <p style={{ fontSize: '12px', color: '#888', marginTop: '16px', fontStyle: 'italic' }}>
                This is an unofficial transcript for reference only. Official transcripts are issued by the Registrar's Office.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
