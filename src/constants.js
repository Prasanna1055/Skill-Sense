export const SAMPLE_JD = `Senior Full-Stack Engineer — FinTech Startup (Series B)

We're building the next generation of payment infrastructure. Join our core engineering team to design and ship features used by millions of merchants worldwide.

RESPONSIBILITIES
• Design and implement scalable REST APIs and microservices
• Build responsive React frontends with excellent UX
• Architect PostgreSQL database schemas and optimize query performance
• Deploy and manage services on AWS (ECS, RDS, S3, Lambda)
• Mentor junior engineers and conduct code reviews

REQUIRED SKILLS
• React.js — 4+ years, hooks, state management (Redux/Zustand)
• Node.js — 3+ years, Express or Fastify
• PostgreSQL — schema design, indexing, query optimization
• AWS — EC2, ECS, RDS, S3, CloudWatch
• System Design — distributed systems, scalability patterns

NICE TO HAVE
• Docker & Kubernetes
• TypeScript (advanced)
• Redis / caching strategies`;

export const SAMPLE_RESUME = `ALEX JOHNSON
alex.johnson@email.com | github.com/alexj

SUMMARY
Full-stack software engineer with 4 years of experience. Strong React frontend skills; backend experience with Node.js and REST APIs.

SKILLS
JavaScript (ES6+), TypeScript (basic), React, Redux, Node.js, Express, MySQL, MongoDB, Git, Docker (basic), Jest
Cloud: AWS Cloud Practitioner certified (foundational only); Heroku deployments

EXPERIENCE

Software Engineer — Agency XYZ (2022–Present)
• Built 10+ client-facing React applications with Redux state management
• Developed Node.js/Express REST APIs serving 50k+ daily requests
• Used MySQL for relational data; designed normalized schemas
• Improved test coverage from 20% to 75% with Jest
• Reviewed code for 2 junior developers

Junior Developer — WebStudio (2020–2022)
• Built React components for e-commerce platforms
• Wrote Python scripts for data automation
• Deployed to Heroku; basic Docker containerization

EDUCATION
B.Tech Computer Science — Mumbai University, 2020

PROJECTS
ShopDash: E-commerce dashboard (React + Node.js + MySQL)
AutoReport: Python/Node.js analytics automation tool`;

export const IMPORTANCE_COLORS = {
  critical: '#ef4444',
  important: '#f59e0b',
  'nice-to-have': '#3b82f6',
};

export const SCORE_THRESHOLDS = {
  expert: 4.5,
  advanced: 3.5,
  intermediate: 2.5,
  beginner: 1.5,
};

export function getScoreColor(score) {
  if (score >= 4.5) return '#8b5cf6';
  if (score >= 3.5) return '#22c55e';
  if (score >= 2.5) return '#f59e0b';
  if (score >= 1.5) return '#f97316';
  return '#ef4444';
}

export function getScoreLabel(score) {
  if (score >= 4.5) return 'Expert';
  if (score >= 3.5) return 'Advanced';
  if (score >= 2.5) return 'Intermediate';
  if (score >= 1.5) return 'Beginner';
  return 'Novice';
}
