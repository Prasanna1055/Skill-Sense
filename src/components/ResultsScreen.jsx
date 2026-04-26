import { useState } from 'react';
import { getScoreColor } from '../constants';

const TYPE_ICONS = {
  course: '🎓',
  book: '📖',
  docs: '📄',
  practice: '💻',
  video: '🎬',
  tutorial: '📝',
};

function ReadinessGauge({ score, label }) {
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const r = 48;
  const circ = 2 * Math.PI * r;
  const prog = (score / 100) * circ;
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#1e3050" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${prog} ${circ}`} strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: 'stroke-dasharray 1s ease' }} />
        <text x="60" y="56" textAnchor="middle" fill={color} fontSize="24" fontWeight="800" fontFamily="monospace">{score}</text>
        <text x="60" y="72" textAnchor="middle" fill="#3a5070" fontSize="11">/100</text>
      </svg>
      <div style={{ fontWeight: 700, color, fontSize: '14px', marginTop: '4px' }}>{label}</div>
    </div>
  );
}

export default function ResultsScreen({ plan, scores, data, onBack }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: '#080f1e', color: '#dce8f8', padding: '32px 24px', fontFamily: '"DM Sans", -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ background: 'none', border: '1px solid #1e3050', color: '#5a7090', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '24px', fontSize: '13px' }}>
          ← Back to Chat
        </button>

        <h2 style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: 800 }}>📊 Assessment Results</h2>
        <p style={{ color: '#3a5070', margin: '0 0 32px', fontSize: '14px' }}>{data.candidateName} · {data.jobRole}</p>

        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: '#0d1b2e', borderRadius: '14px', padding: '24px', border: '1px solid #1e3050', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '11px', color: '#3a5070', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Readiness Score</div>
            <ReadinessGauge score={plan.readinessScore} label={plan.readinessLabel} />
            <p style={{ fontSize: '12px', color: '#5a7090', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>{plan.overallSummary}</p>
          </div>

          <div style={{ background: '#0d1b2e', borderRadius: '14px', padding: '24px', border: '1px solid #1e3050' }}>
            <div style={{ fontSize: '11px', color: '#3a5070', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Skill Breakdown</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
              {data.skills.map((skill) => {
                const s = scores[skill.id];
                if (!s) return null;
                const color = getScoreColor(s.score);
                return (
                  <div key={skill.id} style={{ padding: '12px', background: '#080f1e', borderRadius: '8px', border: '1px solid #1e3050' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '8px', color: '#dce8f8' }}>{skill.name}</div>
                    <div style={{ height: '4px', background: '#1e3050', borderRadius: '2px', marginBottom: '6px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(s.score / 5) * 100}%`, background: color, borderRadius: '2px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <span style={{ color, fontWeight: 700 }}>{s.score}/5</span>
                      <span style={{ color: '#3a5070' }}>{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Wins */}
        <div style={{ background: '#0d1b2e', borderRadius: '14px', padding: '24px', marginBottom: '20px', border: '1px solid #1e3050' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚡ Quick Wins <span style={{ fontSize: '12px', color: '#3a5070', fontWeight: 400 }}>Take action right now</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {plan.quickWins.map((win, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', padding: '12px', background: '#080f1e', borderRadius: '8px', border: '1px solid #1e3050', fontSize: '13px', lineHeight: 1.5 }}>
                <span style={{ color: '#4f6dff', fontWeight: 800, flexShrink: 0, fontSize: '15px' }}>{i + 1}.</span>
                <span style={{ color: '#b0c8e0' }}>{win}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Path */}
        <div>
          <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 800 }}>
            📚 Personalized Learning Path
            <span style={{ marginLeft: '12px', fontSize: '13px', color: '#3a5070', fontWeight: 400 }}>~{plan.totalWeeks} weeks total</span>
          </h3>

          {plan.learningPath.map((item, idx) => (
            <div key={idx} style={{ background: '#0d1b2e', borderRadius: '12px', marginBottom: '16px', overflow: 'hidden', border: '1px solid #1e3050' }}>
              <button onClick={() => setExpanded(expanded === idx ? null : idx)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', color: '#dce8f8', textAlign: 'left' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: getScoreColor(item.currentScore) + '18', border: `2px solid ${getScoreColor(item.currentScore)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: getScoreColor(item.currentScore), flexShrink: 0, fontFamily: 'monospace' }}>
                  {item.currentScore}
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>{item.skill}</div>
                  <div style={{ fontSize: '12px', color: '#3a5070', marginTop: '2px' }}>
                    Score {item.currentScore} → {item.targetScore} · ~{item.estimatedWeeks} weeks
                  </div>
                </div>
                <div style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: item.priority === 'high' ? '#ef444420' : item.priority === 'medium' ? '#f59e0b20' : '#22c55e20', color: item.priority === 'high' ? '#ef4444' : item.priority === 'medium' ? '#f59e0b' : '#22c55e' }}>
                  {item.priority} priority
                </div>
                <span style={{ color: '#3a5070', fontSize: '18px', flexShrink: 0 }}>{expanded === idx ? '▲' : '▼'}</span>
              </button>

              {expanded === idx && (
                <div style={{ borderTop: '1px solid #1e3050', padding: '20px 24px' }}>
                  {item.steps.map((step, si) => (
                    <div key={si} style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#4f6dff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>{si + 1}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '15px' }}>{step.title}</div>
                          <div style={{ fontSize: '12px', color: '#3a5070', marginTop: '2px' }}>{step.description} · ~{step.days} days</div>
                        </div>
                      </div>

                      <div style={{ paddingLeft: '36px' }}>
                        {step.resources.map((r, ri) => (
                          <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', padding: '10px 12px', background: '#080f1e', borderRadius: '8px', border: '1px solid #1e3050' }}>
                            <span style={{ fontSize: '16px', flexShrink: 0 }}>{TYPE_ICONS[r.type] || '🔗'}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: '13px', color: '#dce8f8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                              <div style={{ fontSize: '11px', color: '#3a5070', marginTop: '1px' }}>{r.timeEstimate} · {r.free ? '🟢 Free' : '💰 Paid'}</div>
                            </div>
                            <a href={r.url} target="_blank" rel="noreferrer" style={{ color: '#4f6dff', fontSize: '12px', textDecoration: 'none', padding: '4px 10px', border: '1px solid #4f6dff', borderRadius: '6px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                              Open →
                            </a>
                          </div>
                        ))}

                        <div style={{ padding: '10px 12px', background: '#0d2a4a', borderRadius: '8px', borderLeft: '3px solid #4f6dff', fontSize: '12px', color: '#b0c8e0', lineHeight: 1.5 }}>
                          <strong style={{ color: '#4f6dff' }}>🔨 Practice: </strong>{step.practiceTask}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
