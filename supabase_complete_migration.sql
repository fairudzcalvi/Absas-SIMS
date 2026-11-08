-- ==============================================================================
-- ABSAS SIMS - Comprehensive Database Migration
-- Architecture: Multi-Year Academic Calendar, Quarters, Sections, SHS Strands,
--               Faculty Positions, Student Lifecycle Archiving, Scholarships, 
--               Financial Transactions (OR), Policies, and Enrollments.
-- ==============================================================================

-- 1. Enable Necessary Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. ACADEMIC STRUCTURE: SCHOOL YEARS & QUARTERS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS school_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_label VARCHAR(50) UNIQUE NOT NULL, -- e.g. "2024-2025", "2025-2026"
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT FALSE,
    semester_count INT DEFAULT 2, -- e.g. 2 semesters, 1 full year, 3 trimesters
    quarter_count INT DEFAULT 4,  -- e.g. 4 quarters, 2 semestral periods
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration support for existing school_years table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='school_years' AND column_name='semester_count') THEN
        ALTER TABLE school_years ADD COLUMN semester_count INT DEFAULT 2;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='school_years' AND column_name='quarter_count') THEN
        ALTER TABLE school_years ADD COLUMN quarter_count INT DEFAULT 4;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS quarters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_year_id UUID REFERENCES school_years(id) ON DELETE CASCADE,
    quarter_number INT NOT NULL,
    quarter_name VARCHAR(100) NOT NULL, -- "1st Quarter", "2nd Quarter", etc.
    semester_name VARCHAR(100) DEFAULT '1st Semester', -- "1st Semester", "2nd Semester", etc.
    is_active BOOLEAN DEFAULT FALSE,
    is_grading_open BOOLEAN DEFAULT TRUE,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_sy_quarter UNIQUE (school_year_id, quarter_number)
);

-- Migration support for existing quarters table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quarters' AND column_name='semester_name') THEN
        ALTER TABLE quarters ADD COLUMN semester_name VARCHAR(100) DEFAULT '1st Semester';
    END IF;
END $$;

-- ==============================================================================
-- 3. SENIOR HIGH SCHOOL (SHS) STRANDS & TRACKS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS shs_strands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strand_code VARCHAR(50) UNIQUE NOT NULL, -- "STEM", "ABM", "HUMSS", "GAS", "TVL"
    strand_name VARCHAR(255) NOT NULL,
    track_type VARCHAR(100) DEFAULT 'Academic Track', -- "Academic Track", "TVL Track"
    description TEXT,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. DYNAMIC SECTIONS (Supports Multiple Sections Per Grade Level & SHS Strands)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 1 AND 12),
    section_name VARCHAR(100) NOT NULL, -- e.g. "Diamond", "Emerald", "STEM-A"
    strand_id UUID REFERENCES shs_strands(id) ON DELETE SET NULL, -- NULL for Grades 1-10
    adviser_id BIGINT, -- Links to faculty(faculty_record_id)
    school_year_id UUID REFERENCES school_years(id) ON DELETE CASCADE,
    room_number VARCHAR(50),
    max_capacity INT DEFAULT 45,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. SCHOLARSHIPS & DISCOUNT MATRIX
-- ==============================================================================

CREATE TABLE IF NOT EXISTS scholarships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL, -- "ESC Voucher", "Academic Top 1", "Sibling Discount"
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value NUMERIC(10,2) NOT NULL DEFAULT 0.00, -- e.g. 100.00 for 100%, or 5000.00 for fixed
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. SCHOOL POLICIES & GRADING CONFIGURATION
-- ==============================================================================

CREATE TABLE IF NOT EXISTS school_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Academic' CHECK (category IN ('Academic', 'Attendance', 'Discipline', 'Financial', 'General')),
    written_work_pct NUMERIC(5,2) DEFAULT 30.00,
    performance_task_pct NUMERIC(5,2) DEFAULT 50.00,
    quarterly_exam_pct NUMERIC(5,2) DEFAULT 20.00,
    passing_grade NUMERIC(5,2) DEFAULT 75.00,
    attendance_warning_threshold INT DEFAULT 10,
    description TEXT,
    document_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. ENROLLMENTS & YEARLY LIFECYCLE MANAGEMENT
