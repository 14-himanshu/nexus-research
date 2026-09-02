import { useState, useEffect } from 'react';
import type { AgentState } from '../hooks/useResearchStream';
import { BrainCircuit, Search, CheckCircle, PenTool, Loader2, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AGENT_CONFIG = {
  planner: {
    icon: BrainCircuit,
    label: 'Planner',
    desc: 'Formulating research plan',
    color: 'from-violet-500/20 to-purple-500/10',
    activeColor: 'text-violet-400',
    iconBg: 'bg-violet-500/10 border-violet-500/20',
  },
  researcher: {
    icon: Search,
    label: 'Researcher',
    desc: 'Searching the web',
    color: 'from-blue-500/20 to-cyan-500/10',
    activeColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
  },
  fact_checker: {
    icon: CheckCircle,
    label: 'Fact Checker',
    desc: 'Verifying information',
    color: 'from-amber-500/20 to-yellow-500/10',
    activeColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
  },
  writer: {
    icon: PenTool,
    label: 'Writer',
    desc: 'Synthesizing report',
    color: 'from-emerald-500/20 to-green-500/10',
    activeColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
  },
};

interface AgentTrackerProps {
  agents: Record<string, AgentState>;
}

function AgentStep({ agentKey, agent, isLast }: { agentKey: string; agent: AgentState; isLast: boolean }) {
  const config = AGENT_CONFIG[agentKey as keyof typeof AGENT_CONFIG];
  const Icon = config?.icon || BrainCircuit;
  const isWorking = agent.state === 'working';
  const isDone = agent.state === 'done';
  const isError = agent.state === 'error';

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (isWorking) setElapsed(0);
  }, [isWorking]);

  useEffect(() => {
    let interval: number;
    if (isWorking) {
      interval = window.setInterval(() => setElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isWorking]);

  return (
    <div className="flex items-center gap-0 flex-1 min-w-0">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex-1 flex flex-col items-center text-center px-2 py-3 rounded-2xl transition-all duration-500 relative min-w-0 ${
          isWorking
            ? `bg-gradient-to-b ${config?.color} border border-white/10`
            : isDone
            ? 'opacity-90'
            : 'opacity-35'
        }`}
      >
        {/* Icon */}
        <div className="relative mb-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-500 ${
            isWorking
              ? 'bg-white text-[#0a0a0f] border-white/30 shadow-lg shadow-white/10'
              : isDone
              ? `${config?.iconBg} ${config?.activeColor} border`
              : isError
              ? 'bg-red-500/10 text-red-400 border-red-500/20'
              : 'bg-white/[0.04] text-zinc-600 border-white/[0.06]'
          }`}>
            {isWorking ? (
              <Loader2 size={17} className="animate-spin" />
            ) : isError ? (
              <AlertCircle size={17} />
            ) : isDone ? (
              <CheckCircle size={17} />
            ) : (
              <Icon size={17} />
            )}
          </div>
          {isWorking && (
            <div className="absolute inset-0 bg-white/20 rounded-xl animate-ping" />
          )}
        </div>

        {/* Label */}
        <span className={`text-[11px] font-semibold leading-tight ${
          isWorking ? 'text-white' : isDone ? config?.activeColor : 'text-zinc-600'
        }`}>
          {config?.label || agent.name}
        </span>

        {/* Status text */}
        <p className={`text-[10px] mt-1 leading-tight max-w-[100px] truncate ${
          isWorking ? 'text-zinc-300' : 'text-zinc-600'
        }`}>
          {isWorking ? (agent.statusText || config?.desc) : isDone ? 'Complete' : isError ? 'Error' : 'Waiting'}
        </p>

        {/* Timer */}
        {isWorking && elapsed > 0 && (
          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-zinc-400 font-mono">
            <Clock size={9} />
            {elapsed >= 60 ? `${Math.floor(elapsed / 60)}m ${elapsed % 60}s` : `${elapsed}s`}
          </div>
        )}
      </motion.div>

      {/* Connector line */}
      {!isLast && (
        <div className={`w-6 h-px shrink-0 mx-1 transition-colors duration-700 ${
          isDone ? 'bg-emerald-500/50' : 'bg-white/10'
        }`} />
      )}
    </div>
  );
}

export function AgentTracker({ agents }: AgentTrackerProps) {
  const agentEntries = Object.entries(agents);

  const activeAgent = agentEntries.find(([, a]) => a.state === 'working');
  const doneCount = agentEntries.filter(([, a]) => a.state === 'done').length;

  return (
    <div className="w-full rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            {agentEntries.map(([key, agent]) => (
              <div
                key={key}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                  agent.state === 'done'
                    ? 'bg-emerald-400'
                    : agent.state === 'working'
                    ? 'bg-white animate-pulse'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
            Pipeline
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-medium">
          {doneCount}/{agentEntries.length} complete
          {activeAgent && (
            <span className="ml-2 text-zinc-400">
              · <span className="text-white font-medium">{activeAgent[1].name}</span> running
            </span>
          )}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/5 relative">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-700 ease-in-out"
          style={{ width: `${(doneCount / agentEntries.length) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex items-stretch gap-0 p-4">
        {agentEntries.map(([key, agent], index) => (
          <AgentStep
            key={key}
            agentKey={key}
            agent={agent}
            isLast={index === agentEntries.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
