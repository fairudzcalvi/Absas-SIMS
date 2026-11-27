/**
 * Shared finance rules:
 * - Strict No-Refund Policy disclaimer
 * - Scholarship / discount stacking (e.g., ESC Voucher + Sibling Discount)
 * - 10-month transferee tuition proration
 * - Monthly balance breakdown & financial hold check for overdue balances
 */

export const SCHOOL_YEAR_MONTHS = 10;

export const NO_REFUND_DISCLAIMER =
  'STRICT NO-REFUND POLICY: All tuition, miscellaneous, and school fees paid to A.B. Simpson Alliance School, Inc. are strictly NON-REFUNDABLE and NON-TRANSFERABLE under any circumstances, including voluntary withdrawal, transfer, dropping of enrollment, or death of the student.';

/**
 * Computes stacked scholarship/voucher discount from up to two grants
 * (e.g., ESC Voucher + Sibling Discount).
 * Fixed grants (like ESC ₱9,000) apply first, then percentage grants (like Sibling 10%)
 * apply to remaining tuition (or base tuition if no fixed grant), capped at grossTotal.
 */
export function calculateStackedDiscount({
  tuition = 0,
  grossTotal = 0,
  primaryScholarship = null,
  secondaryScholarship = null,
}) {
  const grants = [primaryScholarship, secondaryScholarship].filter(Boolean);
  // Deduplicate if the same grant id was picked twice
  const uniqueGrants = [];
  const seenIds = new Set();
  for (const g of grants) {
    const key = String(g.id ?? g.code ?? g.name);
    if (!seenIds.has(key)) {
      seenIds.add(key);
      uniqueGrants.push(g);
    }
  }

  // Apply fixed_amount grants first, then percentage grants
  const ordered = [
    ...uniqueGrants.filter(g => g.discount_type !== 'percentage'),
    ...uniqueGrants.filter(g => g.discount_type === 'percentage'),
  ];

  let remainingTuition = Math.max(0, Number(tuition) || 0);
  let totalDiscount = 0;
  const breakdown = [];

  for (const g of ordered) {
    const rawVal = Number(g.discount_value || 0);
    let amt;
    if (g.discount_type === 'percentage') {
      // If a fixed grant already reduced tuition, apply percentage to remaining tuition
      amt = Math.round(((remainingTuition * rawVal) / 100) * 100) / 100;
      remainingTuition = Math.max(0, remainingTuition - amt);
    } else {
      amt = Math.min(remainingTuition, rawVal);
      remainingTuition = Math.max(0, remainingTuition - amt);
    }
    totalDiscount += amt;
    breakdown.push({
      id: g.id ?? null,
      code: g.code ?? '',
      name: g.name ?? 'Discount',
      type: g.discount_type,
      value: rawVal,
      amount: amt,
    });
  }

  const capped = Math.min(Math.max(0, Number(grossTotal) || 0), totalDiscount);
  return {
    discount: Math.round(capped * 100) / 100,
    breakdown,
  };
}

/** Check if a scholarship is an ESC Grant or Sibling Discount (or generally stackable). */
export function isEscGrant(s) {
  const txt = `${s?.code ?? ''} ${s?.name ?? ''}`.toLowerCase();
  return txt.includes('esc');
}

export function isSiblingDiscount(s) {
  const txt = `${s?.code ?? ''} ${s?.name ?? ''}`.toLowerCase();
  return txt.includes('sibling');
}

/**
 * Prorate 10-month tuition for a transferee who enrolled after `monthsElapsed` months.
 * Example: 3 months elapsed => student attends 7 of 10 months => 70% of base tuition.
 */
export function calculateProratedTuition(baseTuition, monthsElapsed = 0) {
  const elapsed = Math.min(9, Math.max(0, Number(monthsElapsed) || 0));
  const remainingMonths = SCHOOL_YEAR_MONTHS - elapsed;
  const proratedTuition = Math.round(((Number(baseTuition) || 0) * (remainingMonths / SCHOOL_YEAR_MONTHS)) * 100) / 100;
  return {
    monthsElapsed: elapsed,
    remainingMonths,
    proratedTuition,
  };
}

/**
 * Estimate how many months remain in the 10-month school year based on start_date / end_date.
 * Always clamped between 1 and 10.
 */
export function getRemainingSchoolMonths(schoolYear, now = new Date()) {
  if (schoolYear?.start_date && schoolYear?.end_date) {
    const start = new Date(schoolYear.start_date);
    const end = new Date(schoolYear.end_date);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end > start) {
      if (now <= start) return SCHOOL_YEAR_MONTHS;
      if (now >= end) return 1;
      const totalMs = end.getTime() - start.getTime();
      const remMs = end.getTime() - now.getTime();
      const ratio = remMs / totalMs;
      return Math.min(SCHOOL_YEAR_MONTHS, Math.max(1, Math.ceil(ratio * SCHOOL_YEAR_MONTHS)));
    }
  }
  return SCHOOL_YEAR_MONTHS;
}

