/**
 * Official Philippine DepEd K to 12 Curriculum Definitions & Sorting Utilities
 *
 * Provides grade-specific subject sequences according to DepEd Order No. 21, s. 2019,
 * DepEd Order No. 8, s. 2015, and the DepEd Senior High School curriculum guidelines.
 */

// DepEd K to 12 Standard Core & Grade-specific Curriculum Orders
export const DEPED_CURRICULUM = {
  // Primary (Grades 1 - 2) - Note: Science is NOT in Grades 1 & 2 curriculum in DepEd
  1: [
    'Mother Tongue',
    'Filipino',
    'English',
    'Mathematics',
    'Araling Panlipunan',
    'Edukasyon sa Pagpapakatao (EsP)',
    'MAPEH',
  ],
  2: [
    'Mother Tongue',
    'Filipino',
    'English',
    'Mathematics',
    'Araling Panlipunan',
    'Edukasyon sa Pagpapakatao (EsP)',
    'MAPEH',
  ],
  // Grade 3: Science is officially introduced; Mother Tongue is still present
  3: [
    'Mother Tongue',
    'Filipino',
    'English',
    'Mathematics',
    'Science',
    'Araling Panlipunan',
    'Edukasyon sa Pagpapakatao (EsP)',
    'MAPEH',
  ],
  // Intermediate (Grades 4 - 6): Mother Tongue ends; EPP (Edukasyong Pantahanan at Pangkabuhayan) starts
  4: [
    'Filipino',
    'English',
    'Mathematics',
    'Science',
    'Araling Panlipunan',
    'Edukasyon sa Pagpapakatao (EsP)',
    'Edukasyong Pantahanan at Pangkabuhayan (EPP)',
    'MAPEH',
  ],
  5: [
    'Filipino',
    'English',
    'Mathematics',
    'Science',
    'Araling Panlipunan',
    'Edukasyon sa Pagpapakatao (EsP)',
    'Edukasyong Pantahanan at Pangkabuhayan (EPP)',
    'MAPEH',
  ],
  6: [
    'Filipino',
    'English',
    'Mathematics',
    'Science',
    'Araling Panlipunan',
    'Edukasyon sa Pagpapakatao (EsP)',
    'Edukasyong Pantahanan at Pangkabuhayan (EPP)',
    'MAPEH',
  ],
  // Junior High School (Grades 7 - 10): EPP transitions to TLE (Technology and Livelihood Education)
  7: [
    'Filipino',
    'English',
    'Mathematics',
    'Science',
    'Araling Panlipunan',
    'Edukasyon sa Pagpapakatao (EsP)',
    'Technology and Livelihood Education (TLE)',
    'MAPEH',
  ],
  8: [
    'Filipino',
    'English',
    'Mathematics',
    'Science',
    'Araling Panlipunan',
    'Edukasyon sa Pagpapakatao (EsP)',
    'Technology and Livelihood Education (TLE)',
    'MAPEH',
  ],
  9: [
    'Filipino',
    'English',
    'Mathematics',
    'Science',
    'Araling Panlipunan',
    'Edukasyon sa Pagpapakatao (EsP)',
    'Technology and Livelihood Education (TLE)',
    'MAPEH',
  ],
  10: [
    'Filipino',
    'English',
    'Mathematics',
    'Science',
    'Araling Panlipunan',
    'Edukasyon sa Pagpapakatao (EsP)',
    'Technology and Livelihood Education (TLE)',
    'MAPEH',
  ],
  // Senior High School (Grade 11): Core & Applied
  11: [
    'Oral Communication',
    'Reading and Writing',
    'Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino',
    'Pagbasa at Pagsusuri ng Iba\'t Ibang Teksto',
    '21st Century Literature from the Philippines and the World',
    'Contemporary Philippine Arts from the Regions',
    'General Mathematics',
    'Statistics and Probability',
    'Earth and Life Science',
    'Physical Science',
    'Personal Development',
    'Understanding Culture, Society, and Politics',
    'Physical Education and Health 1',
    'Physical Education and Health 2',
    'Empowerment Technologies',
    'English for Academic and Professional Purposes',
  ],
  // Senior High School (Grade 12): Core & Applied
  12: [
    'Media and Information Literacy',
    'Introduction to the Philosophy of the Human Person',
    'Physical Education and Health 3',
    'Physical Education and Health 4',
    'Practical Research 1',
    'Practical Research 2',
    'Inquiries, Investigations, and Immersion',
    'Filipino sa Piling Larang',
    'Entrepreneurship',
  ],
};

