---
name: conference-talk-drafter
description: Drafts a conference talk proposal (CFP) and the talk skeleton for a 20-minute conference presentation, optimized for a single clear argument with concrete evidence. Use when submitting talks to design conferences, dev conferences, or fintech events. Triggers — "submit a talk", "write a CFP", "draft a conference proposal", "talk skeleton", "what should my talk be about".
---

# Conference Talk Drafter

## Purpose

A conference talk is not a project update. It's an argument backed by evidence, told as a story, in 20 minutes. This skill produces both the CFP (what gets you in) and the talk skeleton (what makes the talk worth giving).

## When to use

- Submitting to a conference CFP
- Preparing a meetup talk
- Drafting a recorded talk for a podcast or webinar
- Pitching internal lunch-and-learns or internal demos

## Inputs

1. The venue (conference name, audience composition, typical talk style)
2. The project(s) the talk is grounded in
3. The single argument you want to make
4. The duration (5, 10, 20, 30, 45 min)
5. Your specific positioning angle (e.g. "designer who ships on-device AI for banking")

## Phase 1 — The CFP

### Title formula

Avoid clever-but-unclear titles. The title should make the reviewer think "yes, our audience would want to hear that."

Good title patterns:
- "What I learned [doing specific thing] for [specific audience]"
- "[Specific technical thing] in [specific domain]: what works, what doesn't"
- "[Counterintuitive claim] — and what changed my mind"

Bad title patterns:
- "The future of [trend]" — too vague, sounds like every other talk
- "How AI will change [profession]" — overclaim, no evidence
- "[Cute pun]: [actual title]" — most CFP reviewers skip these

### Abstract structure (150–250 words)

1. **The hook** (2–3 sentences) — the concrete situation that motivated the talk
2. **The claim** (1 sentence) — the argument you'll make
3. **The evidence** (2–3 sentences) — what you built, what happened, what data you have
4. **What the audience will take away** (2–3 bullets or sentences) — be specific. Not "they'll learn about AI" but "they'll see exactly how to integrate on-device inference into a SwiftUI app, and the three places I got it wrong."
5. **Who this is for** (1 sentence) — name the audience explicitly

### Speaker bio

3–4 sentences max. Lead with what you build, not where you work (especially given NDA constraints). Link to one URL: the master proof URL.

Example: "JC is a product designer building on-device AI tools for regulated industries. He recently shipped a banking UX audit app using Apple Intelligence and runs a Substack on design × AI organizational practice. See [URL]."

## Phase 2 — The talk skeleton

### The shape of a 20-minute talk

| Section | Duration | Purpose |
|---|---|---|
| Hook | 1–2 min | Specific moment, concrete detail, gets attention |
| The setup | 2–3 min | The problem, why it matters, why now |
| The claim | 1 min | The single argument, stated explicitly |
| Evidence 1 | 3–4 min | First project or experiment that supports the claim |
| Evidence 2 | 3–4 min | Second project or experiment, different angle |
| Evidence 3 | 3–4 min | Third project — and ideally where you were wrong |
| Implication | 2–3 min | What the audience should do differently |
| Close | 1 min | Restate the claim, name the resources, one clear ask |

### The single-argument rule

A 20-minute talk fits one argument. If you have two arguments, you have two talks. Cut.

Test: can you state the talk in one sentence with no "and"? If not, narrow it.

### The evidence-not-promise rule

Every claim must be backed by a specific moment, a specific number, or a specific artifact you can show. "I learned that X" is worthless. "I tried X for 3 weeks, here's the code, here's what broke" is worth listening to.

### Slide structure default

- One idea per slide
- One number, quote, or image per slide
- No bullets longer than 4 words
- No slide should require you to read it aloud
- Backup slides for the Q&A you're afraid of

### The honest section

Every good talk includes a section where you were wrong, surprised, or had to change your mind. This is what separates a talk from a sales pitch. Make it specific.

## CFP tactics

- Submit early in the window (reviewer fatigue is real)
- Cite the specific theme or track of the conference if there is one
- Link to a recording of any previous talk, even an internal one
- If you have a working product to demo, mention it in the abstract
- Read the conference's past talks. Match the register, beat the average.

## Voice calibration for JC

- Punchy declarative sentences
- No em dashes
- Concrete specificity (numbers, names, durations)
- Org-level framing on design × AI questions
- Comfortable with self-critique, allergic to self-flagellation
- Show working products, not just slides

## Anti-patterns to refuse

- Talks with 3 arguments compressed into 20 minutes
- "Here's a list of 10 things I learned" structures (force a single argument)
- Talks where the speaker is the protagonist instead of the work
- Slide-heavy talks with no live demo or artifact
- CFPs that promise "best practices" without specifics

## The honest test

After drafting the talk, ask: "If someone watches the first 5 minutes, do they know what I'm arguing and why?" If not, the hook is too long or the claim is too vague.

And after the talk skeleton: "What's the one sentence I want the audience to repeat to their colleague at lunch tomorrow?" If you can't write that sentence, the talk doesn't have a core yet.
