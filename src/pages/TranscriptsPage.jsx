import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

/* ── Icons ─────────────────────────────────────────────── */
function IcoTranscript() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function IcoPdf() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15h1a1 1 0 0 0 0-2H9v4m4-4h2m-2 2h1.5" />
    </svg>
  );
}
function IcoCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function IcoClock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IcoSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IcoBatch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  );
}
function IcoList() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function IcoInfo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function IcoShield() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IcoWarn() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IcoGenerate() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function IcoView() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
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

/* ── Constants ─────────────────────────────────────────── */
const GRADE_OPTIONS = [
  { value: 1,  label: 'Grade 1'  },
  { value: 2,  label: 'Grade 2'  },
  { value: 3,  label: 'Grade 3'  },
  { value: 4,  label: 'Grade 4'  },
  { value: 5,  label: 'Grade 5'  },
  { value: 6,  label: 'Grade 6'  },
  { value: 7,  label: 'Grade 7'  },
  { value: 8,  label: 'Grade 8'  },
  { value: 9,  label: 'Grade 9'  },
  { value: 10, label: 'Grade 10' },
];

/* ── Page ──────────────────────────────────────────────── */
export default function TranscriptsPage() {
  const { supabase } = useAuth();

  const [students, setStudents]     = useState([]);
  const [transcriptMap, setTranscriptMap] = useState({}); // keyed by student_record_id
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [gradeFilter, setGrade]     = useState('');
  const [statusFilter, setStatus]   = useState('');

  const [stats, setStats]           = useState({ total: 0, today: 0, complete: 0, incomplete: 0 });
  const [previewStudent, setPreview] = useState(null);
  const [grades, setGrades]         = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  /* fetch students + transcripts separately, then merge */
  const fetchStudents = useCallback(async () => {
    setLoading(true);

    // 1. Fetch students
    let q = supabase
      .from('students')
      .select('student_record_id, student_id, first_name, last_name, lrn_id, grade_level, section_name')
      .order('last_name');

    if (gradeFilter) q = q.eq('grade_level', Number(gradeFilter));
    if (search) q = q.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,lrn_id.ilike.%${search}%,student_id.ilike.%${search}%`);

    const { data: studentData } = await q;
    const studentRows = studentData ?? [];

    // 2. Fetch transcripts
    const { data: transcriptData } = await supabase
      .from('transcripts')
      .select('student_record_id, general_average, generated_date, school_year');

    const tMap = {};
    (transcriptData ?? []).forEach(t => {
      tMap[t.student_record_id] = t;
    });
    setTranscriptMap(tMap);

    // 3. Apply status filter client-side
    let rows = studentRows;
    if (statusFilter === 'complete')   rows = rows.filter(s => !!tMap[s.student_record_id]);
    if (statusFilter === 'incomplete') rows = rows.filter(s => !tMap[s.student_record_id]);

    setStudents(rows);

    // 4. Stats
    const today = new Date().toISOString().split('T')[0];
    const todayCount = (transcriptData ?? []).filter(t => (t.generated_date ?? '').startsWith(today)).length;
    const completeIds = new Set((transcriptData ?? []).map(t => t.student_record_id));

    setStats({
      total:      (transcriptData ?? []).length,
      today:      todayCount,
      complete:   completeIds.size,
      incomplete: studentRows.length - completeIds.size,
    });

    setLoading(false);
  }, [supabase, gradeFilter, search, statusFilter]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);

      // 1. Fetch students
      let q = supabase
        .from('students')
        .select('student_record_id, student_id, first_name, last_name, lrn_id, grade_level, section_name')
        .order('last_name');

      if (gradeFilter) q = q.eq('grade_level', Number(gradeFilter));
      if (search) q = q.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,lrn_id.ilike.%${search}%,student_id.ilike.%${search}%`);

      const { data: studentData } = await q;
      const studentRows = studentData ?? [];

      // 2. Fetch transcripts
      const { data: transcriptData } = await supabase
        .from('transcripts')
        .select('student_record_id, general_average, generated_date, school_year');

      const tMap = {};
      (transcriptData ?? []).forEach(t => {
        tMap[t.student_record_id] = t;
      });

      // 3. Apply status filter client-side
      let rows = studentRows;
      if (statusFilter === 'complete')   rows = rows.filter(s => !tMap[s.student_record_id]);
      if (statusFilter === 'incomplete') rows = rows.filter(s => !tMap[s.student_record_id]);

      // 4. Stats
      const today = new Date().toISOString().split('T')[0];
      const todayCount = (transcriptData ?? []).filter(t => (t.generated_date ?? '').startsWith(today)).length;
      const completeIds = new Set((transcriptData ?? []).map(t => t.student_record_id));

      if (!ignore) {
        setTranscriptMap(tMap);
        setStudents(rows);
        setStats({
          total:      (transcriptData ?? []).length,
          today:      todayCount,
          complete:   completeIds.size,
          incomplete: studentRows.length - completeIds.size,
        });
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [supabase, gradeFilter, search, statusFilter]);

  /* preview grades */
  async function openPreview(student) {
    setPreview(student);
    setPreviewLoading(true);
    const { data } = await supabase
      .from('grades')
      .select('*')
      .eq('student_record_id', student.student_record_id)
      .order('subject');
    setGrades(data ?? []);
    setPreviewLoading(false);
  }

  /* mark as generated — INSERT into transcripts table */
  async function markGenerated(studentId) {
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('transcripts').upsert(
      {
        student_record_id: studentId,
        general_average:   null,
        generated_date:    today,
        school_year:       '2025-2026',
      },
      { onConflict: 'student_record_id' }
    );
    setPreview(null);
    fetchStudents();
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <>
      {/* Header */}
      <div className="top-header">
        <h1><IcoTranscript /> Academic Transcripts</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">

        {/* Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><IcoTranscript /></div>
            <div className="stat-info">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Generated Transcripts</div>
            </div>
          </div>
          <div className="stat-card gold">
            <div className="stat-icon"><IcoPdf /></div>
            <div className="stat-info">
              <div className="stat-number">{stats.today}</div>
              <div className="stat-label">Generated Today</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon"><IcoCheck /></div>
            <div className="stat-info">
              <div className="stat-number">{stats.complete}</div>
              <div className="stat-label">Complete Records</div>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon"><IcoClock /></div>
            <div className="stat-info">
              <div className="stat-number">{stats.incomplete}</div>
              <div className="stat-label">Incomplete Records</div>
            </div>
          </div>
        </div>

        {/* Search / Filter Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoSearch /> Search Student</h2>
            <button className="btn btn-primary" onClick={() => alert('Batch generation: select students first.')}>
              <IcoBatch /> Batch Generate
            </button>
          </div>
          <div className="form-grid">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Search Student</label>
              <input
                placeholder="Search by name, Student ID, or LRN..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Grade Level</label>
              <select value={gradeFilter} onChange={e => setGrade(e.target.value)}>
                <option value="">All Grades</option>
                {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Status</label>
              <select value={statusFilter} onChange={e => setStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="complete">Complete</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </div>
          </div>
        </div>

        {/* Student Records Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoList /> Student Records</h2>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>LRN</th>
                  <th>Student Name</th>
                  <th>Grade Level</th>
                  <th>Status</th>
                  <th>General Average</th>
                  <th>Last Generated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="empty-message">Loading...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={8} className="empty-message">No students found</td></tr>
                ) : (
                  students.map(s => {
                    const t = transcriptMap[s.student_record_id];
                    return (
                      <tr key={s.student_record_id}>
                        <td>{s.student_id ?? '—'}</td>
                        <td>{s.lrn_id ?? '—'}</td>
                        <td>{s.first_name} {s.last_name}</td>
                        <td>{s.grade_level ? `Grade ${s.grade_level}` : '—'} {s.section_name ? `— ${s.section_name}` : ''}</td>
                        <td><TranscriptBadge hasTranscript={!!t} /></td>
                        <td>{t?.general_average ? Number(t.general_average).toFixed(2) : '—'}</td>
                        <td>
                          {t?.generated_date
                            ? new Date(t.generated_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => openPreview(s)} title="View / Generate">
                              <IcoView /> View
                            </button>
                            <button className="btn btn-primary btn-sm" onClick={() => markGenerated(s.student_record_id)} title="Generate">
                              <IcoGenerate /> Generate
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transcript Information Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoInfo /> Transcript Information</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <InfoBlock
              icon={<IcoCheck />}
              title="Official Transcript"
              text="The transcript contains complete academic records including all subjects, grades, and general average for each grading period."
              bg="#e8f4fb" border="#b8d9e8" color="#1a6080"
            />
            <InfoBlock
              icon={<IcoWarn />}
              title="Requirements"
              text="Transcripts can only be generated for students with complete grade records across all quarters."
              bg="#fffbe6" border="#ffe082" color="#7d5a00"
            />
            <InfoBlock
              icon={<IcoShield />}
              title="Authenticity"
              text="All generated transcripts include the school seal, registrar's signature, and date of issuance for official use."
              bg="#e9f7ef" border="#a3d9b1" color="#1a5e34"
            />
          </div>
        </div>

      </div>

      {/* ── Transcript Preview Modal ── */}
      {previewStudent && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setPreview(null); }}>
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoTranscript /> Transcript Preview</h3>
              <button className="modal-close" onClick={() => setPreview(null)}><IcoClose /></button>
            </div>
            <div className="modal-body">
              {/* Student Info */}
              <div style={styles.previewMeta}>
                <div><strong>Name:</strong> {previewStudent.first_name} {previewStudent.last_name}</div>
                <div><strong>Student ID:</strong> {previewStudent.student_id ?? '—'}</div>
                <div><strong>LRN:</strong> {previewStudent.lrn_id ?? '—'}</div>
                <div><strong>Grade:</strong> {previewStudent.grade_level ? `Grade ${previewStudent.grade_level}` : '—'} {previewStudent.section_name}</div>
                <div><strong>General Average:</strong> {transcriptMap[previewStudent.student_record_id]?.general_average ? Number(transcriptMap[previewStudent.student_record_id].general_average).toFixed(2) : '—'}</div>
              </div>

              {/* Grades Table */}
              {previewLoading ? (
                <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>Loading grades...</p>
              ) : grades.length === 0 ? (
                <p className="empty-message">No grade records found for this student.</p>
              ) : (
                <table className="data-table" style={{ marginTop: '16px' }}>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Q1</th>
                      <th>Q2</th>
                      <th>Q3</th>
                      <th>Q4</th>
                      <th>Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupBySubject(grades).map(row => (
                      <tr key={row.subject}>
                        <td>{row.subject}</td>
                        <td>{row.q1 ?? '—'}</td>
                        <td>{row.q2 ?? '—'}</td>
                        <td>{row.q3 ?? '—'}</td>
                        <td>{row.q4 ?? '—'}</td>
                        <td><strong>{row.final ?? '—'}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setPreview(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => markGenerated(previewStudent.student_record_id)}>
                <IcoGenerate /> Mark as Generated
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Helpers ── */
function groupBySubject(grades) {
  const map = {};
  grades.forEach(g => {
    if (!map[g.subject]) {
      map[g.subject] = { subject: g.subject, q1: null, q2: null, q3: null, q4: null, final: null };
    }
    // quarter values are '1Q','2Q','3Q','4Q'
    // Map '1Q' -> q1, '2Q' -> q2, etc.
    const qKey = `q${g.quarter[0]}`;
    if (qKey in map[g.subject]) {
      map[g.subject][qKey] = g.quarter_grade;
    }
    // Compute final as average of present quarters
    const vals = ['q1','q2','q3','q4']
      .map(k => map[g.subject][k])
      .filter(v => v != null && !isNaN(Number(v)));
    if (vals.length > 0) {
      map[g.subject].final = (vals.reduce((a, b) => a + Number(b), 0) / vals.length).toFixed(2);
    }
  });
  return Object.values(map);
}

/* ── Sub-components ── */
function TranscriptBadge({ hasTranscript }) {
  const cls = hasTranscript ? 'badge badge-success' : 'badge badge-warning';
  return <span className={cls}>{hasTranscript ? 'Complete' : 'Incomplete'}</span>;
}

function InfoBlock({ icon, title, text, bg, border, color }) {
  return (
    <div style={{ backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '8px', padding: '14px 18px', color }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', marginBottom: '6px', fontSize: '15px' }}>
        {icon} {title}
      </div>
      <p style={{ margin: 0, fontSize: '14px' }}>{text}</p>
    </div>
  );
}

const styles = {
  previewMeta: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px 24px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '14px 18px',
    fontSize: '14px',
    marginBottom: '8px',
  },
};
