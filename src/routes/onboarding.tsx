import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Clock, ListPlus, Rocket, Sparkles } from "lucide-react";
import { RequireAuth, useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  component: () => <RequireAuth><Onboarding /></RequireAuth>,
  head: () => ({ meta: [{ title: "Welcome — Aether" }] }),
});

const STEPS = ["Welcome", "Schedule", "First tasks", "Start"] as const;

function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [time, setTime] = useState("08:00");
  const [tasks, setTasks] = useState<string[]>(["", "", ""]);
  const [busy, setBusy] = useState(false);

  const canContinue =
    step === 0 ? true :
    step === 1 ? !!time :
    step === 2 ? tasks.filter((t) => t.trim()).length >= 1 :
    true;

  async function finish() {
    if (!user) return;
    setBusy(true);
    try {
      const cleaned = tasks.map((t) => t.trim()).filter(Boolean);
      if (cleaned.length) {
        const rows = cleaned.map((title) => ({ title, user_id: user.id, category: "Day 1", priority: "high" as const }));
        const { error: tErr } = await supabase.from("tasks").insert(rows);
        if (tErr) throw tErr;
      }
      const { error: pErr } = await supabase
        .from("profiles")
        .update({ morning_prompt_time: time, onboarded_at: new Date().toISOString() })
        .eq("id", user.id);
      if (pErr) throw pErr;

      await qc.invalidateQueries();
      toast.success("You're all set");
      navigate({ to: "/focus", replace: true });
    } catch (e: any) {
      toast.error(e.message ?? "Could not complete onboarding");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-5 max-w-xl mx-auto">
      <div className="mb-6 flex items-center justify-center gap-1.5">
        {STEPS.map((_, i) => (
          <span key={i} className={`h-1 rounded-full transition-all ${i <= step ? "w-10 bg-primary" : "w-6 bg-muted"}`} />
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-8 min-h-[440px]">
        {step === 0 && (
          <div className="text-center py-6">
            <div className="size-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="size-5 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold mt-5">Welcome to Aether</h1>
            <p className="text-sm text-muted-foreground mt-3 max-w-sm mx-auto">
              In a few quick steps we'll set up your daily routine, your first tasks, and your first focus session.
            </p>
          </div>
        )}

        {step === 1 && (
          <div>
            <Clock className="size-6 text-primary" />
            <h2 className="text-xl font-semibold mt-4">When do you start your day?</h2>
            <p className="text-sm text-muted-foreground mt-2">
              We'll remind you to plan today's tasks at this time.
            </p>
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <input
                type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="bg-background border border-border rounded-md px-4 py-2.5 text-xl tabular-nums outline-none focus:border-primary focus:ring-2 focus:ring-ring"
              />
              <div className="flex flex-wrap gap-2">
                {["06:30", "08:00", "09:00", "10:00"].map((t) => (
                  <button key={t} onClick={() => setTime(t)}
                    className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${time === t ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:bg-muted"}`}
                  >{t}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <ListPlus className="size-6 text-primary" />
            <h2 className="text-xl font-semibold mt-4">Your first three tasks</h2>
            <p className="text-sm text-muted-foreground mt-2">
              What would make today a win? Even one is enough.
            </p>
            <div className="mt-6 space-y-2.5">
              {tasks.map((t, i) => (
                <div key={i} className="flex items-center gap-3 bg-background border border-border rounded-md px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring transition-all">
                  <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                  <input
                    value={t}
                    onChange={(e) => setTasks((arr) => arr.map((x, idx) => idx === i ? e.target.value : x))}
                    placeholder={["e.g. Finish project proposal", "e.g. Review pull requests", "e.g. 30 min deep work"][i]}
                    className="flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground/70"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-6">
            <div className="size-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Rocket className="size-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mt-5">Ready to start</h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-sm mx-auto">
              We'll save your tasks and start a 25-minute focus session.
            </p>
            <ul className="mt-6 text-left max-w-sm mx-auto space-y-1.5">
              {tasks.filter((t) => t.trim()).map((t, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <span className="text-primary">•</span><span>{t}</span>
                </li>
              ))}
              <li className="text-xs text-muted-foreground pt-2">Morning prompt set for {time}</li>
            </ul>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || busy}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >← Back</button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)} disabled={!canContinue}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 disabled:opacity-50"
            >Continue <ArrowRight className="size-4" /></button>
          ) : (
            <button
              onClick={finish} disabled={busy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 disabled:opacity-50"
            >{busy ? "Saving…" : "Start"} <Rocket className="size-4" /></button>
          )}
        </div>
      </div>
    </div>
  );
}
