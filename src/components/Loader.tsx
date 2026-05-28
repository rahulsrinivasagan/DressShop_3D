import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function Loader() {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 1800;
    let raf = 0;
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / duration);
      setCount(Math.floor(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 400);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: [0.83, 0, 0.17, 1] }}
          className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center"
        >
          <div className="text-5xl md:text-7xl font-display italic">MAISON NOIR</div>
          <div className="mt-8 flex items-end gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            <span>Loading</span>
            <span className="tabular-nums text-foreground">{count.toString().padStart(3, "0")}</span>
          </div>
          <div className="mt-6 w-48 h-px bg-foreground/10 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${count}%` }} className="h-full bg-accent" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

