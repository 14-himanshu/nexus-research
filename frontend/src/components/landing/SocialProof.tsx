export function SocialProof() {
  const logos = ["OpenAI", "Anthropic", "DeepMind", "Google", "Meta", "Mistral"];
  return (
    <section className="relative z-10 py-16 px-6 border-t border-white/5 bg-black overflow-hidden">
      <div className="max-w-[1200px] mx-auto text-center">
        <p className="text-sm font-medium text-zinc-500 mb-8 uppercase tracking-widest">
          Powering research pipelines for the world's most advanced teams
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-40 grayscale">
          {logos.map(logo => (
            <span key={logo} className="text-xl md:text-2xl font-bold font-serif tracking-tight text-white">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
