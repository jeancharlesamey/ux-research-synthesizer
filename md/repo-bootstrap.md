---
name: repo-bootstrap
description: Generates a complete project bootstrap — README, repo structure, .gitignore, license, contribution notes — for a personal open-source project. Use at the start of every new build to avoid the "blank repo" trap. Triggers — "set up the repo", "bootstrap the project", "write the README", "initialize the project", "what files should I create".
---

# Repo Bootstrap

## Purpose

Most personal projects die because the GitHub repo never gets credible enough for anyone to engage with. A clean README, a sensible structure, and a clear "why does this exist" framing fix that on day one.

## When to use

- Day 1 of any new build in the Skill Path program
- When converting a private prototype to public
- When an existing repo's README is "just a scratchpad" and needs to be real

## Inputs

1. Project name (from PRD)
2. One-liner (from PRD)
3. Stack (frontend, backend, AI provider, deployment target)
4. License preference (MIT default for open-source design tools, Apache 2.0 for anything with patentable patterns)
5. Whether it's installable as a package (npm, brew, etc.) or run-from-source

## What to generate

### 1. README.md structure

```markdown
# [Project Name]

[One-liner from PRD — single sentence, no marketing.]

[Optional: one screenshot or 30-second demo GIF, only if the product has UI]

## What this is

[2–3 sentences. The actual problem, the user, the approach. Not the philosophy.]

## What this is not

[2–3 bullets. What it deliberately doesn't do. This builds trust faster than feature lists.]

## Quick start

[Minimal commands to get it running. Copy-pasteable. Assumes nothing.]

```bash
git clone ...
cd ...
npm install
npm run dev
```

## Stack

[Bulleted list, one line per layer, with rationale where non-obvious.]

- Frontend: Next.js + Tailwind
- Backend: TypeScript MCP server
- AI: Claude API (Sonnet 4.6) with function calling
- Deployment: Vercel

## How it works

[3–5 sentences. The architecture in plain English. No diagrams unless they earn their place.]

## Use cases

[2–3 concrete examples. Real, not hypothetical.]

## Roadmap

[3–5 bullets, marked as ✅ shipped / 🟡 in progress / ⚪ planned. Be honest about state.]

## Contributing

[One paragraph. State explicitly whether you welcome PRs. If not, say so kindly.]

## License

[One line + link to LICENSE file.]

## About

[2–3 sentences about you. Link to your Substack or portfolio. This is the only acceptable place for personal context in the README.]
```

### 2. Repo structure

For a Next.js + MCP project:

```
project-name/
├── README.md
├── LICENSE
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── app/                    # Next.js App Router
│   ├── page.tsx
│   ├── layout.tsx
│   └── api/
├── components/             # UI components
├── lib/
│   ├── claude.ts          # Claude API client wrapper
│   ├── rag.ts             # Vector store + retrieval
│   └── schemas.ts         # Function calling schemas
├── mcp-server/            # The MCP server lives here
│   ├── src/
│   │   ├── server.ts
│   │   └── tools/
│   ├── package.json
│   └── README.md          # Server-specific docs
├── docs/                  # Anything longer than a README section
└── examples/              # Sample inputs for users to try
```

For a Swift native app:

```
project-name/
├── README.md
├── LICENSE
├── .gitignore
├── ProjectName.xcodeproj/
├── ProjectName/           # App source
│   ├── App.swift
│   ├── Views/
│   ├── Models/
│   ├── Services/          # Vision, NL, Core ML wrappers
│   └── Resources/
│       └── patterns.json  # The banking UX pattern library
├── ProjectNameTests/
└── docs/
```

### 3. .gitignore

Generate the appropriate one for the stack. Always include:
- `.env*` (never commit secrets)
- `node_modules/`
- `.next/` (for Next.js)
- `DerivedData/` (for Xcode)
- `.DS_Store`

### 4. LICENSE

Generate the full text of the chosen license. MIT default unless specified.

### 5. Commit hygiene defaults

Suggested commit message format for the repo:

```
<type>: <short description>

<longer explanation if needed>
```

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`

### 6. First commit

The first commit should produce a clone-and-run experience. The next person who clones the repo should be able to run `npm install && npm run dev` and see something. If they can't, the bootstrap failed.

## Rules

- The README must read well even to someone who has never heard of you or the project
- "What this is not" section is mandatory — it prevents 50% of misunderstandings
- No "TODO" in shipped READMEs. Either it's done or it's in the roadmap with a marker.
- License file must exist before the first public push
- The 30-second demo GIF (if any) must show the actual product, not a Figma mockup

## Anti-patterns to refuse

- READMEs that start with the author's personal story
- "Powered by AI" with no specifics about how
- Roadmaps with 20+ items (force a cut)
- Contribution sections that say "feel free to contribute" without saying what kind of contributions are wanted
- Repo structures where you can't tell where the entry point is

## The honest test

Show the README to someone who has never heard of the project. Can they explain back to you, in 30 seconds, what it does and who it's for? If not, the README is not done yet.
