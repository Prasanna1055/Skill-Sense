/**
 * SkillSense — Prompt builders for the AI assessment agent
 */

export const buildExtractionPrompt = (jd, resume) => `You are SkillSense, an expert technical recruiter and skills assessor.

Analyze the Job Description and Resume below. Extract required skills, note what the resume actually claims, and generate 3 progressively harder assessment questions per skill that genuinely test proficiency — not definitions.

JOB DESCRIPTION:
${jd}

RESUME:
${resume}

Respond ONLY with valid JSON (no markdown backticks, no preamble):
{
  "jobRole": "exact job title from JD",
  "company": "company name or null",
  "candidateName": "name from resume or 'Candidate'",
  "skills": [
    {
      "id": "short_snake_case_id",
      "name": "Skill Name",
      "importance": "critical|important|nice-to-have",
      "category": "technical|soft|domain",
      "resumeClaim": "what resume specifically says, or null if not mentioned",
      "questions": [
        {"id": "q1", "question": "An applied question testing basic practical knowledge"},
        {"id": "q2", "question": "A harder question requiring deeper understanding"},
        {"id": "q3", "question": "A challenging scenario or problem-solving question"}
      ]
    }
  ]
}

Rules:
- Extract exactly 4-5 most important skills (critical ones first)
- Questions must test real ability — not ask for definitions
- q3 should be genuinely hard for someone with 1-2 years experience
- Order: critical > important > nice-to-have`;

export const buildAckPrompt = (skillName, question, answer, nextQuestion) =>
  `You are SkillSense, a friendly but rigorous technical interviewer.

The candidate was asked about ${skillName}:
Q: "${question}"
A: "${answer}"

Give a 1-sentence natural conversational acknowledgment (do NOT evaluate or score them — just acknowledge you heard them), then immediately ask:
"${nextQuestion}"

Format: [one sentence acknowledgment]. [next question]
Keep it warm but concise. No lengthy feedback yet.`;

export const buildScoringPrompt = (name, importance, qna) =>
  `Evaluate this candidate's ${name} proficiency based on their interview answers.

Skill: ${name} (role importance: ${importance})

Questions and Answers:
${qna.map((x, i) => `Q${i + 1}: ${x.q}\nA${i + 1}: ${x.a}`).join('\n\n')}

Respond ONLY with valid JSON:
{
  "score": 3.5,
  "label": "Intermediate",
  "rationale": "2-3 sentence honest evaluation of what they demonstrated",
  "strengths": ["specific demonstrated strength", "another strength"],
  "gaps": ["specific knowledge gap", "another gap"],
  "nextStep": "The single most impactful thing they should learn next"
}

Scoring scale (be rigorous — most candidates are 2-3, not 4-5):
1.0-1.9 = Novice: surface buzzwords, no real understanding
2.0-2.9 = Beginner: basic awareness, limited practical experience
3.0-3.9 = Intermediate: can work with guidance, understands fundamentals
4.0-4.9 = Advanced: works independently, solid understanding of internals
5.0 = Expert: deep mastery, can design systems, teach others`;

export const buildPlanPrompt = (role, skillResults) => {
  const summary = skillResults
    .map(s => `- ${s.name} [${s.importance}]: ${s.score}/5 (${s.label})\n  Gaps: ${s.gaps.length ? s.gaps.join(', ') : 'none identified'}`)
    .join('\n');

  return `Generate a personalized learning plan for a candidate targeting: ${role}

Assessment Results:
${summary}

Create a focused, actionable plan. Only include skills where there are real gaps worth addressing. Prioritize critical skills with low scores. Use REAL resource URLs that exist (Coursera, Udemy, official docs, YouTube, freeCodeCamp, etc.).

Respond ONLY with valid JSON:
{
  "overallSummary": "Honest 2-3 sentence assessment of the candidate's overall fit",
  "readinessScore": 65,
  "readinessLabel": "Partially Ready",
  "prioritySkills": ["SkillA", "SkillB"],
  "learningPath": [
    {
      "skill": "PostgreSQL",
      "currentScore": 2.0,
      "targetScore": 4.0,
      "estimatedWeeks": 5,
      "priority": "high",
      "steps": [
        {
          "title": "Step title (e.g. Fundamentals)",
          "description": "Brief description of what you'll cover",
          "resources": [
            {
              "name": "Resource name",
              "type": "course|book|docs|practice|video|tutorial",
              "url": "https://real-url.com",
              "timeEstimate": "8 hours",
              "free": true
            }
          ],
          "practiceTask": "A concrete hands-on project or exercise to apply the learning",
          "days": 14
        }
      ]
    }
  ],
  "quickWins": [
    "Very specific action: something to do TODAY",
    "Specific action for this week",
    "Specific action for this month"
  ],
  "totalWeeks": 10
}`;
};
