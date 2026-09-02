import { useEffect, useState } from 'react';
import { useResearchStream } from '../hooks/useResearchStream';
import { ResearchReport } from '../components/ResearchReport';
import { ChatInput } from '../components/ChatInput';
import { AgentTracker } from '../components/AgentTracker';
import { Sparkles, RefreshCw, AlertTriangle, ChevronDown } from 'lucide-react';
import { SettingsModal } from '../components/SettingsModal';
import { useAuth } from '../context/AuthContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { EmptyState } from '../components/dashboard/EmptyState';
import { Sidebar } from '../components/dashboard/Sidebar';
import { useCollections } from '../hooks/useCollections';

export function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPipelineExpanded, setIsPipelineExpanded] = useState(true);
  const [totalReports] = useState<number>(0);

  const { collections, activeCollectionId, setActiveCollectionId, createCollection, deleteCollection } = useCollections();

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

  const hasContent = !!(reportTokens || finalReport || isSearching || error);

  const agentValues = Object.values(agents);
  const hasAgentActivity = agentValues.some(a => a.state !== 'idle');
  const allAgentsDone = agentValues.length > 0 && agentValues.every(a => a.state === 'done' || a.state === 'error');

  // Auto-collapse pipeline when all agents are done and report is rendering
  useEffect(() => {
    if (allAgentsDone && (reportTokens || finalReport)) {
      const timer = setTimeout(() => setIsPipelineExpanded(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [allAgentsDone, reportTokens, finalReport]);

  // Re-expand pipeline when new search starts
  useEffect(() => {
    if (isSearching) setIsPipelineExpanded(true);
  }, [isSearching]);

  useEffect(() => {
    if (isSearching) document.title = 'Researching… · Nexus';
    else if (finalReport) document.title = 'Report Ready · Nexus';
    else document.title = 'Nexus · AI Research';
  }, [isSearching, finalReport]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/10 border-t-white/80 rounded-full animate-spin" />
          <p className="text-sm text-zinc-600 font-medium">Loading workspace…</p>
        </div>
      </div>
    );
  }

  const showPipeline = hasAgentActivity && hasContent;

  return (
    <div className="h-screen bg-[#0a0a0f] text-zinc-300 font-sans flex flex-col overflow-hidden">
      {/* Fixed Header */}
      {user && (
        <DashboardHeader
          user={user}
          backendStatus={backendStatus}
          onSettingsClick={() => setShowSettings(true)}
          onLogout={logout}
          lastQuery={lastQuery}
          totalReports={totalReports}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(p => !p)}
        />
      )}

      {/* Body: sidebar + main */}
      <div className="flex-1 flex flex-row overflow-hidden min-h-0">
        {/* Collapsible Sidebar */}
        {user && (
          <Sidebar
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            collections={collections}
            activeCollectionId={activeCollectionId}
            onSelectCollection={setActiveCollectionId}
            onCreateCollection={createCollection}
            onDeleteCollection={deleteCollection}
          />
        )}

        {/* Main workspace column */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

          {/* ── Empty state ─────────────────────────────────── */}
          {!hasContent && (
            <EmptyState
              startResearch={startResearch}
              stopResearch={stopResearch}
              isSearching={isSearching}
              restoreReport={restoreReport}
              activeCollectionId={activeCollectionId}
              collections={collections}
            />
          )}

          {/* ── Active workspace ─────────────────────────────── */}
          {hasContent && (
            <div className="flex-1 flex flex-row overflow-hidden w-full h-full relative">
              
              {/* Left: Report Content & Input */}
              <div className="flex-1 flex flex-col min-w-0 relative h-full">
              {/* Pipeline tracker — banner for < xl screens */}
              {showPipeline && (
                <div className="xl:hidden shrink-0 border-b border-white/[0.06] bg-[#0a0a0f]">
                  <div className="max-w-4xl mx-auto px-6">
                    {/* Collapse toggle header */}
                    <button
                      onClick={() => setIsPipelineExpanded(p => !p)}
                      className="w-full flex items-center justify-between py-2.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest hover:text-zinc-300 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {agentValues.map((a, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                                a.state === 'done' ? 'bg-emerald-400' :
                                a.state === 'working' ? 'bg-white animate-pulse' :
                                'bg-white/20'
                              }`}
                            />
                          ))}
                        </div>
                        Pipeline
                        {allAgentsDone && (
                          <span className="text-emerald-400 normal-case font-medium tracking-normal text-[11px]">· Complete</span>
                        )}
                      </div>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isPipelineExpanded ? 'rotate-0' : 'rotate-180'}`}
                      />
                    </button>

                    {/* Expanded tracker */}
                    {isPipelineExpanded && (
                      <div className="pb-4">
                        <AgentTracker agents={agents} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Scrollable content — error + skeleton + report */}
              <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide" style={{ paddingBottom: '110px' }}>
                <div className="max-w-4xl mx-auto px-6 pt-6">

                  {/* Error */}
                  {error && (
                    <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                          <AlertTriangle size={18} className="text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-red-300 mb-1">Pipeline Interrupted</h3>
                          <p className="text-sm text-red-400/80 break-words">{error}</p>
                          <button
                            onClick={() => startResearch(lastQuery)}
                            className="mt-4 flex items-center gap-2 text-sm font-medium text-red-300 hover:text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 py-2 rounded-xl transition-all duration-200"
                          >
                            <RefreshCw size={14} />
                            Retry Research
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Skeleton while waiting for first tokens */}
                  {isSearching && !reportTokens && !finalReport && !error && (
                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 space-y-4 animate-pulse">
                      <div className="flex items-center gap-3 mb-6">
                        <Sparkles size={18} className="text-indigo-400 animate-spin" />
                        <span className="text-sm font-medium text-zinc-400">
                          Researching: <span className="text-white">"{lastQuery}"</span>
                        </span>
                      </div>
                      <div className="h-8 bg-white/[0.04] rounded-lg w-3/4" />
                      <div className="h-4 bg-white/[0.04] rounded w-full mt-4" />
                      <div className="h-4 bg-white/[0.04] rounded w-5/6" />
                      <div className="h-4 bg-white/[0.04] rounded w-4/5" />
                      <div className="h-36 bg-white/[0.04] rounded-xl w-full mt-6" />
                      <div className="h-4 bg-white/[0.04] rounded w-full" />
                      <div className="h-4 bg-white/[0.04] rounded w-3/4" />
                    </div>
                  )}

                  {/* Research report */}
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

              {/* Floating chat input — gradient fade, fixed to bottom of main */}
              <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-20">
                <div className="bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/90 to-transparent pt-10 pb-5 px-6">
                  <div className="max-w-2xl mx-auto pointer-events-auto">
                    <ChatInput
                      onSearch={startResearch}
                      onStop={stopResearch}
                      isSearching={isSearching}
                      onRestore={restoreReport}
                      activeCollectionId={activeCollectionId}
                    />
                  </div>
                </div>
              </div>
                </div>
              
              {/* Right: Pipeline Side-panel for xl screens */}
              {showPipeline && (
                <div className="hidden xl:flex flex-col w-[350px] shrink-0 border-l border-white/[0.06] bg-[#0d0d14] overflow-y-auto">
                  <div className="p-4">
                    <AgentTracker agents={agents} />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