-- ==============================================================================

CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_record_id BIGINT NOT NULL, -- Links to students(student_record_id)
    school_year_id UUID REFERENCES school_years(id) ON DELETE CASCADE,
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 1 AND 12),
    strand_id UUID REFERENCES shs_strands(id) ON DELETE SET NULL,
    section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
    enrollment_type VARCHAR(50) DEFAULT 'Continuing' CHECK (enrollment_type IN ('New Enrollee', 'Continuing', 'Transferee', 'Returnee')),
    enrollment_status VARCHAR(50) DEFAULT 'Enrolled' CHECK (enrollment_status IN ('Pending', 'Approved', 'Enrolled', 'Dropped', 'Transferred Out', 'Graduated')),
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE SET NULL,
    requirements_submitted JSONB DEFAULT '{"psa_birth_cert": false, "form_138": false, "form_137": false, "good_moral": false, "medical_clearance": false}',
    date_enrolled DATE DEFAULT CURRENT_DATE,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. ENHANCE EXISTING TABLES (Non-Destructive ALTER TABLE ADD COLUMN)
-- ==============================================================================

-- A. Students Table Enhancements
DO $$ 
BEGIN
    -- Add is_archived
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='is_archived') THEN
        ALTER TABLE students ADD COLUMN is_archived BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add current_strand_id for SHS
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='current_strand_id') THEN
        ALTER TABLE students ADD COLUMN current_strand_id UUID REFERENCES shs_strands(id) ON DELETE SET NULL;
    END IF;

    -- Add current_section_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='current_section_id') THEN
        ALTER TABLE students ADD COLUMN current_section_id UUID REFERENCES sections(id) ON DELETE SET NULL;
    END IF;

    -- Add scholarship_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='scholarship_id') THEN
        ALTER TABLE students ADD COLUMN scholarship_id UUID REFERENCES scholarships(id) ON DELETE SET NULL;
    END IF;

    -- Add student_type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='student_type') THEN
        ALTER TABLE students ADD COLUMN student_type VARCHAR(50) DEFAULT 'Continuing';
    END IF;

    -- Add address
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='address') THEN
        ALTER TABLE students ADD COLUMN address TEXT;
    END IF;

    -- Add guardian_relation
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='guardian_relation') THEN
        ALTER TABLE students ADD COLUMN guardian_relation VARCHAR(100) DEFAULT 'Parent';
    END IF;

    -- Update grade_level check constraint to allow Senior High School (Grades 11 & 12)
    ALTER TABLE students DROP CONSTRAINT IF EXISTS students_grade_level_check;
    ALTER TABLE students ADD CONSTRAINT students_grade_level_check CHECK (grade_level BETWEEN 1 AND 12);

    -- Update status check constraint to allow full lifecycle statuses
    ALTER TABLE students DROP CONSTRAINT IF EXISTS students_status_check;
    ALTER TABLE students ADD CONSTRAINT students_status_check CHECK (status IN ('Active', 'Inactive', 'Graduated', 'Transferred', 'Archived', 'Dropped', 'active', 'inactive', 'graduated', 'transferred', 'archived', 'dropped'));
END $$;

