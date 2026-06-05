import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import Navbar from "@/components/Navbar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="bg-card border border-border rounded-xl px-10 py-12 text-center max-w-md shadow-sm">
        <h1 className="text-6xl font-semibold text-foreground">404</h1>
        <h2 className="mt-3 text-lg font-medium">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't find what you're looking for.
        </p>
        <Link to="/" className="inline-block mt-6 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110">
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="bg-card border border-border rounded-xl px-10 py-10 text-center max-w-md shadow-sm">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try reloading the page.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110"
          >Reload</button>
          <a href="/" className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Aether — Simple, focused productivity" },
      { name: "description", content: "Plan your day, build streaks, and focus deeply with a clean, calm productivity app." },
      { name: "author", content: "Aether" },
      { property: "og:title", content: "Aether — Simple, focused productivity" },
      { property: "og:description", content: "Plan your day, build streaks, and focus deeply." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";
import { MotionPrefsProvider } from "@/lib/motion-prefs";
import { Toaster } from "@/components/ui/sonner";
import AppBootstrap from "@/components/AppBootstrap";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MotionPrefsProvider>
          <AuthProvider>
            <AppBootstrap />
            <Navbar />
            <main className="pt-20 pb-16 min-h-screen">
              <Outlet />
            </main>
            <Toaster />
          </AuthProvider>
        </MotionPrefsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
