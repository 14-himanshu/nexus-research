import { useEffect, useState } from 'react';
import { useResearchStream } from '../hooks/useResearchStream';
import { ResearchReport } from '../components/ResearchReport';
import { ChatInput } from '../components/ChatInput';
import { AgentTracker } from '../components/AgentTracker';
import { Sparkles, RefreshCw } from 'lucide-react';
import { SettingsModal } from '../components/SettingsModal';
import { useAuth } from '../context/AuthContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { EmptyState } from '../components/dashboard/EmptyState';

export function DashboardPage() {
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



  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans flex flex-col relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

      {user && (
          <DashboardHeader 
            user={user} 
            backendStatus={backendStatus} 
            onSettingsClick={() => setShowSettings(true)} 
            onLogout={logout} 
            lastQuery={lastQuery}
          />
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* Main Workspace */}
      <main className="flex-1 relative w-full max-w-[1600px] mx-auto flex flex-col">
        
        {/* Empty State / Initial Search */}
        {!(reportTokens || finalReport || isSearching || error) ? (
          <EmptyState 
            startResearch={startResearch} 
            stopResearch={stopResearch} 
            isSearching={isSearching} 
            restoreReport={restoreReport} 
          />
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

      {/* Floating Bottom Search Pill */}
      {(reportTokens || finalReport || isSearching || error) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-30 print:hidden pointer-events-none animate-in slide-in-from-bottom-8 duration-500">
          <div className="pointer-events-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              <ChatInput onSearch={startResearch} onStop={stopResearch} isSearching={isSearching} onRestore={restoreReport} />
          </div>
        </div>
      )}
    </div>
  );
}

