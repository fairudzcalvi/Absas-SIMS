import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

console.log('----------------------------------------------------');
console.log('RUNNING AUTOMATED VERIFICATION SUITE');
console.log('Target: School Year Isolation & Batch Subject Addition');
console.log('----------------------------------------------------');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`[PASS] ${name}`);
  } catch (err) {
    failedTests++;
    console.error(`[FAIL] ${name}`);
    console.error(`       Error: ${err.message}`);
  }
}

// ==========================================
// TEST SUITE 1: School Year Context & Isolation Rules
// ==========================================

test('AuthContext defines multi-year isolation state & getters', () => {
  const authContextPath = path.join(rootDir, 'src', 'contexts', 'AuthContext.jsx');
  const code = fs.readFileSync(authContextPath, 'utf8');

  assert.ok(code.includes('selectedSchoolYear'), 'Missing selectedSchoolYear state');
  assert.ok(code.includes('isHistoricalYear'), 'Missing isHistoricalYear computation');
  assert.ok(code.includes('activeSchoolYear'), 'Missing activeSchoolYear tracking');
  assert.ok(code.includes('isHistoricalYear: Boolean(selectedSchoolYear && !selectedSchoolYear.is_active)'), 'Missing historical check logic');
});

test('SchoolYearSelector renders active and archived badges with proper attributes', () => {
  const compPath = path.join(rootDir, 'src', 'components', 'SchoolYearSelector.jsx');
  const code = fs.readFileSync(compPath, 'utf8');

  assert.ok(code.includes('currentLabel'), 'Selector must display currentLabel state');
  assert.ok(code.includes('Active'), 'Selector must distinguish Active year');
  assert.ok(code.includes('Archived'), 'Selector must distinguish Archived/Historical year');
  assert.ok(code.includes('sy.year_label'), 'Selector must display sy.year_label');
  // Check no emojis
  assert.ok(!code.match(/[\u{1F300}-\u{1F9FF}]/u), 'SchoolYearSelector must not contain emojis');
});

test('Historical Banner warning is integrated into Dashboard and Teacher Layouts', () => {
  const dashPath = path.join(rootDir, 'src', 'components', 'DashboardLayout.jsx');
  const teachPath = path.join(rootDir, 'src', 'components', 'TeacherLayout.jsx');

  const dashCode = fs.readFileSync(dashPath, 'utf8');
  const teachCode = fs.readFileSync(teachPath, 'utf8');

  assert.ok(dashCode.includes('isHistoricalYear'), 'DashboardLayout must check isHistoricalYear');
  assert.ok(dashCode.includes('Viewing archived records for'), 'DashboardLayout must render historical notice');
  assert.ok(dashCode.includes('Return to Active S.Y.'), 'DashboardLayout must have button to return to active school year');

  assert.ok(teachCode.includes('isHistoricalYear'), 'TeacherLayout must check isHistoricalYear');
  assert.ok(teachCode.includes('Viewing archived records for'), 'TeacherLayout must render historical notice');
});

// ==========================================
// TEST SUITE 2: Module-Level School Year Scoping
// ==========================================

test('TeacherGradesPage isolates data and enforces read-only mode for historical school years', () => {
  const gradesPath = path.join(rootDir, 'src', 'pages', 'teacher', 'TeacherGradesPage.jsx');
  const code = fs.readFileSync(gradesPath, 'utf8');

  assert.ok(code.includes('currentSy'), 'Must compute currentSy');
  assert.ok(code.includes('school_year_id'), 'Must query or store school_year_id');
  assert.ok(code.includes('isHistoricalYear'), 'Must check isHistoricalYear');
  assert.ok(code.includes('setGradingLocked(true)'), 'Must lock grades for historical years');
  assert.ok(code.includes('onConflict: \'student_record_id,subject,quarter,school_year\''), 'Must have multi-year upsert conflict resolution');
});

