import { useState, useRef, useEffect } from "react";
import { useSendChat } from "@workspace/api-client-react";
import { Send, Loader2, Bot, User } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string }

interface Props { studentField?: string }

export default function CounselorView({ studentField }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "سلام! من دکتر راداَن، مشاور تخصصی ترنم همدلی هستم. آماده‌ام تا در آماده‌سازی برای کنکور به شما کمک کنم. سوالات درسی، برنامه مطالعاتی، مدیریت استرس — هر چیزی بپرسید!",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const sendChat = useSendChat();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || sendChat.isPending) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    sendChat.mutate(
      { data: { message: userMsg.content, history: messages, studentField: studentField || "tajrobi" } },
      {
        onSuccess: (data) => {
          setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        },
        onError: () => {
          setMessages((prev) => [...prev, { role: "assistant", content: "متاسفم، مشکلی در ارتباط پیش آمد. لطفاً دوباره تلاش کنید." }]);
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">مشاور هوشمند</h1>
        <p className="text-slate-500 mt-1 text-sm">دکتر راداَن — مشاور تخصصی کنکور ترنم همدلی</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-400/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">دکتر راضیه راداَن</p>
            <p className="text-indigo-300 text-xs">مشاور تخصصی کنکور ترنم همدلی</p>
          </div>
          <div className="mr-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-emerald-400">آنلاین</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} data-testid={`message-chat-${i}`} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-indigo-600" : "bg-amber-100"
              }`}>
                {msg.role === "user"
                  ? <User className="w-4 h-4 text-white" />
                  : <Bot className="w-4 h-4 text-amber-600" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-sm"
                  : "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-sm"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {sendChat.isPending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-amber-600" />
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex gap-2">
            <input
              data-testid="input-chat-message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="سوال خود را بنویسید..."
              className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
            <button
              data-testid="button-send-chat"
              onClick={handleSend}
              disabled={sendChat.isPending || !input.trim()}
              className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" style={{ transform: "scaleX(-1)" }} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["برنامه مطالعاتی یک هفته‌ای بده", "ضعیف‌ترین دروس من چیه؟", "چطور استرس کنکور را کم کنم؟"].map((q) => (
              <button
                key={q}
                data-testid={`button-quick-${q}`}
                onClick={() => { setInput(q); }}
                className="text-xs text-indigo-600 border border-indigo-200 bg-indigo-50 rounded-full px-3 py-1 hover:bg-indigo-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