-- B. Faculty Table Enhancements
DO $$ 
BEGIN
    -- Add position hierarchy (Principal, Department Head, Adviser, Subject Teacher)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='faculty' AND column_name='position') THEN
        ALTER TABLE faculty ADD COLUMN position VARCHAR(100) DEFAULT 'Subject Teacher';
    END IF;

    -- Add is_archived
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='faculty' AND column_name='is_archived') THEN
        ALTER TABLE faculty ADD COLUMN is_archived BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add department
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='faculty' AND column_name='department') THEN
        ALTER TABLE faculty ADD COLUMN department VARCHAR(100) DEFAULT 'Junior High';
    END IF;

    -- Update faculty constraints to allow Senior High School (Grades 11 & 12) and all department structures
    ALTER TABLE faculty DROP CONSTRAINT IF EXISTS faculty_employment_status_check;
    ALTER TABLE faculty DROP CONSTRAINT IF EXISTS faculty_status_check;
    ALTER TABLE faculty DROP CONSTRAINT IF EXISTS faculty_adviser_grade_level_check;
    ALTER TABLE faculty DROP CONSTRAINT IF EXISTS faculty_department_check;
    ALTER TABLE faculty DROP CONSTRAINT IF EXISTS faculty_role_check;
    ALTER TABLE faculty ADD CONSTRAINT faculty_adviser_grade_level_check CHECK (adviser_grade_level IS NULL OR (adviser_grade_level BETWEEN 1 AND 12));
END $$;

-- C. Curriculums Table (Dynamic - schools can define their own)
CREATE TABLE IF NOT EXISTS curriculums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,                      -- e.g. "DepEd K-12 Elementary"
    code VARCHAR(50) UNIQUE NOT NULL,               -- e.g. "ELEM", "JHS", "SHS"
    grade_level_start INT NOT NULL DEFAULT 1,       -- Inclusive start grade
    grade_level_end INT NOT NULL DEFAULT 6,         -- Inclusive end grade
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default DepEd K-12 curriculums
INSERT INTO curriculums (name, code, grade_level_start, grade_level_end, description, sort_order, is_active) VALUES
    ('Elementary', 'ELEM', 1, 6, 'DepEd K-12 Elementary curriculum covering Grades 1 to 6.', 1, TRUE),
    ('Junior High School', 'JHS', 7, 10, 'DepEd K-12 Junior High School curriculum covering Grades 7 to 10.', 2, TRUE),
    ('Senior High School', 'SHS', 11, 12, 'DepEd K-12 Senior High School curriculum covering Grades 11 and 12.', 3, TRUE)
ON CONFLICT (code) DO NOTHING;

-- C. Subjects Table Enhancements
DO $$ 
BEGIN
    -- Add curriculum_id FK to curriculums
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subjects' AND column_name='curriculum_id') THEN
        ALTER TABLE subjects ADD COLUMN curriculum_id UUID REFERENCES curriculums(id) ON DELETE SET NULL;
    END IF;

    -- Add strand_id for SHS Subjects
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subjects' AND column_name='strand_id') THEN
        ALTER TABLE subjects ADD COLUMN strand_id UUID REFERENCES shs_strands(id) ON DELETE SET NULL;
    END IF;

    -- Add semester (for SHS: 1st Semester, 2nd Semester)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subjects' AND column_name='semester') THEN
        ALTER TABLE subjects ADD COLUMN semester VARCHAR(20) DEFAULT NULL;
    END IF;

    -- Update grade_level check constraint for subjects
    ALTER TABLE subjects DROP CONSTRAINT IF EXISTS subjects_grade_level_check;
    ALTER TABLE subjects ADD CONSTRAINT subjects_grade_level_check CHECK (grade_level BETWEEN 1 AND 12);
END $$;

