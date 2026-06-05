import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "./dashboard";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { RequireAuth } from "@/lib/auth-context";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";

export const Route = createFileRoute("/assistant")({
  component: () => <RequireAuth><Assistant /></RequireAuth>,
  head: () => ({ meta: [{ title: "AI Assistant — Aether" }] }),
});

function Assistant() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const loading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="px-5 max-w-3xl mx-auto">
      <PageHeader title="Assistant" subtitle="Your AI productivity coach" />
      <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-[70vh]">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="size-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Aether assistant</p>
            <p className="text-xs text-muted-foreground">Powered by Lovable AI</p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm text-muted-foreground">
                Ask me to help plan your day, prioritize tasks, or beat procrastination.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {["Plan my day", "Help me focus", "Beat procrastination"].map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage({ text: s })}
                    className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={`flex ${isUser ? "justify-end" : ""}`}>
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {text}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" /> Thinking…
            </div>
          )}
          {error && (
            <div className="text-xs text-destructive">{error.message || "Something went wrong."}</div>
          )}
        </div>

        <form onSubmit={submit} className="flex gap-2 px-5 py-4 border-t border-border">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 bg-background border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="size-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
