import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "./dashboard";
import { useEffect, useState } from "react";
import { RequireAuth, useAuth } from "@/lib/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Clock, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useMotionPrefs } from "@/lib/motion-prefs";

export const Route = createFileRoute("/settings")({
  component: () => <RequireAuth><Settings /></RequireAuth>,
  head: () => ({ meta: [{ title: "Settings — Aether" }] }),
});

function Settings() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [time, setTime] = useState("08:00");

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("morning_prompt_time").eq("id", user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (profile?.morning_prompt_time) setTime(profile.morning_prompt_time.slice(0, 5));
  }, [profile]);

  const saveTime = useMutation({
    mutationFn: async (v: string) => {
      const { error } = await supabase.from("profiles").update({ morning_prompt_time: v }).eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["profile"] }); toast.success("Saved"); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="px-5 max-w-2xl mx-auto space-y-4">
      <PageHeader title="Settings" subtitle="Customize your experience" />

      <Section
        title="Daily morning prompt"
        caption="We'll remind you to plan your day at this time"
      >
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <input
            type="time" value={time}
            onChange={(e) => setTime(e.target.value)}
            onBlur={() => { if (time !== profile?.morning_prompt_time?.slice(0, 5)) saveTime.mutate(time); }}
            className="bg-background border border-border rounded-md px-3 py-2 text-sm tabular-nums outline-none focus:border-primary focus:ring-2 focus:ring-ring"
          />
        </div>
      </Section>

      <MotionSection />



      <Section
        title="Account"
        caption={user?.email ?? ""}
      >
        <span className="text-sm text-muted-foreground">Signed in</span>
      </Section>

      <Section
        title="Reset progress"
        caption="Permanently delete all your tasks and restart onboarding"
        danger
      >
        <button
          onClick={async () => {
            if (!confirm("Delete all tasks and restart onboarding? This cannot be undone.")) return;
            const { error: e1 } = await supabase.from("tasks").delete().eq("user_id", user!.id);
            const { error: e2 } = await supabase.from("profiles").update({ onboarded_at: null }).eq("id", user!.id);
            if (e1 || e2) { toast.error((e1 ?? e2)!.message); return; }
            qc.invalidateQueries();
            toast.success("Progress reset");
            setTimeout(() => { window.location.href = "/onboarding"; }, 600);
          }}
          className="text-sm font-medium px-4 py-2 rounded-md border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors"
        >
          Start fresh
        </button>
      </Section>
    </div>
  );
}

function Section({ title, caption, children, danger }: { title: string; caption?: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <div className={`bg-card border ${danger ? "border-destructive/30" : "border-border"} rounded-xl p-5 flex items-center justify-between gap-4`}>
      <div>
        <p className="text-sm font-medium">{title}</p>
        {caption && <p className="text-xs text-muted-foreground mt-1">{caption}</p>}
      </div>
      {children}
    </div>
  );
}

function MotionSection() {
  const { reducedMotion, setReducedMotion, depth, setDepth, glow, setGlow } = useMotionPrefs();
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <p className="text-sm font-medium">Motion & visual effects</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm">Reduced motion</p>
          <p className="text-xs text-muted-foreground mt-1">Disable video, 3D parallax, and animations</p>
        </div>
        <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
      </div>

      <div className={reducedMotion ? "opacity-50 pointer-events-none space-y-5" : "space-y-5"}>
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span>3D depth</span>
            <span className="tabular-nums text-muted-foreground">{depth}</span>
          </div>
          <Slider value={[depth]} min={0} max={20} step={1} onValueChange={([v]) => setDepth(v)} />
          <p className="text-xs text-muted-foreground mt-1.5">Strength of the parallax tilt on cards and headers</p>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Holographic glow</span>
            <span className="tabular-nums text-muted-foreground">{glow}%</span>
          </div>
          <Slider value={[glow]} min={0} max={100} step={5} onValueChange={([v]) => setGlow(v)} />
          <p className="text-xs text-muted-foreground mt-1.5">Intensity of the cursor-tracking light highlight</p>
        </div>
      </div>
    </div>
  );
}
