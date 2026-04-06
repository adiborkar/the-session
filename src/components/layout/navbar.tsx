'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single()
          .then(({ data: u }) => setRole(u?.role ?? null))
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setRole(null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const dashboardHref =
    role === 'educator' ? '/educator' :
    role === 'admin' ? '/admin' : '/student'

  return (
    <header className="border-b border-[#e0d9cd] bg-[#F7F1E2] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-4">
          {/* Small asterisk mark — nod to the FEU star motif */}
          <span className="text-[#DD573D] text-lg leading-none">✦</span>
          <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#2a2520]">
            The Session
          </span>
          <span className="w-px h-3 bg-[#e0d9cd]" />
          <span className="text-[11px] tracking-[0.12em] uppercase text-[#8a7f75]">
            Singapore
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6 shrink-0">
          <Link href="/educators"
            className="text-[11px] tracking-[0.12em] uppercase text-[#5a5047] hover:text-[#2a2520] transition-colors">
            Find an educator
          </Link>
          <Link href="/#how-it-works"
            className="text-[11px] tracking-[0.12em] uppercase text-[#5a5047] hover:text-[#2a2520] transition-colors">
            How it works
          </Link>
          <Link href="/educator/apply"
            className="text-[11px] tracking-[0.12em] uppercase text-[#5a5047] hover:text-[#2a2520] transition-colors">
            Teach
          </Link>

          {user ? (
            <>
              <Link href={dashboardHref}
                className="text-[11px] tracking-[0.12em] uppercase text-[#5a5047] hover:text-[#2a2520] transition-colors">
                Dashboard
              </Link>
              <button onClick={handleSignOut}
                className="text-[11px] tracking-[0.12em] uppercase text-[#5a5047] hover:text-[#2a2520] transition-colors">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login"
                className="text-[11px] tracking-[0.12em] uppercase text-[#5a5047] hover:text-[#2a2520] transition-colors">
                Sign in
              </Link>
              <Link href="/signup"
                className="text-[11px] tracking-[0.12em] uppercase bg-[#DD573D] text-[#F7F1E2] px-4 py-2 hover:bg-[#b8432b] transition-colors">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