// SHS Strand-Specific Specialized Subjects
export const SHS_STRAND_SUBJECTS = {
  11: {
    STEM: [
      'Pre-Calculus',
      'Basic Calculus',
      'General Biology 1',
      'General Biology 2',
    ],
    ABM: [
      'Business Math',
      'Organization and Management',
      'Fundamentals of Accountancy, Business, and Management 1',
    ],
    HUMSS: [
      'Creative Writing',
      'Introduction to World Religions and Belief Systems',
      'Disciplines and Ideas in the Social Sciences',
    ],
    GAS: [
      'Humanities 1',
      'Social Science 1',
      'Applied Economics',
    ],
    TVL: [
      'TVL Specialization 1',
      'TVL Specialization 2',
    ],
  },
  12: {
    STEM: [
      'General Physics 1',
      'General Physics 2',
      'General Chemistry 1',
      'General Chemistry 2',
      'Work Immersion / Research Capstone',
    ],
    ABM: [
      'Fundamentals of Accountancy, Business, and Management 2',
      'Business Finance',
      'Applied Economics',
      'Principles of Marketing',
      'Business Ethics and Social Responsibility',
      'Work Immersion / Business Simulation',
    ],
    HUMSS: [
      'Creative Nonfiction',
      'Philippine Politics and Governance',
      'Community Engagement, Solidarity and Citizenship',
      'Disciplines and Ideas in the Applied Social Sciences',
      'Trends, Networks, and Critical Thinking',
      'Work Immersion / Culminating Activity',
    ],
    GAS: [
      'Humanities 2',
      'Social Science 2',
      'Disaster Readiness and Risk Reduction',
      'Work Immersion',
    ],
    TVL: [
      'TVL Specialization 3',
      'TVL Specialization 4',
      'Work Immersion',
    ],
  },
};

/**
 * Normalizes subject names for robust fuzzy matching across naming variations.
 * e.g. "Araling Panlipunan (AP)" -> "araling panlipunan"
 *      "Edukasyon sa Pagpapakatao (EsP)" -> "edukasyon sa pagpapakatao"
 */
