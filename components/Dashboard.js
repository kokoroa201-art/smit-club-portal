'use client'
import { useApp, STATUS_MAP } from '../lib/AppContext'

function isKorean(value = '') {
  return /한국|대한민국|korea/i.test(value)
}

export default function Dashboard() {
  const { t, applications, sudaStatus, clubSuda } = useApp()
  const activeApplications = applications.filter(app => app.status !== 'rejected')
  const pendingApplications = applications.filter(app => app.status === 'pending')
  const approvedApplications = applications.filter(app => app.status === 'approved')

  const sudaDomestic = Number(clubSuda.domestic) || 0
  const sudaIntl = Number(clubSuda.intl) || 0
  const sudaMembers = sudaDomestic + sudaIntl
  const applicationMembers = activeApplications.reduce((sum, app) => sum + (app.review?.memberCount || 0), 0)
  const applicationIntl = activeApplications.reduce((sum, app) => {
    const presidentInList = app.presidentName?.trim() && (app.members || []).some(m =>
      (app.studentId?.trim() && m.id?.trim() === app.studentId.trim()) ||
      m.name?.trim() === app.presidentName.trim()
    )
    const membersIntl = (app.members || []).filter(m => m.nationality && !isKorean(m.nationality)).length
    const presidentIntl = app.presidentName?.trim() && !presidentInList && app.nationality && !isKorean(app.nationality) ? 1 : 0
    return sum + membersIntl + presidentIntl
  }, 0)

  const plannedCount = 1 + activeApplications.length
  const pendingCount = (sudaStatus === 'pending' ? 1 : 0) + pendingApplications.length
  const approvedCount = (sudaStatus === 'approved' ? 1 : 0) + approvedApplications.length
  const totalMembers = sudaMembers + applicationMembers
  const totalIntl = sudaIntl + applicationIntl
  const intlPercent = totalMembers ? Math.round((totalIntl / totalMembers) * 1000) / 10 : 0

  return (
    <section id="dashboard">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">{t('📊 동아리 현황 대시보드', '📊 Club Dashboard')}</div>
          <h2>{t('2026년 5월 기준 현황', 'Status as of May 2026')}</h2>
          <p>{t('신청 접수와 관리자 검토 결과가 자동으로 반영됩니다.', 'Applications and admin review status are reflected here.')}</p>
        </div>

        <div className="dash-kpi">
          <div className="kpi-card coral">
            <div className="kpi-icon">🏫</div>
            <div className="kpi-num" style={{ color: 'var(--coral)' }}>{plannedCount}</div>
            <div className="kpi-lbl">{t('개설 예정 동아리', 'Clubs in Planning')}</div>
            <div className="kpi-sub">{t('신청서 접수 자동 반영', 'Synced from applications')}</div>
          </div>
          <div className="kpi-card sky">
            <div className="kpi-icon">⏳</div>
            <div className="kpi-num" style={{ color: 'var(--sky)' }}>{pendingCount}</div>
            <div className="kpi-lbl">{t('신청 대기 중', 'Awaiting Review')}</div>
            <div className="kpi-sub">{t('3일 내 답변 필요', 'Reply within 3 days')}</div>
          </div>
          <div className="kpi-card mint">
            <div className="kpi-icon">👥</div>
            <div className="kpi-num" style={{ color: 'var(--mint)' }}>{totalMembers}</div>
            <div className="kpi-lbl">{t('확보된 회원', 'Submitted Members')}</div>
            <div className="kpi-sub">{t(`수다 ${sudaMembers}명 · 신청 ${applicationMembers}명`, `Suda ${sudaMembers} · applications ${applicationMembers}`)}</div>
          </div>
          <div className="kpi-card" style={{ borderLeftColor: 'var(--yellow)' }}>
            <div className="kpi-icon">🌏</div>
            <div className="kpi-num" style={{ color: '#D97706' }}>{totalIntl}</div>
            <div className="kpi-lbl">{t('외국인 확보 회원', 'International Members')}</div>
            <div className="kpi-sub">{intlPercent}% {t('중 외국인', 'international')}</div>
          </div>
          <div className="kpi-card purple">
            <div className="kpi-icon">✅</div>
            <div className="kpi-num" style={{ color: 'var(--purple)' }}>{approvedCount}</div>
            <div className="kpi-lbl">{t('승인 완료', 'Approved')}</div>
            <div className="kpi-sub">{t('관리자 검토 기준', 'Admin reviewed')}</div>
          </div>
        </div>

        <div className="table-card" style={{ marginTop: 24 }}>
          <h3>{t('📋 개설 예정 동아리 현황 (2026년 5월 기준)', '📋 Planned Clubs (as of May 2026)')}</h3>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('동아리명', 'Club Name')}</th>
                  <th>{t('분류', 'Category')}</th>
                  <th>{t('내국인', 'Domestic')}</th>
                  <th>{t('외국인', 'Intl.')}</th>
                  <th>{t('총 회원', 'Total')}</th>
                  <th>{t('상태', 'Status')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>001</td>
                  <td>
                    <b>수다 (Suda)</b><br />
                    <small style={{ color: 'var(--gray)' }}>한국어 말하기 동아리</small>
                  </td>
                  <td>문화 · 교류</td>
                  <td>{sudaDomestic}명</td>
                  <td>{sudaIntl}명</td>
                  <td><b>{sudaMembers}명</b></td>
                  <td><StatusBadge status={sudaStatus} /></td>
                </tr>
                {activeApplications.length === 0 ? (
                  <tr>
                    <td>002</td>
                    <td>
                      <b>미접수</b><br />
                      <small style={{ color: 'var(--gray)' }}>신규 신청 대기</small>
                    </td>
                    <td>-</td><td>-</td><td>-</td><td>-</td>
                    <td><span className="badge new">🆕 준비중</span></td>
                  </tr>
                ) : activeApplications.map((app, index) => {
                  const presidentInList = app.presidentName?.trim() && (app.members || []).some(m =>
                    (app.studentId?.trim() && m.id?.trim() === app.studentId.trim()) ||
                    m.name?.trim() === app.presidentName.trim()
                  )
                  const presidentDomestic = app.presidentName?.trim() && !presidentInList && isKorean(app.nationality || '') ? 1 : 0
                  const domestic = (app.members || []).filter(member => isKorean(member.nationality || '')).length + presidentDomestic
                  const total = app.review?.memberCount || 0
                  const intl = Math.max(total - domestic, 0)
                  return (
                    <tr key={app.id}>
                      <td>{String(index + 2).padStart(3, '0')}</td>
                      <td>
                        <b>{app.clubNameKo || app.clubNameEn || '미정'}</b><br />
                        <small style={{ color: 'var(--gray)' }}>{app.clubNameEn || app.presidentName || '신청 접수'}</small>
                      </td>
                      <td>{app.category || '-'}</td>
                      <td>{domestic ? `${domestic}명` : '-'}</td>
                      <td>{intl ? `${intl}명` : '-'}</td>
                      <td><b>{total ? `${total}명` : '-'}</b></td>
                      <td><StatusBadge status={app.status} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div style={{
            marginTop: 16, background: 'linear-gradient(135deg,#FFF4E0,#FFF8F0)',
            borderRadius: 12, padding: '14px 18px', fontSize: '.82rem',
            color: 'var(--dark)', lineHeight: 1.8,
          }}>
            💡 <b>{t('처리 기준:', 'Review rule:')}</b>{' '}
            {t(
              '창립회원 5인 이상, 한국 포함 3개국 이상, 필수 항목이 충족되면 3일 안에 승인 또는 보완 요청 답변을 보냅니다.',
              'Reply within 3 days when required fields, 5+ members, and 3+ countries including Korea are checked.'
            )}
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div className="timeline-bar"><div className="t-dot coral" /><small>{t('준비중', 'Preparing')}</small></div>
            <div className="timeline-bar"><div className="t-dot yellow" /><small>{t('신청대기', 'Awaiting Review')}</small></div>
            <div className="timeline-bar"><div className="t-dot sky" /><small>{t('검토중', 'Under Review')}</small></div>
            <div className="timeline-bar"><div className="t-dot mint" /><small>{t('승인완료', 'Approved')}</small></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatusBadge({ status }) {
  const info = STATUS_MAP[status] || STATUS_MAP.pending
  return <span className={`badge ${info.cls}`}>{info.label}</span>
}
