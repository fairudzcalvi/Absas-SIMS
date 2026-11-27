-- ============================================================================
-- PATCH: School System Revisions (Billing, Enrollment, Subjects/Schedules)
-- Safe & idempotent. Paste into the Supabase SQL Editor and run once.
-- ============================================================================

-- 1. Payments column widening & constraint cleanup (sync with live DB)
DO $$
BEGIN
    IF to_regclass('public.payments') IS NOT NULL THEN
        ALTER TABLE public.payments
            ALTER COLUMN payment_for TYPE VARCHAR(150),
            ALTER COLUMN payment_method TYPE VARCHAR(50),
            ALTER COLUMN or_number TYPE VARCHAR(50),
            ALTER COLUMN reference_number TYPE VARCHAR(100);
        ALTER TABLE public.payments
            DROP CONSTRAINT IF EXISTS payments_payment_for_check,
            DROP CONSTRAINT IF EXISTS payments_payment_method_check;
    END IF;
END $$;

-- 2. Student Finances: discount stacking (ESC + Sibling) & 10-month transferee proration
DO $$
BEGIN
    IF to_regclass('public.student_finances') IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='student_finances' AND column_name='secondary_scholarship_id') THEN
            ALTER TABLE public.student_finances ADD COLUMN secondary_scholarship_id UUID REFERENCES scholarships(id) ON DELETE SET NULL;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='student_finances' AND column_name='prorated_months') THEN
            ALTER TABLE public.student_finances ADD COLUMN prorated_months INT DEFAULT 10;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='student_finances' AND column_name='months_elapsed') THEN
            ALTER TABLE public.student_finances ADD COLUMN months_elapsed INT DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='student_finances' AND column_name='is_transferee_prorated') THEN
            ALTER TABLE public.student_finances ADD COLUMN is_transferee_prorated BOOLEAN DEFAULT FALSE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='student_finances' AND column_name='discount_breakdown') THEN
            ALTER TABLE public.student_finances ADD COLUMN discount_breakdown JSONB;
        END IF;
    END IF;
END $$;

-- 3. Students & Enrollments: Transferee history, Repeater status, Stacked grants, Completion verification
DO $$
BEGIN
    IF to_regclass('public.students') IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='secondary_scholarship_id') THEN
            ALTER TABLE public.students ADD COLUMN secondary_scholarship_id UUID REFERENCES scholarships(id) ON DELETE SET NULL;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='previous_school') THEN
            ALTER TABLE public.students ADD COLUMN previous_school TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='previous_school_address') THEN
            ALTER TABLE public.students ADD COLUMN previous_school_address TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='last_grade_completed') THEN
            ALTER TABLE public.students ADD COLUMN last_grade_completed VARCHAR(50);
        ELSE
            ALTER TABLE public.students ALTER COLUMN last_grade_completed TYPE VARCHAR(50) USING last_grade_completed::text;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='last_school_year') THEN
            ALTER TABLE public.students ADD COLUMN last_school_year VARCHAR(50);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='months_elapsed') THEN
            ALTER TABLE public.students ADD COLUMN months_elapsed INT DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='completion_confirmed') THEN
            ALTER TABLE public.students ADD COLUMN completion_confirmed BOOLEAN DEFAULT FALSE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='is_repeater') THEN
            ALTER TABLE public.students ADD COLUMN is_repeater BOOLEAN DEFAULT FALSE;
        END IF;
    END IF;

    IF to_regclass('public.enrollments') IS NOT NULL THEN
        ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS enrollments_enrollment_type_check;
        ALTER TABLE public.enrollments ADD CONSTRAINT enrollments_enrollment_type_check
            CHECK (enrollment_type IN ('New Enrollee', 'Continuing', 'Transferee', 'Returnee', 'Repeater'));

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='enrollments' AND column_name='secondary_scholarship_id') THEN
            ALTER TABLE public.enrollments ADD COLUMN secondary_scholarship_id UUID REFERENCES scholarships(id) ON DELETE SET NULL;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='enrollments' AND column_name='previous_school') THEN
            ALTER TABLE public.enrollments ADD COLUMN previous_school TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='enrollments' AND column_name='previous_school_address') THEN
            ALTER TABLE public.enrollments ADD COLUMN previous_school_address TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='enrollments' AND column_name='last_grade_completed') THEN
            ALTER TABLE public.enrollments ADD COLUMN last_grade_completed VARCHAR(50);
        ELSE
            ALTER TABLE public.enrollments ALTER COLUMN last_grade_completed TYPE VARCHAR(50) USING last_grade_completed::text;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='enrollments' AND column_name='last_school_year') THEN
            ALTER TABLE public.enrollments ADD COLUMN last_school_year VARCHAR(50);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='enrollments' AND column_name='months_elapsed') THEN
            ALTER TABLE public.enrollments ADD COLUMN months_elapsed INT DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='enrollments' AND column_name='completion_confirmed') THEN
            ALTER TABLE public.enrollments ADD COLUMN completion_confirmed BOOLEAN DEFAULT FALSE;
        END IF;
    END IF;
END $$;

-- 4. Subjects & Schedules: Time-based HS subjects + Multi-day schedule support
DO $$
BEGIN
    IF to_regclass('public.subjects') IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='subjects' AND column_name='time_start') THEN
            ALTER TABLE public.subjects ADD COLUMN time_start TIME;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='subjects' AND column_name='time_end') THEN
            ALTER TABLE public.subjects ADD COLUMN time_end TIME;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='subjects' AND column_name='days_of_week') THEN
            ALTER TABLE public.subjects ADD COLUMN days_of_week VARCHAR(100);
        END IF;
        ALTER TABLE public.subjects ALTER COLUMN semester TYPE VARCHAR(50);
    END IF;

    IF to_regclass('public.schedules') IS NOT NULL THEN
        ALTER TABLE public.schedules ALTER COLUMN day_of_week TYPE VARCHAR(100);
    END IF;
END $$;

-- 5. Faculty coverage_authorized & Transcripts per-school-year scoping
DO $$
DECLARE
    con_name TEXT;
BEGIN
    IF to_regclass('public.faculty') IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='faculty' AND column_name='coverage_authorized') THEN
            ALTER TABLE public.faculty ADD COLUMN coverage_authorized BOOLEAN DEFAULT FALSE;
        END IF;
    END IF;

    IF to_regclass('public.transcripts') IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='transcripts' AND column_name='school_year') THEN
            ALTER TABLE public.transcripts ADD COLUMN school_year VARCHAR(50);
        END IF;

        -- Drop legacy single-column UNIQUE(student_record_id) constraints so transcripts persist per S.Y.
        FOR con_name IN
            SELECT c.conname
            FROM pg_constraint c
            JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
            WHERE c.conrelid = 'public.transcripts'::regclass
              AND c.contype = 'u'
              AND array_length(c.conkey, 1) = 1
              AND a.attname = 'student_record_id'
        LOOP
            EXECUTE format('ALTER TABLE public.transcripts DROP CONSTRAINT IF EXISTS %I', con_name);
        END LOOP;

        CREATE UNIQUE INDEX IF NOT EXISTS idx_transcripts_student_sy_unique
            ON public.transcripts (student_record_id, COALESCE(school_year, ''));
    END IF;
END $$;

NOTIFY pgrst, 'reload schema';
