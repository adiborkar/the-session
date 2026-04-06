'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

type Role = 'student' | 'educator'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { role }, emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setError(error.message); setLoading(false); return }
    if (role === 'educator') router.push('/educator/apply')
    else setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F7F1E2]">
        <div className="text-center max-w-sm">
          <span className="text-[#DD573D] text-3xl block mb-5">✦</span>
          <h1 className="text-[20px] font-[family-name:var(--font-display)] font-light text-[#2a2520] mb-2">
            Check your email
          </h1>
          <p className="text-[13px] text-[#5a5047]">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <Link href="/" className="text-[12px] tracking-[0.1em] uppercase text-[#DD573D] hover:underline mt-5 block">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F7F1E2]">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[#DD573D] text-lg">✦</span>
            <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#2a2520]">
              The Session
            </span>
          </Link>
        </div>

        <div className="border border-[#e0d9cd] bg-[#F7F1E2] p-8">
          <h1 className="text-[20px] font-[family-name:var(--font-display)] font-light text-[#2a2520] mb-1"
            style={{ letterSpacing: "-0.01em" }}>
            Create an account
          </h1>
          <p className="text-[13px] text-[#8a7f75] mb-7">Join The Session</p>

          {/* Role toggle */}
          <div className="flex border border-[#e0d9cd] mb-6">
            {(['student', 'educator'] as Role[]).map((r) => (
              <button
                key={r} type="button" onClick={() => setRole(r)}
                className={`flex-1 py-2.5 text-[11px] tracking-[0.12em] uppercase transition-colors ${
                  role === r
                    ? 'bg-[#DD573D] text-[#F7F1E2]'
                    : 'text-[#5a5047] hover:text-[#2a2520]'
                }`}
              >
                {r === 'student' ? 'I want to learn' : 'I want to teach'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.15em] uppercase text-[#5a5047]">Email</label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="border border-[#e0d9cd] bg-[#F7F1E2] px-4 py-2.5 text-[13px] text-[#2a2520] placeholder-[#8a7f75] focus:outline-none focus:border-[#2a2520] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.15em] uppercase text-[#5a5047]">Password</label>
              <input
                type="password" required minLength={8} value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="border border-[#e0d9cd] bg-[#F7F1E2] px-4 py-2.5 text-[13px] text-[#2a2520] placeholder-[#8a7f75] focus:outline-none focus:border-[#2a2520] transition-colors"
              />
            </div>
            {error && <p className="text-[13px] text-[#DD573D]">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="mt-2 bg-[#DD573D] text-[#F7F1E2] text-[11px] tracking-[0.15em] uppercase py-3 hover:bg-[#b8432b] transition-colors disabled:opacity-60 flex items-center justify-center"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
            </button>
          </form>

          <p className="text-[13px] text-[#8a7f75] text-center mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-[#DD573D] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
