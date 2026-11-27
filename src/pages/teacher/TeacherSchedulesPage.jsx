import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatGradeSection } from '../../utils/formatters';
import { parseScheduleDays, scheduleIncludesDay, formatDaysShort } from '../../utils/scheduleDays';

/* ── SVG Icons (Strictly Zero Emojis) ────────────────────────── */
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
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IcoRoom() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IcoGrades() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
function IcoAttendance() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
function IcoPrint() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}
function IcoGrid() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}
function IcoList() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  );
}
function IcoClassroom() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
  const { supabase, profile, activeSchoolYear, selectedSchoolYear, activeQuarter } = useAuth();
  const navigate = useNavigate();

  const currentSy = selectedSchoolYear || activeSchoolYear;

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [dayFilter, setDayFilter] = useState('all');
  const [viewMode, setViewMode]   = useState('grid'); // 'grid' (columns) | 'table'

  useEffect(() => {
    let ignore = false;
    async function loadSchedules() {
      if (!profile) return;
      setLoading(true);

      const email = (profile.email || '').toLowerCase().trim();
      const facId = (profile.faculty_id || '').toLowerCase().trim();
      const facRecId = profile.faculty_record_id ? String(profile.faculty_record_id) : '';
      const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.toLowerCase().trim();

      const syMatches = (s) => {
        if (!currentSy) return true;
        if (s.school_year_id && currentSy.id) return s.school_year_id === currentSy.id;
        if (s.school_year && currentSy.year_label) return s.school_year === currentSy.year_label;
        return true;
      };

      const isMySchedule = (s) => {
        const t = (s.teacher || '').toLowerCase().trim();
        const f = (s.faculty_id || '').toLowerCase().trim();
        const fr = s.faculty_record_id ? String(s.faculty_record_id) : '';
        const tn = (s.teacher_name || '').toLowerCase().trim();
        return (
          (email && (t === email || tn === email)) ||
          (facId && (f === facId || t === facId)) ||
          (facRecId && fr === facRecId) ||
          (fullName && (t === fullName || tn === fullName))
        );
      };

      const { data: allData, error: allErr } = await supabase
        .from('schedules')
        .select('*')
        .order('day_of_week')
        .order('time_start');

      if (!allErr && allData) {
        const matched = allData.filter(s => isMySchedule(s) && syMatches(s));
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

  // Group by day of week & sort chronologically (supports multi-day M-W-F)
  const byDay = useMemo(() => {
    return DAYS.reduce((acc, d) => {
      acc[d] = (schedules || [])
        .filter(s => scheduleIncludesDay(s.day_of_week, d))
        .sort((a, b) => (a.time_start || '').localeCompare(b.time_start || ''));
      return acc;
    }, {});
  }, [schedules]);

  // Highlight current day of week
  const currentDayName = useMemo(() => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[new Date().getDay()];
  }, []);

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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
            <span>{currentSy?.year_label ? `S.Y. ${currentSy.year_label}` : 'S.Y. 2025-2026'}</span>
            {activeQuarter && (
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontSize: '11px' }}>
                {activeQuarter.quarter_name}
              </span>
            )}
          </div>
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
              <div className="stat-label">Scheduled Classes / Week</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon"><IcoClock /></div>
            <div className="stat-info">
              <div className="stat-number">{uniqueSubjects.length}</div>
              <div className="stat-label">Assigned Subjects</div>
            </div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon"><IcoRoom /></div>
            <div className="stat-info">
              <div className="stat-number">{uniqueSections.length}</div>
              <div className="stat-label">Teaching Sections</div>
            </div>
          </div>
        </div>

        {/* Schedule Card */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <IcoCalendar />
              Weekly Timetable — {profile?.first_name} {profile?.last_name}
              <span style={{ fontSize: '13px', fontWeight: '400', color: '#666', marginLeft: '6px' }}>
                ({currentSy?.year_label ? `S.Y. ${currentSy.year_label}` : 'S.Y. 2025-2026'})
              </span>
            </h2>

            {/* View Mode & Filter Controls */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Layout Toggle: Grid vs Table */}
              <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '3px', borderRadius: '6px' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setViewMode('grid')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '4px 10px' }}
                >
                  <IcoGrid /> Timetable Grid
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setViewMode('table')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '4px 10px' }}
                >
                  <IcoList /> List View
                </button>
              </div>

              {/* Day filter for list view */}
              {viewMode === 'table' && (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
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
                      {d.slice(0, 3)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <p className="empty-message">Loading teaching schedules...</p>
          ) : schedules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: '#666' }}>
              <h3 style={{ color: '#8B0000', marginBottom: '8px' }}>No Schedules Assigned Yet</h3>
              <p style={{ maxWidth: '420px', margin: '0 auto', fontSize: '14px', color: '#777' }}>
                You currently have no scheduled teaching loads assigned for this school year. Please consult the school registrar or academic coordinator.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* ── Weekly Timetable Columns Grid (5 Columns Matching Student Schedule) ── */
            <div style={{ padding: '16px', overflowX: 'auto' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, minmax(210px, 1fr))',
                gap: '14px',
                minWidth: '1050px',
              }}>
                {DAYS.map(day => {
                  const dayClasses = byDay[day] || [];
                  const isToday = currentDayName === day;

                  return (
                    <div
                      key={day}
                      style={{
                        background: isToday ? '#fffbf5' : '#f8fafc',
                        border: isToday ? '2px solid #8B0000' : '1px solid #e2e8f0',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '380px',
                        boxShadow: isToday ? '0 4px 12px rgba(139,0,0,0.08)' : 'none',
                        transition: 'border 0.2s',
                      }}
                    >
                      {/* Day Column Header */}
                      <div style={{
                        padding: '12px 14px',
                        background: isToday ? '#8B0000' : '#ffffff',
                        color: isToday ? '#ffffff' : '#1e293b',
                        borderBottom: isToday ? 'none' : '1px solid #e2e8f0',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '14px', letterSpacing: '0.3px' }}>
                            {day}
                          </div>
                          {isToday && (
                            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#fef08a', fontWeight: '700' }}>
                              Today
                            </span>
                          )}
                        </div>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '2px 7px',
                          borderRadius: '10px',
                          background: isToday ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                          color: isToday ? '#ffffff' : '#64748b',
                        }}>
                          {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                        </span>
                      </div>

                      {/* Day Class Cards */}
                      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                        {dayClasses.length === 0 ? (
                          <div style={{
                            textAlign: 'center',
                            padding: '30px 10px',
                            color: '#94a3b8',
                            fontSize: '12px',
                            fontStyle: 'italic',
                          }}>
                            No classes scheduled
                          </div>
                        ) : (
                          dayClasses.map(s => (
                            <div
                              key={s.schedule_id}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderLeft: '4px solid #8B0000',
                                borderRadius: '8px',
                                padding: '12px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                              }}
                            >
                              {/* Time Pill */}
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '11px',
                                fontWeight: '600',
                                color: '#8B0000',
                                background: '#fff5f5',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                width: 'fit-content',
                              }}>
                                <IcoClock />
                                <span>{fmtTime(s.time_start)} – {fmtTime(s.time_end)}</span>
                              </div>

                              {/* Subject */}
                              <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a', lineHeight: '1.3' }}>
                                {s.subject}
                              </div>

                              {/* Grade & Section Badge */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                                <IcoClassroom />
                                <span style={{
                                  fontWeight: '600',
                                  background: '#f1f5f9',
                                  padding: '2px 7px',
                                  borderRadius: '4px',
                                  color: '#1e293b',
                                }}>
                                  {formatGradeSection(s.grade_level, s.section_name)}
                                </span>
                              </div>

                              {/* Room */}
                              {s.room && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b' }}>
                                  <IcoRoom />
                                  <span>{s.room}</span>
                                </div>
                              )}

                              {/* Quick Actions */}
                              <div style={{ display: 'flex', gap: '6px', marginTop: '4px', borderTop: '1px solid #f1f5f9', paddingTop: '6px' }}>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => handleGoToGrades(s)}
                                  style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '3px 6px', fontSize: '11px' }}
                                  title="Encode Grades for this section"
                                >
                                  <IcoGrades /> Grades
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => handleGoToAttendance(s)}
                                  style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '3px 6px', fontSize: '11px' }}
                                  title="Take Attendance for this section"
                                >
                                  <IcoAttendance /> Attendance
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ── Traditional List View ── */
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
                      <tr key={`${day}-${s.schedule_id}`}>
                        {idx === 0 && (
                          <td
                            rowSpan={dayClasses.length}
                            style={{
                              fontWeight: '700',
                              color: '#8B0000',
                              verticalAlign: 'top',
                              paddingTop: '14px',
                              whiteSpace: 'nowrap',
                              background: currentDayName === day ? '#fffbf5' : '#fff8f6',
                              borderRight: '1px solid #f2dede',
                            }}
                          >
                            {day} {currentDayName === day ? '(Today)' : ''}
                          </td>
                        )}
                        <td style={{ whiteSpace: 'nowrap', fontWeight: '600', color: '#333' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <IcoClock /> {fmtTime(s.time_start)} – {fmtTime(s.time_end)}
                          </span>
                        </td>
                        <td style={{ fontWeight: '700', color: '#8B0000' }}>
                          <span>{s.subject}</span>
                          {parseScheduleDays(s.day_of_week).length > 1 && (
                            <span style={{ marginLeft: '6px', background: '#fff3cd', color: '#856404', padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>
                              {formatDaysShort(s.day_of_week)}
                            </span>
                          )}
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
