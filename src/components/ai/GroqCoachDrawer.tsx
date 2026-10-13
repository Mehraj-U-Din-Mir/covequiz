import React, { useState, useEffect } from 'react';
import { soundManager } from '../../audio/soundEffects';
import {
  Bot,
  Sparkles,
  Send,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Key,
  Settings,
  ShieldCheck,
  Check,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

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

const SYSTEM_INSTRUCTION = `You are the CoveQuiz AI Mathematics Coach, an encouraging and rigorous math tutor aligned with NEP 2020 and NCF-SE 2023 for school levels 1 to 8.
Guide students using conceptual understanding, friendly benchmark numbers, and visual representations.
CRITICAL PEDAGOGICAL RULES:
1. NEVER reveal the exact final answer directly if the student is still solving.
2. Give a progressive conceptual nudge or explain WHY an approach works.
3. Diagnose misconceptions if the student entered an incorrect answer.
4. Keep explanations concise, clear, and age-appropriate for school students.
5. Emphasize the Signature 6-Stage Thinking sequence: Understand -> Represent -> Strategise -> Solve -> Verify -> Generalise.
6. Do not ask for or store any student personal identifiable information (PII).`;

export const GroqCoachDrawer: React.FC<GroqCoachDrawerProps> = ({ initialContext }) => {
  // Retrieve API Key from localStorage or Vite environment variable
  const [apiKey, setApiKey] = useState<string>(() => {
    return (
      localStorage.getItem('covequiz_groq_api_key') ||
      (import.meta.env.VITE_GROQ_API_KEY as string) ||
      ''
    );
  });

  const [groqModel, setGroqModel] = useState<string>(() => {
    return (
      localStorage.getItem('covequiz_groq_model') ||
      (import.meta.env.VITE_GROQ_MODEL as string) ||
      'llama-3.3-70b-versatile'
    );
  });

  const [isKeySettingsOpen, setIsKeySettingsOpen] = useState<boolean>(false);
  const [tempApiKey, setTempApiKey] = useState<string>(apiKey);
  const [keySavedToast, setKeySavedToast] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'coach',
      text: initialContext?.question
        ? `Hello! I see you are exploring Level ${initialContext.level}: "${initialContext.question}". How can I guide your mathematical thinking without spoiling the answer?`
        : 'Welcome! I am your AI Mathematics Coach. Ask me to explain any mathematical concept, break down tricky calculation steps, or explore alternative solution strategies.',
      type: 'explanation',
      modelUsed: apiKey ? `Groq ${groqModel} (Connected)` : 'Intelligent Pedagogical Engine',
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSaveApiKey = () => {
    const trimmed = tempApiKey.trim();
    setApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem('covequiz_groq_api_key', trimmed);
    } else {
      localStorage.removeItem('covequiz_groq_api_key');
    }
    localStorage.setItem('covequiz_groq_model', groqModel);
    setKeySavedToast(true);
    setTimeout(() => setKeySavedToast(false), 2500);
    setIsKeySettingsOpen(false);
    soundManager.playCorrect();
  };

  const handleClearApiKey = () => {
    setTempApiKey('');
    setApiKey('');
    localStorage.removeItem('covequiz_groq_api_key');
    soundManager.playClick();
  };

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

    const activeKey = apiKey.trim() || (import.meta.env.VITE_GROQ_API_KEY as string)?.trim() || '';

    // Option 1: Direct Client-Side Groq Call if API key is provided
    if (activeKey) {
      try {
        const userContextPrompt = `Curriculum Level: ${initialContext?.level || 1}
Current Problem Statement: ${initialContext?.question || 'General Inquiry'}
Student Answer Submitted: ${initialContext?.userAns || 'None yet'}
Student Question/Request: ${textToSend}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeKey}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: groqModel || 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: SYSTEM_INSTRUCTION },
              { role: 'user', content: userContextPrompt },
            ],
            temperature: 0.3,
            max_tokens: 500,
          }),
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.error?.message || `HTTP ${response.status} from Groq`;
          throw new Error(errMsg);
        }

        const data = await response.json();
        const botReply = data.choices?.[0]?.message?.content;

        if (botReply) {
          const botMsg: ChatMessage = {
            id: `c_${Date.now()}`,
            sender: 'coach',
            text: botReply,
            type: 'explanation',
            modelUsed: `Groq ${groqModel} (Live AI)`,
          };
          setMessages((prev) => [...prev, botMsg]);
          soundManager.playHint();
          setIsLoading(false);
          return;
        }
      } catch (err: any) {
        console.warn('Direct Groq API call error:', err);
        // If error specifically unauthorized or invalid key, notify user
        if (String(err?.message || '').toLowerCase().includes('api key') || String(err?.message || '').includes('401')) {
          const botMsg: ChatMessage = {
            id: `c_${Date.now()}`,
            sender: 'coach',
            text: `⚠️ **Groq API Key Error:** ${err.message || 'Invalid API Key'}.\n\nPlease click **⚙️ Configure Groq Key** above to update your key, or get a free key at [console.groq.com](https://console.groq.com/keys).`,
            type: 'misconception',
            modelUsed: 'Groq Auth Alert',
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsLoading(false);
          return;
        }
      }
    }

    // Option 2: Server-side proxy call if Express backend is running
    try {
      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          context: initialContext,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          const botMsg: ChatMessage = {
            id: `c_${Date.now()}`,
            sender: 'coach',
            text: data.reply,
            type: data.type || 'hint',
            modelUsed: data.model || 'Server Groq Proxy',
          };
          setMessages((prev) => [...prev, botMsg]);
          soundManager.playHint();
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Backend server is offline or on GitHub Pages (expected for static builds)
    }

    // Option 3: Intelligent Mathematical Pedagogical Engine (Dynamic, progressive math reasoning)
    const intelligentReply = generateIntelligentPedagogicalReply(textToSend, initialContext);
    const botMsg: ChatMessage = {
      id: `c_${Date.now()}`,
      sender: 'coach',
      text: intelligentReply,
      type: 'hint',
      modelUsed: 'Intelligent Pedagogical Engine (Offline)',
    };
    setMessages((prev) => [...prev, botMsg]);
    soundManager.playHint();
    setIsLoading(false);
  };

  /**
   * Dynamic Mathematical Pedagogical Engine
   * Provides real mathematical reasoning, step-by-step breakdowns, and conceptual explanations.
   */
  const generateIntelligentPedagogicalReply = (
    query: string,
    context?: { question: string; level: number; userAns?: string }
  ): string => {
    const qLower = query.toLowerCase();
    const problemText = context?.question || '';

    // Extract any math numbers from the problem or query
    const numbersInProblem = problemText.match(/\d+/g)?.map(Number) || [];
    const numbersInQuery = query.match(/\d+/g)?.map(Number) || [];

    // Case 1: Inquiry about a specific calculation (e.g. 18 + 22 + 36)
    if (problemText && (qLower.includes('how') || qLower.includes('solve') || qLower.includes('hint') || qLower.includes('nudge') || qLower.includes('help'))) {
      if (problemText.includes('+') && numbersInProblem.length >= 3) {
        // Multi-number addition breakdown
        const [a, b, c] = numbersInProblem;
        const pairSum = a + b;
        return `💡 **Step-by-Step Mathematical Guidance:**

Let's apply the **Signature 6-Stage Thinking sequence** to "${problemText}":

1. **Understand:** You have three values to combine: **${a}**, **${b}**, and **${c}**.
2. **Represent & Strategise:** Spot friendly benchmark numbers!
   - Look at **${a}** and **${b}**: notice how ${(a % 10)} + ${(b % 10)} = ${(a % 10) + (b % 10)} (a friendly multiple of ten).
   - ${a} + ${b} = **${pairSum}**.
3. **Solve Next Step:** Now combine the friendly sum (**${pairSum}**) with the remaining number (**${c}**):
   - ${pairSum} + ${c} = **${pairSum + c}**.
4. **Verify:** Does ${pairSum + c} make sense? Check in reverse: ${pairSum + c} - ${c} = ${pairSum}!

Try this strategy on your option tiles!`;
      }

      if (problemText.includes('-') && numbersInProblem.length >= 2) {
        const [a, b, c] = numbersInProblem;
        return `💡 **Subtraction Strategy Guidance for "${problemText}":**

1. **Decomposition:** Take away the tens first, then the ones units.
2. **Benchmark Counting:**
   - First step: ${a} - ${b} = **${a - b}**.
   ${c !== undefined ? `- Second step: Take away the third term: ${a - b} - ${c} = **${a - b - c}**.` : ''}
3. **Verification Check:** Add your final answer back to the subtracted parts to verify you reach ${a}!`;
      }

      if (problemText.includes('×') || problemText.includes('*')) {
        return `💡 **Multiplication Priority (BODMAS) Guidance:**

1. **Order of Operations:** In mathematical expressions, **multiplication takes priority over addition and subtraction**.
2. **Grouping:** Solve the multiplication terms first into a single quantity.
3. **Combination:** Add or subtract the remaining terms from left to right.`;
      }

      return `💡 **Mathematical Clue for Level ${context?.level || 1}:**
- **Problem Statement:** "${problemText}"
- **Key Strategy:** Identify what stays constant and break the numbers into friendly chunks (multiples of 5 or 10).
- **Estimation Check:** Approximate the total magnitude first before calculating the exact unit digit.`;
    }

    // Case 2: Conceptual inquiry about "Why" or rules
    if (qLower.includes('why') || qLower.includes('rule') || qLower.includes('explain') || qLower.includes('concept')) {
      if (qLower.includes('fraction') || problemText.toLowerCase().includes('fraction') || problemText.includes('/')) {
        return `🔍 **Conceptual Explanation: Fractions as Unit Shares**

- **Denominator (bottom number):** Tells you how many *equal parts* the whole unit has been partitioned into.
- **Numerator (top number):** Tells you how many of those equal shares are currently selected.
- **Why like denominators matter in addition:** You cannot combine slices of different sizes directly (e.g. halves and thirds) without converting them to equal-sized common pieces!`;
      }

      if (qLower.includes('bodmas') || qLower.includes('pemdas') || qLower.includes('order')) {
        return `🔍 **Why BODMAS / Order of Operations Exists:**

Without a strict convention, an expression like \`2 + 3 × 4\` could equal 20 (if left-to-right) or 14 (if multiplication first).
- **Multiplication is repeated addition:** \`3 × 4\` represents \`4 + 4 + 4\`.
- Therefore \`2 + (3 × 4)\` = \`2 + 4 + 4 + 4 = 14\`.
- Brackets **( )** allow us to override this hierarchy whenever we want addition performed first!`;
      }

      return `🔍 **Conceptual Math Insight:**
Rather than memorizing abstract formulas, mathematicians visualize concrete models:
- **Addition/Subtraction:** Leaps forward and backward along a continuous number line.
- **Multiplication:** Rectangular area arrays (rows × columns).
- **Division:** Fair sharing into equal groups or finding how many groups fit inside a total.`;
    }

    // Case 3: Inquiry about alternative strategies
    if (qLower.includes('alternative') || qLower.includes('another way') || qLower.includes('strategy') || qLower.includes('method')) {
      return `✨ **Alternative Mathematical Strategies:**

1. **Compensation Method:** If adding 38, add 40 first, then compensate by subtracting 2.
2. **Doubles and Near-Doubles:** Use known facts like 25 + 25 = 50, so 25 + 26 = 51.
3. **Partitioning by Place Value:** Split \`45 + 32\` into \`(40 + 30) + (5 + 2) = 70 + 7 = 77\`.
4. **Number Line Hops:** Hop to the nearest benchmark ten, then hop the remaining distance.`;
    }

    // Case 4: Misconception diagnostic if student entered an incorrect answer
    if (context?.userAns) {
      return `🧐 **Diagnostic Misconception Analysis for answer "${context.userAns}":**

Let's diagnose where the calculation might have drifted:
1. **Regrouping / Carrying:** Did a tens digit slip during column addition?
2. **Order of Operations:** Did addition occur before multiplication?
3. **Friendly Digit Pairing:** Double check the ones column sum.

*Verification Tip:* Try substituting your answer into the equation and compute in reverse!`;
    }

    // Case 5: Direct arithmetic in user query (e.g., student typed "what is 25 * 4")
    if (numbersInQuery.length >= 2) {
      return `🧮 **Mathematical Breakdown for your query:**

1. **Breakdown:** Let's look at the numbers [${numbersInQuery.join(', ')}].
2. **Decomposition:** Split the larger numbers into friendly parts (e.g., tens and ones).
3. **Verification:** Try mental estimation first to confirm the sensible range of your result!`;
    }

    // Default engaging response
    return `👋 **Hello! I'm your AI Mathematics Coach.**

I'm ready to help you master mathematics through conceptual understanding:
- Ask me: *"How do I break down ${problemText ? `"${problemText}"` : 'this calculation'}?"*
- Ask me: *"Show me an alternative strategy to solve this."*
- Ask me: *"Why does the BODMAS order of operations work?"*

*(Tip: Click **⚙️ Configure Groq Key** at the top to connect your live Groq Llama-3.3-70b model!)*`;
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Header with Title and AI Model Status */}
      <div style={{ marginBottom: '1.1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`badge ${apiKey ? 'badge-blue' : 'badge-amber'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Bot size={13} />
              {apiKey ? `Groq ${groqModel} • Connected` : 'AI Coach • Dynamic Engine'}
            </span>
            <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={12} /> Zero PII • Minor-Safe
            </span>
          </div>

          <button
            className={`btn btn-sm ${apiKey ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setIsKeySettingsOpen(!isKeySettingsOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}
          >
            <Settings size={13} />
            {apiKey ? 'Groq Key Settings' : '⚙️ Configure Groq Key'}
          </button>
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
          AI Mathematics Coach
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
          Ask for conceptual explanations, step-by-step reasoning, or diagnostic misconception feedback. The coach guides you to understand WHY an answer works without giving away solutions.
        </p>
      </div>

      {/* Groq API Key Configuration Panel */}
      {isKeySettingsOpen && (
        <div
          className="glass-panel"
          style={{
            padding: '1.1rem',
            marginBottom: '1rem',
            background: 'linear-gradient(145deg, rgba(22, 34, 58, 0.95) 0%, rgba(12, 19, 36, 0.98) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <Key size={16} color="#38bdf8" />
            <strong style={{ fontSize: '0.95rem', color: '#38bdf8' }}>Groq AI Model & API Key Configuration</strong>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
            Enter your free Groq API Key (starts with <code>gsk_...</code>). It is stored securely in your browser's local storage and used directly for real-time mathematical reasoning.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                GROQ API KEY
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="password"
                  placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                  }}
                />
                <button className="btn btn-primary btn-sm" onClick={handleSaveApiKey}>
                  <Check size={14} /> Save & Connect
                </button>
                {apiKey && (
                  <button className="btn btn-secondary btn-sm" onClick={handleClearApiKey} title="Remove API Key">
                    <RotateCcw size={14} /> Clear
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>MODEL:</label>
                <select
                  value={groqModel}
                  onChange={(e) => setGroqModel(e.target.value)}
                  style={{
                    padding: '0.35rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    fontSize: '0.8rem',
                  }}
                >
                  <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended)</option>
                  <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Fastest)</option>
                  <option value="llama3-70b-8192">llama3-70b-8192</option>
                  <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
                </select>
              </div>

              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.78rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
              >
                <span>Get Free Key at Groq Console</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}

      {keySavedToast && (
        <div style={{ padding: '0.5rem 0.85rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: 'var(--radius-sm)', color: '#34d399', fontSize: '0.82rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={15} /> Groq API Key saved successfully! AI Coach is now live with real-time reasoning.
        </div>
      )}

      {/* Suggested Quick Prompts */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => handleSendMessage('Give me a step-by-step conceptual nudge for this problem.')}
        >
          <Lightbulb size={13} color="#f59e0b" /> Step-by-Step Nudge
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => handleSendMessage('Show me an alternative solution strategy for this calculation.')}
        >
          <Sparkles size={13} color="#38bdf8" /> Alternative Strategy
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => handleSendMessage('Why does this mathematical rule or formula work?')}
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
                  maxWidth: '82%',
                  padding: '0.85rem 1.15rem',
                  borderRadius: 'var(--radius-md)',
                  background: isCoach ? 'rgba(255, 255, 255, 0.05)' : 'rgba(99, 102, 241, 0.25)',
                  border: `1px solid ${isCoach ? 'var(--border-subtle)' : 'rgba(99, 102, 241, 0.4)'}`,
                  fontSize: '0.92rem',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                }}
              >
                <div>{m.text}</div>
                {m.modelUsed && (
                  <div style={{ marginTop: '0.45rem', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Sparkles size={11} color="#38bdf8" />
                    <span>{m.modelUsed}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: '#38bdf8', fontSize: '0.88rem' }}>
            <span>🤖 AI Coach is formulating mathematical reasoning...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <input
          type="text"
          placeholder="Ask a question about this math problem..."
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
