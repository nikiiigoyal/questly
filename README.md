# 🦚 Questly (working name)

Search **any** topic → get an instant AI-generated learning quest.
Duolingo's habit loop — streaks, XP, bite-sized levels — applied to history, geography, culture and general knowledge. Built for the **AI Builders Hackathon 2026**.

## Features

- 📚 **Structured curriculum** — 6 worlds (History, Geography, Culture, Space, Science, Sports) → units like Ancient/Medieval/Modern India → 80+ topics in a Duolingo-style learning path with progress tracking
- 🔍 **Search anything** — Gemini turns *any* topic into a quest in seconds, even ones not in the curriculum
- 🔁 **Next topic flow** — finish a quest and continue straight to the next topic in the path
- 📖 **Story cards**, 🧠 **quizzes**, and ✅ **true/false** levels with explanations
- 🔥 Daily streaks, ⚡ XP, floating rewards and celebration confetti
- 🔊 Synthesized sound effects (tap / correct / wrong / fanfare) with a mute toggle
- 🛡️ **Resilient AI pipeline** — header auth for new-format keys, live model discovery with retry + backoff across Gemini models, JSON-schema validation, successful quests cached in memory, and sample-quest fallback so the demo never breaks

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · canvas-confetti · Web Audio API (synth SFX) · Google Gemini API (structured JSON output)

## Getting started

```bash
npm install
cp .env.example .env.local   # paste your free GEMINI_API_KEY (https://aistudio.google.com/apikey)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and search a topic.
Without an API key the app still runs fully on built-in sample quests.

## How quest generation works

1. The client POSTs your topic to `/api/quest`.
2. The server prompts Gemini with a strict 6-level plan (story → quiz → story → quiz → true/false → quiz) and a JSON response schema, so the output is always structured and playable.
3. The response is validated level by level; malformed levels are dropped, and if generation fails entirely we fall back to a sample quest — the game never breaks.

## Roadmap

- [ ] Wikipedia/Wikidata grounding with a source link on every fact card
- [ ] Map-tap mini-games for geography quests
- [ ] Adaptive review quest built from your mistakes (spaced repetition)
- [ ] Hindi + regional-language quests
- [ ] Weekly leagues and friend challenges

## Hackathon deliverables

- [x] Working product (this app)
- [ ] Demo video
- [ ] Presentation deck