/** Monthly breakdown: remaining balance divided by remaining months. */
export function calculateMonthlyInstallment(balance, remainingMonths) {
  const bal = Math.max(0, Number(balance) || 0);
  const months = Math.min(SCHOOL_YEAR_MONTHS, Math.max(1, Number(remainingMonths) || 1));
  const perMonth = bal > 0 ? Math.round((bal / months) * 100) / 100 : 0;
  return {
    balance: bal,
    remainingMonths: months,
    perMonth,
  };
}

/**
 * Determine if a student has an overdue balance that restricts grade viewing/printing.
 * - Even if no `student_finances` row exists yet (₱0 paid), a student with netAssessment > 0
 *   is evaluated so completely unpaid students cannot bypass the grade hold while partial payers are blocked.
 * - When `schoolYear` has start/end dates, expected cumulative due is the fairer (lower) of:
 *     (a) quarterly cumulative target ((netAssessment / 4) * qNum), OR
 *     (b) elapsed 10-month pro-rata schedule (adjusted for transferee months_elapsed).
 */
export function evaluateFinancialHold({
  financeRow,
  baseFees = { tuition: 0, misc: 0 },
  primaryScholarship = null,
  secondaryScholarship = null,
  activeQuarterNumber = 1,
  schoolYear = null,
  now = new Date(),
}) {
  const fin = financeRow || null;
  const tuition = fin?.tuition_fee != null && fin?.tuition_fee !== ''
    ? Number(fin.tuition_fee)
    : Number(baseFees?.tuition || 0);
  const misc = fin?.miscellaneous_fee != null && fin?.miscellaneous_fee !== ''
    ? Number(fin.miscellaneous_fee)
    : Number(baseFees?.misc || 0);
  const grossTotal = tuition + misc;

  let discount = Number(fin?.discount_amount ?? 0);
  const hasBreakdown = Array.isArray(fin?.discount_breakdown) && fin.discount_breakdown.length > 0;
  if (primaryScholarship || secondaryScholarship) {
    const stacked = calculateStackedDiscount({ tuition, grossTotal, primaryScholarship, secondaryScholarship });
    if (!discount || (secondaryScholarship && !hasBreakdown && stacked.discount > discount)) {
      discount = stacked.discount;
    }
  }

  const netAssessment = Math.max(0, Math.round((grossTotal - discount) * 100) / 100);
  const amountPaid = Math.round((Number(fin?.amount_paid ?? 0)) * 100) / 100;
  const balance = Math.max(0, Math.round((netAssessment - amountPaid) * 100) / 100);

  if (netAssessment <= 0 || balance <= 0.01) {
    return {
      isOverdue: false,
      overdueAmount: 0,
      expectedCumulativeDue: 0,
      balance: 0,
      netAssessment,
      amountPaid,
    };
  }

  const totalPeriods = Math.max(1, Number(schoolYear?.quarter_count || 4));
  const qNum = Math.min(totalPeriods, Math.max(1, Number(activeQuarterNumber) || 1));
  const quarterlyDue = Math.round(((netAssessment / totalPeriods) * qNum) * 100) / 100;

  let expectedCumulativeDue = quarterlyDue;
  if (schoolYear?.start_date && schoolYear?.end_date) {
    const start = new Date(schoolYear.start_date);
    const end = new Date(schoolYear.end_date);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end > start) {
      if (now >= end) {
        expectedCumulativeDue = netAssessment;
      } else {
        const remCalendar = getRemainingSchoolMonths(schoolYear, now);
        const elapsedCalendar = Math.min(SCHOOL_YEAR_MONTHS, Math.max(1, SCHOOL_YEAR_MONTHS - remCalendar + 1));
        const transferElapsed = Number(fin?.months_elapsed || 0);
        const totalStudentMonths = Math.max(1, Number(fin?.prorated_months || (SCHOOL_YEAR_MONTHS - transferElapsed)));
        const studentMonthsElapsed = Math.max(1, Math.min(totalStudentMonths, elapsedCalendar - transferElapsed));
        const monthlyDue = Math.round(((netAssessment / totalStudentMonths) * studentMonthsElapsed) * 100) / 100;
        expectedCumulativeDue = Math.min(quarterlyDue, monthlyDue);
      }
    }
  }

  const overdueAmount = Math.max(0, Math.round((expectedCumulativeDue - amountPaid) * 100) / 100);
  const isOverdue = balance > 0 && overdueAmount > 0.01;

  return {
    isOverdue,
    overdueAmount,
    expectedCumulativeDue,
    balance,
    netAssessment,
    amountPaid,
  };
}