-- D. Sections Table Enhancements & Deduplication
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sections' AND column_name='strand_id') THEN
        ALTER TABLE sections ADD COLUMN strand_id UUID REFERENCES shs_strands(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sections' AND column_name='adviser_id') THEN
        ALTER TABLE sections ADD COLUMN adviser_id BIGINT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sections' AND column_name='school_year_id') THEN
        ALTER TABLE sections ADD COLUMN school_year_id UUID REFERENCES school_years(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sections' AND column_name='max_capacity') THEN
        ALTER TABLE sections ADD COLUMN max_capacity INT DEFAULT 45;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sections' AND column_name='room_number') THEN
        ALTER TABLE sections ADD COLUMN room_number VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sections' AND column_name='status') THEN
        ALTER TABLE sections ADD COLUMN status VARCHAR(20) DEFAULT 'Active';
    END IF;

    -- Clean up duplicate grade level prefixes from existing section records
    UPDATE sections 
    SET section_name = TRIM(REGEXP_REPLACE(section_name, '^(Grade|Gr\.?)\s*\d+\s*[-–—:]*\s*', '', 'i'))
    WHERE section_name ~* '^(Grade|Gr\.?)\s*\d+\s*[-–—:]*\s*';

    -- Backfill school_year_id for legacy sections if NULL
    UPDATE sections
    SET school_year_id = (SELECT id FROM school_years WHERE is_active = true LIMIT 1)
    WHERE school_year_id IS NULL;

    -- Drop legacy index that restricted sections globally across all school years
    DROP INDEX IF EXISTS idx_sections_grade_name_unique;

    -- Remove duplicate section rows within the same school year keeping the most recent record
    DELETE FROM sections a USING sections b
    WHERE a.id < b.id
      AND a.school_year_id IS NOT DISTINCT FROM b.school_year_id
      AND a.grade_level = b.grade_level
      AND LOWER(TRIM(a.section_name)) = LOWER(TRIM(b.section_name));

    -- Create Unique Index so grade level sections cannot be duplicated within the same school year
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_sections_sy_grade_name_unique') THEN
        CREATE UNIQUE INDEX idx_sections_sy_grade_name_unique 
          ON sections (COALESCE(school_year_id, '00000000-0000-0000-0000-000000000000'::uuid), grade_level, LOWER(TRIM(section_name)));
    END IF;
END $$;

-- E. Schedules Table Creation & Enhancements
CREATE TABLE IF NOT EXISTS schedules (
    schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject VARCHAR(255) NOT NULL,
    teacher VARCHAR(255),
    faculty_id BIGINT,
    teacher_name VARCHAR(255),
    day_of_week VARCHAR(50) NOT NULL,
    time_start TIME NOT NULL,
    time_end TIME NOT NULL,
    room VARCHAR(100),
    section_name VARCHAR(100),
    grade_level INT,
    school_year VARCHAR(50) DEFAULT '2025-2026',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ 
BEGIN
    -- Ensure teacher column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schedules' AND column_name='teacher') THEN
        ALTER TABLE schedules ADD COLUMN teacher VARCHAR(255);
    END IF;

    -- Ensure faculty_id column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schedules' AND column_name='faculty_id') THEN
        ALTER TABLE schedules ADD COLUMN faculty_id BIGINT;
    END IF;

    -- Ensure teacher_name column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schedules' AND column_name='teacher_name') THEN
        ALTER TABLE schedules ADD COLUMN teacher_name VARCHAR(255);
    END IF;

    -- Add section_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schedules' AND column_name='section_id') THEN
        ALTER TABLE schedules ADD COLUMN section_id UUID REFERENCES sections(id) ON DELETE SET NULL;
    END IF;

    -- Add school_year_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schedules' AND column_name='school_year_id') THEN
        ALTER TABLE schedules ADD COLUMN school_year_id UUID REFERENCES school_years(id) ON DELETE SET NULL;
    END IF;

    -- Add quarter_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schedules' AND column_name='quarter_id') THEN
        ALTER TABLE schedules ADD COLUMN quarter_id UUID REFERENCES quarters(id) ON DELETE SET NULL;
    END IF;
END $$;

-- F. Grades Table Enhancements (Multi-Year Academic Partitioning)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='grades' AND column_name='school_year_id') THEN
        ALTER TABLE grades ADD COLUMN school_year_id UUID REFERENCES school_years(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='grades' AND column_name='school_year') THEN
        ALTER TABLE grades ADD COLUMN school_year VARCHAR(50) DEFAULT '2025-2026';
    END IF;

    -- Create index for high-speed multi-year grade retrieval
    CREATE INDEX IF NOT EXISTS idx_grades_sy_student ON grades(school_year_id, student_record_id);
    CREATE INDEX IF NOT EXISTS idx_grades_sy_label ON grades(school_year, student_record_id);

    -- Ensure multi-year unique constraint allows grades per student, subject, quarter, and school year
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'grades_student_subject_quarter_sy_unique'
    ) THEN
        BEGIN
            ALTER TABLE grades 
            ADD CONSTRAINT grades_student_subject_quarter_sy_unique 
            UNIQUE (student_record_id, subject, quarter, school_year);
        EXCEPTION WHEN duplicate_table OR duplicate_object THEN
            NULL;
        END;
    END IF;
END $$;

-- G. Student Finances Enhancements
DO $$ 
BEGIN
    -- Add scholarship_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_finances' AND column_name='scholarship_id') THEN
        ALTER TABLE student_finances ADD COLUMN scholarship_id UUID REFERENCES scholarships(id) ON DELETE SET NULL;
    END IF;

    -- Add discount_amount
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_finances' AND column_name='discount_amount') THEN
        ALTER TABLE student_finances ADD COLUMN discount_amount NUMERIC(10,2) DEFAULT 0.00;
    END IF;

    -- Add school_year_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_finances' AND column_name='school_year_id') THEN
        ALTER TABLE student_finances ADD COLUMN school_year_id UUID REFERENCES school_years(id) ON DELETE SET NULL;
    END IF;
END $$;

-- F. Payments Enhancements (Official Receipts)
DO $$ 
BEGIN
    -- Add or_number (Official Receipt Number)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='or_number') THEN
        ALTER TABLE payments ADD COLUMN or_number VARCHAR(100);
    END IF;

    -- Add school_year_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='school_year_id') THEN
        ALTER TABLE payments ADD COLUMN school_year_id UUID REFERENCES school_years(id) ON DELETE SET NULL;
    END IF;

    -- Add receipt_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='receipt_url') THEN
        ALTER TABLE payments ADD COLUMN receipt_url TEXT;
    END IF;
