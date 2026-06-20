---
name: solo-test-plan
description: Generates a lightweight testing plan for a personal AI product — covering both technical tests (does the code work?) and user tests (does the product solve the problem?). Triggers — "test plan", "how do I test this", "validation plan", "user testing for my project", "is this ready to ship".
---

# Solo Test Plan

## Purpose

For solo builders shipping AI products in public, there are two failure modes: the code is broken (a bug nobody reported because they couldn't even use it), and the product is irrelevant (the code works but nobody needs it). This skill produces a plan that catches both.

## When to use

- Before deploying any v1 to real users
- Before submitting to TestFlight or App Store
- Before writing the "build in public" launch post
- When you suspect you're shipping too early or too late

## Inputs

1. Product name and one-liner
2. The single most important user job (from the PRD)
3. Stack (web app, native iOS, macOS, etc.)
4. Distribution plan (TestFlight, Vercel public URL, GitHub release)
5. Realistic access to test users (how many, who, how soon)

## Output structure

### 1. Technical tests — does the code work

#### Smoke tests
The 5 things that, if any of them fail, the product is unusable. List as testable assertions.

#### Edge cases for AI features specifically
- Empty input
- Extremely long input (over typical context)
- Input in a different language than expected
- Adversarial input (prompt injection attempt)
- Network failure mid-stream
- API rate limit hit
- Model returns malformed JSON when function calling is expected

#### Local test pass criteria
What must be true on your machine before any user touches it.

### 2. User tests — does the product solve the problem

#### Recruitment plan
- Who: specific people, not "designers in general"
- How many: 5 is the floor for solo builds, more is better
- How: where you'll reach them (DMs, Substack, network)
- Incentive: what's in it for them

#### Test protocol
Three short tasks the user does in 15–20 minutes:
- Task 1 — minimum viable use: can they do the simplest version of the job
- Task 2 — realistic use: can they apply it to their actual work
- Task 3 — stretch: where does the product break

For each task: the prompt you give them, what you watch for, what counts as success.

#### Observation framework
- What they say (verbatim quotes go in the report)
- What they do (where they hesitate, where they click confidently)
- What they don't do (the feature they didn't notice)
- Severity bucket per observation: blocker / major / minor / cosmetic

#### Post-task questions
4 questions max. Open-ended. Examples:
- What would make you use this again next week?
- What did you expect would happen that didn't?
- Where would you recommend this to someone else?
- What's the closest thing you use today, and how does this compare?

### 3. AI-specific quality checks

These don't exist in non-AI products and are easy to forget.

#### Output quality rubric
For each user-facing AI output, define what "good enough" means on a 1–5 scale. Anchor each level with an example.

#### Drift testing
Run the same input 5 times. How much does the output vary? If it varies wildly, you have a temperature problem or a prompt instability problem.

#### Failure mode catalog
List the failure modes you've seen during development. For each: how often it happens, what triggers it, how the UI handles it (gracefully or not).

### 4. Pre-ship checklist

A binary list. Every item must be ✅ before public release.

- [ ] All smoke tests passing locally
- [ ] All edge cases handled or gracefully degraded
- [ ] At least 3 real users completed Task 1 successfully
- [ ] At least 1 real user found a use case I didn't design for (good sign)
- [ ] No blocker-severity observations unresolved
- [ ] Output quality rubric scoring ≥4/5 on Task 2
- [ ] Error states have human-readable copy, not stack traces
- [ ] Privacy claim is verifiably true (if you say "on-device", check it)
- [ ] README explains what the product is in 30 seconds
- [ ] You can describe the product to a non-designer in one sentence

## Rules

- 5 users is the floor, not the goal
- A user test without a task is a chat, not a test
- "I think it's working" is not a pass criterion
- Drift testing is required for any AI feature, not optional
- If you skip a section, write why in one sentence — don't silently drop it

## Anti-patterns to refuse

- Test plans that don't include real users
- "Beta testing" as a euphemism for "shipping and hoping"
- Success criteria measured only by you
- Pre-ship checklists where "ship it" is the first item

## The honest test

After running the plan, you should be able to answer: "Would 3 specific people I know reach for this product next week?" If you don't have 3 names, the test plan didn't work.
