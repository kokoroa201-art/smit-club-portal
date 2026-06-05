'use client'
import { useApp } from '../lib/AppContext'
import { STATUS_MAP } from '../lib/AppContext'

export default function ClubShowcase() {
  const { t, clubSuda, sudaStatus, setEditModalOpen, setJoinModalOpen } = useApp()

  const total = clubSuda.domestic + clubSuda.intl
  const pctIntl = total > 0 ? Math.round(clubSuda.intl / total * 1000) / 10 : 0
  const pctDom  = total > 0 ? Math.round(clubSuda.domestic / total * 1000) / 10 : 0
  const membersText = `${total}명 (내국인 ${clubSuda.domestic} · 외국인 ${clubSuda.intl})`

  const statusInfo = STATUS_MAP[sudaStatus] || STATUS_MAP.pending

  return (
    <section id="clubs" style={{ background: '#fff' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">{t('🎯 동아리 소개', '🎯 Club Showcase')}</div>
          <h2>{t('우리 동아리를 소개합니다', 'Meet Our Clubs')}</h2>
          <p>{t(
            '동아리가 생길 때마다 여기에 추가됩니다. 여러분의 동아리도 함께해요!',
            'Each new club will be featured here. Start yours and join the community!'
          )}</p>
        </div>

        <div className="club-cards">
          {/* 수다 클럽 */}
          <div className="club-card" id="club-suda">
            <div className="club-card-header" style={{ background: 'linear-gradient(135deg,#FF8E53,#FFD93D)' }}>
              <div className="club-emoji">🗣️</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <span className={`badge ${statusInfo.cls}`}>{statusInfo.label}</span>
                <button className="edit-btn" onClick={() => setEditModalOpen(true)}>
                  ✏️ {t('수정', 'Edit')}
                </button>
              </div>
            </div>
            <div className="club-card-body">
              <div className="club-name-row">
                <h3>수다 <span style={{ fontWeight: 400, fontSize: '.9rem', color: 'var(--gray)' }}>Suda</span></h3>
                <span className="club-cat">문화·교류</span>
              </div>

              <p className="club-desc">{clubSuda.desc}</p>

              <div className="club-info-grid">
                <div className="club-info-item">
                  <div className="ci-icon" style={{ background: '#FFE8D0', color: '#F59E0B' }}>👑</div>
                  <div>
                    <div className="ci-label">{t('회장단', 'Officers')}</div>
                    <div className="ci-val">{clubSuda.officers}</div>
                  </div>
                </div>
                <div className="club-info-item">
                  <div className="ci-icon" style={{ background: '#FFF4E0', color: '#F59E0B' }}>👥</div>
                  <div>
                    <div className="ci-label">{t('회원 현황', 'Members')}</div>
                    <div className="ci-val">{membersText}</div>
                  </div>
                </div>
                <div className="club-info-item">
                  <div className="ci-icon" style={{ background: '#E8F4FD', color: 'var(--sky)' }}>🌍</div>
                  <div>
                    <div className="ci-label">{t('주요 국적', 'Nationalities')}</div>
                    <div className="ci-val">{clubSuda.nationality}</div>
                  </div>
                </div>
                <div className="club-info-item">
                  <div className="ci-icon" style={{ background: '#EDE8FF', color: 'var(--purple)' }}>📅</div>
                  <div>
                    <div className="ci-label">{t('주요 활동', 'Activities')}</div>
                    <div className="ci-val">{clubSuda.activities}</div>
                  </div>
                </div>
              </div>

              <div className="club-member-bar">
                <div className="cmb-label">
                  {t('외국인', 'Intl.')} <b style={{ color: 'var(--sky)' }}> {pctIntl}%</b>
                </div>
                <div className="cmb-track">
                  <div className="cmb-fill" style={{
                    width: `${pctIntl}%`,
                    background: 'linear-gradient(90deg,var(--sky),var(--purple))',
                  }} />
                </div>
                <div className="cmb-label">
                  {t('내국인', 'Dom.')} <b style={{ color: 'var(--coral)' }}> {pctDom}%</b>
                </div>
              </div>

              <button className="join-btn" onClick={() => setJoinModalOpen(true)}>
                <i className="fa fa-user-plus" />
                {t('가입 신청하기', 'Join This Club')}
              </button>
            </div>
          </div>

          {/* 플레이스홀더 */}
          <div className="club-card club-placeholder">
            <div className="club-card-header" style={{ background: 'linear-gradient(135deg,#E5E7EB,#F3F4F6)' }}>
              <div className="club-emoji" style={{ opacity: .4 }}>➕</div>
            </div>
            <div className="club-card-body" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', textAlign: 'center', padding: '40px 24px', gap: 12,
            }}>
              <div style={{ fontSize: '2.5rem', opacity: .3 }}>🏫</div>
              <h3 style={{ color: 'var(--gray)', fontSize: '1rem' }}>
                {t('다음 동아리를 기다리고 있어요', 'Your club could be next!')}
              </h3>
              <p style={{ color: '#BDC3C7', fontSize: '.82rem', lineHeight: 1.7 }}>
                {t(
                  <>지금 바로 신청하면 이 자리에<br />여러분의 동아리가 소개됩니다!</>,
                  <>Apply now and your club<br />will be featured right here!</>
                )}
              </p>
              <a href="#apply" className="btn btn-outline" style={{ marginTop: 8, padding: '10px 24px', fontSize: '.85rem' }}>
                <i className="fa fa-plus" />
                {t('동아리 신청하기', 'Start a Club')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
