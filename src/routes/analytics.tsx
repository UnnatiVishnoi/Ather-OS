import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "./dashboard";
import { RequireAuth, useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { lastNDays, computeStreak } from "@/lib/streak";

export const Route = createFileRoute("/analytics")({
  component: () => <RequireAuth><Analytics /></RequireAuth>,
  head: () => ({ meta: [{ title: "Analytics — Aether" }] }),
});

type Task = { id: string; done: boolean; completed_at: string | null; created_at: string };

function Analytics() {
  const { user } = useAuth();
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("tasks").select("id,done,completed_at,created_at");
      if (error) throw error;
      return data as Task[];
    },
  });

  const completed = tasks.filter((t) => t.done).length;
  const rate = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);
  const streak = computeStreak(tasks.map((t) => t.completed_at));
  const days = lastNDays(30);
  const perDay = days.map((d) => tasks.filter((t) => t.completed_at?.slice(0, 10) === d).length);
  const max = Math.max(1, ...perDay);

  return (
    <div className="px-5 max-w-5xl mx-auto">
      <PageHeader title="Analytics" subtitle="Your productivity at a glance" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { l: "Completion rate", v: `${rate}%`, d: `${completed} of ${tasks.length} tasks` },
          { l: "Current streak", v: `${streak}d`, d: streak > 0 ? "Keep going" : "Complete one today" },
          { l: "Tasks completed", v: String(completed), d: "All-time total" },
        ].map((s) => (
          <div key={s.l} className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground">{s.l}</p>
            <p className="text-3xl font-semibold mt-2 tabular-nums">{s.v}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Last 30 days</h3>
          <div className="flex items-end gap-1 h-44">
            {perDay.map((v, i) => (
              <div key={i} className="flex-1 flex items-end">
                <div
                  className="w-full rounded-t-sm bg-primary"
                  style={{ height: `${(v / max) * 100}%`, minHeight: v > 0 ? "4px" : "2px", opacity: v > 0 ? 1 : 0.15 }}
                  title={`${days[i]}: ${v}`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-3">
            <span>{new Date(days[0]).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
            <span>Today</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Activity grid</h3>
          <div className="grid grid-cols-7 gap-1.5">
            {lastNDays(49).map((d) => {
              const v = tasks.filter((t) => t.completed_at?.slice(0, 10) === d).length;
              const op = v === 0 ? 0.08 : Math.min(1, 0.25 + v * 0.2);
              return <div key={d} className="aspect-square rounded-sm" title={`${d}: ${v}`}
                style={{ background: "var(--color-primary)", opacity: op }} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
