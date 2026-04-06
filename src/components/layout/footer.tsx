import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[#e0d9cd] bg-[#F7F1E2] mt-32">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-12 gap-8">

          <div className="col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[#DD573D] text-lg">✦</span>
              <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#2a2520]">
                The Session
              </span>
            </div>
            <p className="text-[13px] text-[#5a5047] leading-relaxed max-w-xs">
              Connecting students with passionate musician-educators across Singapore.
              Music for the love of it — not grades.
            </p>
          </div>

          <div className="col-span-2" />

          <div className="col-span-2">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#2a2520] mb-4">
              Students
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/educators" className="text-[13px] text-[#5a5047] hover:text-[#2a2520] transition-colors">
                Find an educator
              </Link>
              <Link href="/student" className="text-[13px] text-[#5a5047] hover:text-[#2a2520] transition-colors">
                My bookings
              </Link>
            </div>
          </div>

          <div className="col-span-2">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#2a2520] mb-4">
              Educators
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/educator/apply" className="text-[13px] text-[#5a5047] hover:text-[#2a2520] transition-colors">
                Apply to teach
              </Link>
              <Link href="/educator" className="text-[13px] text-[#5a5047] hover:text-[#2a2520] transition-colors">
                Educator portal
              </Link>
            </div>
          </div>

          <div className="col-span-2">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#2a2520] mb-4">
              Platform
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/#how-it-works" className="text-[13px] text-[#5a5047] hover:text-[#2a2520] transition-colors">
                How it works
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e0d9cd] mt-12 pt-6 flex items-center justify-between">
          <p className="text-[12px] text-[#8a7f75]">© {new Date().getFullYear()} The Session. Singapore.</p>
          <p className="text-[12px] text-[#8a7f75]">Music for the love of it.</p>
        </div>
      </div>
    </footer>
  )
}
