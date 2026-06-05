import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../../lib/supabaseServer'
import { fromDbRecord } from '../../../../lib/applicationRecords'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!isSupabaseAdminConfigured) {
    return NextResponse.json({ applications: [] })
  }

  const { data, error } = await supabaseAdmin
    .from('club_applications')
    .select('id,source,status,submitted_at,reply_due_at,reviewed_at,certificate_number,certificate_issued_at,club_name_ko,club_name_en,category,president_name,nationality,advisor,member_count,purpose,activities,extra,members,review')
    .order('submitted_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    applications: (data || []).map(row => fromDbRecord({
      ...row,
      email: '',
      phone: '',
      student_id: '',
      note: '',
    })),
  })
}
