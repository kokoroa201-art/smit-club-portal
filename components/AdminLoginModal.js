'use client'
import { useState } from 'react'
import { useApp } from '../lib/AppContext'

export default function AdminLoginModal() {
  const { adminLoginOpen, setAdminLoginOpen, setAdminPanelOpen, showToast, loadAdminApplications } = useApp()
  const [token, setToken] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!adminLoginOpen) return null

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) setAdminLoginOpen(false)
  }

  const check = async () => {
    if (!token.trim()) {
      setError(true)
      return
    }

    setLoading(true)
    setError(false)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token: token.trim() }),
      })
      if (!res.ok) throw new Error('login failed')
      await loadAdminApplications()
      setAdminLoginOpen(false)
      setAdminPanelOpen(true)
      setToken('')
      showToast('관리자 로그인이 완료되었습니다.')
    } catch {
      setError(true)
      setToken('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay admin" onClick={handleOverlayClick}>
      <div className="modal-box" style={{ maxWidth: 400 }}>
        <div style={{
          background: 'linear-gradient(135deg,var(--purple),var(--sky))',
          padding: '24px 28px', borderRadius: '24px 24px 0 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}>🔐 관리자 로그인</div>
            <div style={{ color: 'rgba(255,255,255,.75)', fontSize: '.78rem', marginTop: 4 }}>원우회 운영 토큰을 입력하세요</div>
          </div>
          <button onClick={() => setAdminLoginOpen(false)} style={{
            background: 'rgba(255,255,255,.25)', border: 'none', color: '#fff',
            borderRadius: '50%', width: 36, height: 36, fontSize: '1.1rem', cursor: 'pointer',
          }}>×</button>
        </div>

        <div style={{ padding: 28 }}>
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <div style={{ fontSize: '3rem', marginBottom: 8 }}>🛡️</div>
            <p style={{ color: 'var(--gray)', fontSize: '.88rem', lineHeight: 1.6 }}>
              `.env.local`의 ADMIN_API_TOKEN 값을 입력하세요. 토큰은 브라우저 JS에 저장되지 않습니다.
            </p>
          </div>
          <input
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && check()}
            placeholder="ADMIN_API_TOKEN"
            style={{
              width: '100%', padding: '14px 16px', border: '2px solid #E5E7EB',
              borderRadius: 12, fontSize: '1rem', fontFamily: 'inherit', marginBottom: 10, transition: '.2s',
            }}
          />
          {error && (
            <div style={{ color: 'var(--coral)', fontSize: '.82rem', marginBottom: 12 }}>
              관리자 토큰이 맞지 않거나 서버 환경변수가 설정되지 않았습니다.
            </div>
          )}
          <button onClick={check} disabled={loading} style={{
            width: '100%', padding: 14,
            background: 'linear-gradient(135deg,var(--purple),var(--sky))',
            color: '#fff', border: 'none', borderRadius: 12,
            fontSize: '.95rem', fontWeight: 700, cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit',
            opacity: loading ? .65 : 1,
          }}>
            {loading ? '확인 중...' : '확인'}
          </button>
        </div>
      </div>
    </div>
  )
}
