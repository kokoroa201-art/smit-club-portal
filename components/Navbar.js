'use client'
import { useApp } from '../lib/AppContext'

export default function Navbar() {
  const { t, toggleLang } = useApp()
  return (
    <nav>
      <a className="nav-logo" href="#hero" style={{ textDecoration: 'none' }}>
        <div className="logo-icon">🎓</div>
        <div>
          <span>SMIT 동아리포털</span>
          <small>서울미디어대학원대학교 원우회</small>
        </div>
      </a>
      <div className="nav-links">
        <a href="#steps">{t('절차안내', 'How to Apply')}</a>
        <a href="#download">{t('서식자료', 'Downloads')}</a>
        <a href="#apply">{t('동아리신청', 'Apply Now')}</a>
        <a href="#dashboard">{t('현황대시보드', 'Dashboard')}</a>
        <a href="#clubs">{t('동아리소개', 'Clubs')}</a>
        <a href="#contact">{t('문의', 'Contact')}</a>
        <button className="lang-btn" onClick={toggleLang}>
          {t('🌐 English', '🌐 한국어')}
        </button>
      </div>
      <button className="lang-btn" id="mobile-lang" onClick={toggleLang}>
        {t('EN', 'KO')}
      </button>
    </nav>
  )
}
