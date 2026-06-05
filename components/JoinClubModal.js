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

export default function JoinClubModal() {
  const { t, joinModalOpen, setJoinModalOpen, sudaJoinEmail, showToast } = useApp()
  const [form, setForm] = useState({ name: '', studentId: '', nationality: '', contact: '', motivation: '' })

  if (!joinModalOpen) return null

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) setJoinModalOpen(false)
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    const now = new Date().toLocaleString('ko-KR')
    const body = `[동아리 가입 신청] 수다 (Suda)
━━━━━━━━━━━━━━━━━━━━━

🙋 이름: ${form.name}
🆔 학번: ${form.studentId}
🌍 국적: ${form.nationality}
📱 연락처: ${form.contact}
💬 지원 동기:
${form.motivation}

━━━━━━━━━━━━━━━━━━━━━
신청일시: ${now}
SMIT 동아리 포털에서 전송됨`.trim()

    const subject = encodeURIComponent(`[수다(Suda) 가입신청] ${form.name}`)
    window.location.href = `mailto:${sudaJoinEmail}?subject=${subject}&body=${encodeURIComponent(body)}`

    setJoinModalOpen(false)
    showToast('✅ 이메일 앱이 열립니다. 전송을 눌러 신청을 완료하세요!')
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box" style={{ maxWidth: 520 }}>
        <div style={{
          background: 'linear-gradient(135deg,var(--mint),#4CAF50)',
          padding: '24px 28px', borderRadius: '24px 24px 0 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}>
              🙋 {t('수다 (Suda) 가입 신청', 'Join Suda Club')}
            </div>
            <div style={{ color: 'rgba(255,255,255,.8)', fontSize: '.78rem', marginTop: 4 }}>
              {t('신청서가 원우회를 통해 동아리 회장에게 전달됩니다.', 'Your application will be forwarded to the club president via the Student Council.')}
            </div>
          </div>
          <button onClick={() => setJoinModalOpen(false)} style={{
            background: 'rgba(255,255,255,.25)', border: 'none', color: '#fff',
            borderRadius: '50%', width: 36, height: 36, fontSize: '1.1rem', cursor: 'pointer',
          }}>✕</button>
        </div>

        <div style={{ padding: 28 }}>
          <div style={{
            background: 'linear-gradient(135deg,#E8FFF0,#F0FFF4)',
            borderRadius: 14, padding: '14px 18px', marginBottom: 22,
            fontSize: '.82rem', color: 'var(--dark)', lineHeight: 1.7,
          }}>
            📬 {t(
              <>작성 완료 후 <b>이메일 앱이 자동으로 열립니다.</b> 전송 버튼을 눌러 신청을 완료해 주세요.</>,
              <>After submitting, <b>your email app will open.</b> Click Send to complete your application.</>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label>{t('이름', 'Name')} <span style={{ color: 'var(--coral)' }}>*</span></label>
                <input className="join-modal-input" type="text" name="name" required
                  placeholder={t('이름 / Name', 'Name')}
                  value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>{t('학번', 'Student ID')} <span style={{ color: 'var(--coral)' }}>*</span></label>
                <input className="join-modal-input" type="text" name="studentId" required
                  placeholder="예: 20240001"
                  value={form.studentId} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>{t('국적', 'Nationality')} <span style={{ color: 'var(--coral)' }}>*</span></label>
                <select className="join-modal-input" name="nationality" required
                  value={form.nationality} onChange={handleChange}>
                  <option value="">선택 / Select</option>
                  {NATIONALITIES.map(n => (
                    <option key={n.val} value={n.val}>{n.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t('연락처 (이메일 또는 전화)', 'Contact (Email or Phone)')} <span style={{ color: 'var(--coral)' }}>*</span></label>
                <input className="join-modal-input" type="text" name="contact" required
                  placeholder="your@email.com 또는 010-0000-0000"
                  value={form.contact} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>{t('지원 동기', 'Motivation')} <span style={{ color: 'var(--coral)' }}>*</span></label>
                <textarea className="join-modal-input" name="motivation" required rows="4"
                  style={{ resize: 'vertical' }}
                  placeholder={t(
                    '이 동아리에 가입하고 싶은 이유를 자유롭게 작성해 주세요.',
                    'Why do you want to join this club?'
                  )}
                  value={form.motivation} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" style={{
              marginTop: 20, width: '100%', padding: 15, borderRadius: 14,
              background: 'linear-gradient(135deg,var(--mint),#4CAF50)',
              color: '#fff', border: 'none', fontSize: '.95rem', fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: '.2s',
            }}>
              <i className="fa fa-paper-plane" />
              {t('가입 신청서 제출', 'Submit Application')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
