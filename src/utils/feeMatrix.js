/**
 * Grade-by-Grade Tuition & Miscellaneous Fee Matrix Utilities
 *
 * Supports individual fee structures for every grade level (Grade 1 through Grade 12),
 * with persistent synchronization to Supabase and localStorage.
 */

export const DEFAULT_GRADE_FEES = [
  // Elementary Department (Grades 1 – 6)
  { grade_level: 1,  level: 'Grade 1',  department: 'Elementary',  tuition: 15000, miscellaneous: 3500 },
  { grade_level: 2,  level: 'Grade 2',  department: 'Elementary',  tuition: 15000, miscellaneous: 3500 },
  { grade_level: 3,  level: 'Grade 3',  department: 'Elementary',  tuition: 15500, miscellaneous: 3500 },
  { grade_level: 4,  level: 'Grade 4',  department: 'Elementary',  tuition: 16000, miscellaneous: 3700 },
  { grade_level: 5,  level: 'Grade 5',  department: 'Elementary',  tuition: 16500, miscellaneous: 3700 },
  { grade_level: 6,  level: 'Grade 6',  department: 'Elementary',  tuition: 17000, miscellaneous: 4000 },

  // Junior High School (Grades 7 – 10)
  { grade_level: 7,  level: 'Grade 7',  department: 'Junior High', tuition: 18000, miscellaneous: 4000 },
  { grade_level: 8,  level: 'Grade 8',  department: 'Junior High', tuition: 18500, miscellaneous: 4000 },
  { grade_level: 9,  level: 'Grade 9',  department: 'Junior High', tuition: 19000, miscellaneous: 4200 },
  { grade_level: 10, level: 'Grade 10', department: 'Junior High', tuition: 19500, miscellaneous: 4500 },

  // Senior High School (Grades 11 – 12)
  { grade_level: 11, level: 'Grade 11', department: 'Senior High', tuition: 22000, miscellaneous: 4500 },
  { grade_level: 12, level: 'Grade 12', department: 'Senior High', tuition: 22500, miscellaneous: 5000 },
];

export const DEFAULT_FEES = DEFAULT_GRADE_FEES;

const LOCAL_STORAGE_KEY = 'absas_fee_matrix_v2';

/**
 * Normalizes a fee matrix array to ensure all 12 individual grade levels exist.
 * Automatically migrates legacy 3-tier fee structures if found.
 */
export function normalizeFeeArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return DEFAULT_GRADE_FEES;

  // Check if this is the legacy 3-tier structure (elementary, juniorHigh, seniorHigh)
  const isLegacy3Tier = arr.length <= 3 && arr.some(item => item.key || String(item.level).includes('–') || String(item.level).includes('-'));

  return DEFAULT_GRADE_FEES.map(def => {
    let match;

    if (isLegacy3Tier) {
      if (def.grade_level >= 11) {
        match = arr.find(m => m.key === 'seniorHigh' || String(m.level).toLowerCase().includes('senior'));
      } else if (def.grade_level >= 7) {
        match = arr.find(m => m.key === 'juniorHigh' || String(m.level).toLowerCase().includes('junior'));
      } else {
        match = arr.find(m => m.key === 'elementary' || String(m.level).toLowerCase().includes('elementary'));
      }
    } else {
      match = arr.find(
        m =>
          Number(m.grade_level) === def.grade_level ||
          String(m.level).toLowerCase().trim() === def.level.toLowerCase().trim() ||
          String(m.level).toLowerCase().includes(`grade ${def.grade_level}`)
      );
    }

    if (!match) return def;

    const tuition = Number(match.tuition);
    const misc = Number(match.miscellaneous ?? match.misc);

    return {
      grade_level: def.grade_level,
      level: def.level,
      department: def.department,
      tuition: !isNaN(tuition) && tuition >= 0 ? tuition : def.tuition,
      miscellaneous: !isNaN(misc) && misc >= 0 ? misc : def.miscellaneous,
    };
  });
}

/**
 * Retrieves base fees (tuition, misc, total) for a specific grade level (1-12)
 * based on the provided fee matrix (or cached/default matrix).
 */
