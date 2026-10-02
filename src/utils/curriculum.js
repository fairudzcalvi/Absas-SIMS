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
    const strandSubjects = SHS_STRAND_SUBJECTS[gl]?.[cleanStrand];
    if (strandSubjects && strandSubjects.length > 0) {
      baseSubjects.push(...strandSubjects);
    }
  }

  return baseSubjects;
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

    // Substring / partial match
    const partialIdx = normalizedCurriculum.findIndex(c => norm.includes(c) || c.includes(norm));
    if (partialIdx !== -1) return partialIdx;

    // Separate MAPEH components (Music, Arts, PE, Health) sort with MAPEH
    if (['music', 'arts', 'physical education', 'health', 'pe'].includes(norm)) {
      const mapehIdx = normalizedCurriculum.findIndex(c => c.includes('mapeh'));
      if (mapehIdx !== -1) return mapehIdx + 0.1;
    }

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
 * 2. Merges with matching active database subjects for that grade.
 * 3. Merges any already-graded subjects for the student.
 * 4. Sorts the complete list strictly by official curriculum order.
 */
export function buildStudentSubjectList({
  gradeLevel,
  strandCode = null,
  dbSubjects = [],
  grades = [],
}) {
  const gl = Number(String(gradeLevel).replace(/\D/g, ''));
  const curriculum = getCurriculumSubjects(gl, strandCode);

  // Filter DB subjects: match student's exact grade level (or non-grade-specific electives)
  const dbMatching = (Array.isArray(dbSubjects) ? dbSubjects : [])
    .filter(s => {
      if (!s) return false;
      const sGrade = s.grade_level ? Number(s.grade_level) : null;
      // Match exact grade level
      if (gl && sGrade) return sGrade === gl;
      // If student grade not specified, allow all
      if (!gl) return true;
      return false;
    })
    .map(s => s.subject_name)
    .filter(Boolean);

  // Graded subjects from database
  const gradedSubjects = (Array.isArray(grades) ? grades : [])
    .map(g => g.subject)
    .filter(Boolean);

  // Combine and deduplicate
  const combined = Array.from(new Set([...curriculum, ...dbMatching, ...gradedSubjects]));

  // Sort strictly by curriculum
  return sortSubjectsByCurriculum(combined, gl, strandCode);
}
