import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { getArchetype, Answers } from '@/lib/matrix'
import { generatePersona } from '@/lib/claude'
import { saveProfile, initDb } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const answers = body.answers as Answers

    if (!answers?.Q1 || !answers?.Q2 || !answers?.Q3 || !answers?.Q4 || !answers?.Q5) {
      return NextResponse.json({ error: 'Missing answers' }, { status: 400 })
    }

    // Calculate archetype from matrix
    const archetype = getArchetype(answers)

    // Generate persona with Claude
    const profile = await generatePersona(archetype, answers)

    // Save to DB
    const id = nanoid(10)
    await initDb()
    await saveProfile(id, archetype, profile)

    return NextResponse.json({ id, archetype, profile })
  } catch (err) {
    console.error('[generate]', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
