import { useEffect, useRef } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

const SKIP_PATHS = ["/", "/login", "/onboarding"];
const PROMPT_KEY = "aether:last-prompt-date";

/**
 * Mounted once at root. When a user is authenticated:
 *  1. Loads their profile.
 *  2. If they haven't completed Day 1 onboarding, routes them to /onboarding.
 *  3. Once per day, after their preferred morning time, fires a gentle
 *     toast prompting them to set today's tasks.
 */
export default function AppBootstrap() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const promptedRef = useRef(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, morning_prompt_time, onboarded_at")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: todaysCount } = useQuery({
    queryKey: ["tasks-today-count", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const start = new Date(); start.setHours(0, 0, 0, 0);
      const { count, error } = await supabase
        .from("tasks")
        .select("id", { count: "exact", head: true })
        .gte("created_at", start.toISOString());
      if (error) throw error;
      return count ?? 0;
    },
  });

  // Onboarding redirect
  useEffect(() => {
    if (!user || !profile) return;
    if (profile.onboarded_at) return;
    if (SKIP_PATHS.includes(pathname)) return;
    navigate({ to: "/onboarding", replace: true });
  }, [user, profile, pathname, navigate]);

  // Daily morning prompt
  useEffect(() => {
    if (!user || !profile?.onboarded_at || promptedRef.current) return;
    if (todaysCount === undefined) return;
    if (todaysCount > 0) return;

    const today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem(PROMPT_KEY) === today) return;

    const [hh, mm] = (profile.morning_prompt_time ?? "08:00").split(":").map(Number);
    const now = new Date();
    const target = new Date(); target.setHours(hh, mm, 0, 0);
    if (now < target) return;

    promptedRef.current = true;
    localStorage.setItem(PROMPT_KEY, today);
    toast("Plan today's flight path", {
      description: "Set your tasks for the day to keep your streak alive.",
      action: { label: "Add tasks", onClick: () => navigate({ to: "/tasks" }) },
      duration: 12000,
    });
  }, [user, profile, todaysCount, navigate]);

  return null;
}
