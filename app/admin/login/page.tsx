/**
 * FIX: Added dynamic export to prevent SSR pre-rendering errors
 * WHY: Client components with NextAuth can't be pre-rendered during build
 * CHANGE: 'use client' must be FIRST, then exports
 */
'use client'

// FIX: Tells Next.js to skip static generation for this page
export const dynamic = 'force-dynamic';

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/admin',
      })

      if (res?.error) {
        setError('Invalid email or password')
        setLoading(false)
      } else if (res?.ok) {
        window.location.href = '/admin';
      } else {
        setError('An unexpected error occurred')
        setLoading(false)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl bg-white p-6 shadow">
        <h1 className="mb-4 text-xl font-bold">Admin Sign in</h1>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          className="mb-3 w-full rounded border p-2"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          autoComplete="username"
          required
        />
        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          className="mb-4 w-full rounded border p-2"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <button
          className="w-full rounded bg-sky-600 p-2 font-semibold text-white hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
