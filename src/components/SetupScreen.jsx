const S = {
  page: { minHeight: '100vh', background: '#080f1e', color: '#dce8f8', padding: '40px 24px', fontFamily: '"DM Sans", -apple-system, sans-serif' },
  header: { textAlign: 'center', marginBottom: '48px' },
  logo: { fontSize: '52px', marginBottom: '12px' },
  title: { margin: 0, fontSize: '36px', fontWeight: 800, background: 'linear-gradient(135deg, #4f6dff, #00bcd4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { margin: '10px 0 0', color: '#5a7090', fontSize: '16px' },
  grid: { maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' },
  fieldLabel: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontWeight: 700, fontSize: '15px' },
  textarea: { width: '100%', height: '380px', background: '#0d1b2e', border: '1px solid #1e3050', borderRadius: '10px', padding: '16px', color: '#dce8f8', fontSize: '13px', fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.6, resize: 'none', outline: 'none', boxSizing: 'border-box' },
  steps: { maxWidth: '1000px', margin: '0 auto 40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  step: { background: '#0d1b2e', borderRadius: '10px', padding: '16px', textAlign: 'center', border: '1px solid #1e3050' },
  stepIcon: { fontSize: '28px', marginBottom: '8px' },
  stepTitle: { fontWeight: 700, fontSize: '13px', marginBottom: '4px', color: '#dce8f8' },
  stepDesc: { color: '#5a7090', fontSize: '12px', lineHeight: 1.4 },
  btnWrap: { textAlign: 'center' },
  btn: (disabled) => ({
    background: disabled ? '#1e3050' : 'linear-gradient(135deg, #4f6dff, #00bcd4)',
    color: 'white', border: 'none', padding: '16px 56px', borderRadius: '12px',
    fontSize: '16px', fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : '0 0 40px rgba(79,109,255,0.35)',
    transition: 'all 0.2s',
  }),
  hint: { color: '#3a5070', fontSize: '12px', marginTop: '12px' },
};

export default function SetupScreen({ jd, resume, setJd, setResume, onStart, loading }) {
  const disabled = loading || !jd.trim() || !resume.trim();

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={S.logo}>🎯</div>
        <h1 style={S.title}>SkillSense</h1>
        <p style={S.subtitle}>AI-Powered Skill Assessment & Personalized Learning Plans</p>
      </div>

      <div style={S.grid}>
        <div>
          <div style={S.fieldLabel}><span>📋</span> Job Description</div>
          <textarea style={S.textarea} value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the job description here..." />
        </div>
        <div>
          <div style={S.fieldLabel}><span>📄</span> Candidate Resume</div>
          <textarea style={S.textarea} value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Paste the candidate's resume here..." />
        </div>
      </div>

      <div style={S.steps}>
        {[
          { icon: '🔍', title: 'Extract Skills', desc: 'AI identifies required skills from the JD and resume claims' },
          { icon: '💬', title: 'Assess Proficiency', desc: '3 targeted questions per skill to test real understanding' },
          { icon: '📊', title: 'Score & Gap Analysis', desc: 'Objective 1-5 scoring with strengths and gaps identified' },
          { icon: '📚', title: 'Learning Plan', desc: 'Curated resources and realistic time estimates per gap' },
        ].map((s, i) => (
          <div key={i} style={S.step}>
            <div style={S.stepIcon}>{s.icon}</div>
            <div style={S.stepTitle}>{s.title}</div>
            <div style={S.stepDesc}>{s.desc}</div>
          </div>
        ))}
      </div>

      <div style={S.btnWrap}>
        <button onClick={onStart} disabled={disabled} style={S.btn(disabled)}>
          {loading ? '⏳ Analyzing...' : '🚀 Start Assessment'}
        </button>
        <p style={S.hint}>Sample data pre-loaded · Assessment takes 5–10 minutes · Powered by Claude AI</p>
      </div>
    </div>
  );
}
