create table if not exists public.club_applications (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'form',
  status text not null default 'pending'
    check (status in ('pending', 'review', 'approved', 'rejected', 'certificate_issued')),
  submitted_at timestamptz not null default now(),
  reply_due_at timestamptz not null default (now() + interval '3 days'),
  reviewed_at timestamptz,
  certificate_number text,
  certificate_issued_at timestamptz,
  note text,
  club_name_ko text,
  club_name_en text,
  category text,
  president_name text,
  student_id text,
  email text,
  phone text,
  nationality text,
  advisor text,
  member_count integer,
  purpose text,
  activities text,
  extra text,
  members jsonb not null default '[]'::jsonb,
  review jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists club_applications_status_idx
on public.club_applications (status, submitted_at desc);

alter table public.club_applications enable row level security;

drop policy if exists "Public can submit club applications" on public.club_applications;
create policy "Public can submit club applications"
on public.club_applications
for insert
to anon
with check (status = 'pending');

-- 관리자 조회/수정/삭제/등록증 발급은 브라우저 anon key가 아니라
-- Next.js API Route의 SUPABASE_SERVICE_ROLE_KEY로만 처리합니다.
