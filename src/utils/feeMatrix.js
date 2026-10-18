/**
 * Tuition & Miscellaneous Fee Matrix Utilities
 *
 * Provides dynamic storage and retrieval of school fee matrices from Supabase
 * (with localStorage persistence fallback) so fee changes configured in Settings
 * are saved and immediately reflected across the entire system.
 */

export const DEFAULT_FEES = [
  { level: 'Elementary (Grades 1–6)', tuition: 15000, miscellaneous: 3500, key: 'elementary' },
  { level: 'Junior High (Grades 7–10)', tuition: 18000, miscellaneous: 4000, key: 'juniorHigh' },
  { level: 'Senior High (Grades 11–12)', tuition: 22000, miscellaneous: 4500, key: 'seniorHigh' },
];

const LOCAL_STORAGE_KEY = 'absas_fee_matrix';

/**
 * Normalizes a fee matrix array to ensure required fields and numeric values.
 */
export function normalizeFeeArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return DEFAULT_FEES;

  return DEFAULT_FEES.map((def, idx) => {
    const match = arr.find(
      item =>
        item.key === def.key ||
        String(item.level).toLowerCase().includes(def.key.toLowerCase().slice(0, 4))
    ) || arr[idx];

    if (!match) return def;

    return {
      level: def.level,
      key: def.key,
      tuition: Number(match.tuition) >= 0 ? Number(match.tuition) : def.tuition,
      miscellaneous: Number(match.miscellaneous ?? match.misc) >= 0
        ? Number(match.miscellaneous ?? match.misc)
        : def.miscellaneous,
    };
  });
}

/**
 * Retrieves base fees (tuition, misc, total) for a specific grade level
 * based on the provided fee matrix (or cached/default matrix).
 */
export function getBaseFees(gradeLevel, feeMatrix = null) {
  const g = Number(String(gradeLevel).replace(/\D/g, '') || 1);
  const matrix = normalizeFeeArray(feeMatrix || getCachedFeeMatrix());

  let row;
  let category;

  if (g >= 11) {
    row = matrix.find(m => m.key === 'seniorHigh') || matrix[2] || DEFAULT_FEES[2];
    category = 'Senior High School';
  } else if (g >= 7) {
    row = matrix.find(m => m.key === 'juniorHigh') || matrix[1] || DEFAULT_FEES[1];
    category = 'Junior High School';
  } else {
    row = matrix.find(m => m.key === 'elementary') || matrix[0] || DEFAULT_FEES[0];
    category = 'Elementary Department';
  }

  const tuition = Number(row.tuition);
  const misc = Number(row.miscellaneous ?? row.misc);

  return {
    tuition,
    misc,
    total: tuition + misc,
    category,
    level: row.level,
  };
}

/**
 * Synchronously retrieves cached fee matrix from localStorage (or defaults).
 */
export function getCachedFeeMatrix() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const cached = window.localStorage.getItem(LOCAL_STORAGE_KEY);
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
  return DEFAULT_FEES;
}

/**
 * Asynchronously fetches fee matrix from Supabase:
 * 1. Checks `school_policies` table where category = 'Financial'.
 * 2. Checks `school_settings` table.
 * 3. Falls back to localStorage and defaults.
 */
export async function fetchFeeMatrix(supabase) {
  // First check cached for instant render
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
          // Update cache
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalized));
          }
          return normalized;
        }
      } catch {
        // description was not JSON, continue fallback
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
