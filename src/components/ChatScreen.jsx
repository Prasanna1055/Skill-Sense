import { useRef, useEffect } from 'react';
import SkillTracker from './SkillTracker';

function MD({ text }) {
  return (
    <div style={{ lineHeight: 1.75 }}>
      {text.split('\n').map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
        return (
          <div key={i} style={{ minHeight: line === '' ? '10px' : undefined }}>
            {parts.map((p, j) => {
              if (p.startsWith('**') && p.endsWith('**'))
                return <strong key={j} style={{ color: '#dce8f8', fontWeight: 700 }}>{p.slice(2, -2)}</strong>;
              if (p.startsWith('`') && p.endsWith('`'))
                return <code key={j} style={{ background: '#080f1e', padding: '1px 6px', borderRadius: '4px', fontSize: '0.88em', fontFamily: 'monospace', color: '#00bcd4' }}>{p.slice(1, -1)}</code>;
              return p;
            })}
          </div>
        );
      })}
    </div>
  );
}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: '5px', padding: '4px 0' }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4f6dff', animation: 'ss-pulse 1.4s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
      ))}
      <style>{`@keyframes ss-pulse{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '18px' }}>
      {!isUser && (
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f6dff, #00bcd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', marginRight: '10px', flexShrink: 0, alignSelf: 'flex-start', marginTop: '2px' }}>🎯</div>
      )}
      <div style={{ maxWidth: '76%', padding: '12px 16px', borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: isUser ? '#4f6dff' : '#0d1b2e', color: '#dce8f8', fontSize: '14px', lineHeight: 1.65, border: isUser ? 'none' : '1px solid #1e3050' }}>
        {isUser ? msg.content : <MD text={msg.content} />}
      </div>
    </div>
  );
}

export default function ChatScreen({ data, phase, currentSkillIdx, messages, userInput, setUserInput, loading, scores, onSend, onViewPlan }) {
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => { if (phase === 'questioning' && !loading) inputRef.current?.focus(); }, [phase, loading]);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#080f1e', color: '#dce8f8', fontFamily: '"DM Sans", -apple-system, sans-serif' }}>
      <SkillTracker data={data} scores={scores} currentSkillIdx={currentSkillIdx} phase={phase} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <div style={{ padding: '14px 24px', borderBottom: '1px solid #1e3050', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#080f1e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontWeight: 800, fontSize: '16px', background: 'linear-gradient(135deg, #4f6dff, #00bcd4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillSense</span>
            {data && <span style={{ fontSize: '13px', color: '#3a5070', borderLeft: '1px solid #1e3050', paddingLeft: '12px' }}>{data.jobRole}</span>}
          </div>
          {phase === 'done' && (
            <button onClick={onViewPlan} style={{ background: 'linear-gradient(135deg, #4f6dff, #00bcd4)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
              📊 View Full Plan →
            </button>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
          {loading && (
            <div style={{ display: 'flex', marginBottom: '18px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f6dff, #00bcd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', marginRight: '10px', flexShrink: 0 }}>🎯</div>
              <div style={{ padding: '12px 16px', background: '#0d1b2e', borderRadius: '4px 16px 16px 16px', border: '1px solid #1e3050' }}>
                <LoadingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {phase === 'questioning' && (
          <div style={{ padding: '16px 28px', borderTop: '1px solid #1e3050', display: 'flex', gap: '12px', flexShrink: 0, background: '#080f1e' }}>
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
              placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
              disabled={loading}
              rows={3}
              style={{ flex: 1, background: '#0d1b2e', border: '1px solid #1e3050', borderRadius: '10px', padding: '12px 16px', color: '#dce8f8', fontSize: '14px', resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5 }}
            />
            <button
              onClick={onSend}
              disabled={loading || !userInput.trim()}
              style={{ background: loading || !userInput.trim() ? '#1e3050' : 'linear-gradient(135deg, #4f6dff, #00bcd4)', color: 'white', border: 'none', borderRadius: '10px', padding: '0 24px', cursor: loading || !userInput.trim() ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}
            >
              Send ↑
            </button>
          </div>
        )}

        {(phase === 'planning') && (
          <div style={{ padding: '16px 28px', borderTop: '1px solid #1e3050', textAlign: 'center', color: '#3a5070', fontSize: '13px', background: '#080f1e' }}>
            Generating your personalized learning plan...
          </div>
        )}

        {phase === 'done' && (
          <div style={{ padding: '16px 28px', borderTop: '1px solid #1e3050', textAlign: 'center', background: '#080f1e' }}>
            <button onClick={onViewPlan} style={{ background: 'linear-gradient(135deg, #4f6dff, #00bcd4)', color: 'white', border: 'none', padding: '13px 44px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '15px', boxShadow: '0 0 30px rgba(79,109,255,0.3)' }}>
              📚 View Your Complete Learning Plan →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
