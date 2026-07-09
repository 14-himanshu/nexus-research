import { BrainCircuit, Search, CheckCircle2, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

const STEPS = [
  {
    icon: BrainCircuit,
    label: 'Planner',
    number: '01',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/25',
    line: 'bg-gradient-to-r from-violet-500 to-blue-500',
    title: 'Deconstruct & Plan',
    desc: 'Analyzes your question and creates a step-by-step research plan with targeted search queries.',
  },
  {
    icon: Search,
    label: 'Researcher',
    number: '02',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/25',
    line: 'bg-gradient-to-r from-blue-500 to-amber-500',
    title: 'Search & Scrape',
    desc: 'Executes web searches and extracts raw content from dozens of relevant sources in parallel.',
  },
  {
    icon: CheckCircle2,
    label: 'Fact Checker',
    number: '03',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/25',
    line: 'bg-gradient-to-r from-amber-500 to-emerald-500',
    title: 'Verify & Filter',
    desc: 'Cross-references sources, eliminates noise, and validates the most relevant information.',
  },
  {
    icon: Edit3,
    label: 'Writer',
    number: '04',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/25',
    line: '',
    title: 'Synthesize & Write',
    desc: 'Transforms validated data into a comprehensive, well-structured, cited research report.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 px-6 border-t border-white/[0.05]">
      {/* Subtle bg glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(99,102,241,0.04),transparent)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-4">How it works</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-5">
            The autonomous{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600">pipeline.</span>
          </h2>
          <p className="text-zinc-500 text-lg max-w-lg mx-auto">
            Four specialized agents work together in a coordinated graph to produce intelligence no single LLM could.
          </p>
        </div>

        {/* Steps grid — 2x2 on desktop, single column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative flex gap-5 p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
              >
                {/* Step number badge */}
                <div className="shrink-0 flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${step.bg} transition-all duration-300 group-hover:scale-105`}>
                    <Icon size={22} className={step.color} />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-700 font-mono">{step.number}</span>
                </div>

                <div className="pt-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${step.color}`}>{step.label}</span>
                  </div>
                  <h3 className="text-[16px] font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-[13px] text-zinc-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Animated flow connector */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 flex items-center justify-center gap-2"
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${step.bg}`}>
                  <Icon size={14} className={step.color} />
                </div>
                {i < STEPS.length - 1 && (
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '3rem' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.7 + i * 0.15 }}
                    className={`h-[2px] rounded-full ${step.line} overflow-hidden`}
                  />
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
