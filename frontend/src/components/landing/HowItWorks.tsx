import { Bot, CheckCircle2, Search, Edit3 } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <CheckCircle2 className="text-blue-400" size={24} />,
      title: "1. Planner",
      desc: "Deconstructs the prompt into an execution plan."
    },
    {
      icon: <Search className="text-purple-400" size={24} />,
      title: "2. Researcher",
      desc: "Executes targeted searches across the web."
    },
    {
      icon: <Bot className="text-orange-400" size={24} />,
      title: "3. Fact-Checker",
      desc: "Verifies and filters raw data against sources."
    },
    {
      icon: <Edit3 className="text-rose-400" size={24} />,
      title: "4. Writer",
      desc: "Synthesizes the validated data into a report."
    }
  ];

  return (
    <section id="how-it-works" className="relative z-10 py-32 px-6 bg-black border-t border-zinc-900 overflow-hidden">
      <div className="max-w-[1200px] mx-auto text-center relative">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-20">
          The autonomous <span className="text-zinc-500">pipeline.</span>
        </h2>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-rose-500/20 -translate-y-1/2 z-0" />
          
          {/* Connecting Line (Mobile) */}
          <div className="block md:hidden absolute left-[39px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-rose-500/20 z-0" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-row md:flex-col items-center md:text-center gap-6 md:gap-4 md:w-1/4 group">
              <div className="w-20 h-20 rounded-2xl bg-[#09090b] border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-zinc-600 transition-colors shadow-2xl relative">
                {step.icon}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              </div>
              <div className="text-left md:text-center">
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-400 max-w-[200px] leading-relaxed mx-auto">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
