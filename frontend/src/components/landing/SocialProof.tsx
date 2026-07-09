import { motion } from 'framer-motion';

export function SocialProof() {
  const logos = ["OpenAI", "Anthropic", "DeepMind", "Google", "Meta", "Mistral"];
  return (
    <section className="relative z-10 py-16 px-6 border-t border-white/5 bg-black overflow-hidden">
      <div className="max-w-[1200px] mx-auto text-center relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-black to-transparent z-10" />
        
        <p className="text-sm font-medium text-zinc-500 mb-8 uppercase tracking-widest relative z-20">
          Powering research pipelines for the world's most advanced teams
        </p>
        
        <div className="flex overflow-hidden">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="flex items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700 w-max"
          >
            {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
              <span key={i} className="text-xl md:text-3xl font-bold font-serif tracking-tight text-white mx-8 md:mx-16 shrink-0">
                {logo}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