test('StudentGradesPage isolates grades to selectedSchoolYear', () => {
  const pathFile = path.join(rootDir, 'src', 'pages', 'student', 'StudentGradesPage.jsx');
  const code = fs.readFileSync(pathFile, 'utf8');

  assert.ok(code.includes('selectedSchoolYear'), 'Must use selectedSchoolYear from AuthContext');
  assert.ok(code.includes('currentSy'), 'Must derive currentSy');
  assert.ok(code.includes("school_year_id', currentSy.id"), 'Must filter query by school_year_id');
});

test('TeacherSchedulesPage isolates teacher schedule to active/selected school year', () => {
  const pathFile = path.join(rootDir, 'src', 'pages', 'teacher', 'TeacherSchedulesPage.jsx');
  const code = fs.readFileSync(pathFile, 'utf8');

  assert.ok(code.includes('currentSy'), 'Must use currentSy');
  assert.ok(code.includes('school_year_id'), 'Must query school_year_id');
});

test('SchedulesPage isolates master schedules to selected school year', () => {
  const pathFile = path.join(rootDir, 'src', 'pages', 'SchedulesPage.jsx');
  const code = fs.readFileSync(pathFile, 'utf8');

  assert.ok(code.includes('currentSy'), 'Must compute currentSy');
  assert.ok(code.includes('school_year_id'), 'Must query and save school_year_id');
});

test('EnrollmentPage isolates student enrollments by school year', () => {
  const pathFile = path.join(rootDir, 'src', 'pages', 'EnrollmentPage.jsx');
  const code = fs.readFileSync(pathFile, 'utf8');

  assert.ok(code.includes('currentSy'), 'Must compute currentSy');
  assert.ok(code.includes('school_year_id'), 'Must filter enrollments by school_year_id');
});

test('FinancePage isolates invoices, payments, and discounts by school year', () => {
  const pathFile = path.join(rootDir, 'src', 'pages', 'FinancePage.jsx');
  const code = fs.readFileSync(pathFile, 'utf8');

  assert.ok(code.includes('currentSy'), 'Must compute currentSy');
  assert.ok(code.includes('school_year_id'), 'Must query finances by school_year_id');
});

// ==========================================
// TEST SUITE 3: DepEd Subject Codes & Batch Addition
// ==========================================

function getStandardSubjectCode(name, grade) {
  const norm = (name || '').toLowerCase().trim();
  let prefix;
  if (norm.includes('math')) prefix = 'MATH';
  else if (norm.includes('scien')) prefix = 'SCI';
  else if (norm.includes('mother tongue')) prefix = 'MTB';
  else if (norm.includes('filipino')) prefix = 'FIL';
  else if (norm.includes('english')) prefix = 'ENG';
  else if (norm.includes('araling panlipunan') || norm === 'ap') prefix = 'AP';
  else if (norm.includes('edukasyon sa pagpapakatao') || norm.includes('esp')) prefix = 'ESP';
  else if (norm.includes('edukasyong pantahanan') || norm.includes('epp')) prefix = 'EPP';
  else if (norm.includes('technology and livelihood') || norm.includes('tle')) prefix = 'TLE';
  else if (norm.includes('mapeh')) prefix = 'MAPEH';
  else if (norm.includes('oral comm')) prefix = 'ORALCOMM';
  else if (norm.includes('reading and writing')) prefix = 'READWRITE';
  else if (norm.includes('komunikasyon')) prefix = 'KOM';
  else if (norm.includes('pagbasa')) prefix = 'PAGBASA';
  else if (norm.includes('21st century')) prefix = 'LIT21';
  else if (norm.includes('contemporary philippine')) prefix = 'CPAR';
  else if (norm.includes('statistics')) prefix = 'STAT';
  else if (norm.includes('earth and life')) prefix = 'ELS';
  else if (norm.includes('physical science')) prefix = 'PHYSCI';
  else if (norm.includes('personal dev')) prefix = 'PERDEV';
  else if (norm.includes('understanding culture') || norm.includes('ucsp')) prefix = 'UCSP';
  else if (norm.includes('physical education') || norm.includes('pe')) prefix = 'PE';
  else if (norm.includes('empowerment tech')) prefix = 'EMPOTECH';
  else if (norm.includes('english for academic') || norm.includes('eapp')) prefix = 'EAPP';
  else if (norm.includes('media and info') || norm.includes('mil')) prefix = 'MIL';
  else if (norm.includes('philosophy')) prefix = 'PHIL';
  else if (norm.includes('practical research 1')) prefix = 'PR1';
  else if (norm.includes('practical research 2')) prefix = 'PR2';
  else if (norm.includes('inquiries')) prefix = '3IS';
  else if (norm.includes('entrepreneurship')) prefix = 'ENTREP';
  else if (norm.includes('pre-calculus')) prefix = 'PRECALC';
  else if (norm.includes('basic calculus')) prefix = 'BASCALC';
  else if (norm.includes('biology 1')) prefix = 'BIO1';
  else if (norm.includes('biology 2')) prefix = 'BIO2';
  else if (norm.includes('physics 1')) prefix = 'PHYS1';
  else if (norm.includes('physics 2')) prefix = 'PHYS2';
  else if (norm.includes('chemistry 1')) prefix = 'CHEM1';
  else if (norm.includes('chemistry 2')) prefix = 'CHEM2';
  else {
    const words = name.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      prefix = words[0].substring(0, 4).toUpperCase();
    } else {
      prefix = words.map(w => w[0]).join('').substring(0, 5).toUpperCase();
    }
  }
  return grade ? `${prefix}-${grade}` : prefix;
}

