'use client'
import { useApp } from '../lib/AppContext'

export default function Footer() {
  const { t, setAdminLoginOpen } = useApp()
  return (
    <footer>
      <strong>서울미디어대학원대학교 원우회 (SMIT Student Council)</strong><br />
      {t('🌟 모든 원우를 환영합니다 🌟', '🌟 All students welcome 🌟')}
      <br /><br />
      <button
        onClick={() => setAdminLoginOpen(true)}
        style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,.25)',
          fontSize: '.72rem', cursor: 'pointer', padding: '4px 8px',
          borderRadius: 6, transition: '.2s',
        }}
        onMouseOver={e => e.currentTarget.style.color = 'rgba(255,255,255,.5)'}
        onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,.25)'}
      >
        🔐 관리자
      </button>
    </footer>
  )
}
