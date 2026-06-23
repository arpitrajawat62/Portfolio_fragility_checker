import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  const [page, setPage] = useState('home')
  const [clientCode, setClientCode] = useState(null)

  // Check for existing session on app load
  useEffect(() => {
    const savedClientCode = localStorage.getItem('client_code')
    if (savedClientCode) {
      setClientCode(savedClientCode)
      setPage('dashboard')
    }
  }, [])

  function handleLogin(code) {
    setClientCode(code)
    setPage('dashboard')
  }

  function handleLogout() {
    localStorage.removeItem('client_code')
    setClientCode(null)
    setPage('home')
  }

  if (page === 'home') return <HomePage onGetStarted={() => setPage('login')} />
  if (page === 'login') return <LoginPage onLogin={handleLogin} onBack={() => setPage('home')} />
  return <DashboardPage clientCode={clientCode} onLogout={handleLogout} />
}