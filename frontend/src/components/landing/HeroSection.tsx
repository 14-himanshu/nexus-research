import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Lock, Bot, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <main className="relative z-10 pt-32 pb-20 px-6 max-w-[1200px] mx-auto flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 mb-8"
      >
        <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
        Nexus v2.0 is now live
        <ChevronRight size={14} className="text-zinc-500" />
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6 leading-[1.1]"
      >
        Research at the <br className="hidden md:block" />
        <span className="text-zinc-500">speed of thought.</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl font-light tracking-wide leading-relaxed"
      >
        Deploy a swarm of specialized AI agents to plan, scrape, fact-check, and synthesize massive amounts of web data into actionable intelligence.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <Link 
          to="/signup"
          className="group flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 transition-all"
        >
          Start Researching
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <a 
          href="https://github.com/14-himanshu/nexus-research"
          target="_blank" rel="noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-md border border-zinc-800 hover:bg-zinc-800 transition-all"
        >
          View Documentation
        </a>
      </motion.div>

      {/* Hero Mockup */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        className="w-full mt-20 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl" />
        <div className="relative rounded-2xl border border-zinc-800 bg-black/50 backdrop-blur-xl p-2 shadow-2xl overflow-hidden flex flex-col items-center">
          {/* Mockup Header */}
          <div className="w-full flex items-center gap-2 px-4 py-3 border-b border-zinc-800/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-zinc-800" />
              <div className="w-3 h-3 rounded-full bg-zinc-800" />
              <div className="w-3 h-3 rounded-full bg-zinc-800" />
            </div>
            <div className="mx-auto flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-md border border-zinc-800 text-xs text-zinc-500 font-mono">
              <Lock size={12} />
              nexus.internal/workspace
            </div>
          </div>
          {/* Mockup Body */}
          <div className="w-full p-8 md:p-12 text-left bg-[#09090b]">
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Planner Status */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-blue-400" />
                </div>
                <div className="flex-1 space-y-3 pt-1">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-zinc-500">
                    <CheckCircle2 size={12} className="text-emerald-500" /> PLANNER GENERATED 4 STEPS
                  </div>
                  <div className="h-3 bg-zinc-800 rounded w-full" />
                  <div className="h-3 bg-zinc-800 rounded w-11/12" />
                </div>
              </div>

              {/* Fact Checker Status */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-orange-400" />
                </div>
                <div className="flex-1 space-y-3 pt-1">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-zinc-500">
                    <CheckCircle2 size={12} className="text-emerald-500" /> FACT-CHECKER VERIFIED 12 SOURCES
                  </div>
                  <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 flex gap-3 items-center">
                    <span className="text-xs text-zinc-400">Source [1]:</span>
                    <span className="text-xs font-mono text-emerald-400 truncate">https://nature.com/articles/s41586-023...</span>
                  </div>
                </div>
              </div>

              {/* Output Preview */}
              <div className="mt-8 pt-8 border-t border-zinc-800">
                <h3 className="text-xl font-bold text-white mb-4">The Future of Solid-State Batteries</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  The state of solid-state batteries in 2026 indicates a massive shift towards silicon anodes, enabling a 40% increase in energy density compared to traditional lithium-ion architectures.
                </p>
                <div className="h-2 bg-zinc-800 rounded w-3/4 mb-2" />
                <div className="h-2 bg-zinc-800 rounded w-1/2" />
              </div>

            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
