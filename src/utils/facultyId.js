/**
 * Faculty ID helpers. IDs look like FAC-<year>-<3+ digit sequence>, e.g. FAC-2026-025.
 * Older records use other shapes (FAC-0001, FAC-001, FAC-2026); those are ignored
 * when computing the next number.
 */
import { escapeLike } from './email';

export function formatFacultyId(year, n) {
  return `FAC-${year}-${String(n).padStart(3, '0')}`;
}

export async function getHighestFacultySeq(supabase, year) {
  const prefix = `FAC-${year}-`;
  const { data, error } = await supabase
    .from('faculty')
    .select('faculty_id')
    .ilike('faculty_id', `${escapeLike(prefix)}%`)
    .limit(1000);
  if (error) throw error;

  let max = 0;
  for (const row of data ?? []) {
    const m = String(row.faculty_id ?? '').match(/^FAC-\d{4}-(\d+)$/i);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max;
}

/** Next free faculty_id; `skip` lets a retry jump ahead after a collision. */
export async function getNextFacultyId(supabase, year = new Date().getFullYear(), skip = 0) {
  const max = await getHighestFacultySeq(supabase, year);
  return formatFacultyId(year, max + 1 + skip);
}

/** Existing faculty row using this ID (other than excludeRecordId), or null. */
export async function findFacultyByFacultyId(supabase, facultyId, excludeRecordId = null) {
  const id = String(facultyId ?? '').trim();
  if (!id) return null;
  const { data, error } = await supabase
    .from('faculty')
    .select('faculty_record_id, faculty_id, first_name, last_name')
    .eq('faculty_id', id)
    .limit(5);
  if (error) throw error;
  return (data ?? []).find(r => String(r.faculty_record_id) !== String(excludeRecordId ?? '')) ?? null;
}

export function isFacultyIdViolation(err) {
  const msg = String(err?.message ?? '');
  return err?.code === '23505' && msg.includes('faculty_id');
}

export function duplicateFacultyIdMessage(facultyId, existing) {
  const who = existing ? ` (already assigned to ${existing.first_name ?? ''} ${existing.last_name ?? ''})`.replace(/\s+\)/, ')') : '';
  return `Faculty ID "${facultyId}" already exists${who}. Please enter a different Faculty ID.`;
}
