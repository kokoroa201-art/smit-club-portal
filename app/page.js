'use client'
import { AppProvider } from '../lib/AppContext'
import Toast from '../components/Toast'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Steps from '../components/Steps'
import Downloads from '../components/Downloads'
import ApplicationForm from '../components/ApplicationForm'
import Dashboard from '../components/Dashboard'
import ClubShowcase from '../components/ClubShowcase'
import EditClubModal from '../components/EditClubModal'
import JoinClubModal from '../components/JoinClubModal'
import AdminLoginModal from '../components/AdminLoginModal'
import AdminPanel from '../components/AdminPanel'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Page() {
  return (
    <AppProvider>
      <Toast />
      <Navbar />
      <Hero />
      <Steps />
      <Downloads />
      <ApplicationForm />
      <Dashboard />
      <ClubShowcase />
      <EditClubModal />
      <JoinClubModal />
      <AdminLoginModal />
      <AdminPanel />
      <Contact />
      <Footer />
    </AppProvider>
  )
}
