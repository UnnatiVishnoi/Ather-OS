import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { useMotionPrefs } from "@/lib/motion-prefs";

/**
 * Lightweight CSS-based 3D parallax (no WebGL needed — uses GPU-accelerated
 * CSS transforms only). Tracks pointer over the element and tilts on X/Y.
 * Disabled automatically when reduced-motion is on, or on coarse pointers.
 */
export function Parallax3D({
  children,
  className = "",
  style,
  glow = true,
  intensity = 1,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  glow?: boolean;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion, depth, glow: glowAmt } = useMotionPrefs();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    let tx = 0, ty = 0;
    const maxTilt = (depth / 20) * 8 * intensity; // degrees

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      tx = -cy * maxTilt;
      ty = cx * maxTilt;
      if (!raf) raf = requestAnimationFrame(apply);
      el.style.setProperty("--mx", `${(cx + 0.5) * 100}%`);
      el.style.setProperty("--my", `${(cy + 0.5) * 100}%`);
    };
    const apply = () => {
      raf = 0;
      el.style.transform = `perspective(900px) rotateX(${tx}deg) rotateY(${ty}deg)`;
    };
    const onLeave = () => {
      tx = 0; ty = 0;
      el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion, depth, intensity]);

  return (
    <div
      ref={ref}
      className={`parallax-3d ${glow ? "parallax-glow" : ""} ${className}`}
      style={{
        ...style,
        transition: "transform 200ms ease-out",
        willChange: "transform",
        ["--glow-opacity" as any]: glow ? glowAmt : 0,
      }}
    >
      {children}
    </div>
  );
}
