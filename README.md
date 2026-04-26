# 🎯 SkillSense

**AI-Powered Skill Assessment & Personalized Learning Plan Agent**

SkillSense takes a Job Description and a candidate's resume, conversationally assesses real proficiency on each required skill, identifies gaps, and generates a personalised learning plan — with curated resources and realistic time estimates.

> A resume tells you what someone *claims* to know — not how well they actually know it. SkillSense fixes that.

---

## ✨ Features

- **📋 Intelligent Skill Extraction** — Claude parses both the JD and resume to identify 4–5 critical skills and generate calibrated questions
- **💬 Conversational Assessment** — Natural Q&A flow with 3 progressively harder questions per skill
- **📊 Rigorous Scoring** — Honest 1–5 scoring (calibrated against AI positivity bias) with strengths/gaps analysis
- **🗺️ Personalized Learning Paths** — Per-skill roadmaps with real resource URLs, week estimates, and hands-on practice tasks
- **⚡ Quick Wins** — Actionable steps tiered as today / this week / this month
- **🎯 Readiness Score** — Composite 0–100 score weighted by skill importance

---

## 🏗️ Architecture

```
JD + Resume → Stage 1: Skill Extraction
                ↓
             Stage 2: Assessment Loop (3 Qs × N skills)
                ↓
             Stage 3: Scoring Engine (per skill)
                ↓
             Stage 4: Plan Generation
                ↓
             Results: Scores + Learning Path + Quick Wins
```

All stages use **Claude claude-sonnet-4** via the Anthropic API with structured JSON prompts.

See [`architecture/ARCHITECTURE.md`](./architecture/ARCHITECTURE.md) for full details on the scoring logic, prompt engineering decisions, and state machine.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/skillsense.git
cd skillsense

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your Anthropic API key:
# VITE_ANTHROPIC_API_KEY=sk-ant-api03-...

# 4. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview  # preview the production build locally
```

---

## 🌐 Deployment

### Netlify (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

Set `VITE_ANTHROPIC_API_KEY` in your Netlify dashboard under **Site Settings → Environment Variables**.

### Vercel

```bash
npm install -g vercel
npm run build
vercel --prod
```

Set environment variables in your Vercel project settings.

> ⚠️ **Security Note:** This app calls the Anthropic API directly from the browser (via Vite's `VITE_` prefix exposure). For production use with real users, consider adding a server-side proxy to keep your API key secret.

---

## 📁 Project Structure

```
skillsense/
├── src/
│   ├── components/
│   │   ├── SetupScreen.jsx     # JD + Resume input UI
│   │   ├── ChatScreen.jsx      # Conversational assessment interface
│   │   ├── SkillTracker.jsx    # Sidebar with skill progress
│   │   └── ResultsScreen.jsx   # Scores + learning plan display
│   ├── styles/
│   │   └── index.css           # Global styles
│   ├── App.jsx                 # Main app state machine
│   ├── api.js                  # Claude API wrapper
│   ├── prompts.js              # All 4 prompt builders
│   ├── constants.js            # Shared constants + sample data
│   └── main.jsx                # Entry point
├── architecture/
│   ├── ARCHITECTURE.md         # Detailed architecture docs
│   └── architecture.svg        # Architecture diagram
├── sample/
│   ├── jd.txt                  # Sample job description
│   ├── resume.txt              # Sample resume
│   └── sample_output.json      # Sample assessment output
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── README.md
```

---

## 🔄 How It Works (Step by Step)

1. **Paste** a job description and candidate resume into the setup screen
2. SkillSense calls Claude to **extract 4–5 key skills** and generate 3 calibrated assessment questions per skill
3. The **chat interface** presents questions one by one — answers are natural text responses
4. After each set of 3 answers, Claude **scores the skill** (1–5) with rationale, strengths, and gaps
5. After all skills are assessed, Claude generates a **full learning plan** with:
   - Readiness score (0–100)
   - Per-skill learning paths for genuine gaps only
   - Real resources with URLs, time estimates, free/paid labels
   - 3 quick wins to take action immediately
6. The **Results screen** shows everything in a clean, expandable UI with progress bars

---

## 🧪 Sample Inputs

The app comes pre-loaded with a sample JD (Senior Full-Stack Engineer at a FinTech startup) and a sample resume (Alex Johnson, 4-year software engineer). Press **Start Assessment** to see it in action.

Sample files: `sample/jd.txt` and `sample/resume.txt`

---

## 📊 Sample Output

See `sample/sample_output.json` for a complete example assessment result including:
- Skill scores for React (3.8), Node.js (3.5), PostgreSQL (2.1), AWS (1.8), System Design (2.3)
- Readiness score: 58/100 — "Partially Ready — Strong Foundation"
- Full 13-week learning plan with resource URLs
- Quick wins for today, this week, and this month

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| AI Model | Claude claude-sonnet-4 (Anthropic) |
| API | Anthropic Messages API |
| Styling | Inline styles + CSS variables |
| Deployment | Netlify / Vercel |

---

## 🎬 Demo

A 3–5 minute demo video is included showing:
1. Setup screen walkthrough
2. Live assessment chat (React.js, Node.js skills)
3. Score results after skill 1
4. Final results screen with learning plan
5. Expanding a learning path item with resources

---

## ⚙️ Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_ANTHROPIC_API_KEY` | ✅ Yes | Your Anthropic API key from console.anthropic.com |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

Built with [Claude](https://claude.ai) by Anthropic. Sample data inspired by real engineering job descriptions and resume patterns.
