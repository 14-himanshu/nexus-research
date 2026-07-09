import { useEffect, useState } from 'react';
import { useResearchStream } from './hooks/useResearchStream';
import { ChatInput } from './components/ChatInput';
import { AgentTracker } from './components/AgentTracker';
import { ResearchReport } from './components/ResearchReport';
import { Sparkles, RefreshCw, LogOut, Settings } from 'lucide-react';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, logout, isLoading } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  const {
    agents,
    reportTokens,
    finalReport,
    isSearching,
    error,
    lastQuery,
    reportId,
    startResearch,
    stopResearch,
    restoreReport,
    backendStatus,
    totalTime
  } = useResearchStream();

  useEffect(() => {
    if (isSearching) document.title = 'Researching... | Multi-Agent AI';
    else if (finalReport) document.title = 'Report Ready | Multi-Agent AI';
    else document.title = 'Multi-Agent Research AI';
  }, [isSearching, finalReport]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans flex flex-col relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="px-6 sm:px-10 py-6 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            N
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">Nexus <span className="text-zinc-500 font-medium">Research</span></h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium">
            <div className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : backendStatus === 'checking' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            <span className={backendStatus === 'online' ? 'text-zinc-300' : 'text-zinc-500'}>
              {backendStatus === 'online' ? 'Systems Nominal' : backendStatus === 'checking' ? 'Connecting...' : 'Backend Offline'}
            </span>
          </div>
          
          <div className="flex items-center gap-3 border-l border-white/10 pl-6">
            <span className="text-sm font-medium text-zinc-300">{user.username}</span>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
              title="Settings"
            >
              <Settings size={18} />
            </button>
            <button 
              onClick={logout}
              className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* Main Workspace */}
      <main className="flex-1 relative w-full max-w-[1600px] mx-auto flex flex-col">
        
        {/* Empty State / Initial Search */}
        {!(reportTokens || finalReport || isSearching || error) ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-20">
            <div className="text-center mb-8 transform transition-all duration-700">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                What will you research today?
              </h2>
              <p className="text-zinc-400 text-lg">
                Enter a topic to dispatch the autonomous pipeline.
              </p>
            </div>
            <div className="w-full max-w-3xl">
                <ChatInput onSearch={startResearch} onStop={stopResearch} isSearching={isSearching} onRestore={restoreReport} />
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {[
                    "Latest breakthroughs in solid-state batteries",
                    "Economic impact of AI in 2024",
                    "Architectures for multi-agent systems",
                    "How do quantum computers work?"
                  ].map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => startResearch(prompt, 'standard')}
                      className="px-4 py-2 rounded-full text-xs font-medium bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
            </div>
            <div className="fixed bottom-6 text-zinc-600 text-xs tracking-wider flex flex-col items-center gap-1 opacity-50 font-medium">
               <span>Powered by LangGraph + Google Gemini</span>
            </div>
          </div>
        ) : (
          /* Active Workspace Layout */
          <div className="flex-1 flex flex-col lg:flex-row w-full px-6 pt-6 pb-40 gap-8 relative z-10 h-[calc(100vh-73px)] overflow-y-auto print:overflow-visible print:h-auto print:pb-0">
            
            {/* Left Sidebar: Pipeline */}
            <aside className="w-full lg:w-[320px] shrink-0 print:hidden">
              <div className="sticky top-0">
                <AgentTracker agents={agents} />
              </div>
            </aside>
            
            {/* Main Content Area */}
            <div className="flex-1 min-w-0 max-w-5xl print:max-w-none print:w-full">
              {error && (
                <div className="flex-1 flex flex-col items-center justify-center h-full print:hidden">
                  <div className="glass-panel rounded-2xl p-8 w-full text-center">
                    <div className="text-red-400 mb-2 font-semibold text-lg">Pipeline Interrupted</div>
                    <div className="text-red-200/80 text-sm mb-8 bg-red-950/30 p-4 rounded-xl border border-red-500/20">{error}</div>
                    <button 
                      onClick={() => startResearch(lastQuery)}
                      className="flex items-center gap-2 mx-auto bg-white text-[#09090b] hover:bg-zinc-200 px-5 py-2.5 rounded-lg transition-colors font-medium"
                    >
                      <RefreshCw size={16} />
                      Retry Research
                    </button>
                  </div>
                </div>
              )}

              {isSearching && !reportTokens && !finalReport && !error && (
                <div className="w-full flex flex-col gap-6 p-10 animate-pulse glass-panel rounded-3xl min-h-[500px] print:hidden">
                  <div className="flex items-center gap-3 text-white/70 mb-4">
                    <Sparkles size={20} className="animate-spin text-white/50" />
                    <span className="font-semibold text-lg">Researching: {lastQuery}</span>
                  </div>
                  <div className="h-10 bg-white/5 rounded-xl w-3/4"></div>
                  <div className="h-5 bg-white/5 rounded-lg w-full mt-6"></div>
                  <div className="h-5 bg-white/5 rounded-lg w-5/6"></div>
                  <div className="h-5 bg-white/5 rounded-lg w-4/5"></div>
                  <div className="h-48 bg-white/5 rounded-xl w-full mt-8"></div>
                </div>
              )}

              {(reportTokens || finalReport) && !error && (
                <ResearchReport 
                  content={finalReport || reportTokens} 
                  isStreaming={isSearching && !finalReport} 
                  totalTime={totalTime}
                  reportId={reportId}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom Search Bar */}
      {(reportTokens || finalReport || isSearching || error) && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#09090b] border-t border-white/5 z-30 pt-4 pb-6 px-6 print:hidden">
          <div className="max-w-3xl mx-auto">
              <ChatInput onSearch={startResearch} onStop={stopResearch} isSearching={isSearching} onRestore={restoreReport} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
