import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AIOrb() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 size-14 rounded-full glass-strong edge-glow flex items-center justify-center anim-pulse-glow"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="AI Assistant"
      >
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,oklch(0.85_0.18_215/0.7),transparent_60%)]" />
        <Sparkles className="size-6 text-white relative z-10" />
      </motion.button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-24 right-6 z-40 w-[min(92vw,360px)] glass-strong edge-glow rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Sparkles className="size-4 text-[color:var(--cyan)]" />
            <span className="text-sm font-medium">Aether AI</span>
            <span className="ml-auto text-[10px] text-muted-foreground uppercase tracking-wider">online</span>
          </div>
          <div className="py-3 space-y-2 text-sm">
            <p className="text-muted-foreground">Good evening. You have <span className="text-foreground">3 deep-focus blocks</span> remaining today.</p>
            <p className="text-muted-foreground">Suggested next: <span className="text-[color:var(--cyan)]">Draft Q3 roadmap</span> — 45m focus session.</p>
          </div>
          <div className="flex gap-2 pt-2">
            <input
              placeholder="Ask anything…"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[color:var(--cyan)]/60"
            />
            <button className="px-3 py-2 rounded-lg bg-[var(--grad-aether)] text-xs font-medium text-primary-foreground">Send</button>
          </div>
        </motion.div>
      )}
    </>
  );
}
