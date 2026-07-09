import { motion } from 'framer-motion';
import { ArrowRight, Lock, CheckCircle2, Search, Edit3, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

const BADGE_ITEMS = ['Multi-Agent Graph', 'LangGraph Powered', 'BYOK Support', 'PDF Export'];

const PIPELINE_STEPS = [
  { color: 'bg-violet-500/20 border-violet-500/30 text-violet-400', label: 'Planner', icon: BrainCircuit, done: true, msg: 'Generated 4-step plan' },
  { color: 'bg-blue-500/20 border-blue-500/30 text-blue-400', label: 'Researcher', icon: Search, done: true, msg: 'Scraped 24 web pages' },
  { color: 'bg-amber-500/20 border-amber-500/30 text-amber-400', label: 'Fact Checker', icon: CheckCircle2, done: true, msg: 'Verified 12 sources' },
  { color: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400', label: 'Writer', icon: Edit3, done: false, msg: 'Synthesizing report…' },
];

export function HeroSection() {
  return (
    <section className="relative pt-36 pb-24 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.12),transparent)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-48 bg-gradient-to-b from-indigo-500/30 to-transparent" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/8 text-[12px] font-semibold text-indigo-300 mb-7 tracking-wide"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Nexus v2.0 — Now with Project Collections
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[1.05] mb-6"
        >
          <span className="text-white">Research at</span><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-300 to-zinc-600">
            the speed of thought.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed"
        >
          Deploy a swarm of specialized AI agents that plan, search, fact-check, and write — turning any question into a comprehensive intelligence report in minutes.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3 mb-8"
        >
          <Link
            to="/signup"
            className="group flex items-center gap-2 px-6 py-3 bg-white text-black text-[14px] font-semibold rounded-xl hover:bg-zinc-100 transition-all shadow-xl shadow-white/10 hover:shadow-white/20"
          >
            Start for free
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="https://github.com/14-himanshu/nexus-research"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3 text-[14px] font-medium text-zinc-400 border border-white/[0.08] hover:border-white/15 hover:text-white rounded-xl hover:bg-white/[0.04] transition-all"
          >
            View on GitHub
          </a>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-wrap justify-center gap-2 mb-16"
        >
          {BADGE_ITEMS.map(b => (
            <span key={b} className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium bg-white/[0.03] border border-white/[0.06] px-3 py-1 rounded-full">
              <CheckCircle2 size={10} className="text-emerald-500" />
              {b}
            </span>
          ))}
        </motion.div>

        {/* Hero Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-4xl relative"
        >
          {/* Glow under mockup */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 blur-3xl rounded-full" />

          {/* Browser chrome */}
          <div className="relative rounded-2xl border border-white/[0.10] bg-[#0d0d14] shadow-2xl shadow-black/60 overflow-hidden">
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0a0a10]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[11px] text-zinc-500 font-mono">
                <Lock size={10} />
                nexus.research/workspace
              </div>
              <div className="w-16" />
            </div>

            {/* App content */}
            <div className="flex" style={{ height: '420px' }}>
              {/* Sidebar sim */}
              <div className="w-52 border-r border-white/[0.06] bg-[#0d0d14] p-4 flex flex-col gap-1 shrink-0">
                <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-3 px-1">Library</div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.07] text-[12px] text-white font-medium">
                  <div className="w-3.5 h-3.5 rounded-full bg-indigo-500/30 border border-indigo-500/50" />
                  All Research
                </div>
                <div className="mt-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-2 px-1">Projects</div>
                {['AI Market Study', 'Battery Tech', 'Climate Research'].map((p, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] ${i === 0 ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    <span className="text-zinc-700">#</span> {p}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 p-6 overflow-hidden">
                {/* Pipeline steps */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {PIPELINE_STEPS.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + i * 0.2 }}
                        className={`rounded-xl border p-3 text-center ${step.color} bg-opacity-20`}
                      >
                        <Icon size={14} className="mx-auto mb-1.5" />
                        <div className="text-[10px] font-bold text-white">{step.label}</div>
                        <div className={`text-[9px] mt-0.5 ${step.done ? 'text-emerald-400' : 'text-zinc-500'}`}>{step.msg}</div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Report preview */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5"
                >
                  <div className="text-base font-bold text-white mb-2">The Future of Solid-State Batteries</div>
                  <div className="text-[12px] text-zinc-400 leading-relaxed mb-4">
                    The state of solid-state batteries in 2026 indicates a massive shift towards silicon anodes, enabling a 40% increase in energy density compared to traditional lithium-ion architectures…
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 rounded bg-white/[0.05] w-full overflow-hidden">
                      <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                    <div className="h-2 rounded bg-white/[0.05] w-4/5" />
                    <div className="h-2 rounded bg-white/[0.05] w-3/4" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
