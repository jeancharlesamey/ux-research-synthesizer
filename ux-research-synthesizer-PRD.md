# UX Research Synthesizer — Product Requirements Document

## 1. One-liner

UX Research Synthesizer is a Next.js web tool that turns raw interview notes into structured themes, quotes, and severity ratings in under 30 minutes, for solo UX researchers who synthesize manually today.

## 2. Problem

Solo UX researchers and design consultants spend 4–6 hours manually synthesizing 5–15 interview notes into themes, finding representative quotes, and ranking issues by severity. This synthesis work is tedious, slows insights, and often happens in brittle tools (Notion spreadsheets, Miro canvases, Dovetail's clunky UI). Researchers want to spend time *understanding* what users said, not *transcribing and organizing* what they said. The cost of leaving this broken: insights delayed by a day, synthesis incomplete or inconsistent, or skipped entirely due to time constraints.

## 3. Target user

**Persona: Lily, independent UX consultant**

Lily runs 8–12 interviews per project. She records on Otter.ai or by hand, then sits down with a spreadsheet or Miro board to extract quotes, cluster themes, and prioritize problems. She currently uses Notion for this because it's flexible but slow. She has no budget for Dovetail or UserTesting. She needs to turn raw notes into a synthesis deck within one business day so she can share findings with clients. She's frustrated that she can't easily search for quotes across all interviews or group them by theme without manual copy-paste.

## 4. Core user job

When I finish a round of interviews, I want to get from raw notes to a sharable synthesis in under 30 minutes, so I can spend my time on insight not transcription. I also want to store the more interresting feedbacks into a repo, each feedback is completed with an insgith, and general tags to facilitate later navigation in the repo. I can adjust the tags referential, add some or remove or get recommadation from ai when new tags are needed. Tags are group in a two level structure.

## 5. v1 scope — must have

- **Paste raw interview notes** into a textarea; notes are chunked into sentences and embedded locally.
- **Load default theme templates** (3–5 predefined themes with definitions); user can edit, add, or remove themes before synthesis.
- **Collect and rank quotes** using local semantic search: for each theme, find sentences similar to the definition (configurable closeness threshold), rank by similarity + keyword frequency, assign severity (critical/important/nice-to-have).
- **Generate a shareable synthesis document** as markdown with themes, representative quotes, severity ratings, and quotes-per-theme count, ready to share with stakeholders.
- **Adjust theme sensitivity** per-theme: user tunes closeness threshold (0–1 scale) to filter out noise or catch edge cases.

## 6. v1 scope — explicitly out

These are tempting but out of scope for v1. We will not ship with:

- **Multi-user collaboration** — v1 is single-user only. No comment threads, version history, or team editing. Solo researchers use it solo.
- **Automatic transcription or audio processing** — users bring text notes only. No integration with Otter.ai, Dovetail, or other recording tools. (They can copy-paste transcripts.)
- **Custom analysis prompts or configuration** — the Claude prompts are fixed. Users cannot change the theme definition, adjust severity weights, or define custom extraction rules.
- **Export to Figma, slides, or design tools** — output thinking is markdown first, and whem ok for user, figma export/integration in using a given frame model or multiple. export from md to figma frame, chapter after chapter. No one-click deck creation or design-system integration.
- **Interview comparison or diff view** — we don't surface "this theme appeared in 60% of interviews" or compare findings across two studies. That's analytics.
- **Template library or study presets** — no canned questions, study types, or research frameworks. Each study is blank or need to provided by user.
- **User management, authentication, or data persistence** — v1 is stateless. Users paste notes, get results in one session, save locally. No login, no server-side storage.

## 7. Success criteria

- **3+ solo UX researchers (beta cohort) complete a full study synthesis in under 30 minutes** — including theme loading, quote extraction, and markdown download (measured by session logs + timing).
- **The output markdown is usable as-is for a client presentation** — at least 2 of 3 beta users share the output with a stakeholder without re-editing themes or quotes.
- **Theme extraction is accurate for 70%+ of quotes** — random sampling of output quotes shows they match their assigned themes (no noisy or off-topic quotes).

## 8. Stack decisions

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Frontend** | Next.js 15 App Router + Tailwind CSS | Fast iteration; Vercel deployment; local-first theme editor. |
| **Backend** | Node.js + Next.js API routes | No external API calls; all processing happens on-device or on Vercel Function. |
| **Embeddings** | Sentence-transformers (local model, ~400MB) | Fast semantic search; loads once, then cached; no LLM cost or latency. |
| **Theme extraction** | Semantic similarity (RAG) + keyword clustering | User defines themes → algorithm finds matching sentences → ranks by closeness + frequency. |
| **Severity ranking** | Keyword detection + frequency scoring | Keywords like "critical/broken/frustrated" → adjusted by user-configurable weights. |
| **Database** | None for v1; session-only | Stateless; users paste notes, edit themes, download markdown. All data stays local. |
| **Deployment** | Vercel (Node.js Functions support large models) | Zero ops; embeddings load on first request, then cached in serverless environment. |
| **Distribution** | Open-source (GitHub) + live Vercel app | Self-host or use deployed version; no API keys needed; fully local synthesis. |

## 9. Non-goals

- This will never become a real-time collaborative research tool. It is async, single-user, input → output.
- This will never include user management, authentication, or team permissions. If teams want to use it, they fork and self-host.
- This will never replace a full research platform (Dovetail, UserTesting, InsightPlatform). We are a *synthesis accelerator*, not a study platform.
- This will never have plugins, integrations, or a third-party app ecosystem.

## 10. Risks

| Risk | Early signal | Mitigation |
|------|--------------|-----------|
| **Embedding model doesn't load on Vercel (file size or memory)** | Deploy fails; sentence-transformers model (~400MB) times out or causes cold start >30s. | Test model size on Vercel Functions; consider smaller model variants if needed; cache model after first load. |
| **Semantic search misses domain-specific language** | Beta user: "The tool didn't find quotes about X because they used different wording." | Build in keyword search as fallback; let users add custom keywords per theme; test with real interview transcripts early. |
| **Default theme templates don't fit user's domain** | User feedback: "These themes don't match our research questions." Templates feel generic. | Start with 3–5 broad templates; user can edit/add freely; collect feedback on which templates are most useful; plan v1.1 templates by industry. |

## 11. Open questions

- **Blocker: Does sentence-transformers model load reliably on Vercel Functions?** Test deployment with real model; verify cold start time is <5s and doesn't timeout.
- **Blocker: What's the right default set of theme templates?** Gather input from 3–5 beta users: Do broad templates work, or do we need industry-specific ones?
- **Explore: Should users be able to add custom keywords per theme for fallback search?** If semantic similarity misses wording variations, keyword boost helps; worth adding for v1.1?
- **Explore: How to explain severity scoring to users?** Document the keyword + frequency algorithm clearly so users understand *why* a quote got "critical" vs "important".
- **Explore: Do we support multi-paragraph quotes or sentence-level only?** Full quotes are more context-rich but harder to display; test with beta users to see preference.

---

**v1 Timeline: TBD — need time budget**  
**Owner: Jeanch**  
**Status: Approved for build**
