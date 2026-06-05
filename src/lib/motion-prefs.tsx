import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Prefs = {
  reducedMotion: boolean;
  depth: number; // 0..20 (parallax tilt strength in degrees)
  glow: number;  // 0..100 (holographic glow intensity %)
};

type Ctx = Prefs & {
  setReducedMotion: (v: boolean) => void;
  setDepth: (v: number) => void;
  setGlow: (v: number) => void;
};

const DEFAULTS: Prefs = { reducedMotion: false, depth: 8, glow: 60 };
const KEY = "aether-motion-prefs";

const MotionCtx = createContext<Ctx>({
  ...DEFAULTS,
  setReducedMotion: () => {},
  setDepth: () => {},
  setGlow: () => {},
});

export function MotionPrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      const sysReduced =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (saved) {
        setPrefs({ ...DEFAULTS, ...JSON.parse(saved) });
      } else if (sysReduced) {
        setPrefs({ ...DEFAULTS, reducedMotion: true });
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch {}
    const root = document.documentElement;
    root.style.setProperty("--motion-depth", String(prefs.depth));
    root.style.setProperty("--motion-glow", String(prefs.glow / 100));
    root.classList.toggle("reduce-motion", prefs.reducedMotion);
  }, [prefs]);

  return (
    <MotionCtx.Provider
      value={{
        ...prefs,
        setReducedMotion: (v) => setPrefs((p) => ({ ...p, reducedMotion: v })),
        setDepth: (v) => setPrefs((p) => ({ ...p, depth: v })),
        setGlow: (v) => setPrefs((p) => ({ ...p, glow: v })),
      }}
    >
      {children}
    </MotionCtx.Provider>
  );
}

export const useMotionPrefs = () => useContext(MotionCtx);
