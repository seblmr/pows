import { createClient } from '@libsql/client'
import { PersonaProfile } from './claude'
import { Archetype } from './matrix'

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

// Init once at module load — not on every request
let initialized = false

export async function initDb() {
  if (initialized) return
  await db.execute(`
    CREATE TABLE IF NOT EXISTS profiles (
      id         TEXT PRIMARY KEY,
      archetype  TEXT NOT NULL,
      profile    TEXT NOT NULL,
      created_at INTEGER DEFAULT (unixepoch())
    )
  `)
  initialized = true
}

export async function saveProfile(
  id: string,
  archetype: Archetype,
  profile: PersonaProfile
) {
  await db.execute({
    sql: 'INSERT INTO profiles (id, archetype, profile) VALUES (?, ?, ?)',
    args: [id, archetype, JSON.stringify(profile)],
  })
}

export async function getProfile(id: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM profiles WHERE id = ?',
    args: [id],
  })
  if (!result.rows[0]) return null
  return {
    id:        result.rows[0].id as string,
    archetype: result.rows[0].archetype as Archetype,
    profile:   JSON.parse(result.rows[0].profile as string) as PersonaProfile,
  }
}
