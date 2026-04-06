import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-8 pt-20 pb-0 w-full">

        {/* Big editorial headline — serif italic + bold sans mix */}
        <div className="mb-10">
          <h1 className="leading-[0.95] text-[#2a2520]" style={{ letterSpacing: "-0.025em" }}>
            {/* Line 1: serif italic */}
            <span
              className="block font-[family-name:var(--font-display)] italic font-light"
              style={{ fontSize: "clamp(56px, 9vw, 110px)" }}
            >
              Your music.
            </span>
            {/* Line 2: bold sans + trailing star */}
            <span
              className="flex items-center gap-4"
              style={{ fontSize: "clamp(56px, 9vw, 110px)" }}
            >
              <span className="font-bold tracking-tight" style={{ fontFamily: "var(--font-sans)" }}>
                Your rules.
              </span>
              <span className="text-[#DD573D] text-[0.35em] leading-none">✦</span>
            </span>
          </h1>
        </div>

        {/* Subtitle + CTA row */}
        <div className="grid grid-cols-12 gap-8 border-t border-[#e0d9cd] pt-8 pb-16">
          <p className="col-span-5 text-[14px] text-[#5a5047] leading-relaxed">
            Connecting students with passionate musician-educators in Singapore.
            Creativity, expression, and actually playing music — not just passing grades.
          </p>
          <div className="col-span-7 flex items-center justify-end gap-6">
            <Link
              href="/educators"
              className="text-[11px] tracking-[0.15em] uppercase bg-[#DD573D] text-[#F7F1E2] px-6 py-3 hover:bg-[#b8432b] transition-colors whitespace-nowrap"
            >
              Find an educator
            </Link>
            <Link
              href="/educator/apply"
              className="text-[11px] tracking-[0.15em] uppercase text-[#5a5047] hover:text-[#2a2520] border-b border-[#e0d9cd] hover:border-[#2a2520] pb-px transition-colors whitespace-nowrap"
            >
              I want to teach →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Full-bleed warm divider ── */}
      <div className="w-full border-t border-b border-[#e0d9cd] bg-[#ede7d8]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-3 divide-x divide-[#e0d9cd]">
            {[
              { value: "SGD 30", label: "Trial lesson — no commitment" },
              { value: "80%", label: "Payout rate for every educator" },
              { value: "60 min", label: "Standard session length" },
            ].map((s) => (
              <div key={s.label} className="py-7 px-8 first:pl-0">
                <p
                  className="font-[family-name:var(--font-display)] text-[32px] font-light text-[#2a2520] mb-0.5"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {s.value}
                </p>
                <p className="text-[12px] text-[#8a7f75] tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-8 py-28 w-full">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#DD573D] mb-4 font-medium">
              Process
            </p>
            <h2
              className="font-[family-name:var(--font-display)] font-light text-[#2a2520] leading-tight"
              style={{ fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.02em" }}
            >
              From first click<br />to first lesson.
            </h2>
          </div>
          <Link
            href="/educators"
            className="text-[11px] tracking-[0.15em] uppercase border border-[#2a2520] text-[#2a2520] px-5 py-2.5 hover:bg-[#2a2520] hover:text-[#F7F1E2] transition-colors mb-1"
          >
            Browse educators
          </Link>
        </div>

        <div className="grid grid-cols-3 border border-[#e0d9cd]">
          {[
            {
              num: "01",
              title: "Browse educators",
              desc: "Filter by instrument, style, and approach. Read each educator's story — especially why they love music.",
            },
            {
              num: "02",
              title: "Book a trial",
              desc: "Pick a time slot and pay online via Stripe. Get instant confirmation with all session details.",
            },
            {
              num: "03",
              title: "Fall in love with music",
              desc: "Have your lesson. If the fit is right, book regular sessions directly. No middlemen after that.",
            },
          ].map((step, i) => (
            <div key={step.num} className={`p-10 ${i < 2 ? 'border-r border-[#e0d9cd]' : ''}`}>
              <p className="text-[11px] font-mono text-[#DD573D] mb-6 tracking-widest">{step.num}</p>
              <h3 className="text-[15px] font-semibold text-[#2a2520] mb-3">{step.title}</h3>
              <p className="text-[13px] text-[#5a5047] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission — dark cream band ── */}
      <section className="bg-[#2a2520]">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-1 flex justify-center">
              <span className="text-[#DD573D] text-3xl">✦</span>
            </div>
            <div className="col-span-7">
              <p
                className="font-[family-name:var(--font-display)] font-light text-[#F7F1E2] leading-relaxed"
                style={{ fontSize: "clamp(20px, 2.5vw, 30px)", letterSpacing: "-0.01em" }}
              >
                &ldquo;ABRSM and Trinity grades have their place. But they&rsquo;re not the whole story. We connect students with educators who believe music is for everyone — at every stage, for the pure joy of it.&rdquo;
              </p>
            </div>
            <div className="col-span-4 flex justify-end">
              <Link
                href="/signup"
                className="text-[11px] tracking-[0.15em] uppercase border border-[#F7F1E2] text-[#F7F1E2] px-6 py-3 hover:bg-[#F7F1E2] hover:text-[#2a2520] transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why The Session ── */}
      <section className="max-w-7xl mx-auto px-8 py-28 w-full">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#DD573D] mb-4 font-medium">
              Why The Session
            </p>
            <h2
              className="font-[family-name:var(--font-display)] font-light text-[#2a2520] leading-tight"
              style={{ fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.02em" }}
            >
              Built for the music,<br />not the certificate.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-l border-[#e0d9cd]">
          {[
            {
              title: "Curated educators",
              desc: "Every educator is personally reviewed. We look for passion and teaching quality — not just credentials.",
            },
            {
              title: "Flexible scheduling",
              desc: "Book weekly, bi-weekly, or on-demand. No long-term contracts. Pay per session.",
            },
            {
              title: "Secure payments",
              desc: "Pay online via Stripe. Educators receive 80% of every lesson automatically. Clear, honest fees.",
            },
            {
              title: "All instruments, all levels",
              desc: "Guitar, piano, violin, voice, drums and more. Kids to adults. Total beginners to advanced players.",
            },
          ].map((item) => (
            <div key={item.title} className="border-b border-r border-[#e0d9cd] p-10">
              <h3 className="text-[15px] font-semibold text-[#2a2520] mb-3">{item.title}</h3>
              <p className="text-[13px] text-[#5a5047] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA band ── */}
      <section className="bg-[#DD573D]">
        <div className="max-w-7xl mx-auto px-8 py-20 flex items-center justify-between">
          <div>
            <h2
              className="font-[family-name:var(--font-display)] font-light text-[#F7F1E2] leading-tight"
              style={{ fontSize: "clamp(32px, 5vw, 60px)", letterSpacing: "-0.025em" }}
            >
              Ready to start playing?
            </h2>
            <p className="text-[14px] text-[#f2c9bf] mt-2">
              Trial lesson from SGD 30 · 60 minutes · No commitment
            </p>
          </div>
          <Link
            href="/educators"
            className="text-[11px] tracking-[0.15em] uppercase border border-[#F7F1E2] text-[#F7F1E2] px-8 py-4 hover:bg-[#F7F1E2] hover:text-[#DD573D] transition-colors whitespace-nowrap"
          >
            Browse educators
          </Link>
        </div>
      </section>

    </div>
  );
}
