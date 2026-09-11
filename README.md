# 🦚 Questly

**Search any topic → play an instant AI-generated learning quest.**

Questly takes Duolingo's habit loop — streaks, XP, bite-sized levels, confetti — and applies it to *any subject you can type*. Type "Black Holes" or "Mughal Empire" and an AI guide named **Mitra** crafts a playable 6-level quest in seconds: stories to read, quizzes to answer, and a curiosity loop that always suggests what to learn next.

## The problem

People *want* to learn, but the internet's two extremes both fail them:

- **Courses** are long, structured, and demand commitment most people don't have.
- **Feeds** are short but random — you consume facts, you don't retain them.

The missing middle is a **5-minute, game-shaped learning experience for *any* topic on demand**. That's Questly.

## Features

- 🔍 **Search anything** — Gemini turns any topic into a 6-level quest in seconds
- 📚 **Structured curriculum** — 9 worlds (History, Geography, Culture, Space, Science, Sports, AI & Tech, General Knowledge, Current News) → units → **122 topics** on a Duolingo-style learning path with per-unit progress
- 🎮 **Game-shaped lessons** — story cards → multiple-choice quizzes → true/false levels, every answer followed by a one-line explanation
- 🔁 **Never-ending loop** — finish a quest and continue to the next topic on the path, or jump into any of 3 AI-recommended related topics
- ⚔️ **Challenge friends** — share a WhatsApp/link duel with your score baked in; friends get a target banner and a win/lose showdown screen
- 🔥 **Streaks & XP** — daily streak logic, floating +XP, celebration confetti, quest-complete fanfare
- ☁️ **Cloud sync (optional)** — Supabase email auth saves streak/XP/progress across devices, with smart merge (never lose your best score)
- 📱 **Mobile-feel polish** — haptic vibration patterns, synthesized sound effects with mute toggle, 3D intro splash, spring animations everywhere
- 🛡️ **Never breaks** — model fallback chain, retries with backoff, strict JSON validation, in-memory quest cache, and a sample-quest fallback so the demo survives any API hiccup

## The full user flow

```
Home (/)
 ├── Type ANY topic ────────────────► /quest?topic=…   (AI generates)
 ├── Tap a trending chip ───────────► /quest?topic=…   (AI generates)
 └── Pick one of 9 worlds ──────────► /category/[id]
                                       units → topic list → progress ring
                                       "Continue" button (first incomplete topic)
                                             │
                                             ▼
                                     /quest?topic=…&cat=…
```

**Inside a quest (`/quest`):**

1. Loading screen — Mitra "crafts your quest" while the API works (rotating tips).
2. **6 levels in a fixed plan:** `story → quiz → story → quiz → true/false → quiz`.
   - 📖 Story cards: one emoji, a title, 2–3 vivid sentences (+5 XP)
   - 🧠 Quizzes: 3–4 options, instant green/red feedback, explanation footer (+10 XP)
   - ✅ True/false: with the same explanation flow (+10 XP)
3. Feedback on every answer: color pop animation, confetti burst on correct, sound + haptic vibration, floating `+XP`.
4. **Quest complete:** trophy + triple confetti, final `+XP`, **accuracy %**, updated **streak**, then:
   - **Continue: <next topic>** (if you came from a curriculum path)
   - **Explore next topics** — 3 AI-generated related topics → infinite curiosity loop
   - **Challenge Friends On This Topic** — opens the duel modal
   - **Save Streak** — Supabase cloud sync · Replay · Home

**Challenge friends flow:**

```
Done screen / Home header → ChallengeModal
   enter nickname + topic → app builds a link embedding
   challenger name, your accuracy %, and XP
        │
        ├─ WhatsApp share · native share sheet · copy link
        ▼
Friend opens link → quest runs in CHALLENGE MODE
   banner: "Friend Challenge by <name>! Target: N%"
   finish → "YOU DEFEATED <NAME>!" or "<NAME> STILL LEADS!"
```

## How AI quest generation works (`/api/quest`)

The client POSTs `{ topic }` to a single Next.js API route, which runs a resilient pipeline:

1. **Cache check** — the last 60 successfully generated quests are served instantly (replays, and a warm fallback under free-tier load).
2. **Model discovery** — fetches Google's live model list, orders candidates (flash-lite variants lead: they think less, truncate less), and remembers the last winner. New-format AI Studio keys are authenticated via the `x-goog-api-key` header.
3. **Structured prompt** — the server prompts Gemini as *Mitra*, a playful learning guide, with a strict 6-level plan, simple-English factual rules, and exactly 3 related topics.
4. **Forced JSON schema** — `responseSchema` makes Gemini return the exact quest shape; every level field is marked required so thinking models can't emit empty skeletons.
5. **Retry + fallback chain** — 503/429/timeouts are retried 3× per model with exponential backoff, then the next model is tried; `maxOutputTokens: 32768` so reasoning tokens can't truncate the quest.
6. **Validation & repair** — `normalizeGeminiQuest` validates level-by-level (coerces string indices, matches answer text, drops malformed levels) and accepts ≥3 levels with ≥1 quiz.
7. **Graceful degradation** — no API key configured? Curated sample quests keep the whole loop playable (with a "Try AI again" button). Total generation failure? A sample quest is served with a friendly note.

