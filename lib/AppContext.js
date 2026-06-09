'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'
import {
  createApplication,
  fromDbRecord,
  parseApplicationEmail,
  toDbRecord,
} from './applicationRecords'

const DEFAULT_CLUB_SUDA = {
  officers: '회장: (미정) · 부회장: (미정)',
  desc: '한국인 원우들과 함께하는 한국어 말하기 동아리. 일상 대화부터 발표 연습까지 자연스럽게 한국어 실력을 키워요.',
  nationality: '우즈베키스탄 · 베트남 · 인도 · 중국 등',
  activities: '주 1회 정기 모임 · 주제 토론 · 한국 문화 체험',
  domestic: 2,
  intl: 22,
}

const APPLICATIONS_KEY = 'club_applications'

export const STATUS_MAP = {
  new: { cls: 'new', label: '🆕 준비중' },
  pending: { cls: 'pending', label: '⏳ 신청대기' },
  review: { cls: 'review', label: '🔍 검토중' },
  approved: { cls: 'approved', label: '✅ 승인완료' },
  certificate_issued: { cls: 'approved', label: '📜 등록증발급' },
  rejected: { cls: 'new', label: '❌ 반려' },
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [lang, setLang] = useState('ko')
  const [toast, setToast] = useState({ show: false, msg: '' })
  const [clubSuda, setClubSuda] = useState(DEFAULT_CLUB_SUDA)
  const [sudaStatus, setSudaStatus] = useState('pending')
  const [sudaEmail, setSudaEmail] = useState('')
  const [adminMemo, setAdminMemo] = useState('')
  const [applications, setApplications] = useState([])
  const [cloudReady, setCloudReady] = useState(false)

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [joinModalOpen, setJoinModalOpen] = useState(false)
  const [adminLoginOpen, setAdminLoginOpen] = useState(false)
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)

  const persistLocalApplications = useCallback((next) => {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(next))
  }, [])

  const loadPublicApplications = useCallback(async () => {
    const savedApplications = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]')
    setApplications(savedApplications.map(app => createApplication(app, app.source || 'form')))

    if (!isSupabaseConfigured) return

    try {
      const res = await fetch('/api/club-applications/public')
      if (!res.ok) return
      const payload = await res.json()
      const next = (payload.applications || []).map(app => createApplication(app, app.source || 'form'))
      setApplications(next)
      persistLocalApplications(next)
      setCloudReady(true)
    } catch {
      setCloudReady(false)
    }
  }, [persistLocalApplications])

  const loadAdminApplications = useCallback(async () => {
    if (!isSupabaseConfigured) return applications
    const res = await fetch('/api/club-applications/admin')
    if (!res.ok) throw new Error('관리자 신청 목록을 불러오지 못했습니다.')
    const payload = await res.json()
    const next = (payload.applications || []).map(app => createApplication(app, app.source || 'form'))
    setApplications(next)
    persistLocalApplications(next)
    setCloudReady(true)
    return next
  }, [applications, persistLocalApplications])

  useEffect(() => {
    const savedLang = localStorage.getItem('smit-lang')
    if (savedLang) setLang(savedLang)

    const saved = JSON.parse(localStorage.getItem('club_suda') || '{}')
    if (Object.keys(saved).length) setClubSuda(prev => ({ ...prev, ...saved }))

    const savedStatus = localStorage.getItem('admin_status_suda')
    if (savedStatus) setSudaStatus(savedStatus)

    const savedEmail = localStorage.getItem('admin_email_suda')
    if (savedEmail) setSudaEmail(savedEmail)

    const savedMemo = localStorage.getItem('admin_memo')
    if (savedMemo) setAdminMemo(savedMemo)

    loadPublicApplications()
  }, [loadPublicApplications])

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'ko' ? 'en' : 'ko'
      localStorage.setItem('smit-lang', next)
      return next
    })
  }, [])

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg })
    setTimeout(() => setToast({ show: false, msg: '' }), 3500)
  }, [])

  const updateClubSuda = useCallback((data) => {
    setClubSuda(prev => {
      const next = { ...prev, ...data }
      localStorage.setItem('club_suda', JSON.stringify(next))
      return next
    })
  }, [])

  const updateSudaStatus = useCallback((status) => {
    setSudaStatus(status)
    localStorage.setItem('admin_status_suda', status)
  }, [])

  const updateSudaEmail = useCallback((email) => {
    setSudaEmail(email)
    localStorage.setItem('admin_email_suda', email)
  }, [])

  const updateAdminMemo = useCallback((memo) => {
    setAdminMemo(memo)
    localStorage.setItem('admin_memo', memo)
  }, [])

  const upsertLocalApplication = useCallback((app) => {
    setApplications(prev => {
      const next = [app, ...prev.filter(item => item.id !== app.id)]
      persistLocalApplications(next)
      return next
    })
  }, [persistLocalApplications])

  const addApplication = useCallback(async (data, source = 'form') => {
    const app = createApplication(data, source)
    upsertLocalApplication(app)

    // 관리자 로그인 상태면 service_role API 사용 (더 안정적)
    try {
      const res = await fetch('/api/club-applications/admin', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(toDbRecord(app)),
      })
      if (res.ok) { setCloudReady(true); return app }
    } catch {}

    // 폴백: anon 클라이언트 (일반 신청 폼)
    if (supabase) {
      const { error } = await supabase.from('club_applications').insert(toDbRecord(app))
      if (error) throw error
      setCloudReady(true)
    }

    return app
  }, [upsertLocalApplication])

  const syncLocalToCloud = useCallback(async () => {
    const localApps = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]')
    if (!localApps.length) return 0
    let synced = 0
    for (const app of localApps) {
      try {
        const res = await fetch('/api/club-applications/admin', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(toDbRecord(createApplication(app, app.source || 'form'))),
        })
        if (res.ok) synced++
      } catch {}
    }
    return synced
  }, [])

  const importApplicationEmail = useCallback(async (rawText) => {
    const parsed = parseApplicationEmail(rawText)
    return addApplication(parsed, 'email')
  }, [addApplication])

  const updateApplicationStatus = useCallback(async (id, status, note = '') => {
    const reviewedAt = new Date().toISOString()

    if (isSupabaseConfigured) {
      const res = await fetch('/api/club-applications/admin', {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ id, status, note, reviewedAt }),
      })
      if (!res.ok) throw new Error('신청 상태 변경에 실패했습니다.')
      const payload = await res.json()
      const app = createApplication(payload.application, payload.application.source)
      upsertLocalApplication(app)
      setCloudReady(true)
      return app
    }

    let updated
    setApplications(prev => {
      const next = prev.map(app => {
        if (app.id !== id) return app
        updated = createApplication({ ...app, status, note: note || app.note, reviewedAt }, app.source)
        return updated
      })
      persistLocalApplications(next)
      return next
    })
    return updated
  }, [persistLocalApplications, upsertLocalApplication])

  const issueCertificate = useCallback(async (id) => {
    if (isSupabaseConfigured) {
      const res = await fetch('/api/club-applications/certificate', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error('등록증 발급 처리에 실패했습니다.')
      const payload = await res.json()
      const app = createApplication(payload.application, payload.application.source)
      upsertLocalApplication(app)
      setCloudReady(true)
      return app
    }

    return updateApplicationStatus(id, 'certificate_issued')
  }, [updateApplicationStatus, upsertLocalApplication])

  const deleteApplication = useCallback(async (id) => {
    if (isSupabaseConfigured) {
      const res = await fetch('/api/club-applications/admin', {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error('신청서 삭제에 실패했습니다.')
    }

    setApplications(prev => {
      const next = prev.filter(app => app.id !== id)
      persistLocalApplications(next)
      return next
    })
  }, [persistLocalApplications])

  const resetClubData = useCallback(() => {
    localStorage.removeItem('club_suda')
    localStorage.removeItem('admin_status_suda')
    localStorage.removeItem('admin_email_suda')
    setClubSuda(DEFAULT_CLUB_SUDA)
    setSudaStatus('pending')
    setSudaEmail('')
  }, [])

  const resetMemo = useCallback(() => {
    localStorage.removeItem('admin_memo')
    setAdminMemo('')
  }, [])

  const resetAll = useCallback(() => {
    ;['club_suda','admin_status_suda','admin_email_suda','admin_memo','smit-lang',APPLICATIONS_KEY]
      .forEach(k => localStorage.removeItem(k))
    setClubSuda(DEFAULT_CLUB_SUDA)
    setSudaStatus('pending')
    setSudaEmail('')
    setAdminMemo('')
    setApplications([])
    setLang('ko')
  }, [])

  const t = useCallback((ko, en) => lang === 'ko' ? ko : en, [lang])

  const sudaJoinEmail = sudaEmail
    ? `${sudaEmail},kokoroa@smit.kr`
    : 'kokoroa@smit.kr,skyoon7517@naver.com'

  return (
    <AppContext.Provider value={{
      lang, toggleLang, t,
      toast, showToast,
      clubSuda, updateClubSuda,
      sudaStatus, updateSudaStatus,
      sudaEmail, updateSudaEmail, sudaJoinEmail,
      adminMemo, updateAdminMemo,
      applications, cloudReady, loadPublicApplications, loadAdminApplications,
      addApplication, importApplicationEmail, updateApplicationStatus, issueCertificate, deleteApplication, syncLocalToCloud,
      resetClubData, resetMemo, resetAll,
      editModalOpen, setEditModalOpen,
      joinModalOpen, setJoinModalOpen,
      adminLoginOpen, setAdminLoginOpen,
      adminPanelOpen, setAdminPanelOpen,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
