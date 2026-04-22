import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const WELCOME_MESSAGE = {
  role: "assistant",
  content: `Hello! I'm **StuG Bot** 🤖

Your AI study assistant for Educircle!

I can help you with:
- 📚 Understanding concepts with clear explanations
- 📝 Step-by-step problem solving
- 🧮 Math formulas and equations (properly formatted!)
- 💡 Study tips and learning strategies

How can I help you today?`
};

export default function StuGBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isResponding, setIsResponding] = useState(false);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message to OpenRouter API
  const sendMessage = async (content) => {
    if (!content.trim() || isResponding) return;

    const userMessage = { role: "user", content };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsResponding(true);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": import.meta.env.VITE_SITE_URL || "http://localhost:5173",
          "X-Title": import.meta.env.VITE_SITE_NAME || "Educircle"
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            {
              role: "system",
              content: `You are STUG-Bot, a friendly AI study assistant for Educircle.

**HOW TO RESPOND - READ CAREFULLY:**

### 🟢 For Greetings & Casual Chat:
When users say: "hi", "hello", "hey", "good morning", introduce themselves, say thanks, or casual messages:
- Respond warmly, briefly, and naturally
- If they share their name, acknowledge it: "Hi [Name]! 👋"
- Ask how you can help with their studies
- Keep it conversational (1-2 sentences)
- Examples:
  • User: "hi" → You: "Hi! 👋 How can I help you with your studies today?"
  • User: "hello, I'm Rajesh" → You: "Hi Rajesh! 👋 Great to meet you! What would you like to learn about?"
  • User: "thanks" → You: "You're welcome! 😊 Feel free to ask anytime!"
  • User: "hey there" → You: "Hey! 👋 What's on your mind today?"

### 🔵 For Study/Academic Questions:
When users ask about concepts, formulas, explanations, or topics:
- Provide clear, thorough, structured explanations
- Use paragraphs (3-5 sentences each), NOT line-by-line
- Use **bold** for key terms and important concepts
- Use headings (## for main, ### for sub) to organize longer responses
- Use bullet points for lists
- For formulas/equations, use code blocks with math language:
  \`\`\`math
  F = ma
  \`\`\`
- For inline math, use: \`$E = mc^2$\`
- Include practical examples when helpful
- Be encouraging and educational

### 🔴 What NOT to Do:
- Don't give structured explanations for simple greetings
- Don't force headings/formulas on casual messages
- Don't be robotic - match the user's tone
- Don't over-explain when a brief response is needed

**REMEMBER:** Read the user's message first. If it's casual → respond casually. If it's academic → respond with structure.

**TEST YOUR RESPONSE:**
Before sending, ask: "Is the user asking for a concept explanation, or just saying hi?" Then respond accordingly.`
            },
            ...messages,
            userMessage
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data?.choices?.[0]?.message?.content || "⚠️ No response from AI.";
      
      setMessages(prev => [...prev, { role: "assistant", content: aiContent }]);

    } catch (error) {
      console.error("StuGBot Error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `⚠️ Error: ${error.message}` 
      }]);
    } finally {
      setIsResponding(false);
    }
  };

  const handleSend = () => {
    if (input.trim() && !isResponding) {
      sendMessage(input);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const displayMessages = messages.length === 0 ? [WELCOME_MESSAGE] : messages;

  return (
    <>
      {/* ========== Floating Button - VERTICALLY CENTERED ON RIGHT SIDE ========== */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 right-6 -translate-y-1/2 w-14 h-14 rounded-full shadow-lg 
          hover:shadow-xl transition-all duration-300 z-50 flex items-center 
          justify-center overflow-hidden ${
          isOpen 
            ? "bg-gray-700 hover:bg-gray-800" 
            : "bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-110"
        }`}
        title={isOpen ? "Close Chat" : "Open StuG Bot"}
      >
        {isOpen ? (
          /* Close Icon */
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          /* Logo with SVG Fallback */
          <>
            <img 
              src="/stugbot-logo.png" 
              alt="StuG Bot" 
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback Robot SVG Icon */}
            <svg 
              className="w-8 h-8 text-white hidden" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ display: 'none' }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
              <circle cx="9" cy="9" r="1" fill="currentColor"/>
              <circle cx="15" cy="9" r="1" fill="currentColor"/>
              <path strokeLinecap="round" d="M10 13h4"/>
            </svg>
          </>
        )}
      </button>

      {/* ========== Chat Panel - Also Anchored to Right Side ========== */}
      {isOpen && (
        <div className="fixed top-1/2 right-6 -translate-y-1/2 w-96 h-[600px] bg-white rounded-2xl 
          shadow-2xl z-50 flex flex-col border border-gray-200 overflow-hidden
          animate-slide-up">
          
          {/* Header with Logo */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Logo in Header */}
              <img 
                src="/stugbot-logo.png" 
                alt="StuG Bot" 
                className="w-10 h-10 object-contain bg-white/20 rounded-full p-1.5"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback Robot SVG Icon */}
              <svg 
                className="w-8 h-8 text-white hidden" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ display: 'none' }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
                <circle cx="9" cy="9" r="1" fill="currentColor"/>
                <circle cx="15" cy="9" r="1" fill="currentColor"/>
                <path strokeLinecap="round" d="M10 13h4"/>
              </svg>
              
              <div>
                <h3 className="font-bold text-lg">StuG Bot</h3>
                <p className="text-xs text-blue-100">AI Study Assistant</p>
              </div>
            </div>
            <button
              onClick={() => { setMessages([]); setIsOpen(false); }}
              className="p-2 hover:bg-white/20 rounded-lg transition"
              title="Close Chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {displayMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                  msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-br-sm" 
                    : "bg-gray-100 text-gray-900 rounded-bl-sm border border-gray-200"
                }`}>
                  <div className="prose prose-sm max-w-none prose-p:my-2 prose-headings:mt-3 prose-headings:mb-2">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm, remarkMath]} 
                      rehypePlugins={[rehypeHighlight, rehypeKatex]}
                      components={{
                        p: ({children}) => <p className="mb-3 leading-relaxed">{children}</p>,
                        h1: ({children}) => <h1 className="text-xl font-bold mb-3 mt-4">{children}</h1>,
                        h2: ({children}) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
                        h3: ({children}) => <h3 className="text-base font-bold mb-2 mt-2">{children}</h3>,
                        ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                        li: ({children}) => <li className="leading-relaxed">{children}</li>,
                        strong: ({children}) => <strong className="font-bold text-blue-700">{children}</strong>,
                        em: ({children}) => <em className="italic">{children}</em>,
                        code: ({node, inline, className, children, ...props}) => {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <pre className="bg-gray-800 text-gray-100 p-3 rounded-lg my-3 overflow-x-auto text-sm">
                              <code className={className} {...props}>{children}</code>
                            </pre>
                          ) : (
                            <code className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-sm">{children}</code>
                          );
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isResponding && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-200">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"0ms"}}/>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"150ms"}}/>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"300ms"}}/>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-3 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask StuG Bot anything..."
                disabled={isResponding}
                rows={1}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none 
                  disabled:opacity-50 text-gray-900 placeholder-gray-400"
                style={{minHeight:"48px", maxHeight:"128px"}}
              />
              <button
                onClick={handleSend}
                disabled={isResponding || !input.trim()}
                className={`p-3 rounded-xl transition-all flex items-center justify-center 
                  min-w-[48px] min-h-[48px] ${
                  isResponding || !input.trim() 
                    ? "bg-gray-300 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isResponding ? (
                  <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}