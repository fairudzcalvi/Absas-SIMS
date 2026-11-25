/**
 * Student ID helpers.
 * IDs look like STU-<year>-<4+ digit sequence>, e.g. STU-2026-0042.
 * The next ID is based on the highest existing sequence number in the students
 * table (never on a row count or random number), so it cannot collide with
 * existing records unless two admins save at the same instant - callers should
 * also retry on a unique violation (see isStudentIdViolation).
 */
import { escapeLike } from './email';

export function formatStudentId(year, n) {
  return `STU-${year}-${String(n).padStart(4, '0')}`;
}

/** Highest sequence number used so far for the given year (0 if none). */
export async function getHighestStudentSeq(supabase, year) {
  const prefix = `STU-${year}-`;
  const { data, error } = await supabase
    .from('students')
    .select('student_id')
    .ilike('student_id', `${escapeLike(prefix)}%`)
    .order('student_id', { ascending: false })
    .limit(1000);
  if (error) throw error;

  let max = 0;
  for (const row of data ?? []) {
    const m = String(row.student_id ?? '').match(/^STU-\d{4}-(\d+)$/i);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max;
}

/** Next free student_id. `skip` lets a retry jump ahead after a collision. */
export async function getNextStudentId(supabase, year = new Date().getFullYear(), skip = 0) {
  const max = await getHighestStudentSeq(supabase, year);
  return formatStudentId(year, max + 1 + skip);
}

/** Returns the existing student row (name fields) using this ID, or null. */
export async function findStudentByStudentId(supabase, studentId) {
  const id = String(studentId ?? '').trim();
  if (!id) return null;
  const { data, error } = await supabase
    .from('students')
    .select('student_record_id, student_id, first_name, last_name')
    .eq('student_id', id)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

/** True when a Postgres error is the student_id unique-constraint violation. */
export function isStudentIdViolation(err) {
  const msg = String(err?.message ?? '');
  return err?.code === '23505' && (msg.includes('student_id') || msg.includes('students_student_id_key'));
}

export function isLrnViolation(err) {
  const msg = String(err?.message ?? '');
  return err?.code === '23505' && msg.includes('lrn');
}

export function duplicateStudentIdMessage(studentId, existing) {
  const who = existing ? ` (already assigned to ${existing.first_name ?? ''} ${existing.last_name ?? ''})`.replace(/\s+\)/, ')') : '';
  return `Student ID "${studentId}" already exists${who}. Please enter a different Student ID.`;
}
