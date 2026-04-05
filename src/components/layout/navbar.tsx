'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Music } from 'lucide-react'
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    role === 'admin' ? '/admin' :
    '/student'

  return (
    <header className="border-b border-zinc-100 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Music className="h-5 w-5 text-amber-500" />
          <span>The Session</span>
          <span className="text-xs text-zinc-400 font-normal ml-1">Singapore</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm text-zinc-600">
          <Link href="/educators" className="hover:text-zinc-900 transition-colors">
            Find an educator
          </Link>
          <Link href="/educators#how-it-works" className="hover:text-zinc-900 transition-colors">
            How it works
          </Link>

          {user ? (
            <>
              <Link href={dashboardHref} className="hover:text-zinc-900 transition-colors">
                Dashboard
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
