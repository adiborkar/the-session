'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Music, Loader2 } from 'lucide-react'

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
      email,
      password,
      options: {
        data: { role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (role === 'educator') {
      router.push('/educator/apply')
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-50">
        <div className="text-center max-w-sm">
          <Music className="h-8 w-8 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Check your email</h1>
          <p className="text-zinc-500 text-sm">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <Link href="/" className="text-sm text-amber-600 hover:underline mt-4 block">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-50">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <Music className="h-5 w-5 text-amber-500" />
            The Session
          </Link>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-xl font-bold mb-1">Create an account</h1>
          <p className="text-sm text-zinc-500 mb-6">Join The Session</p>

          {/* Role selector */}
          <div className="flex rounded-lg border border-zinc-200 overflow-hidden mb-6">
            {(['student', 'educator'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
                  role === r ? 'bg-amber-500 text-white' : 'text-zinc-500 hover:bg-zinc-50'
                }`}
              >
                {r === 'student' ? 'I want to learn' : 'I want to teach'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-white mt-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
            </Button>
          </form>

          <p className="text-sm text-zinc-500 text-center mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
