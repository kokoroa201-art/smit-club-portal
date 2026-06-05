'use client'
import { useApp } from '../lib/AppContext'

const FILES = [
  {
    icon: 'hwp', fa: 'fa-file-alt',
    numKo: '📋 서식①', numEn: '📋 Form①',
    titleKo: '동아리 신청 양식', titleEn: 'Club Application',
    descKo: '동아리 설립 신청 기본 양식', descEn: 'Basic club establishment form',
    hwp: '/(서식1)동아리 신청 양식.hwp',
    pdf: '/(서식1)동아리 신청 양식.pdf',
  },
  {
    icon: 'hwp', fa: 'fa-users',
    numKo: '👥 서식②', numEn: '👥 Form②',
    titleKo: '동아리 회원명단', titleEn: 'Member List',
    descKo: '창립 회원 명단 (최소 5인)', descEn: 'Founding member roster (min. 5)',
    hwp: '/(서식2)동아리 회원명단.hwp',
    pdf: '/(서식2)동아리 회원명단.pdf',
  },
  {
    icon: 'hwp', fa: 'fa-calendar-check',
    numKo: '📅 서식③', numEn: '📅 Form③',
    titleKo: '활동 계획서', titleEn: 'Activity Plan',
    descKo: '학기별 활동 계획 및 예산안', descEn: 'Semester activity plan & budget',
    hwp: '/(서식3)활동 계획서.hwp',
    pdf: '/(서식3)활동 계획서.pdf',
  },
  {
    icon: 'hwp', fa: 'fa-clipboard-list',
    numKo: '📊 서식④', numEn: '📊 Form④',
    titleKo: '학기 활동보고서', titleEn: 'Semester Report',
    descKo: '활동 종료 후 제출 (기존 동아리용)', descEn: 'Post-semester report (existing clubs)',
    hwp: '/(서식4)학기 활동보고서.hwp',
    pdf: '/(서식4)학기 활동보고서.pdf',
  },
  {
    icon: 'hwp', fa: 'fa-chalkboard-teacher',
    numKo: '📜 서식⑤', numEn: '📜 Form⑤',
    titleKo: '지도교수 확인서', titleEn: 'Faculty Confirmation',
    descKo: '학교 지원금 수령 시 또는 지도교수 배정 후 제출', descEn: 'Submit when receiving school funding or after faculty advisor is assigned',
    hwp: '/(서식5)지도교수 확인서.hwp',
    pdf: '/(서식5)지도교수 확인서.pdf',
  },
  {
    icon: 'doc', fa: 'fa-book-open',
    titleKo: '📘 동아리 운영규정', titleEn: '📘 Club Operation Rules',
    descKo: 'SMIT 동아리 운영 전반 규정', descEn: 'SMIT official club operation regulations',
    pdf: '/서울미디어대학원대학교 동아리 운영규정.pdf',
  },
  {
    icon: 'doc', fa: 'fa-scroll',
    titleKo: '📗 표준 동아리 회칙', titleEn: '📗 Standard Club Bylaws',
    descKo: '각 동아리 회칙 작성 시 참고 표준안', descEn: 'Reference template for individual club bylaws',
    hwp: '/서울미디어대학원대학교 표준 동아리 회칙(안).hwp',
    pdf: '/서울미디어대학원대학교 표준 동아리 회칙(안).pdf',
  },
  {
    icon: 'doc', fa: 'fa-folder-open',
    titleKo: '📦 서식 통합 패키지', titleEn: '📦 All Forms Package',
    descKo: '모든 서식 한 번에 다운로드', descEn: 'All forms in one download',
    hwp: '/동아리 등록 관련 서식 폼.hwp',
    pdf: '/동아리 등록 관련 서식 폼.pdf',
  },
]

export default function Downloads() {
  const { t } = useApp()
  return (
    <section id="download">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">{t('📁 서식 자료실', '📁 Document Downloads')}</div>
          <h2>{t('필요한 서식을 다운로드하세요', 'Download Required Forms')}</h2>
          <p>{t('HWP 또는 PDF 형식으로 다운로드하여 작성 후 온라인으로 제출하세요.', 'Download HWP or PDF format, fill in, then submit online below.')}</p>
        </div>
        <div className="dl-grid">
          {FILES.map((f, i) => (
            <div className="dl-card" key={i}>
              <div className={`dl-icon ${f.icon}`}>
                <i className={`fa ${f.fa}`} />
              </div>
              <div className="dl-info">
                <h4>
                  {f.numKo && <span className="dl-num">{t(f.numKo, f.numEn)}</span>}
                  <span className="dl-ttl">{t(f.titleKo, f.titleEn)}</span>
                </h4>
                <small>{t(f.descKo, f.descEn)}</small>
              </div>
              <div className="dl-btns">
                {f.hwp && (
                  <a className="dl-btn hwp-btn" href={f.hwp} download>
                    <i className="fa fa-download" /> HWP
                  </a>
                )}
                {f.pdf && (
                  <a className="dl-btn pdf-btn" href={f.pdf} download>
                    <i className="fa fa-download" /> PDF
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
