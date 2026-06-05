import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Timer, Flame, BarChart3, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Aether — A calm, editorial productivity app" },
      { name: "description", content: "Plan today, focus deeply, build momentum. A serene bento-style productivity app with tasks, focus timer, AI coach and streaks." },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-16">
        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[minmax(160px,auto)]">

          {/* Hero tile */}
          <div className="md:col-span-8 md:row-span-2 bg-secondary rounded-3xl p-8 md:p-12 flex flex-col justify-between overflow-hidden relative border border-border">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-accent/40 text-primary text-[10px] font-medium mb-8 tracking-[0.18em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Now with an AI productivity coach
              </div>
              <h1 className="font-serif italic text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-primary mb-6">
                Plan today.<br />Focus deeply.<br />
                <span className="text-accent not-italic">Build momentum.</span>
              </h1>
              <p className="max-w-md text-base md:text-lg text-primary/75 leading-relaxed">
                A calm, distraction-free productivity app. Set your daily tasks, run focus
                sessions, talk to your AI coach, and track your streak.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 relative z-10">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:brightness-110 transition-all shadow-md"
              >
                Get started — free <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-7 py-3.5 bg-transparent border border-primary/25 text-primary rounded-xl font-medium hover:bg-primary/5 transition-colors"
              >
                Sign in
              </Link>
            </div>

            <p className="mt-4 text-xs text-primary/55 italic relative z-10">
              Your account starts empty — no pre-loaded tasks or progress.
            </p>

            <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-accent/30 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* AI Coach tile */}
          <div className="md:col-span-4 bg-card rounded-3xl p-6 border border-border flex flex-col justify-between">
            <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-primary/60 font-medium">Feature 01</span>
              <h3 className="text-2xl font-serif italic text-primary mt-1 mb-2">Personal AI Coach</h3>
              <p className="text-sm text-primary/70 leading-relaxed">
                Real-time insights to help you manage cognitive load and stay on track.
              </p>
            </div>
          </div>

          {/* Streak tile */}
          <div className="md:col-span-4 bg-accent rounded-3xl p-6 flex flex-col items-center justify-center text-accent-foreground text-center">
            <span className="text-6xl font-serif italic leading-none">14</span>
            <span className="text-[10px] uppercase tracking-[0.22em] font-semibold mt-2 opacity-80">Day Streak</span>
            <div className="mt-4 flex gap-1 items-end">
              {[16, 22, 30, 20, 12, 26].map((h, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-background"
                  style={{ height: `${h}px`, opacity: 0.4 + (h / 60) }}
                />
              ))}
            </div>
          </div>

          {/* Focus timer tile */}
          <div className="md:col-span-4 bg-card rounded-3xl p-6 border border-border flex flex-col justify-between">
            <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-primary">
              <Timer className="size-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-primary/60 font-medium">Feature 02</span>
              <h3 className="text-2xl font-serif italic text-primary mt-1 mb-2">Custom focus timer</h3>
              <p className="text-sm text-primary/70 leading-relaxed">
                Pick 15, 25, 45, 60, 90 — or set your own. No more rigid 25-minute boxes.
              </p>
            </div>
          </div>

          {/* Analytics tile */}
          <div className="md:col-span-4 bg-card rounded-3xl p-6 border border-border flex flex-col justify-between">
            <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-primary">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-primary/60 font-medium">Feature 03</span>
              <h3 className="text-2xl font-serif italic text-primary mt-1 mb-2">Quiet analytics</h3>
              <p className="text-sm text-primary/70 leading-relaxed">
                See your week at a glance — completed tasks, focused minutes, streak.
              </p>
            </div>
          </div>

          {/* Streaks copy tile */}
          <div className="md:col-span-4 bg-secondary rounded-3xl p-6 border border-border flex flex-col justify-between">
            <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-primary">
              <Flame className="size-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-primary/60 font-medium">Feature 04</span>
              <h3 className="text-2xl font-serif italic text-primary mt-1 mb-2">Gentle streaks</h3>
              <p className="text-sm text-primary/70 leading-relaxed">
                Momentum without guilt. Skip a day, pick it back up — your streak forgives you.
              </p>
            </div>
          </div>

          {/* Wide CTA tile */}
          <div className="md:col-span-12 bg-card rounded-3xl p-8 md:p-10 border border-border flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-3xl md:text-4xl font-serif italic text-primary mb-2 text-center md:text-left">
                Focus on what matters.
              </h3>
              <p className="text-sm text-primary/60 text-center md:text-left max-w-md">
                Your account starts empty — no pre-loaded tasks or noise. Just a quiet page, and the day in front of you.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              {[
                { done: true, t: "Review quarterly goals" },
                { done: false, t: "Design hero section" },
                { done: false, t: "Weekly sync prep" },
              ].map((task) => (
                <div
                  key={task.t}
                  className="h-12 min-w-[260px] bg-background rounded-lg border border-border flex items-center px-4 gap-3"
                >
                  {task.done ? (
                    <CheckCircle2 className="size-4 text-accent" />
                  ) : (
                    <div className="size-4 rounded-full border border-accent" />
                  )}
                  <span className={`text-sm ${task.done ? "line-through text-primary/40" : "text-primary"}`}>
                    {task.t}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer-ish tile */}
          <div className="md:col-span-12 flex flex-col md:flex-row items-center justify-between gap-4 px-2 pt-4">
            <p className="text-sm font-serif italic text-primary/70">
              Aether — a quiet place to do good work.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/70 transition-colors"
            >
              Create your free account <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
