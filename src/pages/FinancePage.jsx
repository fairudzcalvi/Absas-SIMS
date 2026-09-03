import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

/* ── SVG Icons ─────────────────────────────────────────── */
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
function IcoRecordPayment() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
function IcoReceipt() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
      <line x1="8" y1="7" x2="16" y2="7" /><line x1="8" y1="11" x2="16" y2="11" /><line x1="8" y1="15" x2="12" y2="15" />
    </svg>
  );
}
function IcoSOA() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function IcoExport() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function IcoHistory() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4" />
      <polyline points="12 7 12 12 15 15" />
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
function IcoClose() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── Standard DepEd & ABSAS Fee Matrix ──────────────────── */
const DEFAULT_FEE_MATRIX = {
  elementary: { tuition: 15000, misc: 3500, label: 'Elementary (Grades 1–6)' },
  juniorHigh: { tuition: 18000, misc: 4000, label: 'Junior High (Grades 7–10)' },
  seniorHigh: { tuition: 22500, misc: 5000, label: 'Senior High (Grades 11–12)' },
};

function getBaseFees(gradeLevel) {
  const g = Number(gradeLevel || 1);
  if (g >= 11) return { tuition: 22500, misc: 5000, total: 27500, category: 'Senior High School' };
  if (g >= 7)  return { tuition: 18000, misc: 4000, total: 22000, category: 'Junior High School' };
  return { tuition: 15000, misc: 3500, total: 18500, category: 'Elementary Department' };
}

const GRADE_OPTIONS = [
  { value: 1,  label: 'Grade 1' },
  { value: 2,  label: 'Grade 2' },
  { value: 3,  label: 'Grade 3' },
  { value: 4,  label: 'Grade 4' },
  { value: 5,  label: 'Grade 5' },
  { value: 6,  label: 'Grade 6' },
  { value: 7,  label: 'Grade 7' },
  { value: 8,  label: 'Grade 8' },
  { value: 9,  label: 'Grade 9' },
  { value: 10, label: 'Grade 10' },
  { value: 11, label: 'Grade 11' },
  { value: 12, label: 'Grade 12' },
];

