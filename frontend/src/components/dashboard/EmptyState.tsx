import { Sparkles } from 'lucide-react';
import { ChatInput } from '../ChatInput';

interface EmptyStateProps {
    startResearch: (query: string, depth: string) => void;
    stopResearch: () => void;
    isSearching: boolean;
    restoreReport: (query: string, report: string, depth: string, id: number) => void;
}

export function EmptyState({ startResearch, stopResearch, isSearching, restoreReport }: EmptyStateProps) {
    const suggestions = [
        { label: "Solid-state batteries", icon: "🔋", prompt: "Latest breakthroughs in solid-state batteries" },
        { label: "AI in 2024", icon: "🤖", prompt: "Economic impact of AI in 2024" },
        { label: "Multi-agent systems", icon: "🕸️", prompt: "Architectures for multi-agent systems" },
        { label: "Quantum computing", icon: "⚛️", prompt: "How do quantum computers work?" }
    ];

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-20 relative">
            
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_50%)] pointer-events-none" />

            <div className="text-center mb-8 transform transition-all duration-700 relative z-10">
                <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-6 border border-white/10">
                    <Sparkles className="text-blue-400" size={28} />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                    What will you research today?
                </h2>
                <p className="text-zinc-400 text-lg">
                    Enter a topic to dispatch the autonomous pipeline.
                </p>
            </div>
            
            <div className="w-full max-w-3xl relative z-10">
                <ChatInput onSearch={startResearch} onStop={stopResearch} isSearching={isSearching} onRestore={restoreReport} />
                
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {suggestions.map(s => (
                    <button
                        key={s.prompt}
                        onClick={() => startResearch(s.prompt, 'standard')}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium bg-white/5 border border-white/5 text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-colors"
                    >
                        <span>{s.icon}</span>
                        {s.label}
                    </button>
                    ))}
                </div>
            </div>
            <div className="fixed bottom-6 text-zinc-600 text-xs tracking-wider flex flex-col items-center gap-1 opacity-50 font-medium">
                <span>Powered by LangGraph + Google Gemini</span>
            </div>
        </div>
    );
}
