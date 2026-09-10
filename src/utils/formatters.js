/**
 * Cleans section names that redundantly prefix the grade level.
 * e.g. "Grade 6 - St. Raphael" with gradeLevel 6 -> "St. Raphael"
 *      "Grade 6 St. Raphael" with gradeLevel 6 -> "St. Raphael"
 *      "Gr. 6 - Diamond" with gradeLevel 6 -> "Diamond"
 */
export function cleanSectionName(sectionName, gradeLevel) {
  if (!sectionName) return '';
  let cleaned = String(sectionName).trim();
  const gradeStr = gradeLevel ? String(gradeLevel).trim() : '\\d+';
  cleaned = cleaned.replace(new RegExp(`^Grade\\s*${gradeStr}\\s*[-–—:]*\\s*`, 'i'), '');
  cleaned = cleaned.replace(new RegExp(`^Gr\\.?\\s*${gradeStr}\\s*[-–—:]*\\s*`, 'i'), '');
  return cleaned.trim() || sectionName;
}

/**
 * Formats Grade and Section cleanly without repeating the grade.
 * e.g. (6, "Grade 6 - St. Raphael") -> "Grade 6 - St. Raphael"
 *      (6, "St. Raphael") -> "Grade 6 - St. Raphael"
 *      (6, null) -> "Grade 6"
 */
export function formatGradeSection(gradeLevel, sectionName) {
  if (!gradeLevel && !sectionName) return '—';
  if (!gradeLevel) return sectionName;
  const cleanSec = cleanSectionName(sectionName, gradeLevel);
  if (!cleanSec) return `Grade ${gradeLevel}`;
  return `Grade ${gradeLevel} - ${cleanSec}`;
}