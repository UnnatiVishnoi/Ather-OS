import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06070A]"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="size-16 mx-auto rounded-full border border-[color:var(--cyan)]/50 relative anim-pulse-glow"
            >
              <span className="absolute inset-2 rounded-full bg-[radial-gradient(circle,oklch(0.85_0.18_215/0.8),transparent_70%)]" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-xs uppercase tracking-[0.4em] text-muted-foreground"
            >
              Initializing Aether
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
