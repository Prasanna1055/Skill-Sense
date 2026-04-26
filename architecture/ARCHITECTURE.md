# SkillSense — Architecture & Scoring Logic

## System Architecture

```
INPUT LAYER          AGENT PIPELINE                   OUTPUT LAYER
──────────────       ─────────────────────────────    ──────────────────────
Job Description  ──► Stage 1: Skill Extraction   ──► Skill Scores (1–5)
Resume           ──► Stage 2: Assessment Loop    ──► Readiness Score (0–100)
                     Stage 3: Scoring Engine     ──► Learning Path
                     Stage 4: Plan Generation    ──► Quick Wins
```

## Agent Stages

### Stage 1 — Skill Extraction (`buildExtractionPrompt`)
Claude parses both the JD and resume simultaneously and returns structured JSON containing:
- Extracted required skills (4–5 most important)
- Skill importance tier: `critical | important | nice-to-have`
- What the resume actually claims for each skill
- 3 progressively harder assessment questions per skill (easy → medium → hard)

**Key design decision:** Questions are generated *from both JD and resume*. This means questions are calibrated — if the resume claims expertise, q3 is genuinely hard; if it's a gap, questions are more exploratory.

### Stage 2 — Assessment Loop (`buildAckPrompt`)
For each skill, the agent:
1. Asks the pre-generated question
2. Receives the candidate's answer
3. Calls Claude with a brief acknowledgment prompt that naturally bridges to the next question
4. Repeats for all 3 questions

The acknowledgment call keeps conversation feeling natural without revealing scores mid-assessment.

### Stage 3 — Scoring Engine (`buildScoringPrompt`)
After all 3 answers for a skill are collected, Claude evaluates them holistically:
- Score: 1.0–5.0 (float, not integer)
- Label: Novice / Beginner / Intermediate / Advanced / Expert
- Rationale: 2–3 sentence honest evaluation
- Strengths array + Gaps array
- Next step recommendation

**Scoring scale (calibrated for rigor):**
| Score | Label | Meaning |
|-------|-------|---------|
| 1.0–1.9 | Novice | Surface buzzwords, no real understanding |
| 2.0–2.9 | Beginner | Basic awareness, limited practical experience |
| 3.0–3.9 | Intermediate | Can work with guidance, understands fundamentals |
| 4.0–4.9 | Advanced | Works independently, understands internals |
| 5.0 | Expert | Deep mastery, can design systems and teach others |

The system prompt explicitly tells Claude "most candidates are 2–3, not 4–5" to counteract AI tendency toward positive bias.

### Stage 4 — Plan Generation (`buildPlanPrompt`)
Claude receives all skill results and generates:
- Readiness score (0–100) — weighted composite based on skill importance tiers
- Per-skill learning paths only for genuine gaps (score < 3.5 on critical skills, < 3.0 on others)
- Real resource URLs (Coursera, Udemy, MDN, official docs, YouTube)
- Time estimates in weeks and days
- Practice tasks that are concrete and project-based
- 3 quick wins tiered by immediate actionability

## State Machine

```
idle → questioning → (per skill loop) → planning → done
              ↑___________|
              (3 questions per skill, N skills)
```

## Scoring Logic Detail

### Readiness Score Calculation (Conceptual)
The readiness score in Stage 4 is computed by Claude with this weighting intent:
- Critical skills have 3× weight
- Important skills have 2× weight  
- Nice-to-have skills have 1× weight

A candidate scoring 4/5 on all critical skills but 1/5 on nice-to-haves would score ~75/100.

### Gap Prioritization
Skills are included in the learning path only when:
- Critical skill score < 4.0 (needs to reach near-Advanced)
- Important skill score < 3.5
- Nice-to-have skill score < 3.0

This keeps the plan focused and realistic rather than trying to fix everything.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Inline styles with CSS variables |
| AI Backend | Anthropic Claude claude-sonnet-4 |
| API Communication | Fetch (browser native) |
| Build | Vite 5 |
| Deployment | Netlify / Vercel (static) |

## Prompt Engineering Choices

1. **JSON-only system prompt** — All 4 stages that return structured data use a strict system prompt. This nearly eliminates JSON parse failures.

2. **Calibration language** — The scoring prompt explicitly counters AI positivity bias with "be rigorous — most candidates are 2-3, not 4-5."

3. **Resume-aware question generation** — Questions adapt to what the resume claims. A candidate claiming 4 years of React gets harder React questions than a candidate with 1 year.

4. **Conversational bridge** — The acknowledgment call (Stage 2 transition) makes the conversation feel human rather than mechanical Q&A.

5. **Gap-focused plan** — The plan prompt only asks Claude to include skills with genuine gaps, keeping the output actionable rather than overwhelming.
