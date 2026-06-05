import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

type Search = { redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): Search => ({ redirect: typeof s.redirect === "string" ? s.redirect : undefined }),
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — Aether" }, { name: "description", content: "Sign in to Aether." }] }),
});

function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: (redirect as never) ?? "/dashboard", replace: true });
  }, [user, redirect, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { display_name: name || email.split("@")[0] } },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (res.error) { toast.error(res.error.message); setBusy(false); }
  }

  return (
    <div className="px-5 max-w-md mx-auto">
      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <span className="size-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">A</span>
            <span className="font-semibold">Aether</span>
          </Link>
          <h1 className="text-2xl font-semibold">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {mode === "signin" ? "Sign in to continue" : "Start with a clean slate"}
          </p>
        </div>

        <button onClick={google} disabled={busy}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-border bg-card hover:bg-muted text-sm font-medium transition-colors disabled:opacity-50">
          <GoogleIcon /> Continue with Google
        </button>

        <div className="flex items-center gap-3 my-5 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          {mode === "signup" && (
            <Field icon={<User className="size-4" />} type="text" placeholder="Display name" value={name} onChange={setName} />
          )}
          <Field icon={<Mail className="size-4" />} type="email" placeholder="you@example.com" value={email} onChange={setEmail} required />
          <Field icon={<Lock className="size-4" />} type="password" placeholder="Password (min 6 characters)" value={password} onChange={setPassword} required minLength={6} />

          <button type="submit" disabled={busy}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50">
            {busy ? "Please wait…" : (mode === "signin" ? "Sign in" : "Create account")} <ArrowRight className="size-4" />
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-5">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary font-medium hover:underline">
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ icon, type, placeholder, value, onChange, required, minLength }: {
  icon: React.ReactNode; type: string; placeholder: string; value: string;
  onChange: (v: string) => void; required?: boolean; minLength?: number;
}) {
  return (
    <div className="flex items-center gap-2 bg-background border border-border rounded-md px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring transition-all">
      <span className="text-muted-foreground">{icon}</span>
      <input
        type={type} placeholder={placeholder} value={value} required={required} minLength={minLength}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground/70"
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 11.9S6.8 21.3 12 21.3c6.9 0 9.5-4.9 9.5-9.4 0-.6 0-1.1-.1-1.7H12z" />
    </svg>
  );
}
