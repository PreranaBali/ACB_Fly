"use client";
import React, { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string; id: string };

// Accent tokens
const ORANGE_TXT = "text-orange-400";
const ORANGE_BORDER = "border-orange-500/30";
const ORANGE_BG = "bg-orange-500/15";

// Site facts (used in About Website mode)
const SITE_FACTS = `
Brand: Results Education
Primary tagline (hero):
- "Empower your" / "Dreams with" / "Results Education"
Primary CTA: "Get Started"
Core value: Affordable, innovative, and revolutionary learning solutions that bring success within reach.

Explore categories:
- ₿ Blockchain • Explore
- </> Coding • Explore
- AI • Explore
- ML • Machine Learning • Explore
- ☁ Cloud • Explore
- DB • Data • Explore

Pillars:
- Affordable Excellence: High-quality courses priced under ₹9,999/-
- Innovative Learning: Holographic teaching technology for immersive experiences
- Comprehensive Coverage: engineering, medical, law, postgraduate, and government exams
- Flexible Platforms: offline and online learning environments

Promise:
- **Guaranteed Success** for Every Student: 100% placement assurance with industry-relevant programs and strong partner network.

Team:
- Ashwin kumar — Managing director and founder

Media placeholders:
- pic1..pic12 (placeholders for images, not content)

Special rule (easter egg):
- If the user asks "who made this website" (or close variation), reply exactly: "Prerana created this website!!".
`;

const DEFAULT_GREETING =
  "Hi! I’m your Results Education assistant. Ask about our programs, pricing, or how to get started. You can also switch to Tutor, Coach, or Quiz modes.";

const STARTERS_ABOUT = [
  "What is Results Education?",
  "Do you really guarantee 100% placement?",
  "Show me the learning tracks",
  "How do I get started?",
];

const STARTERS_GENERIC = [
  "Explain gravity like I’m 12",
  "Summarize the water cycle",
  "Create a 5-question quiz on basic algebra",
  "Show an example problem about photosynthesis",
  "Explain the causes of World War II in simple words",
  "Explain JavaScript promises in a beginner-friendly way"
];


