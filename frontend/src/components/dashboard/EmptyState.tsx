import { Zap, Sparkles, BookOpen, Microscope, Clock } from 'lucide-react';
import { ChatInput } from '../ChatInput';

interface EmptyStateProps {
    startResearch: (query: string, depth: string, collection_id?: number | null) => void;
    stopResearch: () => void;
    isSearching: boolean;
    restoreReport: (query: string, report: string, depth: string, id: number) => void;
    activeCollectionId?: number | null;
    collections?: any[];
}

const SUGGESTIONS = [
    { label: 'Solid-state batteries', icon: Zap, prompt: 'Latest breakthroughs in solid-state battery technology and commercialization timeline', category: 'Energy' },
    { label: 'AI market in 2024', icon: Sparkles, prompt: 'Economic impact and market size of AI industry in 2024', category: 'Technology' },
    { label: 'Multi-agent systems', icon: BookOpen, prompt: 'Best architectures for multi-agent AI systems and their trade-offs', category: 'AI Research' },
    { label: 'Quantum computing', icon: Microscope, prompt: 'Current state of quantum computing and practical applications timeline', category: 'Science' },
];

export function EmptyState({ startResearch, stopResearch, isSearching, restoreReport, activeCollectionId }: EmptyStateProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Hero */}
            <div className="relative z-10 text-center mb-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-400 tracking-wide mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    Autonomous AI Research
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                    What will you
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"> discover </span>
                    today?
                </h1>
                <p className="text-zinc-400 text-lg leading-relaxed max-w-xl mx-auto">
                    Dispatch a team of AI agents to research any topic. Get a comprehensive, cited, and beautifully formatted report.
                </p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-2xl relative z-10">
                <ChatInput
                    onSearch={startResearch}
                    onStop={stopResearch}
                    isSearching={isSearching}
                    onRestore={restoreReport}
                    activeCollectionId={activeCollectionId}
                />
            </div>

            {/* Suggestion chips */}
            <div className="relative z-10 mt-8 flex flex-col items-center gap-3">
                <p className="text-xs text-zinc-600 font-medium tracking-wide uppercase">Try asking about</p>
                <div className="flex flex-wrap justify-center gap-2 max-w-xl">
                    {SUGGESTIONS.map(s => {
                        const Icon = s.icon;
                        return (
                            <button
                                key={s.prompt}
                                onClick={() => startResearch(s.prompt, 'standard', activeCollectionId)}
                                className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-medium bg-white/[0.04] border border-white/[0.07] text-zinc-400 hover:text-white hover:bg-white/[0.08] hover:border-white/15 transition-all duration-200"
                            >
                                <Icon size={14} className="shrink-0 group-hover:text-indigo-400 transition-colors" />
                                {s.label}
                                <span className="text-[10px] text-zinc-600 bg-white/[0.04] px-1.5 py-0.5 rounded-md ml-1">{s.category}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 flex items-center gap-1.5 text-[11px] text-zinc-700">
                <Clock size={11} />
                <span>Typical research takes 30–120 seconds · Powered by LangGraph + Gemini</span>
            </div>
        </div>
    );
}
