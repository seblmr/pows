import { Archetype, Answers } from './matrix'

export type PersonaProfile = {
  name: string
  alias: string
  net_worth: string
  quote: string
  bio: string
  traits: string[]
  weakness: string
  portfolio: string[]
  scandal: string
  financial_score: {
    moral_flexibility: number
    panic_resistance: number
    insider_aura: number
    risk_score: number
  }
}

const SYSTEM_PROMPT = `You generate fictional Wall Street billionaire personas for Prince of Wall Street.

The tone is sharp, cinematic, arrogant, luxurious and slightly satirical.
Personas must feel like characters from Succession, Margin Call, The Big Short, and internet sigma-finance culture.

Rules:
- Never generate generic motivational content
- Avoid corporate jargon, LinkedIn tone, self-help language
- Every line must feel screenshot-worthy
- Humor must be dry, intelligent and subtle
- Each persona must contain at least one human contradiction
- The user should feel simultaneously impressed and concerned
- At least ONE line must feel like a film quote
- At least ONE line must flatter the ego in an unsettling way

Writing style: confident, precise, psychologically specific.
Cross between Forbes, Bloomberg, Succession, and internet finance mythology.

Do not explain. Do not apologize. Do not moralize.
Return ONLY valid JSON. No markdown, no backticks, no preamble.`

const QUESTIONS = {
  Q1: 'How do you react when a position goes -30%?',
  Q2: 'Your relationship with money is:',
  Q3: 'Your biggest financial sin:',
  Q4: 'You trust:',
  Q5: 'Your style in a crisis:',
}

const ANSWER_LABELS: Record<string, Record<string, string>> = {
  Q1: {
    A: 'Add. The market is wrong, not me.',
    B: 'Hold. Pain is information. I process it.',
    C: 'Exit. Capital preservation is the only religion.',
    D: 'Short the rest. If it falls, I want to profit from the collapse.',
  },
  Q2: {
    A: 'A scoreboard. The number is the point.',
    B: 'A weapon. Whoever controls it controls reality.',
    C: 'A mirror. It shows people who they really are.',
    D: 'A burden. Real power doesn\'t need to be counted.',
  },
  Q3: {
    A: 'I\'ve held losers too long out of pride.',
    B: 'I\'ve destroyed a good opportunity through impatience.',
    C: 'I\'ve let someone else make the decision I should have made.',
    D: 'I\'ve won in ways I don\'t talk about.',
  },
  Q4: {
    A: 'Data. Everything else is narrative.',
    B: 'Instinct. I\'ve been right too many times to ignore it.',
    C: 'Nobody. Especially not myself on a good day.',
    D: 'Timing. Genius is just being early and surviving long enough.',
  },
  Q5: {
    A: 'Go quiet. Silence is leverage.',
    B: 'Make calls. Crisis is when real networks activate.',
    C: 'Read. Every collapse has already happened before.',
    D: 'Move. I don\'t process well sitting still.',
  },
}

export async function generatePersona(
  archetype: Archetype,
  answers: Answers
): Promise<PersonaProfile> {
  const answerLines = Object.entries(answers)
    .map(([q, a]) => `${QUESTIONS[q as keyof typeof QUESTIONS]} → ${ANSWER_LABELS[q][a]}`)
    .join('\n')

  const userPrompt = `Archetype: The ${archetype}

User answers:
${answerLines}

Generate the persona. Return ONLY this JSON:
{
  "name": "First Last",
  "alias": "The [Word]",
  "net_worth": "$[X]B",
  "quote": "",
  "bio": "",
  "traits": ["", "", ""],
  "weakness": "",
  "portfolio": ["", "", ""],
  "scandal": "",
  "financial_score": {
    "moral_flexibility": 0,
    "panic_resistance": 0,
    "insider_aura": 0,
    "risk_score": 0
  }
}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`)
  }

  const data = await response.json()
  const raw = data.content[0].text.replace(/```json|```/g, '').trim()
  return JSON.parse(raw) as PersonaProfile
}
