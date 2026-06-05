'use client'
import { useApp } from '../lib/AppContext'

export default function Contact() {
  const { t } = useApp()
  return (
    <section id="contact">
      <div className="container">
        <h2>{t('문의 & 연락처', 'Contact Us')}</h2>
        <p>{t('궁금한 점은 언제든지 연락 주세요.', 'Feel free to reach out anytime.')}</p>
        <div className="contact-cards">
          <div className="contact-card">
            <div className="cc-icon">👑</div>
            <h4>{t('원우회 회장', 'Council President')}</h4>
            <p>
              <a href="mailto:skyoon7517@naver.com" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                skyoon7517@naver.com
              </a>
            </p>
          </div>
          <div className="contact-card">
            <div className="cc-icon">🤝</div>
            <h4>{t('원우회 부회장', 'Vice President')}</h4>
            <p>
              <a href="mailto:kokoroa@smit.kr" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                kokoroa@smit.kr
              </a>
            </p>
          </div>
          <div className="contact-card">
            <div className="cc-icon">🏫</div>
            <h4>{t('교학팀', 'Academic Affairs')}</h4>
            <p>
              <a href="mailto:admission@smit.ac.kr" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                admission@smit.ac.kr
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
