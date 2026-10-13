import React, { useState } from 'react';
import { soundManager } from '../../audio/soundEffects';
import { Bot, Sparkles, Send, BookOpen, Lightbulb, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface GroqCoachDrawerProps {
  initialContext?: {
    question: string;
    level: number;
    userAns?: string;
  };
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  type?: 'explanation' | 'hint' | 'misconception' | 'strategy';
  modelUsed?: string;
}

export const GroqCoachDrawer: React.FC<GroqCoachDrawerProps> = ({ initialContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'coach',
      text: initialContext?.question
        ? `Hello! I see you are working on Level ${initialContext.level}: "${initialContext.question}". How can I guide your mathematical thinking without spoiling the answer?`
        : 'Welcome! I am your Groq AI Mathematics Coach. Ask me to explain any mathematical concept, break down tricky steps, or analyze alternative solution strategies.',
      type: 'explanation',
      modelUsed: 'Groq Llama-3.3-70b / Deterministic Hybrid'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    soundManager.playClick();
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call server-side Groq endpoint
      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          context: initialContext,
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `c_${Date.now()}`,
        sender: 'coach',
        text: data.reply || 'Here is a hint to guide your mathematical thinking.',
        type: data.type || 'hint',
        modelUsed: data.model || 'Groq Llama-3.3-70b',
      };
      setMessages((prev) => [...prev, botMsg]);
      soundManager.playHint();
    } catch {
      // Fallback deterministic coaching when server or Groq key is unavailable
      const fallbackReply = generateDeterministicCoachReply(textToSend, initialContext);
      const botMsg: ChatMessage = {
        id: `c_${Date.now()}`,
        sender: 'coach',
        text: fallbackReply,
        type: 'hint',
        modelUsed: 'Offline Pedagogical Fallback',
      };
      setMessages((prev) => [...prev, botMsg]);
      soundManager.playHint();
    } finally {
      setIsLoading(false);
    }
  };

  const generateDeterministicCoachReply = (
    query: string,
    context?: { question: string; level: number; userAns?: string }
  ): string => {
    const qLower = query.toLowerCase();

    if (qLower.includes('hint') || qLower.includes('help') || qLower.includes('how')) {
      return `💡 **Mathematical Strategy Guidance:**
1. **Identify the Core Invariant:** In Level ${context?.level || 1}, check what stays constant during the operation.
2. **Decomposition:** Break numbers down into friendly benchmarks (e.g. make-10 or common denominators).
3. **Estimation Check:** Before computing, approximate whether the expected answer is greater than or less than the starting numbers.`;
    }

    if (qLower.includes('why') || qLower.includes('explain')) {
      return `🔍 **Conceptual Explanation:**
Rather than simply memorizing rules, visualize the mathematical model:
- For fractions: think of equal shares of a unit whole.
- For algebra: think of a physical two-pan scale where equal operations maintain balance.
- For negative numbers: visualize movement along a continuous number line.`;
    }

    if (context?.userAns) {
      return `🧐 **Misconception Analysis for answer "${context.userAns}":**
When answers differ from expectations, the most common causes are:
- A column regrouping slip (forgetting to carry over 1 ten or borrow).
- Sign inversion (subtracting a negative is adding).
- Misinterpreting order of operations (doing addition before multiplication).
Try re-verifying by substituting your result back into the problem statement!`;
    }

    return `✨ Great mathematical inquiry! Remember to follow the Signature 6-Stage Thinking sequence: Understand the given data, Represent it visually, Strategise an approach, Solve step-by-step, Verify the magnitude, and Generalise the underlying principle.`;
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
          <span className="badge badge-blue">
            <Bot size={13} /> Groq Powered
          </span>
          <span className="badge badge-green">Zero PII • Minor-Safe</span>
        </div>
        <h2 style={{ fontSize: '1.8rem' }}>AI Mathematics Coach</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Ask for conceptual explanations, strategy comparisons, or diagnostic misconception feedback. The coach guides you to understand WHY an answer works without giving away solutions.
        </p>
      </div>

      {/* Suggested Quick Prompts */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => handleSendMessage('Give me a conceptual nudge for this problem.')}
        >
          <Lightbulb size={13} color="#f59e0b" /> Conceptual Nudge
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => handleSendMessage('Show me an alternative solution method.')}
        >
          <Sparkles size={13} color="#38bdf8" /> Alternative Strategy
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => handleSendMessage('Why does this mathematical rule work?')}
        >
          <BookOpen size={13} color="#c084fc" /> Explain The 'Why'
        </button>
      </div>

      {/* Chat Messages Log */}
      <div
        className="glass-panel"
        style={{
          height: '420px',
          overflowY: 'auto',
          padding: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        {messages.map((m) => {
          const isCoach = m.sender === 'coach';
          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                gap: '0.8rem',
                alignItems: 'flex-start',
                flexDirection: isCoach ? 'row' : 'row-reverse',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: isCoach ? 'var(--grad-primary)' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '1rem',
                }}
              >
                {isCoach ? '🤖' : '👤'}
              </div>

              <div
                style={{
                  maxWidth: '80%',
                  padding: '0.85rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isCoach ? 'rgba(255, 255, 255, 0.05)' : 'rgba(99, 102, 241, 0.25)',
                  border: `1px solid ${isCoach ? 'var(--border-subtle)' : 'rgba(99, 102, 241, 0.4)'}`,
                  fontSize: '0.92rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}
              >
                <div>{m.text}</div>
                {m.modelUsed && (
                  <div style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Powered by {m.modelUsed}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <span>🤖 Coach is formulating mathematical reasoning...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <input
          type="text"
          placeholder="Ask a question about this math topic..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'white',
            outline: 'none',
            fontSize: '0.95rem',
          }}
        />
        <button className="btn btn-primary" onClick={() => handleSendMessage()} disabled={isLoading}>
          <Send size={16} /> Send
        </button>
      </div>
    </div>
  );
};
