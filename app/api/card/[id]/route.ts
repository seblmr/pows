import { NextRequest, NextResponse } from 'next/server'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { getProfile, initDb } from '@/lib/db'

// Load font — place Cormorant-Light.ttf in /public/fonts/
async function loadFont(url: string) {
  const res = await fetch(url)
  return res.arrayBuffer()
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await initDb()
  const data = await getProfile(params.id)
  if (!data) return new NextResponse('Not found', { status: 404 })

  const { archetype, profile: p } = data
  const base = process.env.NEXT_PUBLIC_BASE_URL!

  const fontDisplay = await loadFont(`${base}/fonts/Cormorant-Light.ttf`)
  const fontMono    = await loadFont(`${base}/fonts/JetBrainsMono-Regular.ttf`)

  const scores = [
    { label: 'MORAL FLEXIBILITY', value: p.financial_score.moral_flexibility },
    { label: 'PANIC RESISTANCE',  value: p.financial_score.panic_resistance  },
    { label: 'INSIDER AURA',      value: p.financial_score.insider_aura      },
    { label: 'RISK SCORE',        value: p.financial_score.risk_score        },
  ]

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          background: '#080808',
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 64px',
          fontFamily: 'Cormorant',
          position: 'relative',
        },
        children: [
          // Corner accents
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute', top: '24px', left: '24px',
                width: '32px', height: '32px',
                borderTop: '1px solid #C9A84C',
                borderLeft: '1px solid #C9A84C',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute', bottom: '24px', right: '24px',
                width: '32px', height: '32px',
                borderBottom: '1px solid #C9A84C',
                borderRight: '1px solid #C9A84C',
              },
            },
          },

          // Top label
          {
            type: 'div',
            props: {
              style: {
                fontFamily: 'JetBrains',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#C9A84C',
                marginBottom: '32px',
                textTransform: 'uppercase',
                display: 'flex',
              },
              children: 'PRINCE OF WALL STREET',
            },
          },

          // Main content row
          {
            type: 'div',
            props: {
              style: { display: 'flex', flex: 1, gap: '64px' },
              children: [
                // Left column
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', flexDirection: 'column', flex: 1 },
                    children: [
                      // Archetype
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontFamily: 'JetBrains',
                            fontSize: '11px',
                            color: '#C9A84C',
                            letterSpacing: '0.2em',
                            marginBottom: '8px',
                            display: 'flex',
                          },
                          children: `THE ${archetype.toUpperCase()}`,
                        },
                      },
                      // Name
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '58px',
                            fontWeight: '300',
                            color: '#E8E0D0',
                            lineHeight: 1.05,
                            marginBottom: '4px',
                            display: 'flex',
                          },
                          children: p.name,
                        },
                      },
                      // Alias
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '22px',
                            fontStyle: 'italic',
                            color: '#C9A84C',
                            marginBottom: '24px',
                            display: 'flex',
                          },
                          children: p.alias,
                        },
                      },
                      // Separator
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '40px',
                            height: '1px',
                            background: '#C9A84C',
                            marginBottom: '24px',
                          },
                        },
                      },
                      // Net worth
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontFamily: 'JetBrains',
                            fontSize: '28px',
                            color: '#E8E0D0',
                            marginBottom: '28px',
                            display: 'flex',
                          },
                          children: p.net_worth,
                        },
                      },
                      // Quote
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '20px',
                            fontStyle: 'italic',
                            color: 'rgba(232,224,208,0.8)',
                            lineHeight: 1.5,
                            borderLeft: '2px solid rgba(201,168,76,0.4)',
                            paddingLeft: '20px',
                            display: 'flex',
                            maxWidth: '460px',
                          },
                          children: `"${p.quote}"`,
                        },
                      },
                    ],
                  },
                },

                // Right column — scores
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      width: '320px',
                      gap: '20px',
                    },
                    children: scores.map(s => ({
                      type: 'div',
                      props: {
                        key: s.label,
                        style: { display: 'flex', flexDirection: 'column', gap: '6px' },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                              },
                              children: [
                                {
                                  type: 'div',
                                  props: {
                                    style: {
                                      fontFamily: 'JetBrains',
                                      fontSize: '9px',
                                      letterSpacing: '0.15em',
                                      color: '#6b6560',
                                      display: 'flex',
                                    },
                                    children: s.label,
                                  },
                                },
                                {
                                  type: 'div',
                                  props: {
                                    style: {
                                      fontFamily: 'JetBrains',
                                      fontSize: '9px',
                                      color: '#C9A84C',
                                      display: 'flex',
                                    },
                                    children: `${s.value}/10`,
                                  },
                                },
                              ],
                            },
                          },
                          // Bar background
                          {
                            type: 'div',
                            props: {
                              style: {
                                width: '100%',
                                height: '1px',
                                background: 'rgba(255,255,255,0.05)',
                                position: 'relative',
                                display: 'flex',
                              },
                              children: {
                                type: 'div',
                                props: {
                                  style: {
                                    width: `${s.value * 10}%`,
                                    height: '1px',
                                    background: '#C9A84C',
                                  },
                                },
                              },
                            },
                          },
                        ],
                      },
                    })),
                  },
                },
              ],
            },
          },

          // Bottom domain
          {
            type: 'div',
            props: {
              style: {
                fontFamily: 'JetBrains',
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: 'rgba(107,101,96,0.4)',
                marginTop: '28px',
                display: 'flex',
              },
              children: 'PRINCEOFWALLSTREET.COM',
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Cormorant', data: fontDisplay, weight: 300, style: 'normal' },
        { name: 'JetBrains', data: fontMono,    weight: 400, style: 'normal' },
      ],
    }
  )

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
  const png = resvg.render().asPng()

  return new NextResponse(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
