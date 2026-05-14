import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './routes/ProtectedRoute'

const navLinkClass = ({ isActive }) =>
  [
    'flex min-h-10 items-center justify-center rounded-md px-3 text-sm font-semibold transition-colors',
    isActive
      ? 'bg-emerald-50 text-emerald-800'
      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950',
  ].join(' ')

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-50 text-stone-950">
        <header className="flex min-h-[72px] flex-col gap-4 border-b border-stone-200 bg-white/90 px-5 py-4 backdrop-blur md:flex-row md:items-center md:justify-between md:px-8">
          <NavLink className="text-xl font-bold text-stone-950" to="/dashboard">
            Task Manager
          </NavLink>

          <nav
            className="grid grid-cols-3 gap-2 md:flex md:items-center"
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
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
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