function peso(n) {
  return '₱' + Number(n ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ── Main Finance Page ─────────────────────────────────── */
export default function FinancePage() {
  const { supabase, activeSchoolYear, activeQuarter } = useAuth();

  const [students, setStudents]         = useState([]);
  const [finances, setFinances]         = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [strands, setStrands]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [dbNotice, setDbNotice]         = useState('');

  // Filters
  const [gradeFilter, setGradeFilter]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch]             = useState('');

  // Record Payment Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent]   = useState(null);
  const [payForm, setPayForm] = useState({
    amount:           '',
    payment_date:     new Date().toISOString().split('T')[0],
    payment_method:   'Cash',
    payment_for:      'Tuition Fee',
    or_number:        `OR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    reference_number: '',
    remarks:          '',
  });
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentError, setPaymentError]   = useState('');

  // Modals for Printing
  const [viewReceipt, setViewReceipt] = useState(null); // { payment, student, finance }
  const [viewSOA, setViewSOA]         = useState(null);     // { student, finance, payments }
  const [viewHistory, setViewHistory] = useState(null); // { student, payments }
  const [historyLoading, setHistoryLoading] = useState(false);

  /* Fetch all financial and student records */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setDbNotice('');

    try {
      // 1. Fetch Students
      const { data: stuData } = await supabase
        .from('students')
        .select('*')
        .order('last_name', { ascending: true });
      setStudents(stuData ?? []);

      // 2. Fetch Scholarships
      const { data: schData } = await supabase
        .from('scholarships')
        .select('*');
      setScholarships(schData ?? []);

      // 3. Fetch Strands
      const { data: strData } = await supabase
        .from('shs_strands')
        .select('*');
      setStrands(strData ?? []);

      // 4. Fetch Student Finances
      const { data: finData, error: finErr } = await supabase
        .from('student_finances')
        .select('*');

      if (finErr) {
        setDbNotice(finErr.message);
        setFinances([]);
      } else {
        setFinances(finData ?? []);
      }

    } catch (err) {
      setDbNotice(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* Build unified student account ledger rows */
  const studentAccounts = students.map(student => {
    const fin = finances.find(f => f.student_record_id === student.student_record_id);
    const sch = scholarships.find(s => s.id === (fin?.scholarship_id || student.scholarship_id));
    const str = strands.find(st => st.id === student.current_strand_id);

    const base = getBaseFees(student.grade_level);
    const tuition = fin?.tuition_fee ? Number(fin.tuition_fee) : base.tuition;
    const misc = fin?.miscellaneous_fee ? Number(fin.miscellaneous_fee) : base.misc;
    const grossTotal = tuition + misc;

    // Calculate discount
    let discount = Number(fin?.discount_amount ?? 0);
    if (!discount && sch) {
      if (sch.discount_type === 'percentage') {
        discount = (tuition * Number(sch.discount_value)) / 100;
      } else {
        discount = Number(sch.discount_value);
      }
    }

    const netAssessment = Math.max(0, grossTotal - discount);
    const amountPaid = Number(fin?.amount_paid ?? 0);
    const balance = Math.max(0, netAssessment - amountPaid);

    let status = 'Unpaid';
    if (amountPaid >= netAssessment && netAssessment > 0) {
      status = 'Paid';
    } else if (amountPaid > 0) {
      status = 'Partial';
    }

    return {
      student,
      finance_id: fin?.finance_id || null,
      tuition,
      misc,
      grossTotal,
      discount,
      netAssessment,
      amountPaid,
      balance,
      status,
      scholarship: sch,
      strand: str,
    };
  });

  /* Filtered list */
  const filteredAccounts = studentAccounts.filter(acc => {
    const s = acc.student;
    if (gradeFilter && Number(s.grade_level) !== Number(gradeFilter)) return false;
    if (statusFilter && acc.status.toLowerCase() !== statusFilter.toLowerCase()) return false;

    if (search) {
      const q = search.toLowerCase();
      const name = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase();
      const stuId = (s.student_id || '').toLowerCase();
      const lrn = (s.lrn_id || '').toLowerCase();
      if (!name.includes(q) && !stuId.includes(q) && !lrn.includes(q)) return false;
    }

    return true;
  });

  /* Financial Metrics */
  const totalRevenue   = studentAccounts.reduce((sum, a) => sum + a.netAssessment, 0);
  const totalCollected = studentAccounts.reduce((sum, a) => sum + a.amountPaid, 0);
  const totalReceivable = studentAccounts.reduce((sum, a) => sum + a.balance, 0);
  const fullyPaidCount = studentAccounts.filter(a => a.status === 'Paid').length;

  /* Open Record Payment Modal */
  function openPaymentModal(acc = null) {
    const targetStudent = acc ? acc.student : students[0] || null;
    setSelectedStudent(targetStudent);
    setPayForm({
      amount:           acc && acc.balance > 0 ? String(acc.balance) : '',
      payment_date:     new Date().toISOString().split('T')[0],
      payment_method:   'Cash',
      payment_for:      'Tuition Fee',
      or_number:        `OR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      reference_number: '',
      remarks:          '',
    });
    setPaymentError('');
    setPaymentModalOpen(true);
  }

  /* Submit Payment and generate Official Receipt */
  async function handleSavePayment(e) {
    e.preventDefault();
    if (!selectedStudent || !payForm.amount || Number(payForm.amount) <= 0) {
      setPaymentError('Please select a student and enter a valid payment amount.');
      return;
    }

    setSavingPayment(true);
    setPaymentError('');

    try {
      const studentId = selectedStudent.student_record_id;
      const paymentAmount = Number(payForm.amount);
      const acc = studentAccounts.find(a => a.student.student_record_id === studentId);

      const newAmountPaid = (acc ? acc.amountPaid : 0) + paymentAmount;
      const netAssessment = acc ? acc.netAssessment : paymentAmount;
      const newStatus = newAmountPaid >= netAssessment ? 'paid' : newAmountPaid > 0 ? 'partial' : 'unpaid';

      // 1. Update or insert into student_finances
      const existingFin = finances.find(f => f.student_record_id === studentId);
      if (existingFin) {
        await supabase
          .from('student_finances')
          .update({
            amount_paid: newAmountPaid,
            status:      newStatus,
          })
          .eq('finance_id', existingFin.finance_id);
      } else {
        const base = getBaseFees(selectedStudent.grade_level);
        await supabase
          .from('student_finances')
          .insert([{
            student_record_id: studentId,
            tuition_fee:       base.tuition,
            miscellaneous_fee: base.misc,
            amount_paid:       paymentAmount,
            status:            newStatus,
            school_year:       activeSchoolYear?.year_label || '2026-2027',
          }]);
      }

      // 2. Insert into payments transaction log
      const { data: createdPayment, error: payErr } = await supabase
        .from('payments')
        .insert([{
          student_record_id: studentId,
          amount:            paymentAmount,
          payment_date:      payForm.payment_date,
          payment_method:    payForm.payment_method,
          payment_for:       payForm.payment_for,
          or_number:         payForm.or_number,
          reference_number:  payForm.reference_number || null,
          remarks:           payForm.remarks || null,
          school_year_id:    activeSchoolYear?.id || null,
        }])
        .select()
        .single();

      if (payErr) throw payErr;

      setPaymentModalOpen(false);
      fetchData();

      // Open Official Receipt Slip
      setViewReceipt({
        payment: createdPayment,
        student: selectedStudent,
        finance: acc,
      });

    } catch (err) {
      setPaymentError(err.message || 'Error recording payment.');
    } finally {
      setSavingPayment(false);
    }
  }

  /* Open Payment History */
  async function openHistoryModal(acc) {
    setViewHistory({ student: acc.student, payments: [], finance: acc });
    setHistoryLoading(true);

    const { data } = await supabase
      .from('payments')
      .select('*')
      .eq('student_record_id', acc.student.student_record_id)
      .order('payment_date', { ascending: false });

    setViewHistory({ student: acc.student, payments: data ?? [], finance: acc });
    setHistoryLoading(false);
  }

  /* Open Statement of Account (SOA) */
  async function openSOAModal(acc) {
    const { data } = await supabase
      .from('payments')
      .select('*')
      .eq('student_record_id', acc.student.student_record_id)
      .order('payment_date', { ascending: false });

    setViewSOA({
      student: acc.student,
      finance: acc,
      payments: data ?? [],
    });
  }

  /* Export CSV */
  function exportCSV() {
    const headers = ['DepEd LRN', 'Student Name', 'Grade & Strand', 'Scholarship', 'Gross Fees', 'Discount', 'Net Assessment', 'Amount Paid', 'Balance', 'Status'];
    const rows = filteredAccounts.map(a => [
      a.student.lrn_id || a.student.student_id || '—',
      `${a.student.first_name} ${a.student.last_name}`,
      `Grade ${a.student.grade_level} ${a.strand ? `(${a.strand.strand_code})` : ''}`,
      a.scholarship ? a.scholarship.name : 'Regular',
      a.grossTotal,
      a.discount,
      a.netAssessment,
      a.amountPaid,
      a.balance,
      a.status,
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `student_finance_summary_${activeSchoolYear?.year_label || 'active'}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Top Header */}
      <div className="top-header">
        <h1><IcoFinance /> Finance, Billing &amp; Official Receipts</h1>
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
            <span>{activeSchoolYear?.year_label ? `S.Y. ${activeSchoolYear.year_label}` : 'S.Y. 2026-2027'}</span>
            {activeQuarter && (
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontSize: '11px' }}>
                {activeQuarter.quarter_name}
              </span>
            )}
          </div>
          <span className="date-time">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
        </div>
      </div>

      <div className="content-area">
        {/* Notice */}
        {dbNotice && (
          <div style={{ background: '#fff3cd', border: '1px solid #ffeeba', color: '#856404', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
            <strong>Notice:</strong> {dbNotice}
          </div>
        )}

        {/* Financial Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><IcoFinance /></div>
            <div className="stat-info">
              <div className="stat-number" style={{ fontSize: '22px' }}>{peso(totalRevenue)}</div>
              <div className="stat-label">Total Assessed Revenue</div>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon"><IcoCollected /></div>
            <div className="stat-info">
              <div className="stat-number" style={{ fontSize: '22px' }}>{peso(totalCollected)}</div>
              <div className="stat-label">Collected Collections</div>
            </div>
          </div>
          <div className="stat-card gold">
            <div className="stat-icon"><IcoBalance /></div>
            <div className="stat-info">
              <div className="stat-number" style={{ fontSize: '22px' }}>{peso(totalReceivable)}</div>
              <div className="stat-label">Outstanding Balance</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon"><IcoPaid /></div>
            <div className="stat-info">
              <div className="stat-number">{fullyPaidCount} / {studentAccounts.length}</div>
              <div className="stat-label">Fully Paid Students</div>
            </div>
          </div>
        </div>

        {/* Action Bar & Filters */}
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary" onClick={() => openPaymentModal(null)}>
                <IcoRecordPayment /> + Record Payment &amp; Issue Receipt
              </button>
            </div>

            <button className="btn btn-secondary btn-sm" onClick={exportCSV}>
              <IcoExport /> Export Financial Report (CSV)
            </button>
          </div>

          <div className="form-grid" style={{ alignItems: 'flex-end', marginTop: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Grade Level</label>
              <select className="filter-select" style={{ width: '100%' }} value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}>
                <option value="">All Grade Levels (1–12)</option>
                {GRADE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Payment Status</label>
              <select className="filter-select" style={{ width: '100%' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="Paid">Fully Paid</option>
                <option value="Partial">Partial Payment</option>
                <option value="Unpaid">Unpaid / Zero Payment</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Search Student Account</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  className="search-input"
                  style={{ width: '100%', paddingRight: search ? '32px' : '10px' }}
                  placeholder="Student name, ID, or LRN..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      background: '#e9ecef',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: '1',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#8B0000'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#e9ecef'; e.currentTarget.style.color = '#666'; }}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Student Accounts Table */}
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>DepEd LRN</th>
                  <th>Student Name</th>
                  <th>Grade &amp; Strand</th>
                  <th>Scholarship / Voucher</th>
                  <th>Net Assessment</th>
                  <th>Amount Paid</th>
                  <th>Remaining Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="empty-message">Loading financial records...</td></tr>
                ) : filteredAccounts.length === 0 ? (
                  <tr><td colSpan={9} className="empty-message">No student billing records found.</td></tr>
                ) : (
                  filteredAccounts.map(acc => (
                    <tr key={acc.student.student_record_id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: '700', color: '#8B0000' }}>
                        {acc.student.lrn_id || acc.student.student_id || '—'}
                      </td>
                      <td style={{ fontWeight: '600' }}>{acc.student.first_name} {acc.student.last_name}</td>
                      <td>
                        Grade {acc.student.grade_level} {acc.strand ? `(${acc.strand.strand_code})` : ''}
                      </td>
                      <td>
                        {acc.scholarship ? (
                          <span style={styles.badgeScholarship}>
                            {acc.scholarship.code} ({acc.scholarship.discount_type === 'percentage' ? `${acc.scholarship.discount_value}%` : `₱${acc.scholarship.discount_value}`})
                          </span>
                        ) : (
                          <span style={{ color: '#888', fontSize: '12px' }}>Regular</span>
                        )}
                      </td>
                      <td style={{ fontWeight: '600' }}>{peso(acc.netAssessment)}</td>
                      <td style={{ color: '#137333', fontWeight: '600' }}>{peso(acc.amountPaid)}</td>
                      <td style={{ color: acc.balance > 0 ? '#b06000' : '#137333', fontWeight: '700' }}>
                        {peso(acc.balance)}
                      </td>
                      <td>
                        <span style={
                          acc.status === 'Paid' ? styles.badgePaid :
                          acc.status === 'Partial' ? styles.badgePartial : styles.badgeUnpaid
                        }>
                          {acc.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => openPaymentModal(acc)}
                            title="Pay & Issue Receipt"
                          >
                            <IcoRecordPayment /> Pay
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => openSOAModal(acc)}
                            title="Statement of Account (SOA)"
                          >
                            <IcoSOA /> SOA
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => openHistoryModal(acc)}
                            title="Payment History Ledger"
                          >
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

        {/* Academic Fee Schedule Structure */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🏫 DepEd &amp; ABSAS Fee Matrix Schedule (S.Y. {activeSchoolYear?.year_label || '2026-2027'})</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={styles.feeBox}>
              <h4 style={{ color: '#8B0000', margin: '0 0 10px 0' }}>Elementary (Grades 1–6)</h4>
              <div style={styles.feeRow}><span>Base Tuition Fee:</span> <strong>₱15,000.00</strong></div>
              <div style={styles.feeRow}><span>Miscellaneous Fees:</span> <strong>₱3,500.00</strong></div>
              <div style={{ ...styles.feeRow, borderTop: '2px solid #8B0000', marginTop: '8px', paddingTop: '8px', color: '#8B0000', fontWeight: 'bold' }}>
                <span>Annual Total Assessment:</span> <span>₱18,500.00</span>
              </div>
            </div>

            <div style={styles.feeBox}>
              <h4 style={{ color: '#8B0000', margin: '0 0 10px 0' }}>Junior High (Grades 7–10)</h4>
              <div style={styles.feeRow}><span>Base Tuition Fee:</span> <strong>₱18,000.00</strong></div>
              <div style={styles.feeRow}><span>Miscellaneous &amp; Lab:</span> <strong>₱4,000.00</strong></div>
              <div style={{ ...styles.feeRow, borderTop: '2px solid #8B0000', marginTop: '8px', paddingTop: '8px', color: '#8B0000', fontWeight: 'bold' }}>
                <span>Annual Total Assessment:</span> <span>₱22,000.00</span>
              </div>
            </div>

            <div style={styles.feeBox}>
              <h4 style={{ color: '#8B0000', margin: '0 0 10px 0' }}>Senior High (Grades 11–12)</h4>
              <div style={styles.feeRow}><span>SHS Specialized Tuition:</span> <strong>₱22,500.00</strong></div>
              <div style={styles.feeRow}><span>Strand &amp; Workshop Fees:</span> <strong>₱5,000.00</strong></div>
              <div style={{ ...styles.feeRow, borderTop: '2px solid #8B0000', marginTop: '8px', paddingTop: '8px', color: '#8B0000', fontWeight: 'bold' }}>
                <span>Annual Total Assessment:</span> <span>₱27,500.00</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Record Payment Modal ── */}
      {paymentModalOpen && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setPaymentModalOpen(false); }}>
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoRecordPayment /> Record Student Payment &amp; Issue Receipt</h3>
              <button className="modal-close" onClick={() => setPaymentModalOpen(false)}><IcoClose /></button>
            </div>
            <form onSubmit={handleSavePayment}>
              <div className="modal-body">
                {paymentError && (
                  <div style={{ color: '#dc3545', background: '#f8d7da', padding: '10px 14px', borderRadius: '6px', marginBottom: '14px', fontSize: '13px' }}>
                    {paymentError}
                  </div>
                )}

                {/* Student Selection */}
                <div className="form-group">
                  <label>Select Student *</label>
                  <select
                    value={selectedStudent?.student_record_id || ''}
                    onChange={e => {
                      const stu = students.find(s => String(s.student_record_id) === e.target.value);
                      setSelectedStudent(stu || null);
                      const acc = studentAccounts.find(a => String(a.student.student_record_id) === e.target.value);
                      if (acc) {
                        setPayForm(f => ({ ...f, amount: acc.balance > 0 ? String(acc.balance) : '' }));
                      }
                    }}
                    required
                  >
                    <option value="">Choose a student...</option>
                    {students.map(s => {
                      const acc = studentAccounts.find(a => a.student.student_record_id === s.student_record_id);
                      return (
                        <option key={s.student_record_id} value={s.student_record_id}>
                          {s.last_name}, {s.first_name} (ID: {s.student_id}) — Gr {s.grade_level} | Bal: {peso(acc?.balance ?? 0)}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Official Receipt (OR) # *</label>
                    <input
                      value={payForm.or_number}
                      onChange={e => setPayForm(f => ({ ...f, or_number: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Payment Amount (₱) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={payForm.amount}
                      onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Payment Date *</label>
                    <input
                      type="date"
                      value={payForm.payment_date}
                      onChange={e => setPayForm(f => ({ ...f, payment_date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select value={payForm.payment_method} onChange={e => setPayForm(f => ({ ...f, payment_method: e.target.value }))}>
                      <option value="Cash">Cash</option>
                      <option value="GCash">GCash</option>
                      <option value="PayMaya">PayMaya</option>
                      <option value="Bank Transfer">Bank Transfer (BDO/BPI)</option>
                      <option value="Check">Check</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Payment Allocation</label>
                    <select value={payForm.payment_for} onChange={e => setPayForm(f => ({ ...f, payment_for: e.target.value }))}>
                      <option value="Tuition Fee">Tuition Fee</option>
                      <option value="Downpayment / Enrollment Fee">Downpayment / Enrollment Fee</option>
                      <option value="Prelims Installment">Prelims Installment</option>
                      <option value="Midterms Installment">Midterms Installment</option>
                      <option value="Semi-Finals Installment">Semi-Finals Installment</option>
                      <option value="Finals / Full Settlement">Finals / Full Settlement</option>
                      <option value="Miscellaneous Fee">Miscellaneous Fee</option>
                      <option value="Books / Uniforms">Books / Uniforms</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Transaction / Ref Number</label>
                    <input
                      value={payForm.reference_number}
                      onChange={e => setPayForm(f => ({ ...f, reference_number: e.target.value }))}
                      placeholder="Optional (e.g. GCash Ref #)"
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Cashier Remarks</label>
                    <input
                      value={payForm.remarks}
                      onChange={e => setPayForm(f => ({ ...f, remarks: e.target.value }))}
                      placeholder="Optional payment notes"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setPaymentModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={savingPayment}>
                  {savingPayment ? 'Processing Payment...' : '✓ Confirm & Print Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Official Receipt (OR) Printable Slip Modal ── */}
      {viewReceipt && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setViewReceipt(null); }}>
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoReceipt /> Official Receipt — {viewReceipt.payment?.or_number}</h3>
              <button className="modal-close" onClick={() => setViewReceipt(null)}><IcoClose /></button>
            </div>
            <div className="modal-body" style={{ padding: '24px', background: '#fff', border: '2px solid #8B0000', borderRadius: '8px' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #8B0000', paddingBottom: '12px', marginBottom: '14px' }}>
                <h3 style={{ color: '#8B0000', margin: '0 0 2px 0', fontSize: '18px' }}>ANGELICUM BIRMINGHAM SCHOOL OF ACADEMIC STUDIES</h3>
                <div style={{ fontSize: '12px', color: '#555' }}>San Pedro, Laguna • Official Cashier Receipt</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#8B0000', marginTop: '6px' }}>
                  OFFICIAL RECEIPT NO: {viewReceipt.payment?.or_number}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', lineHeight: '1.6' }}>
                <div><strong>Date:</strong> {viewReceipt.payment?.payment_date}</div>
                <div><strong>Payment Method:</strong> {viewReceipt.payment?.payment_method}</div>
                <div><strong>DepEd LRN:</strong> <span style={{ fontFamily: 'monospace' }}>{viewReceipt.student?.lrn_id || '—'}</span></div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>Received From:</strong> {viewReceipt.student?.first_name} {viewReceipt.student?.last_name} (Grade {viewReceipt.student?.grade_level})
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>Payment For:</strong> {viewReceipt.payment?.payment_for}
                </div>
                {viewReceipt.payment?.reference_number && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Ref #:</strong> {viewReceipt.payment?.reference_number}
                  </div>
                )}
              </div>

              <div style={{ background: '#f8f9fa', padding: '12px 16px', borderRadius: '6px', margin: '14px 0', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', color: '#8B0000' }}>
                  <span>AMOUNT PAID:</span>
                  <span>{peso(viewReceipt.payment?.amount)}</span>
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px dashed #ccc', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#555' }}>
                <div>Issued by: Cashier / Finance Officer</div>
                <div>Status: <strong style={{ color: '#137333' }}>CONFIRMED &amp; POSTED</strong></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewReceipt(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <IcoPrint /> Print Official Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Statement of Account (SOA) Modal ── */}
      {viewSOA && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setViewSOA(null); }}>
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><IcoSOA /> Statement of Account (SOA)</h3>
              <button className="modal-close" onClick={() => setViewSOA(null)}><IcoClose /></button>
            </div>
            <div className="modal-body" style={{ padding: '24px', background: '#fff', border: '2px solid #8B0000', borderRadius: '8px' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #8B0000', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ color: '#8B0000', margin: '0 0 2px 0', fontSize: '18px' }}>ANGELICUM BIRMINGHAM SCHOOL OF ACADEMIC STUDIES</h3>
                <div style={{ fontSize: '12px', color: '#555' }}>OFFICIAL STATEMENT OF ACCOUNT</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#8B0000', marginTop: '4px' }}>
                  ACADEMIC YEAR {activeSchoolYear?.year_label || '2026-2027'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', marginBottom: '16px' }}>
                <div><strong>Student Name:</strong> {viewSOA.student?.first_name} {viewSOA.student?.last_name}</div>
                <div><strong>DepEd LRN:</strong> <span style={{ fontFamily: 'monospace' }}>{viewSOA.student?.lrn_id || '—'}</span></div>
                <div><strong>Grade &amp; Track:</strong> Grade {viewSOA.student?.grade_level} {viewSOA.finance?.strand ? `(${viewSOA.finance.strand.strand_name})` : ''}</div>
                <div><strong>Date Generated:</strong> {new Date().toLocaleDateString()}</div>
              </div>

              {/* Assessment Breakdown */}
              <table className="data-table" style={{ marginBottom: '16px' }}>
                <thead>
                  <tr>
                    <th>Fee Description</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Base Tuition Assessment</td><td style={{ textAlign: 'right' }}>{peso(viewSOA.finance?.tuition)}</td></tr>
                  <tr><td>Miscellaneous &amp; Laboratory Fees</td><td style={{ textAlign: 'right' }}>{peso(viewSOA.finance?.misc)}</td></tr>
                  {viewSOA.finance?.discount > 0 && (
                    <tr style={{ color: '#137333', fontWeight: 'bold' }}>
                      <td>Scholarship / Voucher Grant ({viewSOA.finance?.scholarship?.name})</td>
                      <td style={{ textAlign: 'right' }}>- {peso(viewSOA.finance?.discount)}</td>
                    </tr>
                  )}
                  <tr style={{ fontWeight: 'bold', background: '#f8f9fa' }}>
                    <td>NET TOTAL ASSESSMENT</td>
                    <td style={{ textAlign: 'right', color: '#8B0000' }}>{peso(viewSOA.finance?.netAssessment)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Payment History inside SOA */}
              <h5 style={{ margin: '0 0 8px 0', color: '#8B0000' }}>Payment Transactions Log</h5>
              {viewSOA.payments.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>No payments recorded yet.</p>
              ) : (
                <table className="data-table" style={{ fontSize: '12px', marginBottom: '16px' }}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>OR #</th>
                      <th>Method</th>
                      <th>Payment For</th>
                      <th style={{ textAlign: 'right' }}>Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewSOA.payments.map(p => (
                      <tr key={p.payment_id}>
                        <td>{p.payment_date}</td>
                        <td>{p.or_number || '—'}</td>
                        <td>{p.payment_method}</td>
                        <td>{p.payment_for}</td>
                        <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#137333' }}>{peso(p.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div style={{ background: '#f8f9fa', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#555' }}>Total Amount Paid: <strong>{peso(viewSOA.finance?.amountPaid)}</strong></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#555' }}>Outstanding Balance:</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: viewSOA.finance?.balance > 0 ? '#8B0000' : '#137333' }}>
                    {peso(viewSOA.finance?.balance)}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewSOA(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <IcoPrint /> Print Statement of Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Payment History Ledger Modal ── */}
      {viewHistory && (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setViewHistory(null); }}>
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <IcoHistory /> Payment Ledger — {viewHistory.student?.first_name} {viewHistory.student?.last_name}
              </h3>
              <button className="modal-close" onClick={() => setViewHistory(null)}><IcoClose /></button>
            </div>
            <div className="modal-body">
              {historyLoading ? (
                <p style={{ textAlign: 'center', color: '#888' }}>Loading payments...</p>
              ) : viewHistory.payments.length === 0 ? (
                <p className="empty-message">No payment history recorded for this student.</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>OR #</th>
                      <th>Payment Date</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Payment For</th>
                      <th>Reference #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewHistory.payments.map(p => (
                      <tr key={p.payment_id}>
                        <td style={{ fontWeight: 'bold', color: '#8B0000' }}>{p.or_number || '—'}</td>
                        <td>{p.payment_date}</td>
                        <td style={{ color: '#137333', fontWeight: 'bold' }}>{peso(p.amount)}</td>
                        <td>{p.payment_method}</td>
                        <td>{p.payment_for}</td>
                        <td>{p.reference_number || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewHistory(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Inline Styles ── */
const styles = {
  badgePaid: {
    display: 'inline-block',
    background: '#e6f4ea',
    color: '#137333',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
  },
  badgePartial: {
    display: 'inline-block',
    background: '#fef7e0',
    color: '#b06000',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
  },
  badgeUnpaid: {
    display: 'inline-block',
    background: '#fce8e6',
    color: '#c5221f',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
  },
  badgeScholarship: {
    display: 'inline-block',
    background: '#e6f4ea',
    color: '#0d652d',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
  },
  feeBox: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    background: '#f8f9fa',
  },
  feeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#444',
    padding: '4px 0',
  },
};
