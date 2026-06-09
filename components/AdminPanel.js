'use client'
import { useEffect, useState } from 'react'
import { useApp, STATUS_MAP } from '../lib/AppContext'

function formatDate(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function isOverdue(value) {
  return value && new Date(value).getTime() < Date.now()
}

function statusLabel(status) {
  return (STATUS_MAP[status] || STATUS_MAP.pending).label
}

function makeReplyContent(app, approved) {
  const subject = approved
    ? `[SMIT 동아리 개설 신청 결과] ${app.clubNameKo || app.clubNameEn} 승인 안내`
    : `[SMIT 동아리 개설 신청 보완 요청] ${app.clubNameKo || app.clubNameEn}`
  const missing = []
  if (!app.review?.requiredFields) missing.push('필수 항목 일부')
  if (!app.review?.minMembers) missing.push('창립회원 최소 5인')
  if (!app.review?.hasKorea) missing.push('한국 학생 포함 여부')
  if (!app.review?.hasThreeCountries) missing.push('한국 포함 3개국 이상 구성')

  const body = approved
    ? `${app.presidentName || '대표자'}님께,\n\nSMIT 원우회입니다.\n제출하신 "${app.clubNameKo || app.clubNameEn}" 동아리 개설 신청서를 검토한 결과, 기본 형식과 신청 조건을 충족하여 승인 가능 상태로 확인되었습니다.\n\n다음 단계 안내를 위해 원우회에서 추가 연락드리겠습니다.\n\n감사합니다.\nSMIT 원우회`
    : `${app.presidentName || '대표자'}님께,\n\nSMIT 원우회입니다.\n제출하신 "${app.clubNameKo || app.clubNameEn}" 동아리 개설 신청서를 검토한 결과, 아래 항목의 보완이 필요합니다.\n\n- ${missing.join('\n- ')}\n\n보완 후 다시 회신해 주시면 재검토하겠습니다.\n\n감사합니다.\nSMIT 원우회`

  return { subject, body, email: app.email || '' }
}

function openCertificate(app) {
  const issuedAt = app.certificateIssuedAt || new Date().toISOString()
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>동아리등록증 - ${app.clubNameKo}</title>
<style>
body{font-family:'Malgun Gothic',sans-serif;margin:0;padding:44px;color:#111}
.cert{border:8px double #22324a;padding:48px;min-height:640px;text-align:center}
h1{font-size:34px;letter-spacing:8px;margin:20px 0 36px}
.no{font-size:13px;text-align:right;color:#555}
table{width:100%;border-collapse:collapse;margin:30px 0;text-align:left}
th,td{border:1px solid #bbb;padding:12px;font-size:15px}
th{width:170px;background:#f5f7fb}
.body{font-size:18px;line-height:1.9;margin:42px 0}
.sign{margin-top:70px;font-size:20px;font-weight:800}
button{margin-top:20px;padding:10px 16px}
@media print{button{display:none}}
</style></head><body>
<div class="cert">
<div class="no">등록번호: ${app.certificateNumber || '-'}</div>
<h1>동아리등록증</h1>
<table>
<tr><th>동아리명</th><td>${app.clubNameKo || '-'} (${app.clubNameEn || '-'})</td></tr>
<tr><th>분류</th><td>${app.category || '-'}</td></tr>
<tr><th>대표자</th><td>${app.presidentName || '-'} (${app.studentId || '-'})</td></tr>
<tr><th>창립회원</th><td>${app.review?.memberCount || 0}명</td></tr>
<tr><th>발급일</th><td>${formatDate(issuedAt)}</td></tr>
</table>
<p class="body">위 동아리는 SMIT 원우회 동아리 개설 절차에 따라<br>동아리 등록 대상임을 확인합니다.</p>
<div class="sign">서울미디어대학원대학교 원우회</div>
<button onclick="window.print()">인쇄 / PDF 저장</button>
</div></body></html>`
  const win = window.open('', '_blank', 'width=820,height=1000')
  win.document.write(html)
  win.document.close()
  win.focus()
}

export default function AdminPanel() {
  const {
    adminPanelOpen, setAdminPanelOpen,
    clubSuda, updateClubSuda,
    sudaStatus, updateSudaStatus,
    sudaEmail, updateSudaEmail,
    adminMemo, updateAdminMemo,
    applications, cloudReady, loadAdminApplications,
    importApplicationEmail, updateApplicationStatus, issueCertificate, deleteApplication,
    syncLocalToCloud,
    resetClubData, resetMemo, resetAll,
    showToast,
  } = useApp()

  const [activeTab, setActiveTab] = useState('applications')
  const [statusSel, setStatusSel] = useState(sudaStatus)
  const [editFields, setEditFields] = useState({})
  const [memoText, setMemoText] = useState(adminMemo)
  const [emailRaw, setEmailRaw] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [replyPreview, setReplyPreview] = useState(null) // { email, subject, body, approved, appId }

  const selected = applications.find(app => app.id === selectedId) || applications[0]

  useEffect(() => {
    if (!adminPanelOpen) return
    setStatusSel(sudaStatus)
    setEditFields({
      officers: clubSuda.officers,
      desc: clubSuda.desc,
      nationality: clubSuda.nationality,
      activities: clubSuda.activities,
      domestic: clubSuda.domestic,
      intl: clubSuda.intl,
      email: sudaEmail,
    })
    setMemoText(adminMemo)
    setSelectedId(applications[0]?.id || '')
  }, [adminPanelOpen, sudaStatus, clubSuda, sudaEmail, adminMemo, applications])

  if (!adminPanelOpen) return null

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) setAdminPanelOpen(false)
  }

  const ef = (key, value) => setEditFields(prev => ({ ...prev, [key]: value }))

  const importEmail = async () => {
    if (!emailRaw.trim()) {
      showToast('붙여넣을 신청서 이메일 내용이 없습니다.')
      return
    }
    try {
      const app = await importApplicationEmail(emailRaw)
      setEmailRaw('')
      setSelectedId(app.id)
      showToast('신청서가 Supabase/관리자 대장에 등록되었습니다.')
    } catch (error) {
      showToast(`신청서 등록 실패: ${error.message}`)
    }
  }

  const refreshApplications = async () => {
    try {
      await loadAdminApplications()
      showToast('Supabase 신청 목록을 새로 불러왔습니다.')
    } catch (error) {
      showToast(`목록 새로고침 실패: ${error.message}`)
    }
  }

  const changeApplicationStatus = async (status) => {
    if (!selected) return
    try {
      await updateApplicationStatus(selected.id, status)
      showToast(`신청 상태를 ${statusLabel(status)}로 변경했습니다.`)
    } catch (error) {
      showToast(`상태 변경 실패: ${error.message}`)
    }
  }

  const openReplyPreview = (approved) => {
    if (!selected) return
    const { subject, body, email } = makeReplyContent(selected, approved)
    setReplyPreview({ email, subject, body: body, approved, appId: selected.id })
  }

  const sendReply = async () => {
    if (!replyPreview) return
    const { email, subject, body, approved, appId } = replyPreview
    const mailto = `mailto:${email}?cc=kokoroa@smit.kr&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailto, '_self')
    try {
      await updateApplicationStatus(appId, approved ? 'approved' : 'rejected')
      showToast(approved ? '✅ 승인 처리 및 이메일 앱을 열었습니다.' : '📧 보완 요청 처리 및 이메일 앱을 열었습니다.')
    } catch (e) {
      showToast(`상태 변경 실패: ${e.message}`)
    }
    setReplyPreview(null)
  }

  const issueSelectedCertificate = async () => {
    if (!selected) return
    try {
      const app = await issueCertificate(selected.id)
      openCertificate(app)
      showToast('동아리등록증 발급 상태가 저장되었습니다.')
    } catch (error) {
      showToast(`등록증 발급 실패: ${error.message}`)
    }
  }

  const saveStatus = () => {
    updateSudaStatus(statusSel)
    showToast('동아리 상태가 변경되었습니다.')
  }

  const saveEdit = () => {
    const domestic = parseInt(editFields.domestic) || 0
    const intl = parseInt(editFields.intl) || 0
    updateClubSuda({
      officers: editFields.officers,
      desc: editFields.desc,
      nationality: editFields.nationality,
      activities: editFields.activities,
      domestic,
      intl,
    })
    if (editFields.email) updateSudaEmail(editFields.email)
    showToast('수다 동아리 정보가 저장되었습니다.')
  }

  const saveMemo = () => {
    updateAdminMemo(memoText)
    showToast('메모가 저장되었습니다.')
  }

  const handleReset = (fn, msg) => {
    if (!window.confirm(msg)) return
    fn()
    showToast('초기화가 완료되었습니다.')
  }

  return (
    <>
    <div className="modal-overlay admin" onClick={handleOverlayClick}>
      <div className="modal-box" style={{ maxWidth: 980, maxHeight: '92vh' }}>
        <div className="admin-panel-head">
          <div>
            <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}>🔐 관리자 패널</div>
            <div style={{ color: 'rgba(255,255,255,.75)', fontSize: '.78rem', marginTop: 4 }}>
              SMIT 동아리포털 · {cloudReady ? 'Supabase 연결됨' : '로컬 백업 모드'}
            </div>
          </div>
          <button onClick={() => setAdminPanelOpen(false)} className="admin-close-btn">×</button>
        </div>

        <div style={{ padding: 28 }}>
          <div className="admin-tab-bar">
            {[
              { id: 'applications', label: '📬 창설 신청 관리' },
              { id: 'status', label: '📋 동아리 현황' },
              { id: 'edit', label: '✏️ 수다 정보 수정' },
              { id: 'memo', label: '📝 가입신청 메모' },
              { id: 'system', label: '⚙️ 시스템' },
            ].map(tab => (
              <button key={tab.id}
                className={`admin-tab${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'applications' && (
            <div className="admin-app-grid">
              <div>
                <div className="admin-section-box">
                  <h4>받은 이메일 등록</h4>
                  <p>기존 Gmail 신청서 본문을 붙여넣으면 Supabase 신청대장에 행으로 저장됩니다.</p>
                  <textarea className="admin-note-box" style={{ minHeight: 170 }} value={emailRaw}
                    onChange={e => setEmailRaw(e.target.value)}
                    placeholder="[SMIT 동아리 개설 신청서 / Club Registration Form]..." />
                  <button className="admin-save-btn" onClick={importEmail}>신청서 등록</button>
                  <button className="admin-reset-btn" onClick={refreshApplications} style={{ marginLeft: 8 }}>새로고침</button>
                </div>

                <div className="admin-section-box" style={{ marginTop: 14 }}>
                  <h4>접수 목록</h4>
                  {applications.length === 0 ? (
                    <p className="admin-empty">아직 등록된 신청서가 없습니다.</p>
                  ) : applications.map(app => (
                    <button key={app.id} className={`admin-app-item${selected?.id === app.id ? ' active' : ''}`}
                      onClick={() => setSelectedId(app.id)}>
                      <b>{app.clubNameKo || app.clubNameEn || '이름 미입력'}</b>
                      <span>{app.presidentName || '-'} · {formatDate(app.submittedAt)}</span>
                      <small className={isOverdue(app.replyDueAt) && app.status === 'pending' ? 'danger' : ''}>
                        {statusLabel(app.status)} · 답변기한 {formatDate(app.replyDueAt)}
                      </small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-section-box">
                {selected ? (
                  <>
                    <div className="admin-detail-head">
                      <div>
                        <h4>{selected.clubNameKo || selected.clubNameEn}</h4>
                        <p>{selected.clubNameEn} · {selected.category || '분류 미입력'}</p>
                      </div>
                      <span className={`badge ${(STATUS_MAP[selected.status] || STATUS_MAP.pending).cls}`}>
                        {statusLabel(selected.status)}
                      </span>
                    </div>

                    <div className="admin-checklist">
                      <Check ok={selected.review?.requiredFields}>필수 항목 입력</Check>
                      <Check ok={selected.review?.minMembers}>창립회원 5인 이상</Check>
                      <Check ok={selected.review?.hasKorea}>한국 학생 포함</Check>
                      <Check ok={selected.review?.hasThreeCountries}>한국 포함 3개국 이상</Check>
                    </div>

                    <div className="admin-info-list">
                      <div><b>대표자</b><span>{selected.presidentName} ({selected.studentId})</span></div>
                      <div><b>이메일</b><span>{selected.email || '-'}</span></div>
                      <div><b>연락처</b><span>{selected.phone || '-'}</span></div>
                      <div><b>국적</b><span>{selected.nationality || '-'}</span></div>
                      <div><b>지도교수</b><span>{selected.advisor || '-'}</span></div>
                      <div><b>답변 기한</b><span className={isOverdue(selected.replyDueAt) && selected.status === 'pending' ? 'danger' : ''}>{formatDate(selected.replyDueAt)}</span></div>
                      <div><b>등록번호</b><span>{selected.certificateNumber || '-'}</span></div>
                    </div>

                    <h4 style={{ marginTop: 18 }}>창립회원 명단</h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="admin-mini-table">
                        <thead><tr><th>이름</th><th>학번</th><th>국적</th></tr></thead>
                        <tbody>
                          {(selected.members || []).map((member, index) => (
                            <tr key={`${member.id}-${index}`}>
                              <td>{member.name}</td>
                              <td>{member.id || '-'}</td>
                              <td>{member.nationality || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="admin-text-preview">
                      <b>설립 목적</b><p>{selected.purpose || '-'}</p>
                      <b>주요 활동 계획</b><p>{selected.activities || '-'}</p>
                      <b>기타 요청사항</b><p>{selected.extra || '-'}</p>
                    </div>

                    <div className="admin-action-row">
                      <button className="admin-save-btn" onClick={() => changeApplicationStatus('review')}>🔍 검토중</button>
                      <button className="admin-save-btn" onClick={() => openReplyPreview(true)}>✅ 승인 답장</button>
                      <button className="admin-save-btn" onClick={issueSelectedCertificate}>📜 등록증 발급</button>
                      <button className="admin-reset-btn" onClick={() => openReplyPreview(false)}>📝 보완 요청</button>
                      <button className="admin-reset-btn" onClick={() => deleteApplication(selected.id)}>🗑 삭제</button>
                    </div>
                  </>
                ) : (
                  <p className="admin-empty">신청서를 선택해주세요.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'status' && (
            <div>
              <p style={{ fontSize: '.82rem', color: 'var(--gray)', marginBottom: 18 }}>기존 수다 동아리 상태를 변경합니다.</p>
              <div className="admin-status-row">
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.92rem' }}>수다 (Suda)</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--gray)' }}>한국어 말하기 동아리</div>
                </div>
                <select className="status-select" value={statusSel} onChange={e => setStatusSel(e.target.value)}>
                  <option value="new">🆕 준비중</option>
                  <option value="pending">⏳ 신청대기</option>
                  <option value="review">🔍 검토중</option>
                  <option value="approved">✅ 승인완료</option>
                  <option value="certificate_issued">📜 등록증발급</option>
                  <option value="rejected">❌ 반려</option>
                </select>
              </div>
              <button className="admin-save-btn" onClick={saveStatus} style={{ marginTop: 16 }}>상태 저장</button>
            </div>
          )}

          {activeTab === 'edit' && (
            <div>
              <p style={{ fontSize: '.82rem', color: 'var(--gray)', marginBottom: 18 }}>수다 동아리 기본 정보를 수정합니다.</p>
              <div style={{ background: '#F8F9FA', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Input label="임원" value={editFields.officers || ''} onChange={value => ef('officers', value)} />
                  <Textarea label="동아리 소개" value={editFields.desc || ''} onChange={value => ef('desc', value)} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <Input label="내국인 수" type="number" value={editFields.domestic ?? ''} onChange={value => ef('domestic', value)} />
                    <Input label="외국인 수" type="number" value={editFields.intl ?? ''} onChange={value => ef('intl', value)} />
                  </div>
                  <Input label="주요 국적" value={editFields.nationality || ''} onChange={value => ef('nationality', value)} />
                  <Input label="주요 활동" value={editFields.activities || ''} onChange={value => ef('activities', value)} />
                  <Input label="동아리 회장 이메일" type="email" value={editFields.email || ''} onChange={value => ef('email', value)} />
                </div>
              </div>
              <button className="admin-save-btn" onClick={saveEdit}>저장</button>
            </div>
          )}

          {activeTab === 'memo' && (
            <div>
              <p style={{ fontSize: '.82rem', color: 'var(--gray)', marginBottom: 14 }}>이메일로 받은 가입신청 현황을 메모해 두세요.</p>
              <textarea className="admin-note-box" value={memoText} onChange={e => setMemoText(e.target.value)} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button className="admin-save-btn" onClick={saveMemo}>메모 저장</button>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div>
              <div style={{ background: '#F8F9FA', borderRadius: 14, padding: 18, marginBottom: 16, fontSize: '.85rem', lineHeight: 2 }}>
                <div>💾 <b>저장 방식:</b> Supabase 우선, 실패 시 로컬 백업</div>
                <div>🔐 <b>관리자 보호:</b> ADMIN_API_TOKEN httpOnly 쿠키</div>
                <div>📧 <b>이메일 수신:</b> kokoroa@smit.kr · skyoon7517@naver.com · admission@smit.ac.kr</div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="admin-save-btn" onClick={async () => {
                  const n = await syncLocalToCloud()
                  showToast(n > 0 ? `☁️ ${n}개 신청서를 Supabase에 동기화했습니다.` : '동기화할 신청서가 없거나 관리자 로그인이 필요합니다.')
                  if (n > 0) await loadAdminApplications()
                }}>☁️ localStorage → Supabase 동기화</button>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                <button className="admin-reset-btn" onClick={() => handleReset(resetClubData, '수다 동아리 정보를 초기화할까요?')}>동아리 정보 초기화</button>
                <button className="admin-reset-btn" onClick={() => handleReset(resetMemo, '메모를 삭제할까요?')}>메모 초기화</button>
                <button className="admin-reset-btn" onClick={() => handleReset(resetAll, '로컬 저장 데이터를 초기화할까요? Supabase 데이터는 삭제되지 않습니다.')}>로컬 초기화</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* 이메일 미리보기 모달 */}
    {replyPreview && (
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)',
        zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }} onClick={e => e.target === e.currentTarget && setReplyPreview(null)}>
        <div style={{
          background: '#fff', borderRadius: 20, width: '100%', maxWidth: 560,
          maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.3)',
        }}>
          {/* 헤더 */}
          <div style={{
            background: replyPreview.approved
              ? 'linear-gradient(135deg,var(--mint),#4CAF50)'
              : 'linear-gradient(135deg,var(--orange),var(--coral))',
            padding: '20px 24px', borderRadius: '20px 20px 0 0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>
                {replyPreview.approved ? '✅ 승인 답장 미리보기' : '📝 보완 요청 미리보기'}
              </div>
              <div style={{ color: 'rgba(255,255,255,.8)', fontSize: '.78rem', marginTop: 3 }}>
                보낼 내용을 확인하고 수정할 수 있습니다
              </div>
            </div>
            <button onClick={() => setReplyPreview(null)} style={{
              background: 'rgba(255,255,255,.25)', border: 'none', color: '#fff',
              borderRadius: '50%', width: 34, height: 34, fontSize: '1rem', cursor: 'pointer',
            }}>✕</button>
          </div>

          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* 수신자 */}
            <div>
              <label style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--gray)', display: 'block', marginBottom: 4 }}>
                수신자 (To) — 신청 학생
              </label>
              <input
                style={{
                  width: '100%', padding: '10px 14px', border: '2px solid #E5E7EB',
                  borderRadius: 10, fontSize: '.9rem', fontFamily: 'inherit',
                }}
                value={replyPreview.email}
                onChange={e => setReplyPreview(p => ({ ...p, email: e.target.value }))}
              />
            </div>

            {/* CC */}
            <div>
              <label style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--gray)', display: 'block', marginBottom: 4 }}>
                참조 (CC) — 원우회 부회장
              </label>
              <input
                readOnly
                style={{
                  width: '100%', padding: '10px 14px', border: '2px solid #E5E7EB',
                  borderRadius: 10, fontSize: '.9rem', fontFamily: 'inherit',
                  background: '#F8F9FA', color: 'var(--gray)',
                }}
                value="kokoroa@smit.kr"
              />
            </div>

            {/* 제목 */}
            <div>
              <label style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--gray)', display: 'block', marginBottom: 4 }}>
                제목 (Subject)
              </label>
              <input
                style={{
                  width: '100%', padding: '10px 14px', border: '2px solid #E5E7EB',
                  borderRadius: 10, fontSize: '.9rem', fontFamily: 'inherit',
                }}
                value={replyPreview.subject}
                onChange={e => setReplyPreview(p => ({ ...p, subject: e.target.value }))}
              />
            </div>

            {/* 본문 */}
            <div>
              <label style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--gray)', display: 'block', marginBottom: 4 }}>
                본문 (Body) — 직접 수정 가능
              </label>
              <textarea
                style={{
                  width: '100%', minHeight: 220, padding: '12px 14px',
                  border: '2px solid #E5E7EB', borderRadius: 10,
                  fontSize: '.88rem', fontFamily: 'inherit', lineHeight: 1.7,
                  resize: 'vertical',
                }}
                value={replyPreview.body}
                onChange={e => setReplyPreview(p => ({ ...p, body: e.target.value }))}
              />
            </div>

            <div style={{ background: '#FFF8E1', borderRadius: 10, padding: '10px 14px', fontSize: '.8rem', color: '#92400e' }}>
              💡 아래 버튼을 누르면 <b>이메일 앱(Gmail·Outlook 등)이 열립니다.</b> 이메일 앱에서 <b>보내기</b>를 눌러야 실제로 전송됩니다.
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={sendReply} style={{
                flex: 1, padding: 14, borderRadius: 12, border: 'none', cursor: 'pointer',
                background: replyPreview.approved
                  ? 'linear-gradient(135deg,var(--mint),#4CAF50)'
                  : 'linear-gradient(135deg,var(--orange),var(--coral))',
                color: '#fff', fontWeight: 700, fontSize: '.95rem', fontFamily: 'inherit',
              }}>
                📧 이메일 앱으로 보내기
              </button>
              <button onClick={() => setReplyPreview(null)} style={{
                padding: '14px 20px', borderRadius: 12, border: '2px solid #E5E7EB',
                background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                fontWeight: 600, fontSize: '.9rem', color: 'var(--gray)',
              }}>
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

function Check({ ok, children }) {
  return <div className={ok ? 'ok' : 'bad'}><span>{ok ? '✓' : '!'}</span>{children}</div>
}

function Input({ label, value, onChange, type = 'text' }) {
  return (
    <div className="form-group">
      <label style={{ fontSize: '.82rem', fontWeight: 700 }}>{label}</label>
      <input type={type} className="join-modal-input" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  )
}

function Textarea({ label, value, onChange }) {
  return (
    <div className="form-group">
      <label style={{ fontSize: '.82rem', fontWeight: 700 }}>{label}</label>
      <textarea className="join-modal-input" rows="3" style={{ resize: 'vertical' }} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  )
}
