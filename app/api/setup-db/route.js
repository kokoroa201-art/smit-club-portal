import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../lib/supabaseServer'

export const dynamic = 'force-dynamic'

const DDL = `
CREATE TABLE IF NOT EXISTS club_applications (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  source                TEXT        NOT NULL DEFAULT 'form',
  status                TEXT        NOT NULL DEFAULT 'pending',
  note                  TEXT,
  submitted_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reply_due_at          TIMESTAMPTZ,
  reviewed_at           TIMESTAMPTZ,
  certificate_number    TEXT,
  certificate_issued_at TIMESTAMPTZ,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  club_name_ko          TEXT        NOT NULL DEFAULT '',
  club_name_en          TEXT        NOT NULL DEFAULT '',
  category              TEXT,
  president_name        TEXT        NOT NULL DEFAULT '',
  student_id            TEXT        NOT NULL DEFAULT '',
  email                 TEXT        NOT NULL DEFAULT '',
  phone                 TEXT,
  nationality           TEXT,
  advisor               TEXT,
  member_count          INTEGER     DEFAULT 0,
  purpose               TEXT,
  activities            TEXT,
  extra                 TEXT,
  members               JSONB       NOT NULL DEFAULT '[]'::jsonb,
  review                JSONB       NOT NULL DEFAULT '{}'::jsonb
);
`

async function tableExists() {
  const { error } = await supabaseAdmin
    .from('club_applications')
    .select('id')
    .limit(1)

  if (error?.code === '42P01') return false  // relation does not exist
  if (error) throw new Error(error.message)
  return true
}

async function createTableViaRpc() {
  const { error } = await supabaseAdmin.rpc('exec_sql', { query: DDL })
  if (error) throw error
}

async function createTableViaHttp() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY
  const res  = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'apikey':        key,
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({ query: DDL }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`HTTP ${res.status}: ${body}`)
  }
}

export async function GET() {
  if (!isSupabaseAdminConfigured) {
    return NextResponse.json({
      ok: false,
      message: 'SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.',
    }, { status: 503 })
  }

  const exists = await tableExists().catch(() => null)

  if (exists === true) {
    return NextResponse.json({
      ok: true,
      message: 'club_applications 테이블이 이미 존재합니다. 연결 정상!',
      tableExists: true,
    })
  }

  // 테이블 미존재 → exec_sql RPC 함수로 시도
  try {
    await createTableViaRpc()
    return NextResponse.json({
      ok: true,
      message: 'club_applications 테이블을 생성했습니다.',
      tableExists: false,
      created: true,
    })
  } catch {
    // exec_sql RPC 없으면 → 수동 안내
    return NextResponse.json({
      ok: false,
      message: [
        'exec_sql RPC 함수가 없어 자동 생성에 실패했습니다.',
        'Supabase SQL Editor에서 schema.sql을 실행해 주세요.',
        '대시보드: https://ipuxbaltawnkertzlwgr.supabase.co/project/default/sql',
      ].join(' | '),
      tableExists: false,
      needsManualSetup: true,
      schemaFile: 'schema.sql',
    }, { status: 422 })
  }
}
