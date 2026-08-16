import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function IcoAttend() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  );
}

const STATUS_COLORS = {
  present: { bg: '#e8f5e9', color: '#2e7d32', label: 'Present' },
  absent:  { bg: '#ffebee', color: '#c62828', label: 'Absent'  },
  late:    { bg: '#fff8e1', color: '#f57f17', label: 'Late'    },
  excused: { bg: '#e3f2fd', color: '#1565c0', label: 'Excused' },
};

export default function StudentAttendancePage() {
  const { supabase, profile }   = useAuth();
  const [records, setRecords]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [monthFilter, setMonth] = useState('');

  useEffect(() => {
    if (!profile?.student_record_id) return;
    async function fetch() {
      setLoading(true);
      let q = supabase
        .from('attendance')
        .select('*')
        .eq('student_record_id', profile.student_record_id)
        .order('date', { ascending: false });
      if (monthFilter) {
        q = q.gte('date', `${monthFilter}-01`).lte('date', `${monthFilter}-31`);
      }
      const { data } = await q;
      setRecords(data ?? []);
      setLoading(false);
    }
    fetch();
  }, [supabase, profile, monthFilter]);

  const counts = records.reduce((acc, r) => {
    const k = (r.status ?? '').toLowerCase();
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <>
      <div className="top-header">
        <h1><IcoAttend /> Attendance</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">

        {/* Summary tiles */}
        <div className="stats-grid">
          {Object.entries(STATUS_COLORS).map(([key, { bg, color, label }]) => (
            <div key={key} className="stat-card" style={{ borderLeftColor: color }}>
              <div className="stat-icon" style={{ background: bg }}>
                <IcoAttend />
              </div>
              <div className="stat-info">
                <div className="stat-number" style={{ color }}>{counts[key] ?? 0}</div>
                <div className="stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter + Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoAttend /> Attendance Records</h2>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <input
                type="month"
                value={monthFilter}
                onChange={e => setMonth(e.target.value)}
                style={{ padding: '8px 12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr><th>Date</th><th>Status</th><th>Remarks</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="empty-message">Loading...</td></tr>
                ) : records.length === 0 ? (
                  <tr><td colSpan={3} className="empty-message">No attendance records found.</td></tr>
                ) : records.map(r => {
                  const k = (r.status ?? '').toLowerCase();
                  const c = STATUS_COLORS[k] ?? { bg: '#f5f5f5', color: '#555' };
                  return (
                    <tr key={r.attendance_id}>
                      <td>{new Date(r.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                      <td>
                        <span style={{ backgroundColor: c.bg, color: c.color, padding: '3px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                          {r.status}
                        </span>
                      </td>
                      <td>{r.remarks ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}
