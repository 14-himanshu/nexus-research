import { Bot, Database, Lock, Code2, Zap, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: Bot,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    title: 'Multi-Agent Architecture',
    description: 'Not simple chains — a LangGraph state machine where Planner, Researcher, Fact-Checker, and Writer agents collaborate iteratively to produce verified intelligence.',
    size: 'large',
  },
  {
    icon: Database,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Bring Your Own Key',
    description: 'Connect your Groq API key to bypass rate limits and run unlimited deep research at cost.',
    size: 'small',
  },
  {
    icon: Lock,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Private Workspaces',
    description: 'Isolated SQLite storage per user. Your research stays strictly confidential.',
    size: 'small',
  },
  {
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    title: 'Three Research Depths',
    description: 'Quick (30s), Standard (60s), or Deep (2min+) — match your query complexity to the right agent depth.',
    size: 'small',
  },
  {
    icon: Code2,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
    title: 'Developer-First Exports',
    description: 'Export to beautifully formatted Markdown or print professional PDF reports. Built for modern research workflows.',
    size: 'large',
  },
  {
    icon: FileText,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'Project Collections',
    description: 'Organize your research into projects. Keep multiple investigations separate and easily revisit them.',
    size: 'small',
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Features</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-5">
            Built for depth.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600">
              Engineered for speed.
            </span>
          </h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            Every component is designed to deliver research that's thorough, accurate, and beautifully presented.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className={`group relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 hover:border-white/[0.13] hover:bg-white/[0.04] transition-all duration-300 overflow-hidden ${
                  f.size === 'large' ? 'md:col-span-2' : ''
                }`}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Icon */}
                <div className={`inline-flex p-2.5 rounded-xl border mb-5 ${f.bg}`}>
                  <Icon size={20} className={f.color} />
                </div>

                <h3 className="text-[17px] font-semibold text-white mb-2.5">{f.title}</h3>
                <p className="text-[14px] text-zinc-500 leading-relaxed">{f.description}</p>

                {/* Code block for developer export feature */}
                {f.icon === Code2 && (
                  <div className="mt-6 rounded-xl bg-[#080810] border border-white/[0.06] p-4 font-mono text-[11px] overflow-hidden">
                    <div className="flex gap-3">
                      <span className="text-zinc-700 select-none">1<br />2<br />3<br />4</span>
                      <pre className="text-emerald-400">
{`# Executive Summary
The state of solid-state batteries in 2026...

> Source: MIT Technology Review [1]`}
                      </pre>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
