'use client'

type Props = {
  cardUrl:   string
  alias:     string
  archetype: string
  quote:     string
  pageUrl:   string
}

export default function ShareButtons({ cardUrl, alias, archetype, quote, pageUrl }: Props) {

  async function shareAsImage() {
    try {
      // Fetch the PNG card
      const res  = await fetch(cardUrl)
      const blob = await res.blob()
      const file = new File([blob], `${alias}.png`, { type: 'image/png' })

      const shareText = `My Prince of Wall Street identity: ${alias}\n"${quote}"\n\nDiscover yours → ${pageUrl}`

      // Web Share API — works on Android & iOS
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          text:  shareText,
          files: [file],
        })
      } else {
        // Fallback: open X with text + URL only
        const encoded = encodeURIComponent(shareText)
        window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank')
      }
    } catch (err) {
      console.error('Share failed:', err)
    }
  }

  async function downloadCard() {
    const res  = await fetch(cardUrl)
    const blob = await res.blob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${alias}-prince.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col items-center gap-4 mb-16 w-full max-w-sm">
      <button
        onClick={shareAsImage}
        className="w-full font-mono text-xs text-void bg-gold border border-gold px-6 py-4 hover:bg-gold/90 transition-all duration-200 tracking-widest uppercase"
      >
        Share on X / Instagram
      </button>

      <button
        onClick={downloadCard}
        className="w-full font-mono text-xs text-smoke border border-white/10 px-6 py-3 hover:border-white/30 transition-all duration-200 tracking-widest uppercase"
      >
        Download card
      </button>

      <a
        href="/"
        className="w-full text-center font-mono text-xs text-smoke/50 border border-white/5 px-6 py-3 hover:border-white/20 transition-all duration-200 tracking-widest uppercase"
      >
        Try again
      </a>
    </div>
  )
}
