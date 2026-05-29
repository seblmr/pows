import { notFound } from 'next/navigation'
import { getProfile, initDb } from '@/lib/db'
import { PersonaProfile } from '@/lib/claude'
import { Archetype } from '@/lib/matrix'

type Props = { params: { id: string } }

export default async function ResultPage({ params }: Props) {
  await initDb()
  const data = await getProfile(params.id)
  if (!data) notFound()

  const { archetype, profile } = data
  const p: PersonaProfile = profile

  const scores = [
    { label: 'Moral Flexibility', value: p.financial_score.moral_flexibility },
    { label: 'Panic Resistance',  value: p.financial_score.panic_resistance  },
    { label: 'Insider Aura',      value: p.financial_score.insider_aura      },
    { label: 'Risk Score',        value: p.financial_score.risk_score        },
  ]

  const shareText = encodeURIComponent(
    `My Prince of Wall Street identity: ${p.alias}\n"${p.quote}"\n\nDiscover yours →`
  )
  const shareUrl = encodeURIComponent(
    `${process.env.NEXT_PUBLIC_BASE_URL}/result/${params.id}`
  )

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      {/* Header */}
      <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-16">
        Prince of Wall Street — Your Identity
      </p>

      {/* Profile Card */}
      <div className="w-full max-w-2xl border border-white/10 p-10 mb-12 relative overflow-hidden">
        {/* Subtle corner accent */}
        <span className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold/40" />
        <span className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold/40" />

        {/* Archetype + Name */}
        <div className="mb-8">
          <p className="font-mono text-xs text-gold tracking-[0.25em] uppercase mb-2">
            The {archetype}
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-ivory">
            {p.name}
          </h1>
          <p className="font-display text-xl text-gold italic mt-1">{p.alias}</p>
        </div>

        <div className="gold-line mb-8" />

        {/* Net worth */}
        <p className="font-mono text-2xl text-ivory mb-8 tracking-tight">
          {p.net_worth}
        </p>

        {/* Quote */}
        <blockquote className="font-display text-2xl md:text-3xl italic text-ivory/90 leading-snug mb-10 border-l-2 border-gold/40 pl-6">
          "{p.quote}"
        </blockquote>

        {/* Bio */}
        <p className="font-display text-lg text-smoke leading-relaxed mb-10">
          {p.bio}
        </p>

        {/* Traits */}
        <div className="flex flex-wrap gap-2 mb-8">
          {p.traits.map((trait, i) => (
            <span key={i} className="font-mono text-xs text-gold/70 border border-gold/20 px-3 py-1 tracking-widest uppercase">
              {trait}
            </span>
          ))}
        </div>

        {/* Weakness */}
        <div className="mb-10">
          <p className="font-mono text-xs text-smoke tracking-widest uppercase mb-2">Weakness</p>
          <p className="font-display text-base text-ivory/60 italic">{p.weakness}</p>
        </div>

        {/* Portfolio */}
        <div className="mb-10">
          <p className="font-mono text-xs text-smoke tracking-widest uppercase mb-3">Portfolio</p>
          <div className="space-y-1">
            {p.portfolio.map((item, i) => (
              <p key={i} className="font-display text-base text-ivory/70">— {item}</p>
            ))}
          </div>
        </div>

        {/* Scandal */}
        <div className="mb-10 p-4 border border-red-900/30 bg-red-950/10">
          <p className="font-mono text-xs text-red-400/60 tracking-widest uppercase mb-2">
            Most Likely Scandal
          </p>
          <p className="font-display text-base text-ivory/80 italic">{p.scandal}</p>
        </div>

        {/* Scores */}
        <div className="space-y-4">
          {scores.map((s, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="font-mono text-xs text-smoke tracking-widest uppercase">{s.label}</span>
                <span className="font-mono text-xs text-gold">{s.value}/10</span>
              </div>
              <div className="h-px bg-white/5 relative">
                <div
                  className="absolute top-0 left-0 h-full bg-gold score-bar"
                  style={{
                    '--score-width': `${s.value * 10}%`,
                    '--delay': `${i * 0.15}s`,
                  } as React.CSSProperties}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share buttons */}
       <ShareButtons
       cardUrl={cardUrl}
       alias={p.alias}
       archetype={archetype}
       quote={p.quote}
       pageUrl={`${base}/result/${params.id}`}
       />

      <p className="font-mono text-xs text-smoke/30 tracking-widest">
        PRINCEOFWALLSTREET.COM
      </p>
    </main>
  )
}