export function getBaseFees(gradeLevel, feeMatrix = null) {
  const g = Number(String(gradeLevel).replace(/\D/g, '') || 1);
  const matrix = normalizeFeeArray(feeMatrix || getCachedFeeMatrix());

  const row = matrix.find(m => Number(m.grade_level) === g) || matrix[0] || DEFAULT_GRADE_FEES[0];

  const tuition = Number(row.tuition);
  const misc = Number(row.miscellaneous ?? row.misc);

  return {
    grade_level: g,
    level: row.level,
    department: row.department,
    tuition,
    misc,
    total: tuition + misc,
    category: `${row.department || 'Academic'} Department`,
  };
}

/**
 * Synchronously retrieves cached fee matrix from localStorage (or defaults).
 */
export function getCachedFeeMatrix() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const cached = window.localStorage.getItem(LOCAL_STORAGE_KEY) || window.localStorage.getItem('absas_fee_matrix');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return normalizeFeeArray(parsed);
        }
      }
    }
  } catch (err) {
    console.warn('Could not read cached fee matrix:', err);
  }
  return DEFAULT_GRADE_FEES;
}

/**
 * Asynchronously fetches fee matrix from Supabase:
 * 1. Checks `school_policies` table where category = 'Financial'.
 * 2. Checks `school_settings` table.
 * 3. Falls back to localStorage and defaults.
 */
export async function fetchFeeMatrix(supabase) {
  const cached = getCachedFeeMatrix();

  if (!supabase) return cached;

  try {
    // 1. Try school_policies (Financial category)
    const { data: polData, error: polErr } = await supabase
      .from('school_policies')
      .select('*')
      .eq('category', 'Financial')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!polErr && polData?.description) {
      try {
        const parsed = JSON.parse(polData.description);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = normalizeFeeArray(parsed);
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalized));
          }
          return normalized;
        }
      } catch {
        // Not valid JSON
      }
    }

    // 2. Try school_settings
    const { data: setRow } = await supabase
      .from('school_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (setRow?.fee_matrix) {
      const parsed = typeof setRow.fee_matrix === 'string'
        ? JSON.parse(setRow.fee_matrix)
        : setRow.fee_matrix;

      if (Array.isArray(parsed) && parsed.length > 0) {
        const normalized = normalizeFeeArray(parsed);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalized));
        }
        return normalized;
      }
    }
  } catch (err) {
    console.error('Error fetching fee matrix from Supabase:', err);
  }

  return cached;
}

/**
 * Saves fee matrix to Supabase (and synchronizes localStorage):
 * 1. Writes to `school_policies` (Financial category).
 * 2. Writes to `school_settings` if available.
 * 3. Updates localStorage.
 */
export async function saveFeeMatrix(supabase, feeArray) {
  const normalized = normalizeFeeArray(feeArray);

  // 1. Update localStorage immediately
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalized));
    window.localStorage.setItem('absas_fee_matrix', JSON.stringify(normalized));
  }

  if (!supabase) return normalized;

  try {
    // 2. Upsert in school_policies
    const { data: existingPol } = await supabase
      .from('school_policies')
      .select('id')
      .eq('category', 'Financial')
      .limit(1)
      .maybeSingle();

    const policyPayload = {
      policy_name: 'Tuition & Miscellaneous Fee Matrix',
      category: 'Financial',
      description: JSON.stringify(normalized),
      is_active: true,
    };

    if (existingPol?.id) {
      await supabase
        .from('school_policies')
        .update(policyPayload)
        .eq('id', existingPol.id);
    } else {
      await supabase
        .from('school_policies')
        .insert([policyPayload]);
    }

    // 3. Try to update school_settings if fee_matrix column is present
    try {
      await supabase
        .from('school_settings')
        .update({ fee_matrix: normalized })
        .eq('id', 1);
    } catch {
      // Ignore if fee_matrix column does not exist on school_settings
    }
  } catch (err) {
    console.error('Error saving fee matrix to Supabase:', err);
    throw err;
  }

  return normalized;
}
