import { motion } from 'framer-motion';

const TECH = ['LangGraph', 'Google Gemini', 'FastAPI', 'React', 'Tailwind CSS', 'SQLite', 'Groq LPU', 'Python 3.12'];

export function SocialProof() {
  return (
    <section className="relative py-20 px-6 border-t border-white/[0.05] overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-10">
          Built with the best open-source stack
        </p>

        {/* Scrolling tech badges */}
        <div
          className="flex overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            className="flex items-center gap-3 w-max"
          >
            {[...TECH, ...TECH].map((tech, i) => (
              <span
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.07] bg-white/[0.03] text-[13px] font-medium text-zinc-500 whitespace-nowrap shrink-0"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
