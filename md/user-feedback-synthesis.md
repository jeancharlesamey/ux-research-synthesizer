---
name: user-feedback-synthesis
description: Synthesizes raw feedback from 3–10 user test sessions into structured themes, severity ratings, and a prioritized action list. Use after every round of testing to extract signal from noise. Triggers — "synthesize user feedback", "what did users say", "make sense of the test results", "what should I fix first", "user research synthesis".
---

# User Feedback Synthesis

## Purpose

Raw notes from user testing are useless until they're synthesized. This skill produces a structured output you can act on: what's broken, how badly, what to fix first, and what to ignore.

## When to use

- After every round of TestFlight feedback
- After 5+ user test sessions on a deployed web app
- Before shipping the next iteration of a v1
- When you have more feedback than you can hold in your head

## Inputs

1. Raw notes from each session (timestamps, quotes, observations)
2. The product's core user job (from PRD)
3. Severity definitions if not default (see below)
4. The next ship window (so prioritization is realistic)

## Default severity definitions

- **Blocker** — user couldn't complete the core job. Fix before next ship.
- **Major** — user completed the job but was frustrated, confused, or worked around the product. Fix in next 2 ships.
- **Minor** — user noticed it, mentioned it, but moved on. Backlog.
- **Cosmetic** — visual or copy issue, no functional impact. Batch fix later.

## Output structure

### 1. Headline

One sentence. What's the dominant signal from this round?

Example: "Three of five users couldn't find the synthesis output, so they assumed it was still processing — the perceived performance problem is actually a UI visibility problem."

### 2. Quantitative summary

| Metric | Value |
|---|---|
| Sessions reviewed | 5 |
| Completed core job | 4 / 5 |
| Would use again next week | 3 / 5 |
| Blockers identified | 1 |
| Majors identified | 4 |
| Minors identified | 7 |

### 3. Themes

3–6 themes max. Force consolidation. Each theme contains:

- **Theme label** (3–5 words)
- **Severity** (worst observation in the theme)
- **Count** (how many users mentioned/exhibited)
- **What's actually happening** (1–2 sentence summary)
- **Verbatim quotes** (2–3 max, attributed by participant code)
- **Suggested response** (one action, not three options)

Example:

> **Theme: Output is invisible after submission**
> **Severity:** Blocker · **Count:** 3 of 5 users
>
> Users submitted notes, saw the streaming indicator end, but didn't notice the output rendered below the fold. Two assumed the product had failed silently.
>
> > "Did it work? I don't see anything." — P2
> > "I waited like 30 seconds, then refreshed." — P4
>
> **Suggested response:** Auto-scroll to the output region when synthesis completes, add a visible completion state above the fold.

### 4. The "things that surprised me" section

Observations that don't fit a theme but matter. Often the most valuable.

Examples:
- A user found a use case you didn't design for
- Two users independently asked for the same feature
- The product was used in a context you didn't anticipate

### 5. Prioritized action list

A numbered list, max 7 items, for the next ship window. Each item:

- One sentence action
- Estimated effort: S / M / L
- Linked theme

Example:
1. **Auto-scroll to output on synthesis complete** (S) — Theme: Output is invisible
2. **Add "X themes found" summary at the top of output** (S) — Theme: Output is invisible
3. **Persist last 3 syntheses in local storage** (M) — Theme: Lost work on refresh

### 6. What I'm not doing (and why)

The most important section. List the things users asked for that you won't build, with one-line reasoning.

- "Export to Notion" — out of scope for v1, would slow down ship cadence
- "Multi-language support" — only one user mentioned, not blocking
- "Team collaboration features" — explicit non-goal per PRD

### 7. Open questions for next round

3 max. The things this round didn't answer that the next round should.

## Rules

- Force theme consolidation: 3–6 themes max. If you have 12, you're listing not synthesizing.
- Every theme needs a count and a verbatim quote. No themes from a single user with no quote.
- Suggested response is one action. Three options means you haven't synthesized.
- The "what I'm not doing" section is mandatory. Half the value of synthesis is what you decide to ignore.
- Don't hedge severity. A blocker is a blocker even if it's awkward to fix.

## Anti-patterns to refuse

- Synthesis that's just a list of every observation
- Themes named after features ("Search functionality") instead of behaviors ("Users can't find their previous work")
- "All feedback is valuable" framing that refuses to prioritize
- Action lists with 20 items
- Reports that hide bad news in the appendix

## The honest test

Show the synthesis to someone who wasn't in the sessions. Can they explain, in 1 minute, what the product needs next? If not, the synthesis didn't compress the signal enough.
