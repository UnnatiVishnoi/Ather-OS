import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, ListChecks, Timer, BarChart3, Sparkles, Settings, LogOut, LogIn, Sun, Moon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/focus", label: "Focus", icon: Timer },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/assistant", label: "AI", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur border-b border-border">
      <nav className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <span className="size-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">A</span>
          <span className="text-sm">Aether</span>
        </Link>

        {user && (
          <div className="hidden md:flex items-center gap-1">
            {items.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                activeProps={{ className: "text-foreground bg-muted" }}
              >
                <Icon className="size-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="size-9 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          {user ? (
            <>
              <span className="hidden sm:inline text-xs text-muted-foreground max-w-[160px] truncate">
                {user.email}
              </span>
              <button
                onClick={async () => { await signOut(); navigate({ to: "/" }); }}
                className="text-sm font-medium px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-1.5"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            </>
          ) : (
            <Link to="/login"
              className="text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <LogIn className="size-4" /> Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
