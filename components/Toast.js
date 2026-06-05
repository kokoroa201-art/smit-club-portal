'use client'
import { useApp } from '../lib/AppContext'

export default function Toast() {
  const { toast } = useApp()
  if (!toast.show) return null
  return <div className="toast">{toast.msg}</div>
}
