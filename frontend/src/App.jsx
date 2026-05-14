import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './routes/ProtectedRoute'

// Helper: returns class names for NavLink based on active route and theme
const navLinkClass = ({ isActive }) =>
  [
    'flex min-h-10 items-center justify-center rounded-md px-3 text-sm font-semibold transition-colors',
    isActive
      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'
      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 hover:text-stone-950 dark:hover:bg-stone-800 dark:hover:text-stone-100',
  ].join(' ')

// Dark mode toggle button component
function DarkModeToggle({ theme, setTheme }) {
  // Handles toggle logic and persistent storage
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="ml-2 rounded-md px-3 py-2 text-sm font-medium transition-colors bg-stone-100 text-stone-950 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700 dark:bg-gray-900 dark:text-white"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}

function App() {
  // Holds the current theme, 'light' or 'dark'
  const [theme, setTheme] = useState('light')

  // Load theme from localStorage or system preference on app startup
  useEffect(() => {
    let savedTheme = localStorage.getItem('theme')
    if (!savedTheme) {
      // Optionally detect system preference for first load
      savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    setTheme(savedTheme)
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // When theme changes (via button or elsewhere), update <html> class and localStorage to keep in sync
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-50 text-stone-950 dark:bg-stone-950 dark:text-stone-50 transition-colors dark:bg-gray-900 dark:text-white">
        <header className="flex min-h-[72px] flex-col gap-4 border-b border-stone-200 bg-white/90 px-5 py-4 backdrop-blur md:flex-row md:items-center md:justify-between md:px-8 dark:bg-stone-900/90 dark:border-stone-800 dark:bg-gray-900 dark:text-white">
          <NavLink className="text-xl font-bold text-stone-950 dark:text-stone-50 dark:text-white" to="/dashboard">
            Task Manager
          </NavLink>

          <nav
            className="grid grid-cols-3 gap-2 md:flex md:items-center dark:text-white"
            aria-label="Primary navigation"
          >
            <NavLink className={navLinkClass} to="/login">
              Login
            </NavLink>
            <NavLink className={navLinkClass} to="/register">
              Register
            </NavLink>
            <NavLink className={navLinkClass} to="/dashboard">
              Dashboard
            </NavLink>
            <DarkModeToggle theme={theme} setTheme={setTheme} />
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12 dark:text-white">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
