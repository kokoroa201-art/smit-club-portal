'use client'
import { useState } from 'react'
import { useApp } from '../lib/AppContext'

const CLUB_PW = process.env.NEXT_PUBLIC_SUDA_EDIT_PW

export default function EditClubModal() {
  const { t, clubSuda, updateClubSuda, editModalOpen, setEditModalOpen, showToast } = useApp()
  const [step, setStep] = useState('pw') // 'pw' | 'edit'
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [fields, setFields] = useState({})

  const open = () => {
    setStep('pw')
    setPw('')
    setPwError(false)
    setFields({
      officers: clubSuda.officers,
      desc: clubSuda.desc,
      nationality: clubSuda.nationality,
      activities: clubSuda.activities,
      domestic: clubSuda.domestic,
      intl: clubSuda.intl,
    })
  }

  if (!editModalOpen) return null

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) setEditModalOpen(false)
  }

  const checkPw = () => {
    if (pw === CLUB_PW) {
      setStep('edit')
      setPwError(false)
    } else {
      setPwError(true)
      setPw('')
    }
  }

  const handleField = (k, v) => setFields(prev => ({ ...prev, [k]: v }))

  const save = () => {
    const dom = parseInt(fields.domestic) || 0
    const intl = parseInt(fields.intl) || 0
    updateClubSuda({ ...fields, domestic: dom, intl: intl })
    setEditModalOpen(false)
    showToast('💾 저장 완료! 이 기기에 반영되었습니다.')
  }

  const sendEmail = () => {
    const dom = parseInt(fields.domestic) || 0
    const intl = parseInt(fields.intl) || 0
    const body = `[수다 동아리 정보 수정 요청]
━━━━━━━━━━━━━━━━━━━━━

👑 회장단: ${fields.officers}
📝 소개: ${fields.desc}
👥 회원: 내국인 ${dom}명 · 외국인 ${intl}명
🌍 주요 국적: ${fields.nationality}
📅 주요 활동: ${fields.activities}

━━━━━━━━━━━━━━━━━━━━━
요청일시: ${new Date().toLocaleString('ko-KR')}
SMIT 동아리 포털에서 전송됨`.trim()

    const subject = encodeURIComponent('[SMIT 동아리 수정요청] 수다(Suda)')
    window.location.href = `mailto:kokoroa@smit.kr?subject=${subject}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box" style={{ maxWidth: 540 }}>
        <div style={{
          background: 'linear-gradient(135deg,var(--coral),var(--orange))',
          padding: '24px 28px', borderRadius: '24px 24px 0 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}>✏️ {t('동아리 정보 수정', 'Edit Club Info')}</div>
            <div style={{ color: 'rgba(255,255,255,.8)', fontSize: '.78rem', marginTop: 4 }}>
              {t('수정 후 저장하면 이 기기에 반영됩니다.', 'Saved changes reflect on this device.')}
            </div>
          </div>
          <button onClick={() => setEditModalOpen(false)} style={{
            background: 'rgba(255,255,255,.25)', border: 'none', color: '#fff',
            borderRadius: '50%', width: 36, height: 36, fontSize: '1.1rem', cursor: 'pointer',
          }}>✕</button>
        </div>

        {step === 'pw' ? (
          <div style={{ padding: '32px 28px' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔐</div>
              <p style={{ color: 'var(--gray)', fontSize: '.9rem', lineHeight: 1.7 }}>
                {t(
                  <>동아리 관계자만 수정할 수 있습니다.<br />동아리 비밀번호를 입력해 주세요.</>,
                  <>Only club members can edit this.<br />Please enter your club password.</>
                )}
              </p>
            </div>
            <input
              type="password" value={pw} onChange={e => setPw(e.target.value)}
              placeholder="비밀번호 / Password"
              onKeyDown={e => e.key === 'Enter' && checkPw()}
              style={{
                width: '100%', padding: '14px 16px', border: '2px solid #E5E7EB',
                borderRadius: 12, fontSize: '1rem', fontFamily: 'inherit', marginBottom: 12,
              }}
            />
            {pwError && (
              <div style={{ color: 'var(--coral)', fontSize: '.82rem', marginBottom: 12 }}>
                ❌ {t('비밀번호가 맞지 않습니다.', 'Incorrect password.')}
              </div>
            )}
            <button onClick={checkPw} style={{
              width: '100%', padding: 14,
              background: 'linear-gradient(135deg,var(--coral),var(--orange))',
              color: '#fff', border: 'none', borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
            }}>
              {t('확인', 'Confirm')}
            </button>
          </div>
        ) : (
          <div style={{ padding: 28 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label style={{ fontSize: '.85rem', fontWeight: 700 }}>👑 {t('회장단', 'Officers')}</label>
                <input type="text" className="join-modal-input"
                  value={fields.officers || ''} onChange={e => handleField('officers', e.target.value)}
                  placeholder="회장: 홍길동 · 부회장: 김철수" />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '.85rem', fontWeight: 700 }}>📝 {t('동아리 소개', 'Description')}</label>
                <textarea className="join-modal-input" rows="3" style={{ resize: 'vertical' }}
                  value={fields.desc || ''} onChange={e => handleField('desc', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label style={{ fontSize: '.85rem', fontWeight: 700 }}>🇰🇷 {t('내국인 수', 'Domestic')}</label>
                  <input type="number" className="join-modal-input" min="0"
                    value={fields.domestic ?? ''} onChange={e => handleField('domestic', e.target.value)} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '.85rem', fontWeight: 700 }}>🌍 {t('외국인 수', 'International')}</label>
                  <input type="number" className="join-modal-input" min="0"
                    value={fields.intl ?? ''} onChange={e => handleField('intl', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label style={{ fontSize: '.85rem', fontWeight: 700 }}>🌍 {t('주요 국적', 'Nationalities')}</label>
                <input type="text" className="join-modal-input"
                  value={fields.nationality || ''} onChange={e => handleField('nationality', e.target.value)}
                  placeholder="우즈베키스탄 · 베트남 · 인도 · 중국 등" />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '.85rem', fontWeight: 700 }}>📅 {t('주요 활동', 'Activities')}</label>
                <input type="text" className="join-modal-input"
                  value={fields.activities || ''} onChange={e => handleField('activities', e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={save} style={{
                flex: 1, padding: 14,
                background: 'linear-gradient(135deg,var(--mint),#4CAF50)',
                color: '#fff', border: 'none', borderRadius: 12, fontSize: '.95rem', fontWeight: 700, cursor: 'pointer',
              }}>💾 {t('저장하기', 'Save')}</button>
              <button onClick={sendEmail} style={{
                flex: 1, padding: 14,
                background: 'linear-gradient(135deg,var(--sky),var(--purple))',
                color: '#fff', border: 'none', borderRadius: 12, fontSize: '.95rem', fontWeight: 700, cursor: 'pointer',
              }}>📧 {t('원우회에 전송', 'Send to Council')}</button>
            </div>
            <p style={{ textAlign: 'center', fontSize: '.75rem', color: 'var(--gray)', marginTop: 12 }}>
              {t(
                '💾 저장: 이 기기에서만 반영 | 📧 전송: 원우회 검토 후 공식 반영',
                '💾 Save: reflects on this device only | 📧 Send: official update after council review'
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