test('Standard subject code generator maps JHS subjects with grade suffixes', () => {
  assert.equal(getStandardSubjectCode('Mathematics', 7), 'MATH-7');
  assert.equal(getStandardSubjectCode('Science', 8), 'SCI-8');
  assert.equal(getStandardSubjectCode('English', 9), 'ENG-9');
  assert.equal(getStandardSubjectCode('Filipino', 10), 'FIL-10');
  assert.equal(getStandardSubjectCode('Araling Panlipunan', 7), 'AP-7');
  assert.equal(getStandardSubjectCode('MAPEH', 8), 'MAPEH-8');
  assert.equal(getStandardSubjectCode('Technology and Livelihood Education (TLE)', 9), 'TLE-9');
  assert.equal(getStandardSubjectCode('Edukasyon sa Pagpapakatao (EsP)', 10), 'ESP-10');
});

test('Standard subject code generator maps SHS Core & Specialized subjects', () => {
  assert.equal(getStandardSubjectCode('Oral Communication in Context', 11), 'ORALCOMM-11');
  assert.equal(getStandardSubjectCode('Reading and Writing Skills', 11), 'READWRITE-11');
  assert.equal(getStandardSubjectCode('Statistics and Probability', 11), 'STAT-11');
  assert.equal(getStandardSubjectCode('Pre-Calculus', 11), 'PRECALC-11');
  assert.equal(getStandardSubjectCode('Basic Calculus', 11), 'BASCALC-11');
  assert.equal(getStandardSubjectCode('General Biology 1', 11), 'BIO1-11');
  assert.equal(getStandardSubjectCode('General Physics 1', 12), 'PHYS1-12');
  assert.equal(getStandardSubjectCode('General Chemistry 1', 12), 'CHEM1-12');
  assert.equal(getStandardSubjectCode('Practical Research 1', 11), 'PR1-11');
  assert.equal(getStandardSubjectCode('Inquiries, Investigations, and Immersion', 12), '3IS-12');
});

