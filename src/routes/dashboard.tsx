import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Flame, CheckCircle2, ArrowRight, ListPlus, Sparkles } from "lucide-react";
import { RequireAuth, useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { computeStreak, lastNDays } from "@/lib/streak";
import dashboardBg from "@/assets/dashboard-bg.mp4.asset.json";
import { Parallax3D } from "@/components/Parallax3D";
import { useMotionPrefs } from "@/lib/motion-prefs";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard")({
  component: () => <RequireAuth><Dashboard /></RequireAuth>,
  head: () => ({ meta: [{ title: "Dashboard — Aether" }] }),
});

type Task = {
  id: string; title: string; category: string; priority: string;
  done: boolean; due: string | null; progress: number;
  created_at: string; completed_at: string | null;
};

function Dashboard() {
  const { user } = useAuth();
  const { reducedMotion } = useMotionPrefs();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  const showVideo = !reducedMotion;
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Task[];
    },
  });

  const streak = computeStreak(tasks.map((t) => t.completed_at));
  const todayKey = new Date().toISOString().slice(0, 10);
  const completedToday = tasks.filter((t) => t.completed_at?.slice(0, 10) === todayKey).length;
  const active = tasks.filter((t) => !t.done);
  const todaysList = active.slice(0, 6);
  const score = tasks.length === 0 ? 0 : Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);

  const days = lastNDays(7);
  const perDay = days.map((d) => tasks.filter((t) => t.completed_at?.slice(0, 10) === d).length);
  const max = Math.max(1, ...perDay);

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";
  const subtitle = `${greeting} · ${now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}`;

  if (!isLoading && tasks.length === 0) {
    return (
      <div className="px-5 max-w-3xl mx-auto">
        <PageHeader title="Dashboard" subtitle={subtitle} />
        <div className="bg-card border border-border rounded-xl text-center py-14 px-6">
          <div className="size-12 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Sparkles className="size-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mt-5">Your dashboard is empty</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Add your first tasks to start tracking your streak and completion rate.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/tasks" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:brightness-110">
              <ListPlus className="size-4" /> Add your first task
            </Link>
            <Link to="/focus" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border text-sm hover:bg-muted">
              Start a focus session <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 max-w-6xl mx-auto">
      {/* Cinematic video hero with 3D parallax */}
      <Parallax3D className="rounded-2xl mb-6" glow>
        <div className="relative overflow-hidden rounded-2xl border border-border h-44 md:h-56 bg-gradient-to-br from-primary/15 via-accent/10 to-background">
          {showVideo && (
            <video
              src={dashboardBg.url}
              autoPlay loop muted playsInline
              preload={isMobile ? "metadata" : "auto"}
              data-motion="auto"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-background/10" />
          <div className="relative h-full flex flex-col justify-center px-6 md:px-10">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">{greeting}</p>
            <h1 className="text-3xl md:text-4xl font-semibold mt-2">Welcome back.</h1>
            <p className="text-sm text-muted-foreground mt-1">{now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
          </div>
          {!reducedMotion && (
            <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 anim-float-orb">
              <div className="size-24 rounded-full bg-gradient-to-br from-primary via-accent to-primary shadow-[0_20px_60px_-10px_var(--color-primary)] [transform:perspective(600px)_rotateX(15deg)_rotateY(-20deg)]" />
            </div>
          )}
        </div>
      </Parallax3D>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Metric label="Completion rate" value={`${score}%`} sub={`${completedToday} completed today`} icon={Activity} />
        <Metric label="Active tasks" value={String(active.length)} sub={`${tasks.length} total`} icon={CheckCircle2} />
        <Metric label="Current streak" value={`${streak} ${streak === 1 ? "day" : "days"}`} sub={streak > 0 ? "Keep it going" : "Complete a task today"} icon={Flame} />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-5">
          <Header title="Last 7 days" caption="Completed tasks per day" />
          <div className="flex items-end gap-3 h-44 mt-4">
            {perDay.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-sm bg-primary transition-all"
                    style={{ height: `${(v / max) * 100}%`, minHeight: v > 0 ? "8px" : "2px", opacity: v > 0 ? 1 : 0.15 }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{new Date(days[i]).toLocaleDateString(undefined, { weekday: "short" })}</span>
                <span className="text-xs tabular-nums text-muted-foreground/70">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <Header title="Streak" caption="Last 14 days" />
          <div className="flex items-center gap-4 mt-4">
            <Flame className="size-8 text-primary" />
            <div>
              <p className="text-3xl font-semibold tabular-nums">{streak}</p>
              <p className="text-xs text-muted-foreground">consecutive days</p>
            </div>
          </div>
          <div className="mt-5 grid gap-1" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
            {lastNDays(14).map((d) => {
              const has = tasks.some((t) => t.completed_at?.slice(0, 10) === d);
              return <div key={d} className="aspect-square rounded-sm border border-border" title={d}
                style={{ background: has ? "var(--color-primary)" : "var(--color-muted)" }} />;
            })}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <Header title="Today's tasks" caption={`${active.length} active`} />
          {todaysList.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">All clear for today.</p>
              <Link to="/tasks" className="text-sm text-primary hover:underline mt-2 inline-block">Add a task →</Link>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {todaysList.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  <CheckCircle2 className={`size-4 ${t.done ? "text-primary" : "text-muted-foreground/40"}`} />
                  <span className={`flex-1 text-sm truncate ${t.done ? "line-through text-muted-foreground" : ""}`}>{t.title}</span>
                  <span className="text-xs text-muted-foreground">{t.category}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <Header title="Progress" caption="All-time" />
          <div className="mt-4 space-y-4">
            <ProgressRow label="Completed" value={tasks.filter((t) => t.done).length} total={Math.max(1, tasks.length)} />
            <ProgressRow label="In progress" value={tasks.filter((t) => !t.done && t.progress > 0).length} total={Math.max(1, tasks.length)} />
            <ProgressRow label="Completed today" value={completedToday} total={Math.max(1, completedToday + active.length)} />
          </div>
          <Link to="/tasks" className="mt-6 inline-flex items-center gap-1 text-sm text-primary hover:underline">
            Manage tasks <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums font-medium">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>}
    </div>
  );
}

function Header({ title, caption }: { title: string; caption?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <h3 className="text-sm font-semibold">{title}</h3>
      {caption && <span className="text-xs text-muted-foreground">{caption}</span>}
    </div>
  );
}

function Metric({ label, value, sub, icon: Icon }: any) {
  return (
    <Parallax3D className="rounded-xl" glow intensity={0.6}>
      <div className="group relative bg-card border border-border rounded-xl p-5 overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:border-primary/40">
        <div className="absolute -top-12 -right-12 size-32 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <Icon className="size-4 text-primary" />
        </div>
        <p className="relative text-3xl font-semibold mt-3 tabular-nums">{value}</p>
        <p className="relative text-xs text-muted-foreground mt-1">{sub}</p>
      </div>
    </Parallax3D>
  );
}
