export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-6">
        Prince of Wall Street
      </p>
      <h1 className="font-display text-5xl font-light text-ivory mb-4">
        Profile not found.
      </h1>
      <p className="font-display text-lg text-smoke italic mb-12">
        This identity has either expired or never existed.
      </p>
      <a
        href="/"
        className="font-mono text-xs text-gold border border-gold/30 px-8 py-3 hover:bg-gold hover:text-void transition-all duration-200 tracking-widest uppercase"
      >
        Discover yours
      </a>
    </main>
  )
}
