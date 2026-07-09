import { Bot, Database, Lock, Code2 } from 'lucide-react';

export function FeaturesGrid() {
  return (
    <section id="features" className="relative z-10 py-32 px-6 bg-black">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Built for depth. <br className="hidden md:block" />
            <span className="text-zinc-500">Engineered for speed.</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Feature 1 (Large) */}
          <div className="md:col-span-2 p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Bot className="text-zinc-400 mb-6" size={28} />
            <h3 className="text-2xl font-semibold text-white mb-3">Multi-Agent State Machine</h3>
            <p className="text-zinc-400 font-light leading-relaxed max-w-md">
              Nexus doesn't use simple LLM chains. It utilizes LangGraph to create a cyclical state machine where Planner, Researcher, Fact-Checker, and Writer agents iteratively refine the output.
            </p>
          </div>

          {/* Feature 2 (Small) */}
          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors group relative overflow-hidden">
            <Database className="text-zinc-400 mb-6" size={28} />
            <h3 className="text-xl font-semibold text-white mb-3">Bring Your Own Key</h3>
            <p className="text-zinc-400 font-light leading-relaxed text-sm">
              Connect your personal Gemini API key to avoid global rate limits and run unlimited deep research at cost.
            </p>
          </div>

          {/* Feature 3 (Small) */}
          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors group relative overflow-hidden">
            <Lock className="text-zinc-400 mb-6" size={28} />
            <h3 className="text-xl font-semibold text-white mb-3">Private Workspaces</h3>
            <p className="text-zinc-400 font-light leading-relaxed text-sm">
              Enterprise-grade security with isolated SQLite histories. Your research is strictly confidential.
            </p>
          </div>

          {/* Feature 4 (Large) */}
          <div className="md:col-span-2 p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors group relative overflow-hidden flex flex-col justify-between">
            <div>
              <Code2 className="text-zinc-400 mb-6" size={28} />
              <h3 className="text-2xl font-semibold text-white mb-3">Developer-First Exports</h3>
              <p className="text-zinc-400 font-light leading-relaxed max-w-md mb-8">
                Export findings natively into beautifully formatted Markdown or download PDF reports for external stakeholders. 
              </p>
            </div>
            <div className="w-full h-32 rounded-lg bg-black border border-zinc-800 p-4 font-mono text-xs text-emerald-400 overflow-hidden flex items-start">
              <span className="text-zinc-600 select-none mr-4">1<br/>2<br/>3<br/>4</span>
              <pre><code>
{`# Executive Summary
The state of solid-state batteries in 2026 indicates a 
massive shift towards silicon anodes.
> Source: MIT Technology Review [1]`}
              </code></pre>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
