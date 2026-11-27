import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatGradeSection } from '../utils/formatters';
import { getBaseFees, fetchFeeMatrix } from '../utils/feeMatrix';
import { evaluateFinancialHold } from '../utils/financeRules';

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
  { value: 11, label: 'Grade 11' },
  { value: 12, label: 'Grade 12' },
];

/* ── Page ──────────────────────────────────────────────── */
export default function TranscriptsPage() {
  const { supabase, selectedSchoolYear, activeSchoolYear, activeQuarter, selectedQuarter, isHistoricalYear } = useAuth();
  const currentSy = selectedSchoolYear || activeSchoolYear;

  const [students, setStudents]     = useState([]);
  const [transcriptMap, setTranscriptMap] = useState({}); // keyed by student_record_id
  const [holdMap, setHoldMap]       = useState({}); // keyed by student_record_id
  const [schoolSettings, setSchoolSettings] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [gradeFilter, setGrade]     = useState('');
  const [statusFilter, setStatus]   = useState('');

  const [stats, setStats]           = useState({ total: 0, today: 0, complete: 0, incomplete: 0 });
  const [previewStudent, setPreview] = useState(null);
  const [certStudent, setCertStudent] = useState(null);
  const [grades, setGrades]         = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  /* fetch students + transcripts + overdue financial hold status */
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const syLabel = currentSy?.year_label || activeSchoolYear?.year_label || '';

    // 1. Fetch students, S.Y. enrollments, S.Y. sections, transcripts, finances, scholarships, fees, settings
    const [
      { data: studentData },
      { data: enrData },
      { data: secData },
      { data: transcriptData },
      { data: finData },
      { data: schData },
      feesData,
      { data: sysSettings },
    ] = await Promise.all([
      supabase
        .from('students')
        .select('student_record_id, student_id, first_name, middle_name, last_name, lrn_id, grade_level, section_name, scholarship_id, secondary_scholarship_id, status, is_archived')
        .order('last_name'),
      currentSy?.id
        ? supabase.from('enrollments').select('student_record_id, grade_level, section_id, scholarship_id, secondary_scholarship_id, enrollment_status, created_at').eq('school_year_id', currentSy.id).order('created_at', { ascending: false })
        : Promise.resolve({ data: [] }),
      currentSy?.id
        ? supabase.from('sections').select('id, section_name').eq('school_year_id', currentSy.id)
        : Promise.resolve({ data: [] }),
      supabase.from('transcripts').select('transcript_id, student_record_id, general_average, generated_date, school_year').order('created_at', { ascending: false }),
      supabase.from('student_finances').select('*'),
      supabase.from('scholarships').select('*'),
      fetchFeeMatrix(supabase),
      supabase.from('school_settings').select('*').limit(1).maybeSingle(),
    ]);

    setSchoolSettings(sysSettings || null);

    const activeEnrs = (enrData || []).filter(e => !['Dropped', 'Transferred Out'].includes(e.enrollment_status));
    const secById = new Map((secData || []).map(sc => [String(sc.id), sc.section_name]));
    const enrByStu = new Map();
    for (const e of activeEnrs) {
      if (!enrByStu.has(e.student_record_id)) enrByStu.set(e.student_record_id, e);
    }

    const excludedStatuses = ['archived', 'inactive', 'dropped', 'transferred', 'transferred out'];
    let studentRows = (studentData ?? []).map(s => {
      const enr = enrByStu.get(s.student_record_id);
      if (enr) {
        const resolvedSec = enr.section_id ? secById.get(String(enr.section_id)) : null;
        return {
          ...s,
          grade_level: enr.grade_level ?? s.grade_level,
          section_name: resolvedSec || (isHistoricalYear ? '' : s.section_name),
          scholarship_id: enr.scholarship_id || (!isHistoricalYear ? s.scholarship_id : null),
          secondary_scholarship_id: enr.secondary_scholarship_id || (!isHistoricalYear ? s.secondary_scholarship_id : null),
        };
      }
      return s;
    }).filter(s => {
      if (isHistoricalYear) {
        return activeEnrs.length > 0 ? enrByStu.has(s.student_record_id) : false;
      }
      if (s.is_archived) return false;
      return !excludedStatuses.includes((s.status || 'Active').toLowerCase());
    });

    if (gradeFilter === 'completers') {
      studentRows = studentRows.filter(s => [6, 10].includes(Number(s.grade_level)));
    } else if (gradeFilter) {
      studentRows = studentRows.filter(s => Number(s.grade_level) === Number(gradeFilter));
    }
    if (search.trim()) {
      const qLower = search.trim().toLowerCase();
      studentRows = studentRows.filter(s =>
        `${s.first_name || ''} ${s.last_name || ''} ${s.lrn_id || ''} ${s.student_id || ''}`.toLowerCase().includes(qLower)
      );
    }

    const syTranscripts = (transcriptData ?? []).filter(
      t => !syLabel || !t.school_year || t.school_year === syLabel
    );
    const tMap = {};
    syTranscripts.forEach(t => {
      if (!tMap[t.student_record_id]) {
        tMap[t.student_record_id] = t;
      }
    });
    setTranscriptMap(tMap);

    // Evaluate overdue financial holds per student (strictly matched by current S.Y. or unscoped legacy row)
    const hMap = {};
    const qNum = (selectedQuarter || activeQuarter)?.quarter_number || 1;
    studentRows.forEach(s => {
      const finRow =
        (finData ?? []).find(
          f =>
            f.student_record_id === s.student_record_id &&
            ((currentSy?.id && f.school_year_id === currentSy.id) || (syLabel && f.school_year === syLabel))
        ) ||
        (finData ?? []).find(
          f => f.student_record_id === s.student_record_id && !f.school_year_id && !f.school_year
        ) ||
        null;
      const priSchId = finRow ? finRow.scholarship_id : s.scholarship_id;
      const secSchId = finRow ? finRow.secondary_scholarship_id : s.secondary_scholarship_id;
      const priSch = (schData ?? []).find(sc => String(sc.id) === String(priSchId)) || null;
      const secSch = (schData ?? []).find(sc => String(sc.id) === String(secSchId)) || null;
      hMap[s.student_record_id] = evaluateFinancialHold({
        financeRow: finRow,
        baseFees: getBaseFees(s.grade_level, feesData),
        primaryScholarship: priSch,
        secondaryScholarship: secSch,
        activeQuarterNumber: qNum,
        schoolYear: currentSy,
      });
    });
    setHoldMap(hMap);

    // 3. Apply status filter client-side
    let rows = studentRows;
    if (statusFilter === 'complete')   rows = rows.filter(s => !!tMap[s.student_record_id]);
    if (statusFilter === 'incomplete') rows = rows.filter(s => !tMap[s.student_record_id]);

    setStudents(rows);

    // 4. Stats scoped to the listed S.Y. students so counts are always consistent and non-negative
    const nowLocal = new Date();
    const todayLocal = `${nowLocal.getFullYear()}-${String(nowLocal.getMonth() + 1).padStart(2, '0')}-${String(nowLocal.getDate()).padStart(2, '0')}`;
    const syTranscriptsForListed = studentRows.map(s => tMap[s.student_record_id]).filter(Boolean);
    const todayCount = syTranscriptsForListed.filter(t => (t.generated_date ?? '').startsWith(todayLocal)).length;
    const completeForListed = syTranscriptsForListed.length;

    setStats({
      total:      completeForListed,
      today:      todayCount,
      complete:   completeForListed,
      incomplete: Math.max(0, studentRows.length - completeForListed),
    });

    setLoading(false);
  }, [supabase, gradeFilter, search, statusFilter, currentSy, activeSchoolYear, activeQuarter, selectedQuarter, isHistoricalYear]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- guarded; runs cleanly when filter deps change
    fetchStudents();
  }, [fetchStudents]);

  function filterGradesBySelectedSy(rows) {
    if (!currentSy?.id && !currentSy?.year_label) return rows ?? [];
    return (rows ?? []).filter(g =>
      (!g.school_year_id && !g.school_year) ||
      (currentSy?.id && g.school_year_id && String(g.school_year_id) === String(currentSy.id)) ||
      (currentSy?.year_label && g.school_year === currentSy.year_label)
    );
  }

  /* preview grades */
  async function openPreview(student) {
    setPreview(student);
    setPreviewLoading(true);
    const { data } = await supabase
      .from('grades')
      .select('*')
      .eq('student_record_id', student.student_record_id)
      .order('subject');
    setGrades(filterGradesBySelectedSy(data));
    setPreviewLoading(false);
  }

  /* mark as generated — INSERT into transcripts table with real computed average */
  async function markGenerated(studentId) {
    const hold = holdMap[studentId];
    if (hold?.isOverdue) {
      alert(`Financial Hold: Cannot release or print official academic records while an overdue balance of ₱${Number(hold.overdueAmount).toLocaleString()} remains unpaid.`);
      return;
    }

    const { data: gData } = await supabase
      .from('grades')
      .select('*')
      .eq('student_record_id', studentId);
    const grouped = groupBySubject(filterGradesBySelectedSy(gData)).filter(r => r.final != null);
    if (grouped.length === 0) {
      alert('Cannot generate transcript: no graded subjects found for this student in the selected school year.');
      return;
    }
    const avg = Number((grouped.reduce((sum, r) => sum + Number(r.final), 0) / grouped.length).toFixed(2));

    const nowLocal = new Date();
    const today = `${nowLocal.getFullYear()}-${String(nowLocal.getMonth() + 1).padStart(2, '0')}-${String(nowLocal.getDate()).padStart(2, '0')}`;
    const syLabel = currentSy?.year_label || activeSchoolYear?.year_label || '2026-2027';

    // Scope transcript persistence per (student_record_id, school_year) so generating new S.Y. never overwrites past S.Y. records
    const { data: existingTr } = await supabase
      .from('transcripts')
      .select('transcript_id')
      .eq('student_record_id', studentId)
      .eq('school_year', syLabel)
      .limit(1)
      .maybeSingle();

    const trPayload = {
      student_record_id: studentId,
      general_average:   avg,
      generated_date:    today,
      school_year:       syLabel,
    };

    const { error: trErr } = existingTr?.transcript_id
      ? await supabase.from('transcripts').update(trPayload).eq('transcript_id', existingTr.transcript_id)
      : await supabase.from('transcripts').insert([trPayload]);

    if (trErr) {
      alert(`Failed to save transcript record: ${trErr.message}`);
      return;
    }
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
            <span>{currentSy?.year_label ? `S.Y. ${currentSy.year_label}` : activeSchoolYear?.year_label ? `S.Y. ${activeSchoolYear.year_label}` : 'S.Y. 2025-2026'}</span>
            {activeQuarter && (
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontSize: '11px' }}>
                {activeQuarter.quarter_name}
              </span>
            )}
          </div>
          <span className="date-time">{dateStr}</span>
        </div>
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
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <h2 className="card-title"><IcoSearch /> Search Student &amp; Certificates</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${gradeFilter === 'completers' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setGrade(g => (g === 'completers' ? '' : 'completers'))}
              >
                <IcoBatch /> {gradeFilter === 'completers' ? 'Showing Grade 6 & 10 Completers' : 'Grade 6 & 10 Completers'}
              </button>
            </div>
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
                <option value="completers">Grade 6 &amp; 10 Completers (Certificates)</option>
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
                  <th>DepEd LRN</th>
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
                  <tr><td colSpan={7} className="empty-message">Loading...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={7} className="empty-message">No students found</td></tr>
                ) : (
                  students.map(s => {
                    const t = transcriptMap[s.student_record_id];
                    const hold = holdMap[s.student_record_id];
                    const isCompleter = Number(s.grade_level) === 6 || Number(s.grade_level) === 10;
                    return (
                      <tr key={s.student_record_id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: '700', color: '#8B0000' }}>{s.lrn_id || s.student_id || '—'}</td>
                        <td style={{ fontWeight: '600' }}>{s.first_name} {s.last_name}</td>
                        <td>{formatGradeSection(s.grade_level, s.section_name)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <TranscriptBadge hasTranscript={!!t} />
                            {hold?.isOverdue && (
                              <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: '11px', fontWeight: '700', padding: '2px 7px', borderRadius: '6px' }}>
                                Overdue Hold
                              </span>
                            )}
                          </div>
                        </td>
                        <td>{t?.general_average ? Number(t.general_average).toFixed(2) : '—'}</td>
                        <td>
                          {t?.generated_date
                            ? new Date(t.generated_date.includes('T') ? t.generated_date : `${t.generated_date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => openPreview(s)} title="View / Print Transcript">
                              <IcoView /> View
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => markGenerated(s.student_record_id)}
                              disabled={Boolean(hold?.isOverdue)}
                              title={hold?.isOverdue ? 'Withheld due to overdue balance' : 'Mark Transcript Generated'}
                            >
                              <IcoGenerate /> Generate
                            </button>
                            {isCompleter && (
                              <button
                                className="btn btn-sm"
                                style={{ background: '#b45309', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}
                                onClick={() => setCertStudent(s)}
                                title={`Print Certificate of Completion (Grade ${s.grade_level})`}
                              >
                                Certificate
                              </button>
                            )}
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
                <div><strong>Student Name:</strong> {previewStudent.first_name} {previewStudent.last_name}</div>
                <div><strong>DepEd LRN:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#8B0000' }}>{previewStudent.lrn_id ?? previewStudent.student_id ?? '—'}</span></div>
                <div><strong>Grade &amp; Section:</strong> {formatGradeSection(previewStudent.grade_level, previewStudent.section_name)}</div>
                <div>
                  <strong>General Average:</strong>{' '}
                  {(() => {
                    const liveGrouped = groupBySubject(grades).filter(r => r.final != null);
                    if (liveGrouped.length > 0) {
                      return (liveGrouped.reduce((sum, r) => sum + Number(r.final), 0) / liveGrouped.length).toFixed(2);
                    }
                    const savedAvg = transcriptMap[previewStudent.student_record_id]?.general_average;
                    return savedAvg ? Number(savedAvg).toFixed(2) : '—';
                  })()}
                </div>
              </div>

              {holdMap[previewStudent.student_record_id]?.isOverdue && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', marginTop: '10px', fontSize: '13px' }}>
                  <strong>Financial Hold Active:</strong> This student has an overdue balance of{' '}
                  <strong>₱{Number(holdMap[previewStudent.student_record_id].overdueAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>{' '}
                  (Total Balance: ₱{Number(holdMap[previewStudent.student_record_id].balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}). Official release and report printing are restricted until settled.
                </div>
              )}

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
              <button
                className="btn btn-secondary"
                disabled={Boolean(holdMap[previewStudent.student_record_id]?.isOverdue)}
                onClick={() => window.print()}
              >
                Print Transcript
              </button>
              <button
                className="btn btn-primary"
                disabled={Boolean(holdMap[previewStudent.student_record_id]?.isOverdue)}
                onClick={() => markGenerated(previewStudent.student_record_id)}
              >
                <IcoGenerate /> Mark as Generated
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Certificate of Completion Modal (Grade 6 & Grade 10 Completers) ── */}
      {certStudent && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setCertStudent(null); }}>
          <div className="modal-content" style={{ maxWidth: '780px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoTranscript /> Certificate of Completion (Grade {certStudent.grade_level})</h3>
              <button className="modal-close" onClick={() => setCertStudent(null)}><IcoClose /></button>
            </div>
            <div className="modal-body">
              {holdMap[certStudent.student_record_id]?.isOverdue && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px' }}>
                  <strong>Financial Hold Active:</strong> Certificate printing is withheld until the overdue balance of{' '}
                  <strong>₱{Number(holdMap[certStudent.student_record_id].overdueAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> is settled.
                </div>
              )}

              <div
                id="printable-completion-certificate"
                style={{
                  border: '6px double #8B0000',
                  borderRadius: '8px',
                  padding: '32px 36px',
                  background: '#fffdf7',
                  textAlign: 'center',
                  color: '#1f2937',
                }}
              >
                <div style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#6b7280', fontWeight: '600' }}>
                  Republic of the Philippines • Department of Education
                </div>
                <h2 style={{ margin: '6px 0 4px 0', color: '#8B0000', fontSize: '22px', letterSpacing: '0.5px' }}>
                  {schoolSettings?.school_name || 'A.B. SIMPSON ALLIANCE SCHOOL, INC.'}
                </h2>
                <div style={{ fontSize: '12px', color: '#555', marginBottom: '20px' }}>
                  {schoolSettings?.address || 'Official Student Information & Records Management'}
                </div>

                <div style={{
                  display: 'inline-block',
                  padding: '6px 22px',
                  borderTop: '2px solid #8B0000',
                  borderBottom: '2px solid #8B0000',
                  color: '#8B0000',
                  fontSize: '20px',
                  fontWeight: '800',
                  letterSpacing: '1.5px',
                  marginBottom: '18px',
                }}>
                  CERTIFICATE OF COMPLETION
                </div>

                <p style={{ fontSize: '14px', margin: '0 0 10px 0', color: '#4b5563' }}>
                  This is to certify that
                </p>

                <div style={{ fontSize: '26px', fontWeight: '800', color: '#111827', margin: '6px 0 8px 0', textDecoration: 'underline' }}>
                  {certStudent.first_name} {certStudent.middle_name ? `${certStudent.middle_name} ` : ''}{certStudent.last_name}
                </div>

                <div style={{ fontSize: '13px', fontFamily: 'monospace', color: '#8B0000', fontWeight: '700', marginBottom: '16px' }}>
                  Learner Reference Number (LRN): {certStudent.lrn_id || certStudent.student_id || '—'}
                </div>

                <p style={{ fontSize: '14px', lineHeight: '1.7', maxWidth: '580px', margin: '0 auto 20px auto', color: '#374151' }}>
                  has satisfactorily completed all academic and character requirements prescribed by the Department of Education for{' '}
                  <strong>
                    {Number(certStudent.grade_level) === 6
                      ? 'Elementary Education (Grade 6)'
                      : 'Junior High School (Grade 10)'}
                  </strong>{' '}
                  during School Year <strong>{currentSy?.year_label || activeSchoolYear?.year_label || '2026-2027'}</strong>.
                </p>

                <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '34px' }}>
                  Issued on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '540px', margin: '0 auto' }}>
                  <div>
                    <div style={{ borderTop: '1px solid #374151', paddingTop: '6px', fontWeight: '700', fontSize: '13px' }}>
                      {schoolSettings?.registrar || 'School Registrar'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>Registrar / Records Officer</div>
                  </div>
                  <div>
                    <div style={{ borderTop: '1px solid #374151', paddingTop: '6px', fontWeight: '700', fontSize: '13px' }}>
                      {schoolSettings?.principal || 'School Principal'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>Principal / School Head</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setCertStudent(null)}>Close</button>
              <button
                className="btn btn-primary"
                disabled={Boolean(holdMap[certStudent.student_record_id]?.isOverdue)}
                onClick={() => window.print()}
              >
                Print Certificate of Completion
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
    // quarter values are '1Q','2Q','3Q','4Q' (also handle 'Q1' or null safely)
    const qMatch = String(g.quarter ?? '').match(/[1-4]/);
    if (qMatch) {
      const qKey = `q${qMatch[0]}`;
      if (qKey in map[g.subject]) {
        map[g.subject][qKey] = g.quarter_grade;
      }
    }
    // Compute final as average of present numeric quarters (exclude empty strings)
    const vals = ['q1','q2','q3','q4']
      .map(k => map[g.subject][k])
      .filter(v => v != null && String(v).trim() !== '' && !isNaN(Number(v)));
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
