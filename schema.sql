-- ─────────────────────────────────────────────────────────────
--  SMIT 동아리포털 · Supabase 스키마
--  실행: Supabase 대시보드 → SQL Editor → 아래 전체 복사 → Run
-- ─────────────────────────────────────────────────────────────

-- UUID 확장 (Supabase 기본 활성화)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── 동아리 개설 신청 테이블 ───────────────────────────────────
CREATE TABLE IF NOT EXISTS club_applications (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 신청 메타
  source                TEXT        NOT NULL DEFAULT 'form',          -- 'form' | 'email'
  status                TEXT        NOT NULL DEFAULT 'pending',       -- pending|review|approved|certificate_issued|rejected
  note                  TEXT,                                          -- 관리자 메모
  submitted_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reply_due_at          TIMESTAMPTZ,                                   -- 원우회 답변 기한 (제출일+3일)
  reviewed_at           TIMESTAMPTZ,
  certificate_number    TEXT,                                          -- SMIT-CLUB-YYYYMMDD-XXXX
  certificate_issued_at TIMESTAMPTZ,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 동아리 기본 정보
  club_name_ko          TEXT        NOT NULL,
  club_name_en          TEXT        NOT NULL,
  category              TEXT,

  -- 대표자 정보
  president_name        TEXT        NOT NULL,
  student_id            TEXT        NOT NULL,
  email                 TEXT        NOT NULL,
  phone                 TEXT,
  nationality           TEXT,

  -- 기타 신청 정보
  advisor               TEXT,
  member_count          INTEGER     DEFAULT 0,
  purpose               TEXT,
  activities            TEXT,
  extra                 TEXT,

  -- 창립 회원 목록 (JSON 배열: [{name, id, nationality}])
  members               JSONB       NOT NULL DEFAULT '[]'::jsonb,

  -- 자격 검토 결과 (JSON: {requiredFields, minMembers, hasKorea, hasThreeCountries, memberCount, canApprove})
  review                JSONB       NOT NULL DEFAULT '{}'::jsonb
);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_club_applications_updated_at ON club_applications;
CREATE TRIGGER trg_club_applications_updated_at
  BEFORE UPDATE ON club_applications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_club_applications_status       ON club_applications (status);
CREATE INDEX IF NOT EXISTS idx_club_applications_submitted_at ON club_applications (submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_club_applications_email        ON club_applications (email);

-- ─── Row Level Security ────────────────────────────────────────
ALTER TABLE club_applications ENABLE ROW LEVEL SECURITY;

-- anon: 신청서 제출만 가능 (INSERT)
DROP POLICY IF EXISTS "anon_insert" ON club_applications;
CREATE POLICY "anon_insert" ON club_applications
  FOR INSERT TO anon
  WITH CHECK (true);

-- anon: SELECT 불가 (개인정보 보호)
-- service_role은 RLS 우회 → 관리자 API 라우트에서 service_role 클라이언트 사용

-- ─── 확인용 조회 (실행 후 테이블 구조 확인) ────────────────────
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'club_applications' ORDER BY ordinal_position;
