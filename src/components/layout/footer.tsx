import Link from 'next/link'
import { Music } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-zinc-50 mt-24">
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 font-semibold text-base mb-2">
            <Music className="h-4 w-4 text-amber-500" />
            The Session
          </div>
          <p className="text-sm text-zinc-500 max-w-xs">
            Music for the love of it. Connecting passionate musician-educators with students across Singapore.
          </p>
        </div>

        <div className="flex gap-16 text-sm text-zinc-600">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-zinc-900">Students</span>
            <Link href="/educators" className="hover:text-zinc-900">Find an educator</Link>
            <Link href="/student" className="hover:text-zinc-900">My bookings</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-zinc-900">Educators</span>
            <Link href="/educator/apply" className="hover:text-zinc-900">Apply to teach</Link>
            <Link href="/educator" className="hover:text-zinc-900">Educator portal</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-100 py-4 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} The Session. Singapore.
      </div>
    </footer>
  )
}