END $$;

-- ==============================================================================
-- 9. PERFORMANCE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_sections_school_year ON sections(school_year_id);
CREATE INDEX IF NOT EXISTS idx_sections_grade_level ON sections(grade_level);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_record_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_school_year ON enrollments(school_year_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_section ON enrollments(section_id);
CREATE INDEX IF NOT EXISTS idx_students_archived ON students(is_archived);
CREATE INDEX IF NOT EXISTS idx_faculty_archived ON faculty(is_archived);
CREATE INDEX IF NOT EXISTS idx_payments_or_number ON payments(or_number);

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE school_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarters ENABLE ROW LEVEL SECURITY;
ALTER TABLE shs_strands ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Grant table permissions to public, anon, and authenticated
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, postgres, service_role;

GRANT ALL ON school_years TO anon, authenticated, postgres, service_role;
GRANT ALL ON quarters TO anon, authenticated, postgres, service_role;
GRANT ALL ON shs_strands TO anon, authenticated, postgres, service_role;
GRANT ALL ON sections TO anon, authenticated, postgres, service_role;
GRANT ALL ON scholarships TO anon, authenticated, postgres, service_role;
GRANT ALL ON school_policies TO anon, authenticated, postgres, service_role;
GRANT ALL ON enrollments TO anon, authenticated, postgres, service_role;

-- Allow read/write access to public and authenticated users
DO $$ 
BEGIN
    -- school_years
    DROP POLICY IF EXISTS "Allow all access to school_years" ON school_years;
    DROP POLICY IF EXISTS "Allow authenticated full access to school_years" ON school_years;
    CREATE POLICY "Allow all access to school_years" ON school_years FOR ALL TO public USING (true) WITH CHECK (true);

    -- quarters
    DROP POLICY IF EXISTS "Allow all access to quarters" ON quarters;
    DROP POLICY IF EXISTS "Allow authenticated full access to quarters" ON quarters;
    CREATE POLICY "Allow all access to quarters" ON quarters FOR ALL TO public USING (true) WITH CHECK (true);

    -- shs_strands
    DROP POLICY IF EXISTS "Allow all access to shs_strands" ON shs_strands;
    DROP POLICY IF EXISTS "Allow authenticated full access to shs_strands" ON shs_strands;
    CREATE POLICY "Allow all access to shs_strands" ON shs_strands FOR ALL TO public USING (true) WITH CHECK (true);

    -- sections
    DROP POLICY IF EXISTS "Allow all access to sections" ON sections;
    DROP POLICY IF EXISTS "Allow authenticated full access to sections" ON sections;
    CREATE POLICY "Allow all access to sections" ON sections FOR ALL TO public USING (true) WITH CHECK (true);

    -- scholarships
    DROP POLICY IF EXISTS "Allow all access to scholarships" ON scholarships;
    DROP POLICY IF EXISTS "Allow authenticated full access to scholarships" ON scholarships;
    CREATE POLICY "Allow all access to scholarships" ON scholarships FOR ALL TO public USING (true) WITH CHECK (true);

    -- school_policies
    DROP POLICY IF EXISTS "Allow all access to school_policies" ON school_policies;
    DROP POLICY IF EXISTS "Allow authenticated full access to school_policies" ON school_policies;
    CREATE POLICY "Allow all access to school_policies" ON school_policies FOR ALL TO public USING (true) WITH CHECK (true);

    -- enrollments
    DROP POLICY IF EXISTS "Allow all access to enrollments" ON enrollments;
    DROP POLICY IF EXISTS "Allow authenticated full access to enrollments" ON enrollments;
    CREATE POLICY "Allow all access to enrollments" ON enrollments FOR ALL TO public USING (true) WITH CHECK (true);
END $$;

-- ==============================================================================
-- 11. STARTER SEED DATA (Standard DepEd & School Configuration)
-- ==============================================================================

-- 1. School Years
INSERT INTO school_years (year_label, start_date, end_date, is_active)
VALUES 
    ('2024-2025', '2024-06-01', '2025-03-31', FALSE),
    ('2025-2026', '2025-06-01', '2026-03-31', TRUE)
ON CONFLICT (year_label) DO NOTHING;

-- 2. Quarters for Active School Year (2025-2026)
DO $$
DECLARE
    sy_id UUID;
BEGIN
    SELECT id INTO sy_id FROM school_years WHERE year_label = '2025-2026' LIMIT 1;
    IF sy_id IS NOT NULL THEN
        INSERT INTO quarters (school_year_id, quarter_number, quarter_name, is_active, is_grading_open)
        VALUES 
            (sy_id, 1, '1st Quarter', TRUE, TRUE),
            (sy_id, 2, '2nd Quarter', FALSE, TRUE),
            (sy_id, 3, '3rd Quarter', FALSE, FALSE),
            (sy_id, 4, '4th Quarter', FALSE, FALSE)
        ON CONFLICT (school_year_id, quarter_number) DO NOTHING;
    END IF;
END $$;

-- 3. Senior High School Strands
INSERT INTO shs_strands (strand_code, strand_name, track_type, description, status)
VALUES 
    ('STEM', 'Science, Technology, Engineering, and Mathematics', 'Academic Track', 'Focuses on advanced mathematics, natural sciences, and engineering foundations.', 'Active'),
    ('ABM', 'Accountancy, Business, and Management', 'Academic Track', 'Focuses on basic accounting, financial management, business enterprise, and economics.', 'Active'),
    ('HUMSS', 'Humanities and Social Sciences', 'Academic Track', 'Focuses on communication, journalism, literature, political science, and philosophy.', 'Active'),
    ('GAS', 'General Academic Strand', 'Academic Track', 'Flexible track designed for students exploring diverse multidisciplinary career paths.', 'Active'),
    ('TVL-ICT', 'Information and Communications Technology', 'TVL Track', 'Technical specialization in programming, web design, networking, and digital systems.', 'Active'),
    ('TVL-HE', 'Home Economics', 'TVL Track', 'Specialization in bread and pastry production, culinary arts, and hospitality operations.', 'Active')
ON CONFLICT (strand_code) DO NOTHING;

-- 4. Standard Scholarships & Grants
INSERT INTO scholarships (name, code, discount_type, discount_value, description, is_active)
VALUES 
    ('ESC Voucher Program', 'ESC-GRANT', 'fixed_amount', 9000.00, 'DepEd Education Service Contracting (ESC) tuition subsidy grant.', TRUE),
    ('Academic Top 1 (Valedictorian)', 'ACAD-TOP1', 'percentage', 100.00, 'Full 100% tuition fee waiver for rank 1 student achievers.', TRUE),
    ('Academic Top 2 (Salutatorian)', 'ACAD-TOP2', 'percentage', 50.00, '50% tuition fee discount for rank 2 student achievers.', TRUE),
    ('Sibling Discount', 'SIBLING-10', 'percentage', 10.00, '10% discount applied to the younger sibling enrolled simultaneously.', TRUE),
    ('Athletic / Sports Scholar', 'SPORTS-GRANT', 'percentage', 75.00, 'Varsity and school representative athletic grant.', TRUE)
ON CONFLICT (code) DO NOTHING;

-- 5. Standard DepEd School Policy & Grading Formula
INSERT INTO school_policies (policy_name, category, written_work_pct, performance_task_pct, quarterly_exam_pct, passing_grade, attendance_warning_threshold, description, is_active)
VALUES 
    ('DepEd Standard JHS Grading Policy', 'Academic', 30.00, 50.00, 20.00, 75.00, 10, 'Standard DepEd Order No. 8, s. 2015 weights for Junior High School core subjects.', TRUE),
    ('DepEd SHS STEM Specialization Policy', 'Academic', 25.00, 50.00, 25.00, 75.00, 10, 'Standard grading criteria for Senior High School specialized STEM subjects.', TRUE)
ON CONFLICT DO NOTHING;

-- 6. Starter Sections for Active School Year (Grade 1 to 12)
DO $$
DECLARE
    sy_id UUID;
    stem_id UUID;
    abm_id UUID;
BEGIN
    SELECT id INTO sy_id FROM school_years WHERE year_label = '2025-2026' LIMIT 1;
    SELECT id INTO stem_id FROM shs_strands WHERE strand_code = 'STEM' LIMIT 1;
    SELECT id INTO abm_id FROM shs_strands WHERE strand_code = 'ABM' LIMIT 1;

    IF sy_id IS NOT NULL THEN
        INSERT INTO sections (grade_level, section_name, school_year_id, max_capacity, status)
        VALUES 
            (1, 'St. Therese', sy_id, 40, 'Active'),
            (2, 'St. Jude', sy_id, 40, 'Active'),
            (3, 'St. Joseph', sy_id, 40, 'Active'),
            (4, 'St. Michael', sy_id, 40, 'Active'),
            (5, 'St. Gabriel', sy_id, 40, 'Active'),
            (6, 'St. Raphael', sy_id, 40, 'Active'),
            (7, 'Diamond', sy_id, 45, 'Active'),
            (7, 'Emerald', sy_id, 45, 'Active'),
            (8, 'Ruby', sy_id, 45, 'Active'),
            (8, 'Sapphire', sy_id, 45, 'Active'),
            (9, 'Pearl', sy_id, 45, 'Active'),
            (9, 'Opal', sy_id, 45, 'Active'),
            (10, 'Gold', sy_id, 45, 'Active'),
            (10, 'Silver', sy_id, 45, 'Active')
        ON CONFLICT DO NOTHING;

        -- SHS Sections with Strands
        IF stem_id IS NOT NULL THEN
            INSERT INTO sections (grade_level, section_name, strand_id, school_year_id, max_capacity, status)
            VALUES 
                (11, 'STEM A', stem_id, sy_id, 45, 'Active'),
                (12, 'STEM A', stem_id, sy_id, 45, 'Active')
            ON CONFLICT DO NOTHING;
        END IF;

        IF abm_id IS NOT NULL THEN
            INSERT INTO sections (grade_level, section_name, strand_id, school_year_id, max_capacity, status)
            VALUES 
                (11, 'ABM A', abm_id, sy_id, 45, 'Active'),
                (12, 'ABM A', abm_id, sy_id, 45, 'Active')
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
END $$;

-- Reload Supabase PostgREST Schema Cache
NOTIFY pgrst, 'reload schema';

