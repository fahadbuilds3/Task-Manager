import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { registerUser } from '../api/authApi'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await registerUser(formData)
      navigate('/login')
    } catch (apiError) {
      if (!apiError.response) {
        setError('Cannot connect to the backend. Start the server on port 5000.')
        return
      }

      setError(
        apiError.response?.data?.message ||
          'Unable to create account. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      className="grid min-h-[calc(100vh-11rem)] place-items-center"
      aria-labelledby="register-title"
    >
      <div className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/70 md:p-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-normal text-amber-700">
          Start organizing
        </p>
        <h1 id="register-title" className="mb-6 text-3xl font-bold text-stone-950">
          Register
        </h1>

        {error && (
          <p className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800">
            {error}
          </p>
        )}

        <form className="grid gap-3" onSubmit={handleSubmit}>
          <label
            className="text-sm font-semibold text-stone-800"
            htmlFor="register-name"
          >
            Name
          </label>
          <input
            className="min-h-11 rounded-md border border-stone-300 bg-white px-3 text-stone-950 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label
            className="text-sm font-semibold text-stone-800"
            htmlFor="register-email"
          >
            Email
          </label>
          <input
            className="min-h-11 rounded-md border border-stone-300 bg-white px-3 text-stone-950 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label
            className="text-sm font-semibold text-stone-800"
            htmlFor="register-password"
          >
            Password
          </label>
          <input
            className="min-h-11 rounded-md border border-stone-300 bg-white px-3 text-stone-950 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />

          <button
            className="mt-2 min-h-11 rounded-md bg-emerald-700 px-4 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-stone-400"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-stone-600">
          Already registered?{' '}
          <Link className="font-bold text-emerald-800 hover:text-emerald-950" to="/login">
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Register
