import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../../lib/supabaseServer'
import { fromDbRecord } from '../../../../lib/applicationRecords'

export const dynamic = 'force-dynamic'

function isAdmin(request) {
  const expected = process.env.ADMIN_API_TOKEN
  const provided = request.cookies.get('smit_admin_session')?.value
  return Boolean(expected && provided && provided === expected)
}

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

function unavailable() {
  return NextResponse.json({ error: 'Supabase service role is not configured' }, { status: 503 })
}

export async function GET(request) {
  if (!isAdmin(request)) return unauthorized()
  if (!isSupabaseAdminConfigured) return unavailable()

  const { data, error } = await supabaseAdmin
    .from('club_applications')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ applications: (data || []).map(fromDbRecord) })
}

export async function PATCH(request) {
  if (!isAdmin(request)) return unauthorized()
  if (!isSupabaseAdminConfigured) return unavailable()

  const body = await request.json()
  const { data, error } = await supabaseAdmin
    .from('club_applications')
    .update({
      status: body.status,
      note: body.note || null,
      reviewed_at: body.reviewedAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', body.id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ application: fromDbRecord(data) })
}

export async function DELETE(request) {
  if (!isAdmin(request)) return unauthorized()
  if (!isSupabaseAdminConfigured) return unavailable()

  const body = await request.json()
  const { error } = await supabaseAdmin
    .from('club_applications')
    .delete()
    .eq('id', body.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
