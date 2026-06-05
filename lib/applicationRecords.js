export function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next.toISOString()
}

export function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `app_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export function normalizeCountry(value = '') {
  const v = value.trim()
  if (!v) return ''
  if (/korea|한국|대한민국|쒓뎅/i.test(v)) return '한국'
  return v
}

export function evaluateApplication(app) {
  const members = Array.isArray(app.members) ? app.members : []
  const countries = new Set([
    normalizeCountry(app.nationality),
    ...members.map(member => normalizeCountry(member.nationality)),
  ].filter(Boolean))
  const memberCount = members.filter(member => member.name?.trim()).length
  const hasKorea = countries.has('한국')
  const hasThreeCountries = countries.size >= 3
  const minMembers = memberCount >= 5
  const requiredFields = Boolean(
    app.clubNameKo?.trim() &&
    app.clubNameEn?.trim() &&
    app.category?.trim() &&
    app.presidentName?.trim() &&
    app.studentId?.trim() &&
    app.email?.trim() &&
    app.phone?.trim() &&
    app.nationality?.trim() &&
    app.purpose?.trim()
  )

  return {
    memberCount,
    countries: Array.from(countries),
    hasKorea,
    hasThreeCountries,
    minMembers,
    requiredFields,
    canApprove: minMembers && hasKorea && hasThreeCountries && requiredFields,
  }
}

export function parseApplicationEmail(rawText) {
  const text = rawText || ''
  const pick = (...patterns) => {
    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match?.[1]) return match[1].trim()
    }
    return ''
  }

  const membersBlock = pick(
    /(?:창립 회원 명단|Founding Members)[^\n]*:\s*([\s\S]*?)(?:\n\s*💡|\n\s*설립 목적|\n\s*Purpose|$)/i
  )

  const members = membersBlock
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const match = line.match(/^(.+?)\s*\(([^/)]+)(?:\s*\/\s*([^)]+))?\)/)
      return {
        name: (match?.[1] || line).trim(),
        id: (match?.[2] || '').trim(),
        nationality: (match?.[3] || '').trim(),
      }
    })

  const submittedAtText = pick(/제출일시:\s*(.+)/)
  let submittedAt = new Date().toISOString()
  if (submittedAtText) {
    // 한국어 날짜 형식 정규화: "2026. 5. 29. 오후 2:22:42" → ISO
    const normalized = submittedAtText
      .replace(/오후\s*(\d)/g, (_, h) => String(parseInt(h) + 12) + ':')
      .replace(/오전\s*(\d)/g, '$1:')
      .replace(/\s*\.\s*/g, '-').replace(/-+$/, '').replace(/-(\d{2}:\d{2})/, ' $1')
    const parsed = new Date(normalized)
    if (!isNaN(parsed.getTime())) submittedAt = parsed.toISOString()
  }

  return {
    clubNameKo: pick(/국문:\s*(.+)/, /Club Name\)[\s\S]*?국문:\s*(.+)/),
    clubNameEn: pick(/영문:\s*(.+)/),
    category: pick(/분류\s*\(Category\):\s*(.+)/, /Category\):\s*(.+)/),
    presidentName: pick(/이름:\s*(.+)/),
    studentId: pick(/학번:\s*(.+)/),
    email: pick(/이메일:\s*(.+)/),
    phone: pick(/연락처:\s*(.+)/),
    nationality: pick(/국적:\s*(.+)/),
    advisor: pick(/지도교수\s*\(Faculty Advisor\):\s*(.+)/),
    memberCount: pick(/예상 회원 수\s*\(Expected Members\):\s*(\d+)/),
    purpose: pick(/설립 목적\s*\(Purpose\):\s*([\s\S]*?)(?:\n\s*📅|\n\s*주요 활동 계획|$)/),
    activities: pick(/주요 활동 계획\s*\(Activities\):\s*([\s\S]*?)(?:\n\s*📝|\n\s*기타 요청사항|$)/),
    extra: pick(/기타 요청사항\s*\(Requests\):\s*([\s\S]*?)(?:\n\s*=|제출일시|$)/),
    members,
    submittedAt,
  }
}

export function createApplication(data, source = 'form') {
  const submittedAt = data.submittedAt || new Date().toISOString()
  const app = {
    id: data.id || makeId(),
    source,
    status: data.status || 'pending',
    submittedAt,
    replyDueAt: data.replyDueAt || addDays(submittedAt, 3),
    reviewedAt: data.reviewedAt || '',
    certificateNumber: data.certificateNumber || '',
    certificateIssuedAt: data.certificateIssuedAt || '',
    note: data.note || '',
    clubNameKo: data.clubNameKo || '',
    clubNameEn: data.clubNameEn || '',
    category: data.category || '',
    presidentName: data.presidentName || '',
    studentId: data.studentId || '',
    email: data.email || '',
    phone: data.phone || '',
    nationality: data.nationality || '',
    advisor: data.advisor || '',
    memberCount: data.memberCount || '',
    purpose: data.purpose || '',
    activities: data.activities || '',
    extra: data.extra || '',
    members: Array.isArray(data.members) ? data.members : [],
  }

  return { ...app, review: data.review || evaluateApplication(app) }
}

export function toDbRecord(app) {
  const record = createApplication(app, app.source || 'form')
  return {
    id: record.id,
    source: record.source,
    status: record.status,
    submitted_at: record.submittedAt,
    reply_due_at: record.replyDueAt,
    reviewed_at: record.reviewedAt || null,
    certificate_number: record.certificateNumber || null,
    certificate_issued_at: record.certificateIssuedAt || null,
    note: record.note || null,
    club_name_ko: record.clubNameKo,
    club_name_en: record.clubNameEn,
    category: record.category,
    president_name: record.presidentName,
    student_id: record.studentId,
    email: record.email,
    phone: record.phone,
    nationality: record.nationality,
    advisor: record.advisor || null,
    member_count: Number(record.memberCount || record.review.memberCount || 0),
    purpose: record.purpose,
    activities: record.activities || null,
    extra: record.extra || null,
    members: record.members,
    review: record.review,
  }
}

export function fromDbRecord(row) {
  return createApplication({
    id: row.id,
    source: row.source,
    status: row.status,
    submittedAt: row.submitted_at,
    replyDueAt: row.reply_due_at,
    reviewedAt: row.reviewed_at,
    certificateNumber: row.certificate_number,
    certificateIssuedAt: row.certificate_issued_at,
    note: row.note,
    clubNameKo: row.club_name_ko,
    clubNameEn: row.club_name_en,
    category: row.category,
    presidentName: row.president_name,
    studentId: row.student_id,
    email: row.email,
    phone: row.phone,
    nationality: row.nationality,
    advisor: row.advisor,
    memberCount: row.member_count,
    purpose: row.purpose,
    activities: row.activities,
    extra: row.extra,
    members: row.members,
    review: row.review,
  }, row.source || 'form')
}

export function makeCertificateNumber(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const tail = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `SMIT-CLUB-${y}${m}${d}-${tail}`
}
