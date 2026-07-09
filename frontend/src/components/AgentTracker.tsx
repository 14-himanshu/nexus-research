import { useState, useEffect } from 'react';
import type { AgentState } from '../hooks/useResearchStream';
import { BrainCircuit, Search, CheckCircle, PenTool, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
  planner: BrainCircuit,
  researcher: Search,
  fact_checker: CheckCircle,
  writer: PenTool,
};

interface AgentTrackerProps {
  agents: Record<string, AgentState>;
}

function AgentItem({ 
  agentKey, 
  agent, 
  isLast,
  index
}: { 
  agentKey: string; 
  agent: AgentState; 
  isLast: boolean;
  index: number;
}) {
  const TOOLTIPS: Record<string, string> = {
    planner: "Analyzes the query and creates a step-by-step research plan.",
    researcher: "Executes searches and scrapes web pages for information.",
    fact_checker: "Verifies extracted facts and filters out noise.",
    writer: "Synthesizes facts into a comprehensive markdown report."
  };
  const Icon = iconMap[agentKey as keyof typeof iconMap] || BrainCircuit;
  const isWorking = agent.state === 'working';
  const isDone = agent.state === 'done';
  const isError = agent.state === 'error';
  const isPending = agent.state === 'idle';

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (isWorking || isPending) {
      setElapsed(0);
    }
  }, [isWorking, isPending]);

  useEffect(() => {
    let interval: number;
    if (isWorking) {
      interval = window.setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorking]);

  return (
    <div className="relative group lg:mb-1" tabIndex={0}>
      {/* Custom Tooltip */}
      <div className="absolute lg:left-full lg:top-1/2 lg:-translate-y-1/2 lg:ml-4 left-0 -top-12 lg:-top-auto opacity-0 invisible group-hover:opacity-100 group-hover:visible focus:opacity-100 focus:visible active:opacity-100 active:visible transition-all bg-[#09090b] border border-white/10 text-zinc-300 text-[11px] px-3 py-2 rounded-lg z-50 shadow-xl w-64 pointer-events-none">
        {TOOLTIPS[agentKey]}
      </div>
      
      {/* Visual connecting line */}
      {!isLast && (
        <div className={`hidden lg:block absolute left-[19px] top-[40px] bottom-[-12px] w-[2px] z-0 transition-colors duration-500 ${
          isDone ? 'bg-emerald-500/40' : 'bg-white/10'
        }`} />
      )}
      
      <motion.div
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`relative z-10 p-3 flex items-center gap-4 rounded-xl transition-all duration-500 ${
          isWorking ? 'opacity-100 bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.03)]' :
          isDone ? 'opacity-70 hover:opacity-100' :
          isError ? 'opacity-100' :
          'opacity-30'
        }`}
      >
        <div className="relative shrink-0">
          <div className={`relative z-10 p-2 rounded-lg transition-colors duration-500 ${
            isWorking ? 'bg-white text-[#09090b]' :
            isDone ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
            isError ? 'bg-red-500/20 text-red-400' :
            'bg-white/5 text-zinc-500'
          }`}>
            {isWorking ? <Loader2 size={16} className="animate-spin" /> :
             isError ? <AlertCircle size={16} /> :
             isDone ? <CheckCircle size={16} /> :
             <Icon size={16} />}
          </div>
          {/* Pulsing ring when working */}
          {isWorking && (
            <div className="absolute inset-0 bg-white/30 rounded-lg animate-ping z-0" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h4 className={`font-semibold text-sm tracking-wide flex items-center gap-2 ${
              isWorking ? 'text-white' : 
              isDone ? 'text-emerald-400' : 
              isError ? 'text-red-400' : 'text-zinc-500'
            }`}>
              <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                isWorking ? 'bg-white/20' : 'bg-white/5'
              }`}>Step {index + 1}</span>
              <span className="truncate">{agent.name}</span>
            </h4>
            {isWorking && (
              <span className="text-xs font-mono text-zinc-400 font-medium shrink-0 ml-2">
                {elapsed >= 60 ? `${Math.floor(elapsed / 60)}m ${elapsed % 60}s` : `${elapsed}s`}
              </span>
            )}
          </div>
          <p className="text-[13px] text-zinc-500 truncate mt-0.5 font-light">
            {agent.statusText}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function AgentTracker({ agents }: AgentTrackerProps) {
  const agentEntries = Object.entries(agents);
  return (
    <div className="w-full lg:max-w-sm flex flex-col pt-4 lg:sticky lg:top-24">
      <div className="flex items-center gap-3 mb-4 lg:mb-6 px-2">
        <h3 className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">Execution Pipeline</h3>
        <div className="h-px bg-white/10 flex-1"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-0 lg:block">
        <AnimatePresence>
          {agentEntries.map(([key, agent], index) => (
            <AgentItem 
              key={key} 
              agentKey={key} 
              agent={agent} 
              isLast={index === agentEntries.length - 1} 
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
