import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Settings2 } from "lucide-react";
import { PageHeader } from "./dashboard";
import { RequireAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/focus")({
  component: () => <RequireAuth><Focus /></RequireAuth>,
  head: () => ({ meta: [{ title: "Focus — Aether" }] }),
});

const PRESETS = [15, 25, 45, 60, 90];

function Focus() {
  const [minutes, setMinutes] = useState(() => {
    if (typeof window === "undefined") return 25;
    return Number(localStorage.getItem("focus-minutes")) || 25;
  });
  const TOTAL = minutes * 60;
  const [seconds, setSeconds] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("focus-minutes", String(minutes));
    setSeconds(minutes * 60);
    setRunning(false);
  }, [minutes]);

  useEffect(() => {
    if (running) {
      ref.current = window.setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  useEffect(() => {
    if (seconds === 0 && running) setRunning(false);
  }, [seconds, running]);

  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  const progress = 1 - seconds / TOTAL;
  const C = 2 * Math.PI * 120;

  return (
    <div className="px-5 max-w-2xl mx-auto">
      <PageHeader title="Focus" subtitle="Pick a duration and dive in" />

      <div className="bg-card border border-border rounded-xl text-center py-12 px-6">
        <div className="flex justify-center gap-2 flex-wrap mb-8">
          {PRESETS.map((m) => (
            <button
              key={m}
              onClick={() => setMinutes(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                minutes === m
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {m}m
            </button>
          ))}
          <button
            onClick={() => setCustomOpen((v) => !v)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:bg-muted inline-flex items-center gap-1"
          >
            <Settings2 className="size-3" /> Custom
          </button>
        </div>

        {customOpen && (
          <div className="mb-6 flex items-center justify-center gap-2">
            <input
              type="number"
              min={1}
              max={180}
              value={minutes}
              onChange={(e) => setMinutes(Math.max(1, Math.min(180, Number(e.target.value) || 1)))}
              className="w-24 bg-background border border-border rounded-md px-3 py-2 text-sm text-center outline-none focus:border-primary"
            />
            <span className="text-sm text-muted-foreground">minutes</span>
          </div>
        )}

        <div className="relative inline-block">
          <svg width="280" height="280" viewBox="0 0 280 280" className="mx-auto">
            <circle cx="140" cy="140" r="120" fill="none" stroke="var(--color-muted)" strokeWidth="6" />
            <circle
              cx="140" cy="140" r="120" fill="none"
              stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round"
              transform="rotate(-90 140 140)"
              style={{
                strokeDasharray: C,
                strokeDashoffset: C * (1 - progress),
                transition: "stroke-dashoffset 1s linear",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Deep work</p>
            <p className="text-6xl tabular-nums font-semibold mt-2">{mins}:{secs}</p>
            <p className="text-xs text-muted-foreground mt-2">{minutes} min session</p>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:brightness-110"
          >
            {running ? <><Pause className="size-4" /> Pause</> : <><Play className="size-4" /> Start</>}
          </button>
          <button
            onClick={() => { setRunning(false); setSeconds(TOTAL); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border text-sm hover:bg-muted"
          >
            <RotateCcw className="size-4" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
