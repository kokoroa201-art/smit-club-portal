'use client'
import { useState } from 'react'
import { useApp } from '../lib/AppContext'

const NATIONALITIES = [
  { val: '한국', label: '🇰🇷 한국 / Korea' },
  { val: '우즈베키스탄', label: '🇺🇿 우즈베키스탄 / Uzbekistan' },
  { val: '베트남', label: '🇻🇳 베트남 / Vietnam' },
  { val: '네팔', label: '🇳🇵 네팔 / Nepal' },
  { val: '인도', label: '🇮🇳 인도 / India' },
  { val: '파키스탄', label: '🇵🇰 파키스탄 / Pakistan' },
  { val: '몽골', label: '🇲🇳 몽골 / Mongolia' },
  { val: '방글라데시', label: '🇧🇩 방글라데시 / Bangladesh' },
  { val: '중국', label: '🇨🇳 중국 / China' },
  { val: '태국', label: '🇹🇭 태국 / Thailand' },
  { val: '러시아', label: '🇷🇺 러시아 / Russia' },
  { val: '기타', label: '기타 / Other' },
]

const CATEGORIES = [
  { val: '학술/연구', label: '학술·연구 / Academic & Research' },
  { val: '문화/예술', label: '문화·예술 / Arts & Culture' },
  { val: '스포츠/건강', label: '스포츠·건강 / Sports & Health' },
  { val: '미디어/기술', label: '미디어·기술 / Media & Technology' },
  { val: '봉사/사회', label: '봉사·사회 / Community Service' },
  { val: '친목/교류', label: '친목·교류 / Social & Exchange' },
  { val: '기타', label: '기타 / Other' },
]

const INIT_FORM = {
  clubNameKo: '', clubNameEn: '', category: '',
  presidentName: '', studentId: '', email: '', phone: '',
  nationality: '', advisor: '', memberCount: '',
  purpose: '', activities: '', extra: '',
}

const INIT_MEMBERS = [
  { name: '', id: '', nationality: '' }, { name: '', id: '', nationality: '' }, { name: '', id: '', nationality: '' },
  { name: '', id: '', nationality: '' }, { name: '', id: '', nationality: '' },
]

