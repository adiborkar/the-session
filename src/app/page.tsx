import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Star, Clock, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-zinc-950 text-white px-4 py-28 text-center">
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-6">
          Now live in Singapore
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
          Music lessons for the{" "}
          <span className="text-amber-400">love of it</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10">
          Connect with passionate musician-educators who care about creativity,
          expression, and actually playing music — not just passing grades.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/educators">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-8">
              Find your educator
            </Button>
          </Link>
          <Link href="/educator/apply">
            <Button size="lg" variant="outline" className="border-zinc-600 text-white hover:bg-zinc-800 px-8">
              I want to teach
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-zinc-500 text-sm">
          First trial lesson from SGD 30 · No commitment
        </p>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-4">How it works</h2>
        <p className="text-zinc-500 text-center mb-16 max-w-lg mx-auto">
          From first click to first lesson in minutes.
        </p>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: <Music className="h-6 w-6 text-amber-500" />,
              step: "01",
              title: "Browse educators",
              desc: "Filter by instrument, style, and teaching approach. Read their story — especially why they love music.",
            },
            {
              icon: <Clock className="h-6 w-6 text-amber-500" />,
              step: "02",
              title: "Book a trial",
              desc: "Pick a time slot that works. Pay online securely. Get instant confirmation with meeting details.",
            },
            {
              icon: <Heart className="h-6 w-6 text-amber-500" />,
              step: "03",
              title: "Fall in love with music",
              desc: "Have your lesson. If the fit is right, book regular sessions directly — no middlemen.",
            },
          ].map((item) => (
            <div key={item.step} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-400">{item.step}</span>
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-amber-50 border-y border-amber-100 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Moving beyond the grade culture</h2>
          <p className="text-zinc-600 leading-relaxed text-base">
            ABRSM and Trinity grades have their place — but they&apos;re not the whole story.
            The Session connects students with educators who believe music is for everyone,
            at every stage, for the pure joy of it. No pressure. No performance anxiety.
            Just music, made well.
          </p>
        </div>
      </section>

      {/* Why The Session */}
      <section className="py-24 px-4 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-16">Why The Session</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: <Star className="h-5 w-5 text-amber-500" />,
              title: "Curated educators",
              desc: "Every educator is personally reviewed. We look for passion and teaching quality, not just credentials.",
            },
            {
              icon: <Clock className="h-5 w-5 text-amber-500" />,
              title: "Flexible scheduling",
              desc: "Book weekly, bi-weekly, or on-demand. No long-term contracts required.",
            },
            {
              icon: <Heart className="h-5 w-5 text-amber-500" />,
              title: "Safe, easy payments",
              desc: "Pay online via Stripe. Educators are paid automatically after each lesson.",
            },
            {
              icon: <Music className="h-5 w-5 text-amber-500" />,
              title: "All instruments, all levels",
              desc: "Guitar, piano, violin, voice, drums and more. Kids to adults, total beginners to advanced players.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-6 rounded-xl border border-zinc-100 bg-white">
              <div className="mt-0.5">{item.icon}</div>
              <div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center bg-zinc-950 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to start playing?</h2>
        <p className="text-zinc-400 mb-8">Book a trial lesson today for SGD 30.</p>
        <Link href="/educators">
          <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white px-10">
            Browse educators
          </Button>
        </Link>
      </section>
    </div>
  );
}
