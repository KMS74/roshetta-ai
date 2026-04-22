'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 flex items-center justify-center rounded-xl border shadow-sm transition-all duration-300 hover:scale-110 active:scale-95 group overflow-hidden ${
        isDark 
          ? 'bg-slate-900 border-slate-700 hover:border-brand-teal hover:shadow-[0_0_20px_rgba(45,212,191,0.2)]' 
          : 'bg-white border-slate-200 hover:border-brand-coral hover:shadow-[0_0_20px_rgba(251,113,133,0.2)]'
      }`}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ y: 20, opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
          exit={{ y: -20, opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
        >
          {isDark ? (
            <Moon className="h-5 w-5 text-brand-teal" />
          ) : (
            <Sun className="h-5 w-5 text-brand-coral" />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Subtle background flare */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
        isDark ? 'bg-brand-teal' : 'bg-brand-coral'
      }`} />
    </button>
  );
}