const GROQ_MODELS = [
  { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B (fast)" },
  { id: "llama-3.1-70b-versatile", label: "Llama 3.1 70B (better)" },
  { id: "mixtral-8x7b-32768", label: "Mixtral 8x7B" },
];

// Env key (client-side build-time injection). For Next.js client components, use NEXT_PUBLIC_GROQ_API_KEY.
const GROQ_KEY =
  (import.meta.env.VITE_GROQ_API_KEY as string | undefined);

type Mode = "About Website" | "Tutor" | "Coach" | "Quiz";

function systemPromptFor(mode: Mode) {
  if (mode === "About Website") {
    return `
You are the official assistant for Results Education.
Use ONLY the facts below to answer questions about the website, programs, promises, and team.
Be friendly, concise, and structure with light bullets or short paragraphs. Emphasize the CTA "Get Started" when appropriate.

Rules:
- If details aren't in the facts, say: "More details are coming soon."
- Keep it accurate and upbeat; avoid fabricating specifics.
- Always render Markdown (bold, lists, and code fences).
- When referencing "Guaranteed Success", format it exactly as **Guaranteed Success**.
- If asked "who made this website", reply exactly: "Prerana Bali is the creator of me".

### Facts
${SITE_FACTS}
`;
  }

  const base =
    "You are a helpful course assistant. Be concise, friendly, and use light Markdown (bold, lists, code) for structure.";
  const map = {
    Tutor:
      "Act as a patient tutor. Explain step by step, check understanding briefly, and avoid overwhelming detail.",
    Coach:
      "Act as a supportive coach. Ask guiding questions and encourage reflection. Keep answers brief and motivating.",
    Quiz:
      "Act as a quizmaster. Ask one question at a time. After the learner answers, evaluate briefly and ask the next question.",
  };
  return `${base}\n${map[mode as Exclude<Mode, "About Website">]}`;
}

// Minimal Markdown to HTML (bold, inline code, code fences). Escapes HTML first.
function mdToHtml(src: string): string {
  // escape HTML
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const placeholders: string[] = [];
  let text = esc(src);

  // Code fences first -> placeholders
  text = text.replace(/```([\s\S]*?)```/g, (_m, code) => {
    const html =
      `<pre class="bg-black/50 border border-white/10 rounded-lg p-3 overflow-x-auto text-[12px] leading-relaxed"><code>` +
      code +
      `</code></pre>`;
    const token = `__CODEBLOCK_${placeholders.length}__`;
    placeholders.push(html);
    return token;
  });

  // Inline code -> placeholders
  text = text.replace(/`([^`\n]+)`/g, (_m, code) => {
    const html = `<code class="bg-white/10 rounded px-1 py-0.5 text-[12px]">${code}</code>`;
    const token = `__CODEINLINE_${placeholders.length}__`;
    placeholders.push(html);
    return token;
  });

  // Bold
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Restore placeholders
  placeholders.forEach((html, i) => {
    const token = new RegExp(`__CODE(?:BLOCK|INLINE)_${i}__`, "g");
    text = text.replace(token, html);
  });

  return text;
}

export default function ResultsEduChat() {
  // Non-persistent messages (clears on refresh)
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: DEFAULT_GREETING, id: crypto.randomUUID() },
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("About Website");
  const [model, setModel] = useState<string>(GROQ_MODELS[0].id);
  const [isLoading, setIsLoading] = useState(false);

  // TTS controls
  const [ttsOn, setTtsOn] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Typewriter effect
  const [isTypingOut, setIsTypingOut] = useState(false);
  const typeTimerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isTypingOut]);

  // Speak last assistant message (if TTS enabled)
  useEffect(() => {
    if (!ttsOn) return;
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last) return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(last.content.replace(/[#*_`>]/g, ""));
    utter.rate = 1.05;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    synth.speak(utter);
  }, [messages, ttsOn]);

  const stopVoice = () => {
    const synth = window.speechSynthesis;
    if (synth) synth.cancel();
    setIsSpeaking(false);
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: DEFAULT_GREETING, id: crypto.randomUUID() }]);
  };

  const stopGeneration = () => {
    abortRef.current?.abort();
    if (typeTimerRef.current) {
      window.clearInterval(typeTimerRef.current);
      typeTimerRef.current = null;
    }
    setIsTypingOut(false);
    setIsLoading(false);
  };

  // Easter egg shortcut: answer locally without API call
  function handleEasterEgg(content: string): string | null {
    const c = content.toLowerCase();
    const triggers = [
      "who made this website",
      "who built this website",
      "who created this website",
      "who made this site",
      "who built this site",
      "who created this site",
    ];
    if (triggers.some((t) => c.includes(t))) {
      return "Prerana Bali is the creator of me";
    }
    return null;
  }

  async function callGroqChat(userMsg: Msg, history: Msg[], signal: AbortSignal) {
    if (!GROQ_KEY) {
      throw new Error(
        "Missing GROQ_API_KEY. Add GROQ_API_KEY (or NEXT_PUBLIC_GROQ_API_KEY for Next.js client) to .env and rebuild."
      );
    }

    const payload = {
      model,
      temperature: 0.5,
      max_tokens: 800,
      stream: false,
      messages: [
        { role: "system", content: systemPromptFor(mode) },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: userMsg.content },
      ],
    };

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify(payload),
      signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Groq error: ${res.status}`);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || "Sorry, I couldn't generate a response.";
  }

  const typeOut = (fullText: string, onUpdate: (text: string) => void, speed = 10) =>
    new Promise<void>((resolve) => {
      setIsTypingOut(true);
      let i = 0;
      if (typeTimerRef.current) window.clearInterval(typeTimerRef.current);
      typeTimerRef.current = window.setInterval(() => {
        i++;
        onUpdate(fullText.slice(0, i));
        if (i >= fullText.length) {
          if (typeTimerRef.current) window.clearInterval(typeTimerRef.current);
          typeTimerRef.current = null;
          setIsTypingOut(false);
          resolve();
        }
      }, speed);
    });

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Cancel any in-flight work and voice
    stopGeneration();
    stopVoice();

    // Easter egg check
    const easterAnswer = handleEasterEgg(content);
    const userMsg: Msg = { role: "user", content: content.trim(), id: crypto.randomUUID() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (easterAnswer) {
      const botMsg: Msg = { role: "assistant", content: easterAnswer, id: crypto.randomUUID() };
      setMessages((prev) => [...prev, botMsg]);
      return;
    }

    setIsLoading(true);
    try {
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;
      const replyText = await callGroqChat(userMsg, messages, signal);

      // Add placeholder assistant message, then type it out
      const botId = crypto.randomUUID();
      setMessages((prev) => [...prev, { role: "assistant", content: "", id: botId }]);

      await typeOut(
        replyText,
        (partial) => {
          setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, content: partial } : m)));
        },
        10
      );
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            e?.message?.includes("GROQ_API_KEY")
              ? "Environment key missing. Add GROQ_API_KEY (or NEXT_PUBLIC_GROQ_API_KEY for Next.js) to your .env and rebuild."
              : "I hit a snag reaching the AI. If you see CORS errors in the console, a simple local proxy may be needed.",
          id: crypto.randomUUID(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const glow = isLoading || isTypingOut ? "shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)]" : "";

  const starters = mode === "About Website" ? STARTERS_ABOUT : STARTERS_GENERIC;

  return (
    // Space for navbar
    <div className="bg-[#05070c] text-slate-200 pt-24 h-screen">
      <div className="mx-auto  px-4 pb-6">
        {/* Layout: fixed-width left on desktop, stacked on mobile */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Robot panel (fixed size on desktop) */}
          <div
            className={`w-full lg:w-[480px] shrink-0 rounded-2xl border ${ORANGE_BORDER} overflow-hidden relative ${glow}`}
          >
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.07),transparent_60%)]" />
            {/* Fixed heights */}
            <div className="h-[360px] sm:h-[420px] lg:h-[600px] relative">
              <iframe
                src="https://my.spline.design/superkidrobotcopy-fcsbjadb1HEIELz9cV31szos/"
                frameBorder="0"
                width="100%"
                height="100%"
                className="block"
                title="Robot 3D"
                aria-label="3D robot"
              />
              {/* Status pill */}
              <div className="absolute top-3 left-3 flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-white/10 bg-black/30 backdrop-blur">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    isLoading || isTypingOut ? "bg-orange-400 animate-pulse" : "bg-emerald-400"
                  }`}
                />
                <span className="text-white/80">{isLoading || isTypingOut ? "Thinking..." : "Ready"}</span>
              </div>
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-orange-400/5" />
            </div>
          </div>

          {/* Chat panel (fixed height with scrollable messages) */}
          <div className="flex-1 flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${ORANGE_TXT}`}>Results Education Assistant</span>
                <span className="text-xs text-white/50">• {mode}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as Mode)}
                  className={`text-xs rounded-lg bg-black/40 border ${ORANGE_BORDER} px-2.5 py-1.5 focus:outline-none`}
                  title="Mode"
                >
                  <option>About Website</option>
                  <option>Tutor</option>
                  <option>Coach</option>
                  <option>Quiz</option>
                </select>

                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="text-xs rounded-lg bg-black/40 border border-white/10 px-2.5 py-1.5 focus:outline-none"
                  title="Model"
                >
                  {GROQ_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>

                {/* TTS toggle */}
                <button
                  onClick={() => setTtsOn(!ttsOn)}
                  className={`text-xs rounded-lg px-2.5 py-1.5 border ${ORANGE_BORDER} ${
                    ttsOn ? ORANGE_BG : "bg-black/30"
                  }`}
                  title="Toggle text-to-speech"
                >
                  🔊 TTS
                </button>

                {/* Stop Voice button */}
                <button
                  onClick={stopVoice}
                  className="text-xs rounded-lg px-2.5 py-1.5 border border-white/10 bg-black/30 disabled:opacity-50"
                  title="Stop speaking"
                  disabled={!isSpeaking}
                >
                  ⏹ Stop Voice
                </button>

                {/* Reset / Stop generation */}
                <button
                  onClick={clearChat}
                  className="text-xs rounded-lg px-2.5 py-1.5 border border-white/10 bg-black/30"
                  title="Clear chat"
                >
                  ♻️ Reset
                </button>
                {(isLoading || isTypingOut) && (
                  <button
                    onClick={stopGeneration}
                    className="text-xs rounded-lg px-2.5 py-1.5 border border-white/10 bg-red-500/20 text-red-200"
                    title="Stop generating"
                  >
                    ⏹ Stop
                  </button>
                )}
              </div>
            </div>

            {/* Always-visible sample questions */}
            <div className="px-3 sm:px-4 py-2 border-b border-white/10 bg-black/20 sticky top-0 z-10">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
    {starters.map((s) => (
      <button
        key={s}
        onClick={() => sendMessage(s)}
        className={`text-xs rounded-full px-3 py-1.5 border ${ORANGE_BORDER} ${ORANGE_BG} hover:bg-orange-500/25 transition`}
      >
        {s}
      </button>
    ))}
  </div>
</div>


            {/* Messages (scrollable area) */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className="flex">
                  <div
                    className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "ml-auto bg-white/10 border border-white/10"
                        : `mr-auto bg-black/30 border ${ORANGE_BORDER}`
                    }`}
                    dangerouslySetInnerHTML={{ __html: mdToHtml(m.content) }}
                  />
                </div>
              ))}
              {(isLoading || isTypingOut) && (
                <div className="flex">
                  <div className={`mr-auto rounded-2xl px-4 py-3 bg-black/30 border ${ORANGE_BORDER}`}>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                      <span>Typing…</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Composer */}
            <div className="p-3 sm:p-4 border-t border-white/10">
              <div
                className={`rounded-2xl border ${ORANGE_BORDER} bg-black/40 focus-within:ring-1 focus-within:ring-orange-500/40`}
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={
                    mode === "About Website"
                      ? "Ask about Results Education (programs, pricing, **Guaranteed Success**, team)... Shift+Enter = new line"
                      : "Ask the robot about your course. Shift+Enter = new line"
                  }
                  rows={2}
                  className="w-full bg-transparent resize-none outline-none px-4 pt-3 pb-2 text-sm"
                />
                <div className="flex items-center justify-between px-3 pb-2">
                  <div className="text-[11px] text-white/50">
                    Press Enter to send • Mode: <span className={ORANGE_TXT}>{mode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={isLoading || isTypingOut || !input.trim()}
                      onClick={() => sendMessage(input)}
                      className={`text-sm rounded-xl px-3 py-1.5 font-medium border ${ORANGE_BORDER} ${ORANGE_BG} hover:bg-orange-500/25 disabled:opacity-50`}
                    >
                      ➤ Send
                    </button>
                  </div>
                </div>
              </div>
              {!GROQ_KEY && (
                <div className="pt-2 text-xs text-red-300/80">
                  GROQ_API_KEY is not set. Add GROQ_API_KEY (or NEXT_PUBLIC_GROQ_API_KEY for Next.js client) to your .env and rebuild.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}