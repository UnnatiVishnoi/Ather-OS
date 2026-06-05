import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  glow?: "cyan" | "violet" | "none";
}

// Simple, clean card — renamed-in-spirit, kept for back-compat with existing imports.
export default function HolographicCard({ children, className }: Props) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow",
        className,
      )}
    >
      {children}
    </div>
  );
}