The result: **the demo never breaks**, even on stage Wi-Fi.

## Cloud sync (Supabase)

Progress is always written to `localStorage` first (guest-first, zero friction). The optional **Save Streak** modal adds:

- Supabase email + password **sign-up / sign-in**
- Progress upserted into a `user_progress` table (xp, streak, last_active, quests_done)
- **Smart merge on sign-in**: keeps max XP, max streak, and the union of completed topics — your best numbers survive everywhere
- **Row Level Security** so users can only ever read/write their own row
- A **demo mode** when Supabase keys aren't set, so the flow is still testable

Set it up in 2 minutes: run [`supabase_setup.sql`](./supabase_setup.sql) in your Supabase SQL editor, then add the two `NEXT_PUBLIC_SUPABASE_*` env vars.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling / motion | Tailwind CSS v4 · Framer Motion spring animations |
| AI | Google Gemini API (`generateContent` with JSON `responseSchema`) |
| Backend-as-a-service | Supabase (auth + Postgres + RLS) |
| Juice | canvas-confetti · Howler.js SFX · `navigator.vibrate` haptics |
| State | localStorage progress store + Supabase sync |

## Project structure

```
src/
├── app/
│   ├── page.tsx                 # Home: search, trending, worlds, streak/XP
│   ├── quest/page.tsx           # The game: levels, XP, results, challenge mode
│   ├── category/[id]/page.tsx   # Duolingo-style path per world
│   └── api/quest/route.ts       # AI pipeline: cache → Gemini → validate → fallback
├── components/
│   ├── AuthModal.tsx            # Supabase sign-up/in + progress merge
│   ├── ChallengeModal.tsx       # Build & share a duel link (WhatsApp/native)
│   ├── IntroSplashScreen.tsx    # 3D intro splash (once per session)
│   ├── NamasteGreeting.tsx      # Animated greeting + mascot hero
│   ├── ProgressBar.tsx / ChunkyButton.tsx
└── lib/
    ├── curriculum.ts            # 9 worlds → units → 122 topics (just add lines!)
    ├── quests.ts                # Quest types, sample quests, JSON validator
    ├── progress.ts              # localStorage XP/streak/streak-day logic
    ├── supabase.ts              # Cloud upsert/load + merge helpers
    ├── sounds.ts                # Howler SFX (tap/correct/wrong/complete)
    └── haptics.ts               # Vibration patterns that respect mute
scripts/generate-sounds.mjs      # Synthesizes the WAV assets in /public/sounds
supabase_setup.sql               # Table + RLS policies + updated_at trigger
```

## Getting started

```bash
git clone https://github.com/nikiiigoyal/questly
cd questly
npm install
cp .env.example .env.local
# → paste your free GEMINI_API_KEY (https://aistudio.google.com/apikey)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and search anything.

**No API key yet?** The app still runs fully on built-in sample quests — every screen stays playable. **No Supabase either?** Progress lives in localStorage and the auth modal runs in demo mode.

### Environment variables

| Variable | Required | What it does |
| --- | --- | --- |
| `GEMINI_API_KEY` | for AI quests | Free key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Enables quest generation on *any* topic. |
| `NEXT_PUBLIC_SUPABASE_URL` | optional | Enables cloud sync. From Supabase → Project Settings → API. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | optional | Paired with the URL above. Run `supabase_setup.sql` first. |

## Design notes

- **XP economy:** stories are worth 5 XP, interactive levels 10 XP → max 50 XP per quest. Streaks advance when you complete ≥1 quest on consecutive days.
- **Curriculum as data:** a topic is just a string in `curriculum.ts` — every topic is fed straight to the AI generator, so growing the syllabus is literally adding lines.
- **Everything degrades gracefully:** missing API key → samples; API failure → samples; missing Supabase → demo mode; missing vibration → no-op; sound errors → silent.

## Roadmap

- [ ] Wikipedia/Wikidata grounding with a source link on every fact card
- [ ] Adaptive review quest built from your mistakes (spaced repetition)
- [ ] Map-tap mini-games for geography quests
- [ ] Hindi + regional-language quests
- [ ] Weekly leagues and live friend leaderboards (challenge links today, a real backend next)

## Hackathon deliverables

- [x] Working product (this app)
- [x] Source code (this repository)
- [ ] Demo video → see [`docs/demo-video-script.md`](./docs/demo-video-script.md)
- [x] Presentation deck — submitted separately (kept outside this repo)
- [ ] Submission form (official portal)

---

Built with ❤️ and a free Gemini key by Team Questly for the AI Builders Hackathon 2026.
