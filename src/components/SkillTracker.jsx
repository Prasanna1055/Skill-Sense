import { getScoreColor } from '../constants';

const IMP_COLORS = {
  critical: '#ef4444',
  important: '#f59e0b',
  'nice-to-have': '#3b82f6',
};

export default function SkillTracker({ data, scores, currentSkillIdx, phase }) {
  return (
    <div style={{ width: '230px', background: '#080f1e', borderRight: '1px solid #1e3050', padding: '20px 16px', overflowY: 'auto', flexShrink: 0 }}>
      <div style={{ fontSize: '10px', fontWeight: 700, color: '#3a5070', letterSpacing: '0.12em', marginBottom: '16px', textTransform: 'uppercase' }}>
        Skills Assessment
      </div>

      {!data ? (
        <div style={{ color: '#3a5070', fontSize: '12px', padding: '8px 0' }}>Analyzing...</div>
      ) : (
        data.skills.map((skill, idx) => {
          const score = scores[skill.id];
          const isActive = idx === currentSkillIdx && (phase === 'questioning');
          const isDone = score !== undefined;
          const isPending = !isDone && !isActive;

          return (
            <div key={skill.id} style={{ marginBottom: '10px', padding: '10px 12px', borderRadius: '8px', background: isActive ? '#0d1b2e' : 'transparent', border: `1px solid ${isActive ? '#4f6dff' : isDone ? '#1e3050' : 'transparent'}`, transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: isDone ? getScoreColor(score.score) : isActive ? '#4f6dff' : '#1e3050', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                  {isDone ? score.score.toFixed(1) : isActive ? '→' : idx + 1}
                </div>
                <span style={{ fontSize: '12px', fontWeight: isDone || isActive ? 600 : 400, color: isPending ? '#3a5070' : '#dce8f8', flex: 1, lineHeight: 1.3 }}>
                  {skill.name}
                </span>
              </div>

              <div style={{ paddingLeft: '30px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: IMP_COLORS[skill.importance] + '18', color: IMP_COLORS[skill.importance] }}>
                  {skill.importance}
                </span>
                {isDone && (
                  <div style={{ marginTop: '5px', fontSize: '11px', color: '#5a7090' }}>
                    {score.label}
                    <div style={{ height: '3px', background: '#1e3050', borderRadius: '2px', marginTop: '4px' }}>
                      <div style={{ height: '100%', width: `${(score.score / 5) * 100}%`, background: getScoreColor(score.score), borderRadius: '2px' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

      {phase === 'done' && (
        <div style={{ marginTop: '16px', padding: '10px', background: '#0d1b2e', borderRadius: '8px', textAlign: 'center', border: '1px solid #1e3050' }}>
          <div style={{ fontSize: '11px', color: '#00bcd4', fontWeight: 700 }}>✓ Assessment Complete</div>
        </div>
      )}
    </div>
  );
}
