# UX Research Synthesizer

**v0.1.1** | June 21th, 2026

Turn raw interview notes into structured themes, quotes, and severity ratings in under 30 minutes. **No API keys. No external calls. All processing is local.**

## What this is

UX Research Synthesizer is a web tool for solo UX researchers who spend hours synthesizing interview notes by hand. You paste raw notes, load a theme template (or create your own), and the tool uses local semantic search to find matching quotes, rank them by relevance and severity, and generate shareable markdown. Everything runs in your browser or on the server—no external APIs, no costs, no privacy concerns.

## What this is not

- **Not a real-time collaborative tool.** This is async, single-user, input → output. If you need team collaboration, use Dovetail or UserTesting.
- **Not a full research platform.** We don't run studies, manage participants, or track longitudinal data. We accelerate synthesis for interviews you've already conducted.
- **Not a transcription service.** Paste text notes only (from Otter.ai, your recorder, or handwritten). No audio upload.
- **Not an LLM interface.** No Claude, GPT, or third-party AI. All extraction is algorithmic (semantic similarity + keyword matching) with local embeddings.

## Quick start

```bash
git clone https://github.com/yourusername/ux-research-synthesizer.git
cd ux-research-synthesizer
npm install
npm run dev
```

Visit `http://localhost:3000` and paste your interview notes. The app will synthesize them live.

## Stack

- **Frontend:** Next.js 15 (App Router) + Tailwind CSS — fast iteration, local-first theme editor.
- **Backend:** Node.js + Next.js API routes — all processing happens here, no external APIs.
- **Embeddings:** Sentence-transformers (all-MiniLM-L6-v2) — local semantic search for quote extraction, runs in browser or server.
- **NLP:** Keyword detection + semantic similarity + clustering — algorithmic severity ranking and theme matching.
- **Deployment:** Vercel (supports large Node.js models) — zero ops, model cached after first load.
- **Database:** None for v1 — stateless. Users paste notes, download markdown. All data stays local.

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^15.0.0 | React framework with App Router |
| `react` | ^19.0.0 | UI library |
| `react-dom` | ^19.0.0 | React DOM rendering |
| `@xenova/transformers` | ^2.6.0 | Local sentence embeddings (all-MiniLM-L6-v2) |
| `@heroicons/react` | ^2.2.0 | Icon components |
| `natural` | ^6.7.0 | NLP utilities for text processing |
| `tailwindcss` | ^3.4.0 | Utility-first CSS framework |
| `typescript` | ^5.0.0 | Type safety |
| `autoprefixer` | ^10.4.0 | CSS vendor prefixes |
| `postcss` | ^8.4.0 | CSS transformations |
| `eslint` | ^8.57.0 | Code linting |

**No external APIs required.** All processing runs locally in Node.js or the browser.

## How it works

1. **Paste notes** — Copy raw interview transcripts or notes into the textarea.
2. **Load or edit themes** — Start with a default template or add your own themes with definitions.
3. **Extract quotes** — The app chunks notes into sentences, embeds them locally, and finds matches for each theme using semantic similarity (configurable threshold per theme).
4. **Rank by severity** — Quotes are scored by similarity strength + keyword frequency (critical/broken/frustrated → higher severity). User can adjust per-theme sensitivity.
5. **Download synthesis** — Export as markdown with themes, quotes, and severity ratings.

Under the hood: sentence-transformers generates embeddings for all notes and theme definitions. A local similarity search finds matching sentences for each theme. Keyword detection assigns severity. No external APIs, no LLM calls—everything runs on your device or Vercel Function.

## Use cases

- **Post-study synthesis:** Run 8 interviews, paste notes, get themes + quotes in 20 minutes.
- **Stakeholder presentation:** Download the markdown output as your findings doc. No extra slides needed.
- **Quick validation:** Check if a new insight is supported by quotes from multiple interviews. Search by keyword or semantic meaning.

## Roadmap

- ✅ **v0.1 launch** — paste notes, extract themes, rank quotes, export markdown (current)
- 🟡 **v0.1.1** — PDF export, custom prompt templates (planned)
- ⚪ **v0.2** — multi-user team synthesis, real-time collaboration (if demand warrants)
- ⚪ **v0.2+** — audio upload + auto-transcription, integrations with Figma/Slack (future, not committed)

## Environment setup

No API keys needed. The app works completely offline (or with your browser's file system).

Optional `.env.local` for customization (future versions):

```
# Leave empty for now — no external APIs required
```

## Running locally

The dev server includes all NLP models (downloaded on first run):

```bash
npm run dev
```

Models (~400MB total) cache after first download. On Vercel, they're cached in the Function after first request.

## Contributing

**PRs are welcome for:**
- Bug fixes and performance improvements
- Better default theme templates
- Improved quote extraction (keyword/semantic combo)
- Documentation and example improvements

**PRs we won't merge:**
- Multi-user collaboration features (out of scope for v1)
- External API integrations (defeats the local-first goal)
- New export formats beyond markdown/PDF

If you're considering a larger change, open an issue first so we can discuss.

## License

MIT — see [LICENSE](LICENSE) for details.

## About

Built for UX researchers by jeancharlesamey. Designed to save hours of manual synthesis work.

---

Have questions? Open an issue or check [the docs](docs/README.md).
