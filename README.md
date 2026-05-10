# Prince of Wall Street

> *What kind of financial predator are you?*

A viral identity generator — 5 questions, 10 archetypes, one shareable card.

---

## Stack

- **Next.js 14** (App Router, standalone output)
- **Claude Sonnet** — persona generation
- **Satori + Resvg** — PNG card generation
- **Turso** — SQLite cloud database
- **Coolify** — self-hosted deployment on Hetzner

---

## Setup

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/princeofwallstreet.git
cd princeofwallstreet
npm install
```

### 2. Download fonts (required for Satori)

```bash
bash scripts/get-fonts.sh
```

### 3. Environment variables

```bash
cp .env.example .env
# Fill in: ANTHROPIC_API_KEY, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, NEXT_PUBLIC_BASE_URL
```

### 4. Create Turso database

```bash
turso db create princeofwallstreet
turso db show princeofwallstreet    # → copy URL
turso db tokens create princeofwallstreet  # → copy token
```

### 5. Run locally

```bash
npm run dev
```

---

## Deployment (Coolify)

1. Push to GitHub
2. Connect repo in Coolify → Dockerfile build → Port 3000
3. Add env variables in Coolify UI
4. Deploy — every `git push main` triggers auto-redeploy

---

## Architecture

```
app/
  page.tsx              → Landing + questionnaire
  result/[id]/page.tsx  → Profile result + OG meta
  api/
    generate/route.ts   → Archetype matrix + Claude API
    card/[id]/route.ts  → PNG card (Satori + Resvg)
lib/
  matrix.ts             → 5 questions × 4 answers → 10 archetypes
  claude.ts             → System prompt + persona generation
  db.ts                 → Turso/SQLite read/write
```

---

## Flow

```
User answers 5 questions
  → matrix.ts calculates archetype
  → claude.ts generates persona JSON
  → profile saved to Turso with nanoid
  → redirect to /result/:id
  → /api/card/:id generates PNG on first request
  → OG tags serve the card on social share
```

---

## Archetypes

| Archetype | Essence |
|---|---|
| The Cobra | Precise, cold, lethal |
| The Oracle | Sees what others don't — usually too early |
| The Vulture | Thrives on ruins |
| The Minister | Respectable surface, opaque underneath |
| The Ghost | Invisible. Nobody knows how he built this |
| The Leviathan | Massive, slow, inexorable |
| The Architect | Builds systems. Plays 20 years ahead |
| The Smuggler | Finds passages where others see walls |
| The Tyrant | Dominates through intensity, not cunning |
| The Chemist | Transforms what seems worthless into value |
