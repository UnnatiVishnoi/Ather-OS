import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "./dashboard";
import { RequireAuth, useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({
  component: () => <RequireAuth><Tasks /></RequireAuth>,
  head: () => ({ meta: [{ title: "Tasks — Aether" }] }),
});

type Priority = "low" | "med" | "high";
interface Task {
  id: string; title: string; category: string; priority: Priority;
  done: boolean; due: string | null; progress: number; user_id: string; created_at: string;
}

function Tasks() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [input, setInput] = useState("");

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Task[];
    },
  });

  const addM = useMutation({
    mutationFn: async (title: string) => {
      const { error } = await supabase.from("tasks").insert({ title, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { setInput(""); qc.invalidateQueries({ queryKey: ["tasks"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleM = useMutation({
    mutationFn: async (t: Task) => {
      const done = !t.done;
      const { error } = await supabase.from("tasks").update({
        done,
        progress: done ? 100 : t.progress,
        completed_at: done ? new Date().toISOString() : null,
      }).eq("id", t.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries(),
  });

  const delM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const filtered = tasks.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));
  const active = tasks.filter((t) => !t.done).length;
  const done = tasks.length - active;

  return (
    <div className="px-5 max-w-3xl mx-auto">
      <PageHeader title="Tasks" subtitle={`${active} active · ${done} completed`} />

      <form
        onSubmit={(e) => { e.preventDefault(); if (input.trim()) addM.mutate(input.trim()); }}
        className="bg-card border border-border rounded-xl p-4 mb-5"
      >
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex items-center gap-2 bg-background border border-border rounded-md px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring transition-all">
            <input
              value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="What do you want to get done?"
              className="flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground/70"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || addM.isPending}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="size-4" /> Add task
          </button>
          <div className="flex items-center gap-2 bg-background border border-border rounded-md px-3 md:w-56">
            <Search className="size-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground/70" />
          </div>
        </div>
      </form>

      {isLoading ? (
        <div className="text-center text-sm text-muted-foreground py-12">Loading…</div>
      ) : tasks.length === 0 ? (
        <div className="bg-card border border-border rounded-xl text-center py-14 px-6">
          <div className="size-12 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Plus className="size-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold mt-5">No tasks yet</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            Add your first task above. Keep it small — three tasks a day is plenty.
          </p>
        </div>
      ) : (
        <ul className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
          {filtered.map((t) => (
            <li key={t.id} className="group flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
              <button onClick={() => toggleM.mutate(t)} className="shrink-0">
                {t.done ? (
                  <CheckCircle2 className="size-5 text-primary" />
                ) : (
                  <Circle className="size-5 text-muted-foreground/40 hover:text-muted-foreground transition-colors" />
                )}
              </button>
              <span className={`flex-1 text-sm truncate ${t.done ? "line-through text-muted-foreground" : ""}`}>
                {t.title}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">{t.category}</span>
              <button
                onClick={() => delM.mutate(t.id)}
                className="text-muted-foreground/40 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Delete task"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="text-center text-sm text-muted-foreground py-8">No tasks match "{q}"</li>
          )}
        </ul>
      )}
    </div>
  );
}
