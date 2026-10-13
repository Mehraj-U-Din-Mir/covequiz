// Groq AI Integration with Zero-PII Policy and Deterministic Fallback

export interface AiCoachRequest {
  prompt: string;
  context?: {
    question?: string;
    level?: number;
    userAns?: string;
  };
}

export interface AiCoachResponse {
  reply: string;
  type: 'hint' | 'explanation' | 'misconception' | 'strategy';
  model: string;
}

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function askAiCoach(req: AiCoachRequest): Promise<AiCoachResponse> {
  if (!GROQ_API_KEY) {
    // Graceful deterministic fallback
    return {
      reply: getDeterministicFallback(req),
      type: 'hint',
      model: 'Deterministic Pedagogical Fallback (Groq API Key Unset)',
    };
  }

  const systemInstruction = `You are the CoveQuiz AI Mathematics Coach, an encouraging and rigorous math tutor aligned with NEP 2020 and NCF-SE 2023 for school levels 1 to 8.
Guide students using conceptual understanding and visual representations.
CRITICAL RULES:
1. NEVER reveal the exact final answer directly if the student is still solving.
2. Give a progressive conceptual nudge or explain WHY an approach works.
3. Diagnose misconceptions if the student entered an incorrect answer.
4. Keep explanations concise, clear, and age-appropriate for school students.
5. Do not ask for or store any student personal identifiable information (PII).`;

  const userContextStr = `Level: ${req.context?.level || 1}
Current Problem: ${req.context?.question || 'General inquiry'}
Student Submitted Answer (if any): ${req.context?.userAns || 'None'}
Student Request: ${req.prompt}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userContextStr },
        ],
        temperature: 0.3,
        max_tokens: 350,
      }),
    });

    clearTimeout(timeoutId);

    if (!resp.ok) {
      throw new Error(`Groq HTTP error ${resp.status}`);
    }

    const data: any = await resp.json();
    const text = data.choices?.[0]?.message?.content || getDeterministicFallback(req);

    return {
      reply: text,
      type: 'explanation',
      model: GROQ_MODEL,
    };
  } catch (err: any) {
    // Deterministic fallback on timeout or error
    return {
      reply: getDeterministicFallback(req),
      type: 'hint',
      model: 'Deterministic Pedagogical Fallback (Network / Timeout)',
    };
  }
}

function getDeterministicFallback(req: AiCoachRequest): string {
  const p = req.prompt.toLowerCase();

  if (p.includes('hint') || p.includes('nudge')) {
    return `💡 **Mathematical Hint:**
- Examine the units and place values closely.
- Try breaking down the operation into smaller friendly numbers.
- Check if you can visualize this on a number line or array model before calculating.`;
  }

  if (p.includes('misconception') || req.context?.userAns) {
    return `🧐 **Misconception Diagnostic:**
If your answer "${req.context?.userAns || ''}" didn't match, verify:
1. Did a carry-over or regrouping step get dropped?
2. Did you apply the correct operational precedence?
3. Check using an inverse operation: work backward from your answer.`;
  }

  return `✨ **Mathematical Strategy Guidance:**
Follow the Signature Thinking Framework:
1. Identify known quantities and the unknown target.
2. Formulate a representation (diagram, bar model, or equation).
3. Choose the most direct calculation pathway.
4. Verify by checking magnitude and reasonable bounds.`;
}
