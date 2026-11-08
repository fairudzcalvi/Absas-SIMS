import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatGradeSection } from '../../utils/formatters';

/* ── Icons ─────────────────────────────────────────────── */
function IcoCalendar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IcoClock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IcoRoom() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IcoGrades() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
function IcoAttendance() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
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

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function fmtTime(t) {
  if (!t) return '—';
  const [h, m] = t.split(':');
  const hr = parseInt(h, 10);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
}

export default function TeacherSchedulesPage() {
  const { supabase, profile, activeSchoolYear, selectedSchoolYear } = useAuth();
  const navigate = useNavigate();

  const currentSy = selectedSchoolYear || activeSchoolYear;

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [dayFilter, setDayFilter] = useState('all');

  useEffect(() => {
    let ignore = false;
    async function loadSchedules() {
      if (!profile) return;
      setLoading(true);

      const email = profile.email;
      const facId = profile.faculty_id || profile.faculty_record_id;
      const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();

      const syMatches = (s) => {
        if (!currentSy) return true;
        if (s.school_year_id && currentSy.id) return s.school_year_id === currentSy.id;
        if (s.school_year && currentSy.year_label) return s.school_year === currentSy.year_label;
        return true;
      };

      // 1. Try 'teacher' column first
      if (email) {
        const { data, error } = await supabase
          .from('schedules')
          .select('*')
          .eq('teacher', email)
          .order('day_of_week')
          .order('time_start');
        if (!error && data && data.length > 0) {
          const filtered = data.filter(syMatches);
          if (!ignore) { setSchedules(filtered); setLoading(false); return; }
        }
      }

      // 2. Try 'faculty_id'
      if (facId) {
        const { data, error } = await supabase
          .from('schedules')
          .select('*')
          .eq('faculty_id', facId)
          .order('day_of_week')
          .order('time_start');
        if (!error && data && data.length > 0) {
          const filtered = data.filter(syMatches);
          if (!ignore) { setSchedules(filtered); setLoading(false); return; }
        }
      }

      // 3. Try 'teacher_name'
      if (fullName) {
        const { data, error } = await supabase
          .from('schedules')
          .select('*')
          .eq('teacher_name', fullName)
          .order('day_of_week')
          .order('time_start');
        if (!error && data && data.length > 0) {
          const filtered = data.filter(syMatches);
          if (!ignore) { setSchedules(filtered); setLoading(false); return; }
        }
      }

      // 4. Fallback: select all and filter in JS
      const { data: allData, error: allErr } = await supabase
        .from('schedules')
        .select('*')
        .order('day_of_week')
        .order('time_start');

      if (!allErr && allData) {
        const matched = allData.filter(s => {
          const tVal = s.teacher || s.faculty_id || s.teacher_id || s.teacher_name;
          const isMe = tVal === email || tVal === facId || tVal === fullName;
          return isMe && syMatches(s);
        });
        if (!ignore) { setSchedules(matched); setLoading(false); return; }
      }

      if (!ignore) { setSchedules([]); setLoading(false); }
    }

    loadSchedules();
    return () => { ignore = true; };
  }, [supabase, profile, currentSy]);

  // Derived stats
  const totalClasses = schedules.length;
  const uniqueSubjects = useMemo(() => {
    return Array.from(new Set(schedules.map(s => s.subject).filter(Boolean)));
  }, [schedules]);

  const uniqueSections = useMemo(() => {
    return Array.from(new Set(schedules.map(s => s.section_name).filter(Boolean)));
  }, [schedules]);

  // Group by day of week
  const byDay = useMemo(() => {
    return DAYS.reduce((acc, d) => {
      acc[d] = schedules.filter(s => s.day_of_week === d);
      return acc;
    }, {});
  }, [schedules]);

  const displayedDays = dayFilter === 'all' ? DAYS : [dayFilter];

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  function handleGoToGrades(s) {
    navigate('/teacher/grades', {
      state: {
        presetGrade: s.grade_level,
        presetSubject: s.subject,
        presetSection: s.section_name,
      },
    });
  }

  function handleGoToAttendance(s) {
    navigate('/teacher/attendance', {
      state: {
        presetGrade: s.grade_level,
        presetSection: s.section_name,
      },
    });
  }

  return (
    <>
      <div className="top-header">
        <h1><IcoCalendar /> My Teaching Schedule</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => window.print()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <IcoPrint /> Print Schedule
          </button>
          <span className="date-time">{dateStr}</span>
        </div>
      </div>

      <div className="content-area">
        {/* Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><IcoCalendar /></div>
            <div className="stat-info">
              <div className="stat-number">{totalClasses}</div>
              <div className="stat-label">Scheduled Classes</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon"><IcoClock /></div>
            <div className="stat-info">
              <div className="stat-number">{uniqueSubjects.length}</div>
              <div className="stat-label">Subjects Taught</div>
            </div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon"><IcoRoom /></div>
            <div className="stat-info">
              <div className="stat-number">{uniqueSections.length}</div>
              <div className="stat-label">Assigned Sections</div>
            </div>
          </div>
        </div>

        {/* Schedule Card */}
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <h2 className="card-title">
              <IcoCalendar />
              Weekly Timetable — {profile?.first_name} {profile?.last_name}
              <span style={{ fontSize: '13px', fontWeight: '400', color: '#666', marginLeft: '8px' }}>
                ({activeSchoolYear?.year_label ? `S.Y. ${activeSchoolYear.year_label}` : 'S.Y. 2025-2026'})
              </span>
            </h2>

            {/* Filter by Day */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                className={`btn btn-sm ${dayFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setDayFilter('all')}
              >
                All Days
              </button>
              {DAYS.map(d => (
                <button
                  key={d}
                  className={`btn btn-sm ${dayFilter === d ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setDayFilter(d)}
                >
                  {d}
                  {byDay[d]?.length > 0 && (
                    <span style={{
                      marginLeft: '6px',
                      background: dayFilter === d ? '#fff' : '#e9ecef',
                      color: dayFilter === d ? '#8B0000' : '#333',
                      borderRadius: '10px',
                      padding: '1px 6px',
                      fontSize: '11px',
                      fontWeight: '700',
                    }}>
                      {byDay[d].length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="empty-message">Loading teaching schedules...</p>
          ) : schedules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: '#666' }}>
              <h3 style={{ color: '#8B0000', marginBottom: '8px' }}>No Schedules Assigned Yet</h3>
              <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '14px', color: '#777' }}>
                You currently have no scheduled classes in the timetable. Please consult the school registrar or academic coordinator to assign your teaching loads.
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Subject</th>
                    <th>Grade &amp; Section</th>
                    <th>Room</th>
                    <th>Quick Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedDays.map(day => {
                    const dayClasses = byDay[day] || [];
                    if (dayClasses.length === 0) {
                      if (dayFilter !== 'all') {
                        return (
                          <tr key={day}>
                            <td colSpan={6} className="empty-message">No classes scheduled on {day}.</td>
                          </tr>
                        );
                      }
                      return null;
                    }

                    return dayClasses.map((s, idx) => (
                      <tr key={s.schedule_id}>
                        {idx === 0 && (
                          <td
                            rowSpan={dayClasses.length}
                            style={{
                              fontWeight: '700',
                              color: '#8B0000',
                              verticalAlign: 'top',
                              paddingTop: '14px',
                              whiteSpace: 'nowrap',
                              background: '#fff8f6',
                              borderRight: '1px solid #f2dede',
                            }}
                          >
                            {day}
                          </td>
                        )}
                        <td style={{ whiteSpace: 'nowrap', fontWeight: '600', color: '#333' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <IcoClock /> {fmtTime(s.time_start)} – {fmtTime(s.time_end)}
                          </span>
                        </td>
                        <td style={{ fontWeight: '700', color: '#8B0000' }}>
                          {s.subject}
                        </td>
                        <td>
                          <span style={{
                            background: '#f0f0f0',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: '600',
                            fontSize: '13px',
                          }}>
                            {formatGradeSection(s.grade_level, s.section_name)}
                          </span>
                        </td>
                        <td>
                          {s.room ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <IcoRoom /> {s.room}
                            </span>
                          ) : '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleGoToGrades(s)}
                              title="Encode Grades for this class"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', fontSize: '11px' }}
                            >
                              <IcoGrades /> Grades
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleGoToAttendance(s)}
                              title="Take Attendance for this class"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', fontSize: '11px' }}
                            >
                              <IcoAttendance /> Attendance
                            </button>
                          </div>
                        </td>
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
