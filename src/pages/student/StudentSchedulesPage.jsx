import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { cleanSectionName } from '../../utils/formatters';
import { parseScheduleDays, scheduleIncludesDay, formatDaysShort } from '../../utils/scheduleDays';

/* ── SVG Icons (Strictly Zero Emojis) ────────────────────────── */
function IcoCalendar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function IcoClock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function IcoRoom() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function IcoUser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function IcoPrint() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect x="6" y="14" width="12" height="8"/>
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

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function fmt(t) {
  if (!t) return '—';
  const [h, m] = t.split(':');
  const hr = parseInt(h, 10);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
}

export default function StudentSchedulesPage() {
  const { supabase, profile, activeSchoolYear, selectedSchoolYear } = useAuth();
  const currentSy = selectedSchoolYear || activeSchoolYear;

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [viewMode, setViewMode]   = useState('grid'); // 'grid' (columns) | 'table'

  useEffect(() => {
    if (!profile?.grade_level) return;
    let ignore = false;
    async function fetch() {
      setLoading(true);
      const { data } = await supabase
        .from('schedules')
        .select('*')
        .eq('grade_level', profile.grade_level)
        .order('day_of_week')
        .order('time_start');

      // Isolate to selected/active school year (preserving legacy null-SY schedules only when unset)
      let filtered = (data ?? []).filter(s =>
        !currentSy ||
        (!s.school_year_id && !s.school_year) ||
        (currentSy?.id && s.school_year_id && String(s.school_year_id) === String(currentSy.id)) ||
        (currentSy?.year_label && s.school_year === currentSy.year_label)
      );

      // Strictly show schedules for the student's own assigned section + grade-wide classes
      if (profile.section_name) {
        const studentSec = cleanSectionName(profile.section_name, profile.grade_level).toLowerCase().trim();
        filtered = filtered.filter(s => {
          if (!s.section_name) return true; // Grade-wide class
          const sec = cleanSectionName(s.section_name, profile.grade_level).toLowerCase().trim();
          return sec === studentSec;
        });
      } else {
        filtered = filtered.filter(s => !s.section_name);
      }

      if (!ignore) {
        setSchedules(filtered);
        setLoading(false);
      }
    }
    fetch();
    return () => { ignore = true; };
  }, [supabase, profile, currentSy]);

  const byDay = useMemo(() => {
    return DAYS.reduce((acc, d) => {
      acc[d] = (schedules || [])
        .filter(s => scheduleIncludesDay(s.day_of_week, d))
        .sort((a, b) => (a.time_start || '').localeCompare(b.time_start || ''));
      return acc;
    }, {});
  }, [schedules]);

  // Determine current day for visual highlighting
  const currentDayName = useMemo(() => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[new Date().getDay()];
  }, []);

  const totalClasses = useMemo(
    () => DAYS.reduce((sum, d) => sum + (byDay[d]?.length || 0), 0),
    [byDay]
  );
  const uniqueSubjects = useMemo(() => {
    return Array.from(new Set(schedules.map(s => s.subject).filter(Boolean)));
  }, [schedules]);

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <>
      <div className="top-header">
        <h1><IcoCalendar /> My Weekly Schedule</h1>
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
        {/* Quick Summary Card */}
        <div className="stats-grid" style={{ marginBottom: '20px' }}>
          <div className="stat-card">
            <div className="stat-icon"><IcoCalendar /></div>
            <div className="stat-info">
              <div className="stat-number">{totalClasses}</div>
              <div className="stat-label">Total Classes / Week</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon"><IcoClock /></div>
            <div className="stat-info">
              <div className="stat-number">{uniqueSubjects.length}</div>
              <div className="stat-label">Enrolled Subjects</div>
            </div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon"><IcoRoom /></div>
            <div className="stat-info">
              <div className="stat-number">
                {profile?.section_name || `Grade ${profile?.grade_level || '—'}`}
              </div>
              <div className="stat-label">
                {currentSy?.year_label ? `S.Y. ${currentSy.year_label}` : 'Current Academic Year'}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <IcoCalendar />
              Grade {profile?.grade_level ?? '—'} {profile?.section_name ? `(${profile.section_name})` : ''} — Weekly Timetable
              {currentSy?.year_label && (
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: '#f1f5f9',
                  color: '#475569',
                }}>
                  S.Y. {currentSy.year_label}
                </span>
              )}
            </h2>

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
          </div>

          {loading ? (
            <p className="empty-message">Loading schedule...</p>
          ) : schedules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: '#666' }}>
              <h3 style={{ color: '#8B0000', marginBottom: '8px' }}>No Classes Scheduled</h3>
              <p style={{ maxWidth: '420px', margin: '0 auto', fontSize: '14px', color: '#777' }}>
                There are no scheduled subjects posted for your grade and section yet. Please check back later or consult the school registrar.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* ── Weekly Timetable Columns Grid (Not by flat row) ── */
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
                                padding: '10px 12px',
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
                                <span>{fmt(s.time_start)} – {fmt(s.time_end)}</span>
                              </div>

                              {/* Subject */}
                              <div style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a', lineHeight: '1.3' }}>
                                {s.subject}
                              </div>

                              {/* Teacher & Room Meta */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title="Teacher">
                                  <IcoUser />
                                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {s.teacher_name || s.teacher || s.faculty_id || 'TBA'}
                                  </span>
                                </div>
                                {s.room && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title="Room">
                                    <IcoRoom />
                                    <span>{s.room}</span>
                                  </div>
                                )}
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
                    <th>Day</th><th>Time</th><th>Subject</th><th>Teacher</th><th>Room</th>
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map(day => {
                    const dayClasses = byDay[day] || [];
                    if (dayClasses.length === 0) return null;
                    return dayClasses.map((s, i) => (
                      <tr key={`${day}-${s.schedule_id}`}>
                        {i === 0 && (
                          <td
                            rowSpan={dayClasses.length}
                            style={{
                              fontWeight: '700',
                              color: '#8B0000',
                              verticalAlign: 'top',
                              paddingTop: '14px',
                              whiteSpace: 'nowrap',
                              background: currentDayName === day ? '#fffbf5' : 'transparent',
                            }}
                          >
                            {day} {currentDayName === day ? '(Today)' : ''}
                          </td>
                        )}
                        <td style={{ whiteSpace: 'nowrap', fontWeight: '500' }}>{fmt(s.time_start)} – {fmt(s.time_end)}</td>
                        <td style={{ fontWeight: '600' }}>
                          <span>{s.subject}</span>
                          {parseScheduleDays(s.day_of_week).length > 1 && (
                            <span style={{ marginLeft: '6px', background: '#fff3cd', color: '#856404', padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>
                              {formatDaysShort(s.day_of_week)}
                            </span>
                          )}
                        </td>
                        <td>{s.teacher_name || s.teacher || s.faculty_id || '—'}</td>
                        <td>{s.room ?? '—'}</td>
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
