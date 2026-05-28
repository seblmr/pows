import { NextResponse } from 'next/server'
import { initDb, saveProfile, getProfile } from '@/lib/db'
import { nanoid } from 'nanoid'

export async function GET() {
  const results: Record<string, string> = {}

  // Test 1 : variables d'env
  results.anthropic_key = process.env.ANTHROPIC_API_KEY
    ? `ok (${process.env.ANTHROPIC_API_KEY.slice(0, 10)}...)`
    : 'MISSING'
  results.turso_url = process.env.TURSO_DATABASE_URL
    ? `ok (${process.env.TURSO_DATABASE_URL.slice(0, 30)}...)`
    : 'MISSING'
  results.turso_token = process.env.TURSO_AUTH_TOKEN ? 'ok' : 'MISSING'
  results.base_url = process.env.NEXT_PUBLIC_BASE_URL ?? 'MISSING'

  // Test 2 : DB
  try {
    await initDb()
    const testId = nanoid(6)
    await saveProfile(testId, 'Cobra', {
      name: 'Test User', alias: 'The Test', net_worth: '$1B',
      quote: 'test', bio: 'test', traits: [], weakness: '',
      portfolio: [], scandal: '',
      financial_score: { moral_flexibility: 5, panic_resistance: 5, insider_aura: 5, risk_score: 5 }
    })
    const fetched = await getProfile(testId)
    results.db = fetched ? 'ok' : 'write succeeded but read failed'
  } catch (e: any) {
    results.db = `ERROR: ${e.message}`
  }

  // Test 3 : Claude API
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Reply with the word OK only.' }],
      }),
    })
    const data = await res.json()
    results.claude = res.ok
      ? `ok — ${data.content?.[0]?.text}`
      : `ERROR ${res.status}: ${JSON.stringify(data)}`
  } catch (e: any) {
    results.claude = `FETCH ERROR: ${e.message}`
  }

  return NextResponse.json(results, { status: 200 })
}
