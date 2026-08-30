import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

/* ── Icons ─────────────────────────────────────────────── */
function IcoFinance() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <path d="M6 14h.01M10 14h4" />
    </svg>
  );
}
function IcoCollected() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
function IcoBalance() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IcoPaid() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function IcoBolt() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}
function IcoRecordPayment() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
function IcoReport() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}
function IcoExport() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function IcoHistory() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}
function IcoFilter() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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
function IcoFeeStructure() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function IcoElementary() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IcoJuniorHigh() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
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

const QUICK_ACTIONS = [
  { label: 'Record Payment',   Icon: IcoRecordPayment, action: 'record'  },
  { label: 'Financial Report', Icon: IcoReport,        action: 'report'  },
  { label: 'Export Data',      Icon: IcoExport,        action: 'export'  },
  { label: 'Payment History',  Icon: IcoHistory,       action: 'history' },
];

const EMPTY_PAYMENT_FORM = {
  student_record_id: '',
  amount:            '',
  payment_date:      new Date().toISOString().split('T')[0],
  payment_method:    'Cash',
  payment_for:       'Tuition Fee',
  reference_number:  '',
  remarks:           '',
};

function peso(n) {
  return '₱' + Number(n ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 });
}

/* ── Page ──────────────────────────────────────────────── */
export default function FinancePage() {
  const { supabase } = useAuth();

  const [records, setRecords]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [gradeFilter, setGrade]     = useState('');
  const [statusFilter, setStatus]   = useState('');
  const [search, setSearch]         = useState('');
  const [stats, setStats]           = useState({ revenue: 0, collected: 0, balance: 0, fullPaid: 0 });

  const [modalOpen, setModalOpen]   = useState(false);
  const [payForm, setPayForm]       = useState(EMPTY_PAYMENT_FORM);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState('');

  const [historyStudent, setHistoryStudent] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  /* fetch */
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('student_finances')
      .select(`
        finance_id, tuition_fee, miscellaneous_fee, total_fees, amount_paid, balance, status, school_year, updated_at,
        students ( student_record_id, first_name, last_name, grade_level, lrn_id )
      `)
      .order('updated_at', { ascending: false });

    let rows = (data ?? []).filter(r => r.students);

    if (gradeFilter) rows = rows.filter(r => r.students?.grade_level === Number(gradeFilter));
    if (search) rows = rows.filter(r => {
      const q = search.toLowerCase();
      const s = r.students;
      return (s?.first_name + ' ' + s?.last_name).toLowerCase().includes(q)
          || String(s?.student_record_id ?? '').includes(q);
    });
    if (statusFilter) rows = rows.filter(r => (r.status ?? '').toLowerCase() === statusFilter.toLowerCase());

    setRecords(rows);

    const totalRevenue = rows.reduce((a, r) => a + Number(r.total_fees ?? 0), 0);
    const totalPaid    = rows.reduce((a, r) => a + Number(r.amount_paid ?? 0), 0);
    const totalBalance = rows.reduce((a, r) => a + Number(r.balance ?? 0), 0);
    const fullPaid     = rows.filter(r => (r.status ?? '').toLowerCase() === 'paid').length;
    setStats({ revenue: totalRevenue, collected: totalPaid, balance: totalBalance, fullPaid });

    setLoading(false);
  }, [supabase, gradeFilter, search, statusFilter]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('student_finances')
        .select(`
          finance_id,
          student_record_id,
          tuition_fee,
          miscellaneous_fee,
          total_fees,
          amount_paid,
          balance,
          status,
          school_year,
          students (
            student_record_id,
            first_name,
            last_name,
            grade_level
          )
        `);

      if (error) {
        console.error("Error fetching finance records:", error);
        if (!ignore) {
          setRecords([]);
          setLoading(false);
        }
        return;
      }

      let rows = data ?? [];

      if (gradeFilter) rows = rows.filter(r => r.students?.grade_level === Number(gradeFilter));
      if (search) rows = rows.filter(r => {
        const q = search.toLowerCase();
        const s = r.students;
        return (s?.first_name + ' ' + s?.last_name).toLowerCase().includes(q)
            || String(s?.student_record_id ?? '').includes(q);
      });
      if (statusFilter) rows = rows.filter(r => (r.status ?? '').toLowerCase() === statusFilter.toLowerCase());

      if (!ignore) {
        setRecords(rows);

        const totalRevenue = rows.reduce((a, r) => a + Number(r.total_fees ?? 0), 0);
        const totalPaid    = rows.reduce((a, r) => a + Number(r.amount_paid ?? 0), 0);
        const totalBalance = rows.reduce((a, r) => a + Number(r.balance ?? 0), 0);
        const fullPaid     = rows.filter(r => (r.status ?? '').toLowerCase() === 'paid').length;
        setStats({ revenue: totalRevenue, collected: totalPaid, balance: totalBalance, fullPaid });

        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [supabase, gradeFilter, search, statusFilter]);

  /* record payment */
  async function handleSavePayment(e) {
    e.preventDefault();
    if (!payForm.student_record_id || !payForm.amount) {
      setFormError('Student record ID and amount are required.');
      return;
    }
    setSaving(true);
    setFormError('');

    const studentRecordId = parseInt(payForm.student_record_id, 10);
    const amount = parseFloat(payForm.amount);

    // Fetch existing finance record for this student
    const { data: existing } = await supabase
      .from('student_finances')
      .select('*')
      .eq('student_record_id', studentRecordId)
      .single();

    if (existing) {
      const newPaid   = Number(existing.amount_paid ?? 0) + amount;
      const totalFees = Number(existing.total_fees ?? 0);
      // Determine new status (lowercase to match CHECK constraint)
      const newStatus = newPaid >= totalFees ? 'paid' : newPaid > 0 ? 'partial' : 'unpaid';
      // Only update amount_paid and status — balance and total_fees are GENERATED columns
      await supabase.from('student_finances').update({
        amount_paid: newPaid,
        status:      newStatus,
      }).eq('finance_id', existing.finance_id);
    } else {
      // No finance record yet — insert new one (omit total_fees/balance — generated)
      await supabase.from('student_finances').insert([{
        student_record_id: studentRecordId,
        tuition_fee:       0,
        miscellaneous_fee: 0,
        amount_paid:       amount,
        status:            'partial',
        school_year:       '2025-2026',
      }]);
    }

    // Insert into payments log
    await supabase.from('payments').insert([{
      student_record_id: studentRecordId,
      amount:            amount,
      payment_date:      payForm.payment_date,
      payment_method:    payForm.payment_method,
      payment_for:       payForm.payment_for,
      reference_number:  payForm.reference_number || null,
      remarks:           payForm.remarks           || null,
    }]);

    setSaving(false);
    setModalOpen(false);
    setPayForm(EMPTY_PAYMENT_FORM);
    fetchRecords();
  }

  /* view payment history */
  async function openHistory(record) {
    setHistoryStudent(record);
    setHistoryLoading(true);
    const { data } = await supabase
      .from('payments')
      .select('*')
      .eq('student_record_id', record.students?.student_record_id)
      .order('payment_date', { ascending: false });
    setHistoryRecords(data ?? []);
    setHistoryLoading(false);
  }

  /* export CSV */
  function exportCSV() {
    const headers = ['Student ID', 'Name', 'Grade', 'Total Fees', 'Amount Paid', 'Balance', 'Status'];
    const rows = records.map(r => [
      r.students?.student_record_id,
      `${r.students?.first_name} ${r.students?.last_name}`,
      r.students?.grade_level,
      r.total_fees, r.amount_paid, r.balance, r.status,
    ]);
    const csv = [headers, ...rows].map(row => row.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'finance.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  function handleQuickAction(action) {
    if (action === 'record')  { setPayForm(EMPTY_PAYMENT_FORM); setFormError(''); setModalOpen(true); }
    if (action === 'export')  exportCSV();
    if (action === 'report')  alert('Financial report generation coming soon.');
    if (action === 'history') alert('Select a student row to view payment history.');
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <>
      {/* Header */}
      <div className="top-header">
        <h1><IcoFinance /> Finance Management</h1>
        <span className="date-time">{dateStr}</span>
      </div>

      <div className="content-area">

        {/* Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><IcoFinance /></div>
            <div className="stat-info">
              <div className="stat-number" style={{ fontSize: '24px' }}>{peso(stats.revenue)}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon"><IcoCollected /></div>
            <div className="stat-info">
              <div className="stat-number" style={{ fontSize: '24px' }}>{peso(stats.collected)}</div>
              <div className="stat-label">Collected Amount</div>
            </div>
          </div>
          <div className="stat-card gold">
            <div className="stat-icon"><IcoBalance /></div>
            <div className="stat-info">
              <div className="stat-number" style={{ fontSize: '24px' }}>{peso(stats.balance)}</div>
              <div className="stat-label">Outstanding Balance</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon"><IcoPaid /></div>
            <div className="stat-info">
              <div className="stat-number">{stats.fullPaid}</div>
              <div className="stat-label">Fully Paid Students</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoBolt /> Quick Actions</h2>
          </div>
          <div className="quick-actions-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {QUICK_ACTIONS.map(({ label, Icon, action }) => (
              <button key={label} className="quick-action-card" onClick={() => handleQuickAction(action)}>
                <div className="action-icon"><Icon /></div>
                <span className="action-label">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoFilter /> Filter Students</h2>
          </div>
          <div className="form-grid">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Grade Level</label>
              <select value={gradeFilter} onChange={e => setGrade(e.target.value)}>
                <option value="">All Grades</option>
                {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Payment Status</label>
              <select value={statusFilter} onChange={e => setStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Search Student</label>
              <input placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Financial Records Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoList /> Student Financial Records</h2>
            <button className="btn btn-secondary btn-sm" onClick={exportCSV}>
              <IcoExport /> Export
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Grade</th>
                  <th>Total Fees</th>
                  <th>Amount Paid</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="empty-message">Loading...</td></tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <IcoFinance />
                        <p style={{ color: '#888', marginTop: '10px', fontStyle: 'italic' }}>No financial records found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  records.map(r => (
                    <tr key={r.finance_id}>
                      <td>{r.students?.student_record_id}</td>
                      <td>{r.students?.first_name} {r.students?.last_name}</td>
                      <td>{r.students?.grade_level ? `Grade ${r.students.grade_level}` : '—'}</td>
                      <td>{peso(r.total_fees)}</td>
                      <td>{peso(r.amount_paid)}</td>
                      <td>{peso(r.balance)}</td>
                      <td><PaymentBadge status={r.status} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              setPayForm({ ...EMPTY_PAYMENT_FORM, student_record_id: String(r.students?.student_record_id ?? '') });
                              setFormError('');
                              setModalOpen(true);
                            }}
                            title="Record Payment"
                          >
                            <IcoRecordPayment />
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => openHistory(r)} title="History">
                            <IcoHistory />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fee Structure */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><IcoFeeStructure /> Fee Structure (SY 2025-2026)</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FeeCard
              icon={<IcoElementary />}
              title="Elementary (Grades 1-6)"
              rows={[
                { label: 'Tuition Fee:', value: '₱15,000' },
                { label: 'Miscellaneous:', value: '₱3,500' },
              ]}
              total="₱18,500"
            />
            <FeeCard
              icon={<IcoJuniorHigh />}
              title="Junior High (Grades 7-10)"
              rows={[
                { label: 'Tuition Fee:', value: '₱18,000' },
                { label: 'Miscellaneous:', value: '₱4,000' },
              ]}
              total="₱22,000"
            />
          </div>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IcoFeeStructure /> Note: Fees may be paid in installments. Additional fees for books, uniforms, and other materials are separate.
          </p>
        </div>

      </div>

      {/* ── Record Payment Modal ── */}
      {modalOpen && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoRecordPayment /> Record Payment</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleSavePayment}>
              <div className="modal-body">
                {formError && <p style={{ color: '#dc3545', marginBottom: '12px', fontSize: '14px' }}>{formError}</p>}
                <div className="form-grid">
                  <div className="form-group">
                    <label>Student Record ID *</label>
                    <input
                      type="number"
                      value={payForm.student_record_id}
                      onChange={e => setPayForm(f => ({ ...f, student_record_id: e.target.value }))}
                      placeholder="Numeric student record ID"
                    />
                  </div>
                  <div className="form-group">
                    <label>Amount (₱) *</label>
                    <input type="number" min="0" step="0.01" value={payForm.amount} onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
                  </div>
                  <div className="form-group">
                    <label>Payment Date *</label>
                    <input type="date" value={payForm.payment_date} onChange={e => setPayForm(f => ({ ...f, payment_date: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select value={payForm.payment_method} onChange={e => setPayForm(f => ({ ...f, payment_method: e.target.value }))}>
                      <option value="Cash">Cash</option>
                      <option value="GCash">GCash</option>
                      <option value="PayMaya">PayMaya</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Check">Check</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Payment For</label>
                    <select value={payForm.payment_for} onChange={e => setPayForm(f => ({ ...f, payment_for: e.target.value }))}>
                      <option value="Tuition Fee">Tuition Fee</option>
                      <option value="Miscellaneous Fee">Miscellaneous Fee</option>
                      <option value="Books">Books</option>
                      <option value="Uniform">Uniform</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Reference Number</label>
                    <input value={payForm.reference_number} onChange={e => setPayForm(f => ({ ...f, reference_number: e.target.value }))} placeholder="Optional" />
                  </div>
                  <div className="form-group">
                    <label>Remarks</label>
                    <input value={payForm.remarks} onChange={e => setPayForm(f => ({ ...f, remarks: e.target.value }))} placeholder="Optional remarks" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Payment History Modal ── */}
      {historyStudent && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setHistoryStudent(null); }}>
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <IcoHistory /> Payment History — {historyStudent.students?.first_name} {historyStudent.students?.last_name}
              </h3>
              <button className="modal-close" onClick={() => setHistoryStudent(null)}><IcoClose /></button>
            </div>
            <div className="modal-body">
              {historyLoading ? (
                <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
              ) : historyRecords.length === 0 ? (
                <p className="empty-message">No payment history found.</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Payment For</th>
                      <th>Reference</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyRecords.map(p => (
                      <tr key={p.payment_id}>
                        <td>{p.payment_date ? new Date(p.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                        <td>{peso(p.amount)}</td>
                        <td>{p.payment_method ?? '—'}</td>
                        <td>{p.payment_for ?? '—'}</td>
                        <td>{p.reference_number ?? '—'}</td>
                        <td>{p.remarks ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setHistoryStudent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Sub-components ── */
function PaymentBadge({ status }) {
  const s = (status ?? '').toLowerCase();
  const cls =
    s === 'paid'    ? 'badge badge-success' :
    s === 'partial' ? 'badge badge-warning' :
                      'badge badge-danger';
  const label = s === 'paid' ? 'Paid' : s === 'partial' ? 'Partial' : 'Unpaid';
  return <span className={cls}>{label}</span>;
}

function FeeCard({ icon, title, rows, total }) {
  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '10px', padding: '20px', backgroundColor: '#fafafa' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#8B0000', marginBottom: '14px', fontSize: '15px' }}>
        {icon} {title}
      </div>
      {rows.map(row => (
        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px', color: '#444', borderBottom: '1px solid #eee' }}>
          <span>{row.label}</span>
          <span style={{ color: '#8B0000', fontWeight: '600' }}>{row.value}</span>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontWeight: '700', fontSize: '15px', color: '#8B0000' }}>
        <span>Total per Semester:</span>
        <span>{total}</span>
      </div>
    </div>
  );
}
