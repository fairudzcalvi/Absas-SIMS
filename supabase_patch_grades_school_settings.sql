-- ============================================================================
-- PATCH: grades multi-year columns + school_settings table
-- Safe to run multiple times (idempotent). Paste into the Supabase SQL Editor.
-- Derived from: SettingsPage.jsx (SchoolProfileTab), feeMatrix.js, AuthContext.jsx,
--               TeacherGradesPage.jsx / StudentGradesPage.jsx
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. school_settings  (single-row table; the app always reads/writes id = 1)
--    Columns used by the frontend:
--      SettingsPage : school_name, abbreviation, address, contact_number,
--                     email, school_year, principal, registrar (+ id = 1)
--      feeMatrix.js : fee_matrix (JSON array of fees per grade)
--      AuthContext  : school_year (fallback when school_years is empty)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS school_settings (
    id              INTEGER PRIMARY KEY DEFAULT 1,
    school_name     TEXT,
    abbreviation    TEXT,
    address         TEXT,
    contact_number  TEXT,
    email           TEXT,
    school_year     TEXT,
    principal       TEXT,
    registrar       TEXT,
    fee_matrix      JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- In case the table already existed in a partial form, make sure every column is there
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS school_name    TEXT;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS abbreviation   TEXT;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS address        TEXT;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS contact_number TEXT;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS email          TEXT;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS school_year    TEXT;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS principal      TEXT;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS registrar      TEXT;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS fee_matrix     JSONB;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS created_at     TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ DEFAULT NOW();

-- Seed the single row (the feeMatrix.js update(...).eq('id', 1) needs it to exist).
-- Values mirror the defaults shown in SettingsPage.
INSERT INTO school_settings (id, school_name, abbreviation, address, contact_number, email, school_year, principal, registrar)
VALUES (1, 'A.B. Simpson Alliance School Inc.', 'ABSAS', 'Zamboanga City, Philippines',
        '(062) 991-XXXX', 'absas.sims.portal@gmail.com', '2025-2026',
        'Dr. Evelyn R. Santos', 'Maria Clara De Leon')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to school_settings" ON school_settings;
CREATE POLICY "Allow all access to school_settings" ON school_settings
    FOR ALL TO public USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 2. grades  (multi-year partitioning)
--    Frontend needs: school_year_id (UUID), school_year (text label), and a
--    unique key (student_record_id, subject, quarter, school_year) for upserts.
-- ----------------------------------------------------------------------------
DO $$
BEGIN
    IF to_regclass('public.grades') IS NULL THEN
        RAISE NOTICE 'Table public.grades does not exist - skipping grades patch.';
        RETURN;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'grades' AND column_name = 'school_year_id') THEN
        ALTER TABLE public.grades ADD COLUMN school_year_id UUID REFERENCES school_years(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'grades' AND column_name = 'school_year') THEN
        ALTER TABLE public.grades ADD COLUMN school_year VARCHAR(50) DEFAULT '2025-2026';
    END IF;

    -- Keep the text label consistent with school_year_id where the id is known
    UPDATE public.grades g
       SET school_year = sy.year_label
      FROM school_years sy
     WHERE g.school_year_id = sy.id
       AND g.school_year IS DISTINCT FROM sy.year_label;

    CREATE INDEX IF NOT EXISTS idx_grades_sy_student ON public.grades(school_year_id, student_record_id);
    CREATE INDEX IF NOT EXISTS idx_grades_sy_label   ON public.grades(school_year, student_record_id);

    -- Multi-year unique key used by upsert onConflict. If existing data already has
    -- duplicates the constraint cannot be created; we warn instead of failing the script.
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'grades_student_subject_quarter_sy_unique') THEN
        BEGIN
            ALTER TABLE public.grades
                ADD CONSTRAINT grades_student_subject_quarter_sy_unique
                UNIQUE (student_record_id, subject, quarter, school_year);
        EXCEPTION
            WHEN duplicate_table OR duplicate_object THEN
                NULL;
            WHEN unique_violation THEN
                RAISE NOTICE 'Could not add unique constraint: duplicate grade rows exist. Find them with: SELECT student_record_id, subject, quarter, school_year, COUNT(*) FROM grades GROUP BY 1,2,3,4 HAVING COUNT(*) > 1;';
            WHEN undefined_column THEN
                RAISE NOTICE 'Could not add unique constraint: grades is missing student_record_id, subject or quarter.';
        END;
    END IF;
END $$;

-- OPTIONAL (not run automatically): if grades still has an OLD unique constraint on
-- only (student_record_id, subject, quarter), it will block saving the same quarter
-- for a second school year. Find it with:
--   SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint
--   WHERE conrelid = 'public.grades'::regclass AND contype = 'u';
-- then drop it:  ALTER TABLE grades DROP CONSTRAINT <name>;

DO $$
BEGIN
    IF to_regclass('public.grades') IS NOT NULL THEN
        ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow all access to grades" ON public.grades;
        CREATE POLICY "Allow all access to grades" ON public.grades
            FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 3. Refresh the PostgREST schema cache so the API sees the new table/columns
-- ----------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
