import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

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

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function fmt(t) {
  if (!t) return '—';
  const [h, m] = t.split(':');
  const hr = parseInt(h, 10);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
}

export default function StudentSchedulesPage() {
  const { supabase, profile } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!profile?.grade_level) return;
    async function fetch() {
      setLoading(true);
      const { data } = await supabase
        .from('schedules')
        .select('*')
        .eq('grade_level', profile.grade_level)
        .order('day_of_week')
        .order('time_start');
      setSchedules(data ?? []);
      setLoading(false);
    }
    fetch();
  }, [supabase, profile]);

  const byDay = DAYS.reduce((acc, d) => {
    acc[d] = schedules.filter(s => s.day_of_week === d);
    return acc;
  }, {});

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <>
      <div className="top-header">
        <h1><IcoCalendar /> My Schedules</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <IcoCalendar />
              Grade {profile?.grade_level ?? '—'} {profile?.section_name ? `— ${profile.section_name}` : ''} — Weekly Schedule
            </h2>
          </div>

          {loading ? (
            <p className="empty-message">Loading...</p>
          ) : schedules.length === 0 ? (
            <p className="empty-message">No schedules found for your grade level.</p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Day</th><th>Subject</th><th>Teacher</th>
                    <th>Time</th><th>Room</th>
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map(day =>
                    byDay[day].length === 0 ? null :
                    byDay[day].map((s, i) => (
                      <tr key={s.schedule_id}>
                        {i === 0 && (
                          <td rowSpan={byDay[day].length} style={{ fontWeight: '700', color: '#8B0000', verticalAlign: 'top', paddingTop: '14px', whiteSpace: 'nowrap' }}>
                            {day}
                          </td>
                        )}
                        <td style={{ fontWeight: '600' }}>{s.subject}</td>
                        <td>{s.teacher ?? '—'}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{fmt(s.time_start)} – {fmt(s.time_end)}</td>
                        <td>{s.room ?? '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
