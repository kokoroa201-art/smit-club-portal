'use client'
import { useApp } from '../lib/AppContext'

export default function Hero() {
  const { t } = useApp()
  return (
    <section id="hero">
      <div className="hero-blobs">
        <div className="blob blob1" />
        <div className="blob blob2" />
        <div className="blob blob3" />
      </div>
      <h1>
        {t(
          <>SMIT 동아리를<br />함께 만들어요 🌟</>,
          <>Start Your Club<br />at SMIT 🌟</>
        )}
      </h1>
      <p>
        {t(
          <>서울미디어대학원대학교 원우회가 여러분의 동아리 꿈을 응원합니다.<br />외국인·내국인 모두 함께 신청하고, 함께 성장해요!</>,
          <>The SMIT Student Council supports your club dreams.<br />International &amp; domestic students — apply together, grow together!</>
        )}
      </p>
      <div className="hero-btns">
        <a href="#apply" className="btn btn-primary">
          <i className="fa fa-pen-to-square" />
          {t('동아리 신청하기', 'Apply for a Club')}
        </a>
        <a href="#download" className="btn btn-outline">
          <i className="fa fa-download" />
          {t('서식 다운로드', 'Download Forms')}
        </a>
        <a href="#dashboard" className="btn btn-sky">
          <i className="fa fa-chart-bar" />
          {t('현황 보기', 'View Dashboard')}
        </a>
      </div>
      <div className="hero-stats">
        <div className="stat-card">
          <div className="num">360</div>
          <div className="lbl">{t('전체 원생', 'Total Students')}</div>
        </div>
        <div className="stat-card">
          <div className="num">259</div>
          <div className="lbl">{t('외국인 원생', 'International')}</div>
        </div>
        <div className="stat-card">
          <div className="num">101</div>
          <div className="lbl">{t('내국인 원생', 'Domestic')}</div>
        </div>
        <div className="stat-card">
          <div className="num">2026</div>
          <div className="lbl">{t('동아리 제도 원년', 'Club Launch Year')}</div>
        </div>
      </div>
    </section>
  )
}
