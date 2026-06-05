import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../../lib/supabaseServer'
import { fromDbRecord, makeCertificateNumber } from '../../../../lib/applicationRecords'

export const dynamic = 'force-dynamic'

function isAdmin(request) {
  const expected = process.env.ADMIN_API_TOKEN
  const provided = request.cookies.get('smit_admin_session')?.value
  return Boolean(expected && provided && provided === expected)
}

export async function POST(request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSupabaseAdminConfigured) {
    return NextResponse.json({ error: 'Supabase service role is not configured' }, { status: 503 })
  }

  const body = await request.json()
  const now = new Date()
  const { data, error } = await supabaseAdmin
    .from('club_applications')
    .update({
      status: 'certificate_issued',
      certificate_number: makeCertificateNumber(now),
      certificate_issued_at: now.toISOString(),
      reviewed_at: now.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq('id', body.id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ application: fromDbRecord(data) })
}