export function normalizeSubject(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // remove parenthesized acronyms like (EsP), (AP), (TLE)
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Alias mapping for common abbreviations to canonical curriculum subject names.
 */
const SUBJECT_ALIASES = {
  'esp': 'Edukasyon sa Pagpapakatao (EsP)',
  'ap': 'Araling Panlipunan',
  'epp': 'Edukasyong Pantahanan at Pangkabuhayan (EPP)',
  'tle': 'Technology and Livelihood Education (TLE)',
  'math': 'Mathematics',
  'sci': 'Science',
  'eng': 'English',
  'fil': 'Filipino',
  'gen math': 'General Mathematics',
  'genmath': 'General Mathematics',
  'stat': 'Statistics and Probability',
  'stats': 'Statistics and Probability',
  'oral comm': 'Oral Communication',
  'pe': 'Physical Education and Health',
  'mapeh': 'MAPEH',
  'pr1': 'Practical Research 1',
  'pr2': 'Practical Research 2',
  '3is': 'Inquiries, Investigations, and Immersion',
  'intro to philosophy': 'Introduction to the Philosophy of the Human Person',
  'philosophy': 'Introduction to the Philosophy of the Human Person',
  'mil': 'Media and Information Literacy',
};

/**
 * Returns the official curriculum subjects for a given grade level (and optional strand).
 */
export function getCurriculumSubjects(gradeLevel, strandCode = null) {
  const gl = Number(String(gradeLevel).replace(/\D/g, ''));
  if (!gl || gl < 1 || gl > 12) {
    return [
      'Filipino',
      'English',
      'Mathematics',
      'Science',
      'Araling Panlipunan',
      'Edukasyon sa Pagpapakatao (EsP)',
      'MAPEH',
    ];
  }

  const baseSubjects = [...(DEPED_CURRICULUM[gl] || [])];

  if ((gl === 11 || gl === 12) && strandCode) {
    const cleanStrand = String(strandCode).toUpperCase().trim();
    const resolvedStrand = cleanStrand.startsWith('TVL') ? 'TVL' : cleanStrand;
    const strandSubjects = SHS_STRAND_SUBJECTS[gl]?.[resolvedStrand];
    if (strandSubjects && strandSubjects.length > 0) {
      baseSubjects.push(...strandSubjects);
    }
  }

  return baseSubjects;
}

/**
 * Returns a canonical comparable key for a subject name (resolving acronyms/aliases).
 */
export function getCanonicalSubjectKey(subjName) {
  const norm = normalizeSubject(subjName);
  if (!norm) return '';
  if (SUBJECT_ALIASES[norm]) {
    return normalizeSubject(SUBJECT_ALIASES[norm]);
  }
  return norm;
}

/**
 * Checks whether two subject names refer to the same canonical subject.
 */
export function subjectsMatch(a, b) {
  const keyA = getCanonicalSubjectKey(a);
  const keyB = getCanonicalSubjectKey(b);
  if (!keyA || !keyB) return false;
  return keyA === keyB;
}

/**
 * Resolves DepEd Order No. 8, s. 2015 grading component weights by grade level & subject.
 * Returns { wwWeight, ptWeight, qaWeight } as fractions summing to 1.0.
 */
export function getDepEdSubjectWeights(gradeLevel, subjectName = '', policyOverride = null, academicPolicies = []) {
  const gl = Number(String(gradeLevel ?? '').replace(/\D/g, ''));
  const norm = normalizeSubject(subjectName);
  const key = getCanonicalSubjectKey(subjectName);

  // Check if an explicitly scoped school policy matches this grade/track
  if (Array.isArray(academicPolicies) && academicPolicies.length > 0) {
    const matchedPol = academicPolicies.find(p => {
      const pn = (p.policy_name || '').toLowerCase();
      if (gl >= 11) {
        return pn.includes('shs') || pn.includes('senior high') || pn.includes('stem');
      }
      if (gl >= 1 && gl <= 10) {
        return (pn.includes('jhs') || pn.includes('elementary') || pn.includes('standard')) && !pn.includes('shs') && !pn.includes('stem');
      }
      return false;
    });
    // Only use an explicit policy override for subject groups when it matches general JHS default
    // or SHS specialized STEM/Senior High if no finer DepEd subject group rule differs below.
    if (matchedPol && !gl && matchedPol.written_work_pct != null) {
      return {
        wwWeight: Number(matchedPol.written_work_pct) / 100,
        ptWeight: Number(matchedPol.performance_task_pct) / 100,
        qaWeight: Number(matchedPol.quarterly_exam_pct) / 100,
      };
    }
  }

  // Grades 1 - 10 (Elementary & Junior High School) per DepEd Order No. 8, s. 2015
  if (gl >= 1 && gl <= 10) {
    if (
      key.includes('science') ||
      key.includes('mathematics') ||
      norm.includes('math') ||
      norm.includes('scien')
    ) {
      return { wwWeight: 0.40, ptWeight: 0.40, qaWeight: 0.20 };
    }
    if (
      key.includes('mapeh') ||
      key.includes('edukasyong pantahanan') ||
      key.includes('technology and livelihood') ||
      ['music', 'arts', 'physical education', 'health', 'pe', 'epp', 'tle'].includes(norm)
    ) {
      return { wwWeight: 0.20, ptWeight: 0.60, qaWeight: 0.20 };
    }
    return { wwWeight: 0.30, ptWeight: 0.50, qaWeight: 0.20 };
  }

  // Grades 11 - 12 (Senior High School) per DepEd Order No. 8, s. 2015
  if (gl >= 11) {
    if (norm.includes('tvl') || norm.includes('sports') || norm.includes('immersion') === false && norm.includes('arts specialization')) {
      return { wwWeight: 0.20, ptWeight: 0.60, qaWeight: 0.20 };
    }
    if (
      norm.includes('immersion') ||
      norm.includes('research') ||
      norm.includes('inquiries') ||
      norm.includes('simulation') ||
      norm.includes('culminating') ||
      norm.includes('capstone') ||
      norm.includes('empowerment') ||
      norm.includes('entrepreneurship') ||
      norm.includes('english for academic') ||
      norm.includes('filipino sa piling')
    ) {
      return { wwWeight: 0.35, ptWeight: 0.40, qaWeight: 0.25 };
    }
    const coreShs = (DEPED_CURRICULUM[11] || []).concat(DEPED_CURRICULUM[12] || []).map(normalizeSubject);
    const isCore = coreShs.includes(key) || coreShs.includes(norm);
    if (!isCore) {
      // Academic Track Specialized Subjects
      return { wwWeight: 0.25, ptWeight: 0.45, qaWeight: 0.30 };
    }
    // SHS Core Subjects
    return { wwWeight: 0.25, ptWeight: 0.50, qaWeight: 0.25 };
  }

  if (policyOverride?.written_work_pct != null) {
    return {
      wwWeight: Number(policyOverride.written_work_pct) / 100,
      ptWeight: Number(policyOverride.performance_task_pct) / 100,
      qaWeight: Number(policyOverride.quarterly_exam_pct) / 100,
    };
  }
  return { wwWeight: 0.30, ptWeight: 0.50, qaWeight: 0.20 };
}

/**
 * Sorts an array of subject names according to official DepEd curriculum order.
 * - Standard curriculum subjects for the grade appear first in curriculum order.
 * - Matching DB / recorded subjects get mapped to their curriculum slot.
 * - Non-curriculum or elective subjects appear cleanly at the end.
 */
export function sortSubjectsByCurriculum(subjectList, gradeLevel, strandCode = null) {
  if (!Array.isArray(subjectList) || subjectList.length === 0) return [];

  const curriculum = getCurriculumSubjects(gradeLevel, strandCode);
  const normalizedCurriculum = curriculum.map(normalizeSubject);

  // Helper to find curriculum position
  function getSubjectPriority(subjName) {
    const norm = normalizeSubject(subjName);
    if (!norm) return 9999;

    // Check alias
    if (SUBJECT_ALIASES[norm]) {
      const aliasNorm = normalizeSubject(SUBJECT_ALIASES[norm]);
      const idx = normalizedCurriculum.indexOf(aliasNorm);
      if (idx !== -1) return idx;
    }

    // Direct match with curriculum
    const directIdx = normalizedCurriculum.indexOf(norm);
    if (directIdx !== -1) return directIdx;

    // Separate MAPEH components (Music, Arts, PE, Health) sort with MAPEH before partial checks
    if (['music', 'arts', 'physical education', 'health', 'pe'].includes(norm)) {
      const mapehIdx = normalizedCurriculum.findIndex(c => c.includes('mapeh'));
      if (mapehIdx !== -1) return mapehIdx + 0.1;
    }

    // Word-boundary prefix match (avoids short codes like 'pe' hitting 'personal' or 'mapeh')
    const partialIdx = normalizedCurriculum.findIndex(c =>
      c.startsWith(norm + ' ') || norm.startsWith(c + ' ')
    );
    if (partialIdx !== -1) return partialIdx;

    // Not in standard curriculum: place at end
    return 1000;
  }

  return [...subjectList].sort((a, b) => {
    const prioA = getSubjectPriority(a);
    const prioB = getSubjectPriority(b);
    if (prioA !== prioB) return prioA - prioB;
    return a.localeCompare(b);
  });
}

/**
 * Builds a unified, deduplicated list of subjects for a student:
 * 1. Takes official curriculum subjects for the student's exact grade level.
 * 2. Merges with matching active database subjects for that grade & strand.
 * 3. Merges any already-graded subjects for the student.
 * 4. Deduplicates aliases/case variants and sorts strictly by curriculum order.
 */
export function buildStudentSubjectList({
  gradeLevel,
  strandCode = null,
  strandId = null,
  dbSubjects = [],
  grades = [],
}) {
  const gl = Number(String(gradeLevel).replace(/\D/g, ''));
  const curriculum = getCurriculumSubjects(gl, strandCode);

  // Filter DB subjects: match student's grade level (or non-grade-specific electives) & strand
  const dbMatching = (Array.isArray(dbSubjects) ? dbSubjects : [])
    .filter(s => {
      if (!s) return false;
      const sGrade = s.grade_level ? Number(s.grade_level) : null;
      if (gl && sGrade && sGrade !== gl) return false;
      if (s.strand_id && strandId && String(s.strand_id) !== String(strandId)) return false;
      return true;
    })
    .map(s => s.subject_name)
    .filter(Boolean);

  // Graded subjects from database
  const gradedSubjects = (Array.isArray(grades) ? grades : [])
    .map(g => g.subject)
    .filter(Boolean);

  // Deduplicate by canonical subject key while keeping curriculum names canonical
  const deduped = [];
  const seenKeys = new Set();
  for (const subj of [...curriculum, ...dbMatching, ...gradedSubjects]) {
    const trimmed = String(subj).trim();
    if (!trimmed) continue;
    const key = getCanonicalSubjectKey(trimmed) || trimmed.toLowerCase();
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      deduped.push(trimmed);
    }
  }

  // Sort strictly by curriculum
  return sortSubjectsByCurriculum(deduped, gl, strandCode);
}
