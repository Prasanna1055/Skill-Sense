import { useState, useRef, useEffect } from 'react';
import SetupScreen from './components/SetupScreen';
import ChatScreen from './components/ChatScreen';
import ResultsScreen from './components/ResultsScreen';
import { callClaude, parseClaudeJSON } from './api';
import {
  buildExtractionPrompt,
  buildAckPrompt,
  buildScoringPrompt,
  buildPlanPrompt,
} from './prompts';
import { SAMPLE_JD, SAMPLE_RESUME } from './constants';

export default function App() {
  const [screen, setScreen] = useState('setup'); // setup | chat | results
  const [jd, setJd] = useState(SAMPLE_JD);
  const [resume, setResume] = useState(SAMPLE_RESUME);

  // Assessment state
  const [data, setData] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | questioning | planning | done
  const [currentSkillIdx, setCurrentSkillIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [skillQna, setSkillQna] = useState([]); // [{q, a}] for current skill
  const [scores, setScores] = useState({}); // skillId -> score object
  const [plan, setPlan] = useState(null);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const addMsg = (content, role = 'agent') => {
    setMessages((prev) => [...prev, { role, content, id: Date.now() + Math.random() }]);
  };

  const startAssessment = async () => {
    setLoading(true);
    setMessages([{ role: 'agent', content: '🎯 **Analyzing your job description and resume...**\n\nExtracting required skills and generating assessment questions.', id: 1 }]);
    setScreen('chat');
    setScores({});
    setPlan(null);
    setCurrentSkillIdx(0);
    setCurrentQuestionIdx(0);
    setSkillQna([]);
    setPhase('idle');
    setData(null);

    try {
      const raw = await callClaude(buildExtractionPrompt(jd, resume));
      const extracted = parseClaudeJSON(raw);
      setData(extracted);

      const count = extracted.skills.length;
      addMsg(
        `✅ **Analysis complete!**\n\nWelcome, **${extracted.candidateName || 'Candidate'}**! I'll assess your fit for the **${extracted.jobRole}** role${extracted.company ? ` at **${extracted.company}**` : ''}.\n\n📋 **${count} skills to assess:**\n${extracted.skills.map((s, i) => `${i + 1}. ${s.name} (${s.importance})`).join('\n')}\n\nI'll ask **3 questions per skill** to gauge real proficiency — not just what your resume says. Answer honestly; this helps generate an accurate, useful learning plan.\n\nLet's begin! 💪`
      );

      setPhase('questioning');

      const first = extracted.skills[0];
      setTimeout(() => {
        addMsg(
          `\n---\n\n**📍 Skill 1/${count}: ${first.name}**\n*${first.importance === 'critical' ? '🔴 Critical' : first.importance === 'important' ? '🟡 Important' : '🔵 Nice-to-have'} · ${first.resumeClaim || 'Not explicitly mentioned in resume'}*\n\n${first.questions[0].question}`
        );
      }, 600);
    } catch (err) {
      addMsg(`❌ **Error:** ${err.message}\n\nPlease check your inputs and try again.`);
      setScreen('setup');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || loading || !data) return;

    const answer = userInput.trim();
    setUserInput('');
    addMsg(answer, 'user');
    setLoading(true);

    const currentSkill = data.skills[currentSkillIdx];
    const updatedQna = [
      ...skillQna,
      { q: currentSkill.questions[currentQuestionIdx].question, a: answer },
    ];
    setSkillQna(updatedQna);

    const nextQIdx = currentQuestionIdx + 1;

    try {
      if (nextQIdx < currentSkill.questions.length) {
        // Ask next question with brief ack
        const nextQ = currentSkill.questions[nextQIdx].question;
        const ack = await callClaude(
          buildAckPrompt(currentSkill.name, currentSkill.questions[currentQuestionIdx].question, answer, nextQ),
          'You are SkillSense, a friendly technical interviewer. Be brief and natural. No markdown formatting.'
        );
        addMsg(ack);
        setCurrentQuestionIdx(nextQIdx);
      } else {
        // Score this skill
        addMsg(`⏳ Scoring your **${currentSkill.name}** responses...`);

        const scoreRaw = await callClaude(
          buildScoringPrompt(currentSkill.name, currentSkill.importance, updatedQna)
        );
        const scoreData = parseClaudeJSON(scoreRaw);
        const newScores = { ...scores, [currentSkill.id]: scoreData };
        setScores(newScores);

        const bar = '█'.repeat(Math.round(scoreData.score)) + '░'.repeat(5 - Math.round(scoreData.score));
        addMsg(
          `**${currentSkill.name} — Assessment Complete**\n\n📊 **Score: ${scoreData.score}/5** \`[${bar}]\` — *${scoreData.label}*\n\n${scoreData.rationale}\n\n✅ **Strengths:** ${scoreData.strengths.join(' · ')}\n⚠️ **Gaps:** ${(scoreData.gaps || []).join(' · ') || 'None identified'}\n💡 **Next step:** ${scoreData.nextStep}`
        );

        const nextSIdx = currentSkillIdx + 1;

        if (nextSIdx < data.skills.length) {
          setCurrentSkillIdx(nextSIdx);
          setCurrentQuestionIdx(0);
          setSkillQna([]);

          const next = data.skills[nextSIdx];
          setTimeout(() => {
            addMsg(
              `\n---\n\n**📍 Skill ${nextSIdx + 1}/${data.skills.length}: ${next.name}**\n*${next.importance === 'critical' ? '🔴 Critical' : next.importance === 'important' ? '🟡 Important' : '🔵 Nice-to-have'} · ${next.resumeClaim || 'Not explicitly mentioned in resume'}*\n\n${next.questions[0].question}`
            );
          }, 500);
        } else {
          // All skills done — generate plan
          setPhase('planning');
          addMsg(
            '🎉 **All skills assessed!**\n\nGenerating your personalized learning plan. Analyzing gaps and curating resources — this takes a moment...'
          );

          const skillResults = data.skills.map((s) => ({
            name: s.name,
            importance: s.importance,
            score: newScores[s.id]?.score || 0,
            label: newScores[s.id]?.label || 'N/A',
            gaps: newScores[s.id]?.gaps || [],
          }));

          const planRaw = await callClaude(buildPlanPrompt(data.jobRole, skillResults));
          const planData = parseClaudeJSON(planRaw);
          setPlan(planData);
          setPhase('done');

          addMsg(
            `🎯 **Your Learning Plan is Ready!**\n\n**Readiness Score: ${planData.readinessScore}/100** — ${planData.readinessLabel}\n\n${planData.overallSummary}\n\n⚡ **Quick Wins:**\n${planData.quickWins.map((w) => `• ${w}`).join('\n')}\n\n📅 **Estimated learning time:** ~${planData.totalWeeks} weeks\n\nClick **"View Full Plan"** below for your complete roadmap with curated resources.`
          );
        }
      }
    } catch (err) {
      addMsg(`❌ **Error:** ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (screen === 'setup') {
    return (
      <SetupScreen
        jd={jd}
        resume={resume}
        setJd={setJd}
        setResume={setResume}
        onStart={startAssessment}
        loading={loading}
      />
    );
  }

  if (screen === 'results' && plan) {
    return (
      <ResultsScreen
        plan={plan}
        scores={scores}
        data={data}
        onBack={() => setScreen('chat')}
      />
    );
  }

  return (
    <ChatScreen
      data={data}
      phase={phase}
      currentSkillIdx={currentSkillIdx}
      messages={messages}
      userInput={userInput}
      setUserInput={setUserInput}
      loading={loading}
      scores={scores}
      onSend={sendMessage}
      onViewPlan={() => setScreen('results')}
    />
  );
}
