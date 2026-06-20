---
name: prd-writer
description: Generates a Product Requirements Document (PRD) for a personal AI product or open-source tool. Use whenever you start a new project and need to define scope, users, success criteria, and constraints before writing any code. Triggers — "write a PRD", "draft requirements", "scope this project", "define the product", "what should this product do".
---

# PRD Writer

## Purpose

Produce a tight, decision-ready PRD for a personal or open-source AI project. Optimized for solo builders who need to lock scope before coding, not for enterprise product teams.

## When to use

- Starting any new project in the Meaghan's Skill Path program
- Before writing a single line of code on a new build
- When scope creep starts and you need to re-anchor

## Inputs to ask for

1. Working name of the product
2. One-sentence pitch ("X for Y who want Z")
3. Target user — be specific: not "designers" but "UX researchers at fintech orgs who run 8+ interviews per study"
4. The single most important user job
5. Stack constraints (if any are non-negotiable, e.g. "must use Next.js")
6. Distribution constraint (open-source, App Store, deployed web app)
7. Time budget for v1

## Output structure

Generate a markdown PRD with exactly these sections:

### 1. One-liner
A single sentence anyone can repeat. No jargon.

### 2. Problem
3–5 sentences. What's broken today, for whom, and what's the cost of leaving it broken. Concrete, not abstract.

### 3. Target user
One persona, written in present tense. Their context, their workflow, the specific moment when they would reach for this product.

### 4. Core user job
The single job the product must do excellently. Format: "When [situation], I want to [motivation], so I can [outcome]."

### 5. v1 scope — must have
Bulleted list of 3–5 capabilities. Each starts with a verb. Each is testable.

### 6. v1 scope — explicitly out
Bulleted list of 3–5 things you're consciously not building. This is the most important section — it prevents scope creep.

### 7. Success criteria
3 concrete signals that v1 worked. At least one must be user behavior (not "I shipped it" but "5 designers used it on real work and 3 came back").

### 8. Stack decisions
List each layer (frontend, backend, AI, deployment, distribution) with the choice and a one-line rationale.

### 9. Non-goals
What this product will never become, even at v10. Protects against future drift.

### 10. Risks
Top 3 things that could kill the project. For each: what it is, how you'd notice it early, what you'd do.

### 11. Open questions
3–5 things you don't yet know. Tag each as "blocker" (must answer before coding) or "explore" (can answer while building).

## Rules

- Length cap: 2 pages when printed
- No bullets longer than 2 sentences
- No marketing language ("revolutionary", "seamless", "powerful")
- If a section feels like padding, delete it
- Every claim must be falsifiable
- If you can't write a section confidently, mark it "TBD — need to learn more" and move on

## Anti-patterns to refuse

- PRDs that read like marketing copy
- "Everything is must-have" — force a cut
- Scope written without an explicit out-of-scope list
- Success criteria that only the author can measure

## Example one-liner format

"UX Research Synthesizer is a Next.js + MCP tool that turns raw interview notes into structured themes and quotes, for solo UX researchers who synthesize manually today."

That's the bar. One sentence, who it's for, what it does, what it replaces.
