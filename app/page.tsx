'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  {
    id: 'Q1',
    text: 'A position drops 30% overnight. You :',
    options: [
      { value: 'A', label: 'Add.', sub: 'The market is wrong, not me.' },
      { value: 'B', label: 'Hold.', sub: 'Pain is information. I process it.' },
      { value: 'C', label: 'Exit.', sub: 'Capital preservation is the only religion.' },
      { value: 'D', label: 'Short the rest.', sub: 'If it falls, I want to profit from the collapse.' },
    ],
  },
  {
    id: 'Q2',
    text: 'Money, to you, is :',
    options: [
      { value: 'A', label: 'A scoreboard.', sub: 'The number is the point.' },
      { value: 'B', label: 'A weapon.', sub: 'Whoever controls it controls reality.' },
      { value: 'C', label: 'A mirror.', sub: 'It shows people who they really are.' },
      { value: 'D', label: 'A burden.', sub: 'Real power doesn\'t need to be counted.' },
    ],
  },
  {
    id: 'Q3',
    text: 'Your most honest financial sin :',
    options: [
      { value: 'A', label: 'Pride.', sub: 'I\'ve held losers too long out of pride.' },
      { value: 'B', label: 'Impatience.', sub: 'I\'ve destroyed a good opportunity through impatience.' },
      { value: 'C', label: 'Passivity.', sub: 'I\'ve let someone else make the decision I should have made.' },
      { value: 'D', label: 'Silence.', sub: 'I\'ve won in ways I don\'t talk about.' },
    ],
  },
  {
    id: 'Q4',
    text: 'In the end, you trust :',
    options: [
      { value: 'A', label: 'Data.', sub: 'Everything else is narrative.' },
      { value: 'B', label: 'Instinct.', sub: 'I\'ve been right too many times to ignore it.' },
      { value: 'C', label: 'Nobody.', sub: 'Especially not myself on a good day.' },
      { value: 'D', label: 'Timing.', sub: 'Genius is just being early and surviving long enough.' },
    ],
  },
  {
    id: 'Q5',
    text: 'When everything burns, you :',
    options: [
      { value: 'A', label: 'Go quiet.', sub: 'Silence is leverage.' },
      { value: 'B', label: 'Make calls.', sub: 'Crisis is when real networks activate.' },
      { value: 'C', label: 'Read.', sub: 'Every collapse has already happened before.' },
      { value: 'D', label: 'Move.', sub: 'I don\'t process well sitting still.' },
    ],
  },
]

const TICKER = 'MARKETS ARE EMOTIONAL · CAPITAL IS PATIENT · IDENTITY IS LEVERAGE · THE QUESTION IS NOT HOW MUCH · THE QUESTION IS HOW · '

export default function Home() {
  const router = useRouter()
  const [step, setStep] = useState<'landing' | 'quiz' | 'loading'>('landing')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [error, setError] = useState('')

  async function handleAnswer(value: string) {
    const q = QUESTIONS[current]
    const newAnswers = { ...answers, [q.id]: value }
    setAnswers(newAnswers)

    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1)
    } else {
      // All questions answered — submit
      setStep('loading')
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: newAnswers }),
        })
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        router.push(`/result/${data.id}`)
      } catch {
        setError('Generation failed. Try again.')
        setStep('quiz')
      }
    }
  }

  if (step === 'landing') {
    return (
      <main className="min-h-screen flex flex-col">
        {/* Ticker */}
        <div className="overflow-hidden border-b border-white/5 py-2">
          <div className="flex animate-ticker whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="font-mono text-xs text-smoke tracking-widest px-4">
                {TICKER}{TICKER}
              </span>
            ))}
          </div>
        </div>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
          <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-8">
            Prince of Wall Street
          </p>

          <h1 className="font-display text-6xl md:text-8xl font-light leading-none tracking-tight text-ivory mb-6">
            What kind of<br />
            <em className="italic text-gold">financial predator</em><br />
            are you?
          </h1>

          <div className="gold-line mx-auto my-8" />

          <p className="font-display text-xl text-smoke italic max-w-md mb-12">
            5 questions. One archetype. An identity you'll want to screenshot.
          </p>

          <button
            onClick={() => setStep('quiz')}
            className="group relative px-10 py-4 border border-gold/40 text-gold font-mono text-sm tracking-widest uppercase hover:bg-gold hover:text-void transition-all duration-300"
          >
            Discover your profile
            <span className="absolute inset-0 border border-gold/10 scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pb-8">
          <p className="font-mono text-xs text-smoke/40 tracking-widest">
            PRINCEOFWALLSTREET.COM
          </p>
        </div>
      </main>
    )
  }

  if (step === 'loading') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase animate-pulse mb-6">
          Identifying your archetype...
        </p>
        <div className="gold-line mx-auto" />
      </main>
    )
  }

  const q = QUESTIONS[current]
  const progress = ((current) / QUESTIONS.length) * 100

  return (
    <main className="min-h-screen flex flex-col">
      {/* Progress */}
      <div className="h-px bg-white/5">
        <div
          className="h-full bg-gold transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Step indicator */}
        <p className="font-mono text-xs text-smoke tracking-widest mb-12">
          {current + 1} / {QUESTIONS.length}
        </p>

        {/* Question */}
        <h2 className="font-display text-3xl md:text-5xl font-light text-ivory text-center max-w-2xl mb-14 animate-fade-up">
          {q.text}
        </h2>

        {/* Options */}
        <div className="w-full max-w-xl space-y-3">
          {q.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              className="w-full text-left px-6 py-4 border border-white/10 hover:border-gold/50 hover:bg-gold/5 transition-all duration-200 group"
            >
              <span className="font-mono text-xs text-gold/60 mr-3 group-hover:text-gold transition-colors">
                {opt.value}
              </span>
              <span className="font-display text-lg text-ivory">
                {opt.label}
              </span>
              <span className="font-display text-sm text-smoke ml-2 italic">
                {opt.sub}
              </span>
            </button>
          ))}
        </div>

        {error && (
          <p className="font-mono text-xs text-red-400 mt-6">{error}</p>
        )}
      </div>
    </main>
  )
}
