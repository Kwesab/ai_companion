import { useState, useRef, useEffect } from "react";
import { Brain, Send, MessageCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SAMPLE_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI tutor for Introduction to Machine Learning. I'm here to help you understand any concepts from your lectures. What would you like to learn about?",
    timestamp: new Date(Date.now() - 300000),
  },
];

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me explain that concept in detail...",
        "I can see why you're confused about this. Let me break it down into simpler parts...",
        "Excellent observation! This relates to several key concepts we've covered...",
        "Based on the lecture slides, the answer is...",
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          responses[Math.floor(Math.random() * responses.length)] +
          "\n\n[This is a simulated response. Integrate with Gemini API for real responses]",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <nav className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 hover:text-primary transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h1 className="font-bold text-foreground">AI Tutor</h1>
            </div>
          </div>
          <div className="w-[120px]" />
        </div>
      </nav>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                AI Tutor
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Ask me anything about your lectures. I'm here to help you understand the material and prepare for exams.
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-2xl ${
                  message.role === "user"
                    ? "bg-primary text-white rounded-2xl rounded-tr-sm"
                    : "bg-secondary/10 border border-secondary/30 text-foreground rounded-2xl rounded-tl-sm"
                } px-6 py-4`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${message.role === "user" ? "text-white/70" : "text-muted-foreground"}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary/10 border border-secondary/30 text-foreground rounded-2xl rounded-tl-sm px-6 py-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me a question about the lecture..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition font-semibold disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {/* Suggested questions */}
          {messages.length <= 1 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-muted-foreground mb-3">
                Suggested questions:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Explain supervised learning with examples",
                  "What's the difference between overfitting and underfitting?",
                  "How do I evaluate a machine learning model?",
                  "What are the best practices for data preprocessing?",
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(suggestion);
                    }}
                    className="p-3 text-left text-sm border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