export default function ApplicationForm() {
  const { t, showToast, addApplication } = useApp()
  const [form, setForm] = useState(INIT_FORM)
  const [members, setMembers] = useState(INIT_MEMBERS)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const updateMember = (i, field, val) => {
    setMembers(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m))
  }

  const addMember = () => setMembers(prev => [...prev, { name: '', id: '', nationality: '' }])
  const removeMember = i => setMembers(prev => prev.filter((_, idx) => idx !== i))

  const buildBody = () => {
    const memberLines = members
      .filter(m => m.name.trim())
      .map(m => `    ${m.name} (${m.id || '-'} / ${m.nationality || '-'})`)
      .join('\n')

    return `
[SMIT 동아리 개설 신청서 / Club Registration Form]
═══════════════════════════════════

📌 동아리명 (Club Name)
    국문: ${form.clubNameKo}
    영문: ${form.clubNameEn}

🏷️ 분류 (Category): ${form.category}

👤 대표자 (President)
    이름: ${form.presidentName}
    학번: ${form.studentId}
    이메일: ${form.email}
    연락처: ${form.phone}
    국적: ${form.nationality}

📚 지도교수 (Faculty Advisor): ${form.advisor || '(미정)'}
👥 예상 회원 수 (Expected Members): ${form.memberCount}명

📋 창립 회원 명단 (Founding Members):
${memberLines}

💡 설립 목적 (Purpose):
    ${form.purpose}

📅 주요 활동 계획 (Activities):
    ${form.activities || '(미작성)'}

📝 기타 요청사항 (Requests):
    ${form.extra || '(없음)'}

═══════════════════════════════════
제출일시: ${new Date().toLocaleString('ko-KR')}
SMIT 원우회 동아리 포털 제출
    `.trim()
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    const cleanMembers = members
      .filter(m => m.name.trim())
      .map(m => ({
        name: m.name.trim(),
        id: m.id.trim(),
        nationality: m.nationality.trim(),
      }))

    try {
      await addApplication({
        ...form,
        members: cleanMembers,
        submittedAt: new Date().toISOString(),
      }, 'form')

      const body = buildBody()
      const subject = encodeURIComponent(`[SMIT 동아리신청] ${form.clubNameKo} / ${form.clubNameEn}`)
      const to = 'kokoroa@smit.kr,skyoon7517@naver.com,admission@smit.ac.kr'
      window.location.href = `mailto:${to}?subject=${subject}&body=${encodeURIComponent(body)}`
      setTimeout(() => {
        setSubmitted(true)
        showToast('✅ 신청서가 저장되고 이메일 앱이 열렸습니다!')
      }, 800)
    } catch (error) {
      showToast(`신청서 저장 실패: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const printDoc = () => {
    const memberRows = members
      .filter(m => m.name.trim())
      .map(m => `<tr><td>${m.name}</td><td>${m.id || '-'}</td><td>${m.nationality || '-'}</td></tr>`)
      .join('')

    const now = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

    const html = `<!DOCTYPE html><html lang="ko"><head>
<meta charset="UTF-8">
<title>동아리 개설 신청서 - ${form.clubNameKo}</title>
<style>
  @page { size: A4; margin: 20mm 18mm; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Malgun Gothic','Apple SD Gothic Neo',sans-serif; font-size:11pt; color:#111; line-height:1.6; }
  .header { text-align:center; border-bottom:3px double #333; padding-bottom:14px; margin-bottom:20px; }
  .header .school { font-size:12pt; color:#555; margin-bottom:4px; }
  .header h1 { font-size:20pt; font-weight:900; letter-spacing:2px; }
  .header .meta { font-size:10pt; color:#666; margin-top:6px; }
  table.info { width:100%; border-collapse:collapse; margin-bottom:16px; }
  table.info th { background:#f0f0f0; width:110px; padding:8px 10px; border:1px solid #ccc; font-weight:700; font-size:10.5pt; text-align:left; white-space:nowrap; }
  table.info td { padding:8px 12px; border:1px solid #ccc; font-size:10.5pt; }
  .section-title { font-size:11.5pt; font-weight:700; background:#333; color:#fff; padding:6px 12px; margin:18px 0 0; }
  table.members { width:100%; border-collapse:collapse; margin-bottom:4px; }
  table.members th { background:#f0f0f0; padding:6px 10px; border:1px solid #ccc; font-size:10pt; }
  table.members td { padding:6px 10px; border:1px solid #ccc; font-size:10pt; }
  .text-box { border:1px solid #ccc; padding:10px 12px; font-size:10.5pt; min-height:60px; white-space:pre-wrap; margin-bottom:4px; }
  .sign-area { margin-top:36px; display:flex; justify-content:flex-end; gap:48px; }
  .sign-box { text-align:center; font-size:10.5pt; }
  .sign-line { border-bottom:1px solid #333; width:140px; margin:28px auto 4px; }
  .footer-note { margin-top:24px; font-size:9pt; color:#888; text-align:center; border-top:1px solid #ddd; padding-top:10px; }
</style>
</head><body>
<div class="header">
  <div class="school">서울미디어대학원대학교 원우회</div>
  <h1>동아리 개설 신청서</h1>
  <div class="meta">제출일: ${now}</div>
</div>
<div class="section-title">① 동아리 기본 정보</div>
<table class="info">
  <tr><th>동아리명 (국문)</th><td>${form.clubNameKo || '-'}</td></tr>
  <tr><th>동아리명 (영문)</th><td>${form.clubNameEn || '-'}</td></tr>
  <tr><th>분류</th><td>${form.category || '-'}</td></tr>
  <tr><th>예상 회원 수</th><td>${form.memberCount || '-'}명</td></tr>
  <tr><th>지도교수</th><td>${form.advisor || '미정'}</td></tr>
</table>
<div class="section-title">② 대표자 정보</div>
<table class="info">
  <tr><th>이름</th><td>${form.presidentName || '-'}</td></tr>
  <tr><th>학번</th><td>${form.studentId || '-'}</td></tr>
  <tr><th>이메일</th><td>${form.email || '-'}</td></tr>
  <tr><th>연락처</th><td>${form.phone || '-'}</td></tr>
  <tr><th>국적</th><td>${form.nationality || '-'}</td></tr>
</table>
<div class="section-title">③ 창립 회원 명단</div>
<table class="members">
  <tr><th>이름 / Name</th><th>학번 / Student ID</th><th>국적 / Nationality</th></tr>
  ${memberRows || '<tr><td colspan="3" style="text-align:center;color:#999">미입력</td></tr>'}
</table>
<div class="section-title">④ 동아리 설립 목적</div>
<div class="text-box">${form.purpose.replace(/</g,'&lt;')}</div>
<div class="section-title">⑤ 주요 활동 계획</div>
<div class="text-box">${(form.activities || '(미작성)').replace(/</g,'&lt;')}</div>
<div class="section-title">⑥ 기타 요청사항</div>
<div class="text-box">${(form.extra || '(없음)').replace(/</g,'&lt;')}</div>
<div class="sign-area">
  <div class="sign-box"><div class="sign-line"></div>대표자 서명</div>
  <div class="sign-box"><div class="sign-line"></div>원우회 확인</div>
  <div class="sign-box"><div class="sign-line"></div>교학처 확인</div>
</div>
<div class="footer-note">본 신청서는 SMIT 동아리포털을 통해 제출되었습니다 · Seoul Media Institute of Technology</div>
</body></html>`

    const w = window.open('', '_blank', 'width=800,height=1000')
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 400)
  }

  return (
    <section id="apply">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">{t('✏️ 온라인 신청', '✏️ Online Application')}</div>
          <h2>{t('동아리 개설 신청서', 'Club Registration Form')}</h2>
          <p>{t(
            '아래 폼을 작성하면 원우회 회장·부회장과 교학팀으로 바로 전달됩니다.',
            'This form sends directly to the Council President, Vice President, and Academic Affairs.'
          )}</p>
        </div>

        <div className="form-wrap">
          <div className="form-note">
            <strong>📬 {t('제출 안내', 'Submission Info')}</strong><br />
            {t(
              <>작성 완료 후 <b>이메일 앱이 자동으로 열립니다</b>. 서식 파일(HWP/PDF)은 이메일에 직접 첨부해 주세요.<br />수신: 원우회 회장(skyoon7517@naver.com) · 원우회 부회장(kokoroa@smit.kr) · 교학팀(admission@smit.ac.kr)</>,
              <>After submission, <b>your email app will open</b>. Please attach the HWP/PDF forms to the email.<br />Recipients: President (skyoon7517@naver.com) · VP (kokoroa@smit.kr) · Academic Affairs (admission@smit.ac.kr).</>
            )}
          </div>

          {submitted ? (
            <div className="success-msg">
              <div className="icon">🎉</div>
              <h3>{t('신청이 완료되었습니다!', 'Application Submitted!')}</h3>
              <p>{t(
                '이메일 앱에서 서식 파일을 첨부하고 전송을 눌러주세요.\n원우회에서 약 3~5일 이내에 연락드립니다.',
                'Please attach your HWP/PDF forms in the email app and click Send.\nThe Student Council will contact you within 3 business days.'
              )}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-grid">

                <div className="form-group">
                  <label>{t('동아리 이름 (국문)', 'Club Name (Korean)')} <span>*</span></label>
                  <input type="text" name="clubNameKo" required
                    placeholder="예: SMIT 사진 동아리"
                    value={form.clubNameKo} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>{t('동아리 이름 (영문)', 'Club Name (English)')} <span>*</span></label>
                  <input type="text" name="clubNameEn" required
                    placeholder="e.g. SMIT Photography Club"
                    value={form.clubNameEn} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>{t('동아리 분류', 'Club Category')} <span>*</span></label>
                  <select name="category" required value={form.category} onChange={handleChange}>
                    <option value="">선택하세요 / Select</option>
                    {CATEGORIES.map(c => (
                      <option key={c.val} value={c.val}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>{t('대표자 이름', 'Club President Name')} <span>*</span></label>
                  <input type="text" name="presidentName" required
                    placeholder="대표자 / Representative"
                    value={form.presidentName} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>{t('대표자 학번', 'Student ID')} <span>*</span></label>
                  <input type="text" name="studentId" required
                    placeholder="예: 20240001"
                    value={form.studentId} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>{t('이메일', 'Email')} <span>*</span></label>
                  <input type="email" name="email" required
                    placeholder="your@email.com"
                    value={form.email} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>{t('연락처', 'Phone')} <span>*</span></label>
                  <input type="tel" name="phone" required
                    placeholder="010-0000-0000"
                    value={form.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>{t('국적', 'Nationality')} <span>*</span></label>
                  <select name="nationality" required value={form.nationality} onChange={handleChange}>
                    <option value="">선택 / Select</option>
                    {NATIONALITIES.map(n => (
                      <option key={n.val} value={n.val}>{n.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    {t('지도교수 성함', 'Faculty Advisor')}
                    <small style={{ fontWeight: 400, color: 'var(--gray)', fontSize: '.75rem' }}> (해당 시 기재 / if applicable)</small>
                  </label>
                  <input type="text" name="advisor"
                    placeholder="교수명 / Professor Name (미정이면 공란)"
                    value={form.advisor} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>{t('예상 회원 수', 'Expected Members')} <span>*</span></label>
                  <input type="number" name="memberCount" required min="5"
                    placeholder="최소 5명 / Min. 5"
                    value={form.memberCount} onChange={handleChange} />
                </div>

                <div className="form-group form-full">
                  <label>{t('동아리 설립 목적', 'Club Purpose')} <span>*</span></label>
                  <textarea name="purpose" required
                    placeholder={t(
                      '동아리의 목적, 활동 내용, 기대 효과를 작성해 주세요.',
                      'Club purpose, activities, and expected outcomes...'
                    )}
                    value={form.purpose} onChange={handleChange} />
                </div>

                <div className="form-group form-full">
                  <label>{t('주요 활동 계획', 'Planned Activities')}</label>
                  <textarea name="activities"
                    placeholder={t(
                      '정기 모임 횟수, 주요 행사, 프로젝트 등을 기입해 주세요.',
                      'Meeting frequency, events, projects, etc...'
                    )}
                    value={form.activities} onChange={handleChange} />
                </div>

                <div className="form-group form-full">
                  <label>
                    {t(
                      '창립 회원 명단 (최소 5인 · 한국 포함 3개국 이상의 학생으로 구성)',
                      'Founding Members (Min. 5 · Must include students from 3+ countries incl. Korea)'
                    )} <span>*</span>
                  </label>
                  <div id="members">
                    {members.map((m, i) => (
                      <div className="member-row" key={i}>
                        <input type="text" placeholder={t('이름 / Name', 'Name')}
                          value={m.name}
                          onChange={e => updateMember(i, 'name', e.target.value)}
                          required={i < 5} />
                        <input type="text" placeholder={t('학번 / Student ID', 'Student ID')}
                          value={m.id}
                          onChange={e => updateMember(i, 'id', e.target.value)} />
                        <select
                          value={m.nationality}
                          onChange={e => updateMember(i, 'nationality', e.target.value)}
                          required={i < 5}
                        >
                          <option value="">{t('선택 / Select', 'Select')}</option>
                          {NATIONALITIES.map(n => (
                            <option key={n.val} value={n.val}>{n.label}</option>
                          ))}
                        </select>
                        {i >= 5 && (
                          <button type="button" className="remove-btn" onClick={() => removeMember(i)}>✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button" className="add-member-btn" onClick={addMember} style={{ marginTop: 10 }}>
                    <i className="fa fa-plus" />
                    {t('회원 추가', 'Add Member')}
                  </button>
                </div>

                <div className="form-group form-full">
                  <label>{t('기타 요청사항', 'Additional Requests')}</label>
                  <textarea name="extra" rows="3"
                    placeholder={t(
                      '공간, 예산, 장비 등 필요한 사항이 있으면 작성해 주세요.',
                      'Space, budget, equipment requests, etc...'
                    )}
                    value={form.extra} onChange={handleChange} />
                </div>

              </div>

              <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button type="submit" className="submit-btn" disabled={submitting} style={{ opacity: submitting ? .65 : 1 }}>
                  <i className="fa fa-paper-plane" />
                  {submitting
                    ? t('저장 중...', 'Saving...')
                    : t('신청서 제출 (원우회 + 교학팀으로 발송)', 'Submit Application (to Council & Academic Affairs)')}
                </button>
                <button type="button" onClick={printDoc} style={{
                  width: '100%', padding: 14, borderRadius: 16, cursor: 'pointer',
                  background: '#fff', border: '2px solid var(--sky)', color: 'var(--sky)',
                  fontSize: '.95rem', fontWeight: 700, fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  transition: '.2s',
                }}>
                  <i className="fa fa-print" />
                  {t('문서 출력 / PDF 저장', 'Print / Save as PDF')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
