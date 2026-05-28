import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { getProfile, initDb } from '@/lib/db'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await initDb()
  const data = await getProfile(params.id)
if (!data) return new Response('Not found', { status: 404 })

  const p = data
  const archetype = p.archetype
  
  // Chargement direct depuis le filesystem — pas de fetch HTTP
  const fontDisplay = fs.readFileSync(
    path.join(process.cwd(), 'public/fonts/Cormorant-Light.ttf')
  )
  const fontMono = fs.readFileSync(
    path.join(process.cwd(), 'public/fonts/JetBrainsMono-Regular.ttf')
  )

  // ... reste du code inchangé
  const scores = [
    { label: 'MORAL FLEXIBILITY', value: p.financial_score.moral_flexibility },
    { label: 'PANIC RESISTANCE',  value: p.financial_score.panic_resistance  },
    { label: 'INSIDER AURA',      value: p.financial_score.insider_aura      },
    { label: 'RISK SCORE',        value: p.financial_score.risk_score        },
  ]

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#080808',
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 64px',
          fontFamily: 'Cormorant',
          position: 'relative',
        }}
      >
        {/* Corner top-left */}
        <div style={{
          position: 'absolute', top: 24, left: 24,
          width: 32, height: 32,
          borderTop: '1px solid #C9A84C',
          borderLeft: '1px solid #C9A84C',
        }} />

        {/* Corner bottom-right */}
        <div style={{
          position: 'absolute', bottom: 24, right: 24,
          width: 32, height: 32,
          borderBottom: '1px solid #C9A84C',
          borderRight: '1px solid #C9A84C',
        }} />

        {/* Top label */}
        <div style={{
          fontFamily: 'JetBrains',
          fontSize: 11,
          letterSpacing: '0.3em',
          color: '#C9A84C',
          marginBottom: 32,
          display: 'flex',
        }}>
          PRINCE OF WALL STREET
        </div>

        {/* Main row */}
        <div style={{ display: 'flex', flex: 1, gap: 64 }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{
              fontFamily: 'JetBrains', fontSize: 11,
              color: '#C9A84C', letterSpacing: '0.2em',
              marginBottom: 8, display: 'flex',
            }}>
              THE {archetype.toUpperCase()}
            </div>

            <div style={{
              fontSize: 56, fontWeight: 300,
              color: '#E8E0D0', lineHeight: 1.05,
              marginBottom: 4, display: 'flex',
            }}>
              {p.name}
            </div>

            <div style={{
              fontSize: 22, fontStyle: 'italic',
              color: '#C9A84C', marginBottom: 24,
              display: 'flex',
            }}>
              {p.alias}
            </div>

            {/* Separator */}
            <div style={{
              width: 40, height: 1,
              background: '#C9A84C', marginBottom: 24,
            }} />

            {/* Net worth */}
            <div style={{
              fontFamily: 'JetBrains', fontSize: 26,
              color: '#E8E0D0', marginBottom: 28,
              display: 'flex',
            }}>
              {p.net_worth}
            </div>

            {/* Quote */}
            <div style={{
              fontSize: 19, fontStyle: 'italic',
              color: 'rgba(232,224,208,0.8)',
              lineHeight: 1.5,
              borderLeft: '2px solid rgba(201,168,76,0.4)',
              paddingLeft: 20,
              display: 'flex',
              maxWidth: 440,
            }}>
              "{p.quote}"
            </div>
          </div>

          {/* Right column — scores */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-end',
            width: 300, gap: 18,
          }}>
            {scores.map((s) => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{
                    fontFamily: 'JetBrains', fontSize: 9,
                    letterSpacing: '0.15em', color: '#6b6560',
                    display: 'flex',
                  }}>
                    {s.label}
                  </div>
                  <div style={{
                    fontFamily: 'JetBrains', fontSize: 9,
                    color: '#C9A84C', display: 'flex',
                  }}>
                    {s.value}/10
                  </div>
                </div>
                {/* Track */}
                <div style={{
                  width: '100%', height: 1,
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                }}>
                  {/* Fill */}
                  <div style={{
                    width: `${s.value * 10}%`,
                    height: 1,
                    background: '#C9A84C',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom domain */}
        <div style={{
          fontFamily: 'JetBrains', fontSize: 10,
          letterSpacing: '0.3em',
          color: 'rgba(107,101,96,0.4)',
          marginTop: 28, display: 'flex',
        }}>
          PRINCEOFWALLSTREET.COM
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Cormorant', data: fontDisplay, weight: 300, style: 'normal' },
        { name: 'JetBrains',  data: fontMono,    weight: 400, style: 'normal' },
      ],
    }
  )
}