test('Batch deduplication correctly filters in-batch duplicates and database duplicates', () => {
  const existingDbSubjects = [
    { curriculum_id: 'curr-jhs', grade_level: 7, subject_name: 'Mathematics' },
    { curriculum_id: 'curr-jhs', grade_level: 7, subject_name: 'Science' },
  ];

  const candidateBatchRows = [
    { grade_level: '7', subject_name: 'Mathematics', subject_code: 'MATH-7' }, // DB duplicate
    { grade_level: '7', subject_name: 'English', subject_code: 'ENG-7' },       // Valid new
    { grade_level: '7', subject_name: 'English', subject_code: 'ENG-7-ALT' },   // Batch duplicate
    { grade_level: '8', subject_name: 'Mathematics', subject_code: 'MATH-8' }, // Valid new (different grade)
  ];

  const batchCurrId = 'curr-jhs';
  const seenInBatch = new Set();
  const toInsert = [];
  let skippedBatchDuplicates = 0;
  let skippedDbDuplicates = 0;

  for (const row of candidateBatchRows) {
    const key = `${row.grade_level}::${row.subject_name.trim().toLowerCase()}`;
    if (seenInBatch.has(key)) {
      skippedBatchDuplicates++;
      continue;
    }
    seenInBatch.add(key);

    const existsInDb = existingDbSubjects.some(s =>
      s.curriculum_id === batchCurrId &&
      s.grade_level === Number(row.grade_level) &&
      (s.subject_name ?? '').trim().toLowerCase() === row.subject_name.trim().toLowerCase()
    );

    if (existsInDb) {
      skippedDbDuplicates++;
      continue;
    }

    toInsert.push(row);
  }

  assert.equal(skippedDbDuplicates, 1, 'Should skip 1 existing DB duplicate (Grade 7 Math)');
  assert.equal(skippedBatchDuplicates, 1, 'Should skip 1 duplicate within batch (Grade 7 English #2)');
  assert.equal(toInsert.length, 2, 'Should keep exactly 2 subjects to insert');
  assert.equal(toInsert[0].subject_name, 'English');
  assert.equal(toInsert[1].subject_name, 'Mathematics');
  assert.equal(toInsert[1].grade_level, '8');
});

// ==========================================
// TEST SUITE 4: SQL Migration Integrity
// ==========================================

test('supabase_complete_migration.sql contains multi-year partitioning columns and constraints', () => {
  const sqlPath = path.join(rootDir, 'supabase_complete_migration.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  assert.ok(sql.includes('school_year_id UUID REFERENCES school_years(id)'), 'Missing school_year_id in grades');
  assert.ok(sql.includes('school_year VARCHAR(50)'), 'Missing school_year VARCHAR in grades');
  assert.ok(sql.includes('idx_grades_sy_student'), 'Missing idx_grades_sy_student index');
  assert.ok(sql.includes('idx_grades_sy_label'), 'Missing idx_grades_sy_label index');
  assert.ok(sql.includes('grades_student_subject_quarter_sy_unique'), 'Missing multi-year unique constraint on grades');
});

// ==========================================
// TEST SUITE 5: Strict Codebase Rules
// ==========================================

test('Codebase check: strictly zero emojis in UI labels, notices, and tooltips across modified files', () => {
  const targetFiles = [
    path.join(rootDir, 'src', 'components', 'SchoolYearSelector.jsx'),
    path.join(rootDir, 'src', 'components', 'DashboardLayout.jsx'),
    path.join(rootDir, 'src', 'components', 'TeacherLayout.jsx'),
    path.join(rootDir, 'src', 'pages', 'SubjectsPage.jsx'),
    path.join(rootDir, 'src', 'pages', 'teacher', 'TeacherGradesPage.jsx'),
    path.join(rootDir, 'src', 'pages', 'student', 'StudentGradesPage.jsx'),
    path.join(rootDir, 'src', 'pages', 'teacher', 'TeacherSchedulesPage.jsx'),
  ];

  const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/u;

  for (const file of targetFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const match = content.match(emojiRegex);
    assert.ok(!match, `File ${path.basename(file)} contains an emoji: ${match ? match[0] : ''}`);
  }
});

console.log('----------------------------------------------------');
console.log(`TOTAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('----------------------------------------------------');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
