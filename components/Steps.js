'use client'
import { useApp } from '../lib/AppContext'

const STEPS = [
  {
    num: 1,
    icon: '💡',
    bg: 'linear-gradient(135deg,#FFE8E8,#FFD0D0)',
    ko: { title: '아이디어 구체화', desc: '동아리 목적·활동 분야·구성원 계획을 세웁니다.' },
    en: { title: 'Plan Your Club', desc: "Define your club's purpose, activities, and target members." },
  },
  {
    num: 2,
    icon: '📝',
    bg: 'linear-gradient(135deg,#FFF4E0,#FFE8B0)',
    ko: { title: '서식 작성', desc: '아래 서식 ①②③을 작성합니다.\n최소 5인 이상 필요. (지도교수는 별도 절차로 배정)' },
    en: { title: 'Fill Out Forms', desc: 'Complete Forms ①②③ below.\nMin. 5 members required. (Faculty advisor assigned separately)' },
  },
  {
    num: 3,
    icon: '🖥️',
    bg: 'linear-gradient(135deg,#E8F4FD,#C8E8FF)',
    ko: { title: '온라인 신청', desc: '이 페이지 신청 폼을 작성하거나 이메일로 서류를 제출합니다.' },
    en: { title: 'Online Application', desc: 'Submit via the form on this page or email the documents.' },
  },
  {
    num: 4,
    icon: '👥',
    bg: 'linear-gradient(135deg,#EDE8FF,#D8D0FF)',
    ko: { title: '원우회 검토', desc: '원우회 회장·부회장이 함께 서류를 검토하고 승인 여부를 결정합니다. (약 3~5일 이내)' },
    en: { title: 'Council Review', desc: 'President & Vice President jointly review documents and decide on approval within 3–5 days.' },
  },
  {
    num: 5,
    icon: '🏫',
    bg: 'linear-gradient(135deg,#E8FFE8,#C8F0C8)',
    ko: { title: '교학팀 협의', desc: '원우회가 교학팀과 최종 협의하여 동아리 공간·예산을 확정합니다.' },
    en: { title: 'Academic Affairs', desc: 'Council coordinates with Academic Affairs for space & budget approval.' },
  },
  {
    num: 6,
    icon: '🎉',
    bg: 'linear-gradient(135deg,#FFE8F4,#FFD0E8)',
    ko: { title: '동아리 승인 & 공식 출범', desc: '승인 완료 후 동아리 등록증 발급 및 공식 활동 시작!' },
    en: { title: 'Official Approval!', desc: 'Receive official registration certificate and start activities!' },
  },
]

export default function Steps() {
  const { t } = useApp()
  return (
    <section id="steps">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            {t('📋 동아리 개설 절차', '📋 Registration Process')}
          </div>
          <h2>{t('이렇게 신청하세요!', 'How to Register a Club')}</h2>
          <p>{t('총 6단계, 최소 5인 이상이면 누구나 동아리를 만들 수 있어요.', '6 easy steps — any 5+ students can start a club!')}</p>
        </div>

        <div className="steps-grid">
          {STEPS.map(s => {
            const info = t(s.ko, s.en)
            return (
              <div className="step-card" key={s.num}>
                <div className="step-num">{s.num}</div>
                <div className="step-icon" style={{ background: s.bg }}>{s.icon}</div>
                <h3>{info.title}</h3>
                <p>{info.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="req-grid">
          <div className="req-card blue">
            <div className="req-card-head">
              <div className="req-icon blue"><i className="fa fa-circle-check" /></div>
              <h4>{t('신청 자격', 'Eligibility')}</h4>
            </div>
            <ul>
              <li>{t('재학 중인 원우 5인 이상 (한국 포함 3개국 이상 각 1인 필수)', '5+ enrolled students (incl. Korea, min. 1 from each of 3 nationalities)')}</li>
              <li>{t('동아리 활동 계획 수립 및 제출', 'Club activity plan prepared and submitted')}</li>
            </ul>
          </div>
          <div className="req-card coral">
            <div className="req-card-head">
              <div className="req-icon coral"><i className="fa fa-clock" /></div>
              <h4>{t('처리 일정', 'Timeline')}</h4>
            </div>
            <ul>
              <li>{t('서류 검토: 약 3~5일', 'Document review: approx. 3–5 days')}</li>
              <li>{t('교학팀 협의: 약 5~7일', 'Academic review: approx. 5–7 days')}</li>
              <li>{t('최종 승인 통보: 이메일·문자', 'Final notification: email & SMS')}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
