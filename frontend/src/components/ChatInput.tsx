import React, { useState, useEffect, useRef } from 'react';
import { API_BASE } from '../lib/api';
import { Search, Square, Loader2, Clock, History, Trash2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

interface ChatInputProps {
  onSearch: (query: string, depth: string, collection_id?: number | null) => void;
  onStop: () => void;
  isSearching: boolean;
  onRestore?: (query: string, report: string, depth: string, id: number) => void;
  activeCollectionId?: number | null;
}

const PLACEHOLDERS = [
  'Ask a complex research question…',
  'What are the economic impacts of AI in 2024?',
  'Compare multi-agent system architectures…',
  'Summarize breakthroughs in fusion energy…',
];

const DEPTH_OPTIONS = [
  { value: 'quick', label: 'Quick', desc: '~30s' },
  { value: 'standard', label: 'Standard', desc: '~60s' },
  { value: 'deep', label: 'Deep', desc: '~2min' },
];

export function ChatInput({ onSearch, onStop, isSearching, onRestore, activeCollectionId }: ChatInputProps) {
  const { token } = useAuth();
  const [query, setQuery] = useState('');
  const [depth, setDepth] = useState('standard');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [history, setHistory] = useState<Array<{id: number, query: string, depth: string, created_at: string}>>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showDepthMenu, setShowDepthMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const depthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showHistory && token) {
      const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
          const url = activeCollectionId
            ? `${API_BASE}/history?collection_id=${activeCollectionId}`
            : `${API_BASE}/history`;
          const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
          if (res.ok) setHistory(await res.json());
        } catch (e) {
          console.error('Failed to load history', e);
        } finally {
          setIsLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [showHistory, token, activeCollectionId]);

  // ⌘K focus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Depth shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !isSearching) {
        if (e.key === '1') { e.preventDefault(); setDepth('quick'); }
        if (e.key === '2') { e.preventDefault(); setDepth('standard'); }
        if (e.key === '3') { e.preventDefault(); setDepth('deep'); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isSearching]);

  // Rotate placeholders
  useEffect(() => {
    const iv = setInterval(() => setPlaceholderIdx(p => (p + 1) % PLACEHOLDERS.length), 4000);
    return () => clearInterval(iv);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
      if (depthRef.current && !depthRef.current.contains(e.target as Node)) {
        setShowDepthMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e: React.FormEvent | { preventDefault: () => void }) => {
    if ('preventDefault' in e) e.preventDefault();
    if (query.trim() && !isSearching) {
      onSearch(query.trim(), depth, activeCollectionId);
      setQuery('');
      setShowHistory(false);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleHistoryClick = async (h: any) => {
    setShowHistory(false);
    try {
      const res = await fetch(`${API_BASE}/history/${h.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (onRestore) onRestore(data.query, data.report, data.depth, data.id);
      }
    } catch (e) {
      console.error('Failed to restore', e);
    }
  };

  const handleDeleteHistory = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await fetch(`${API_BASE}/history/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setHistory(prev => prev.filter(h => h.id !== id));
      toast.success('Removed from history');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const currentDepth = DEPTH_OPTIONS.find(d => d.value === depth) || DEPTH_OPTIONS[1];

  return (
    <div className="w-full relative">
      <form ref={formRef} onSubmit={handleSubmit} className="relative">
        {/* Main input container */}
        <div className={`relative rounded-2xl border transition-all duration-200 ${
          isSearching
            ? 'border-white/20 bg-[#0f0f1a]/90 shadow-[0_0_40px_rgba(99,102,241,0.08)]'
            : 'border-white/[0.09] bg-[#0f0f1a]/80 hover:border-white/15 focus-within:border-white/20 focus-within:shadow-[0_0_30px_rgba(99,102,241,0.06)]'
        } backdrop-blur-2xl shadow-2xl`}>

          <textarea
            ref={textareaRef}
            value={query}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowHistory(true)}
            disabled={isSearching}
            placeholder={PLACEHOLDERS[placeholderIdx]}
            rows={1}
            className="w-full bg-transparent text-white py-4 pl-5 pr-4 focus:outline-none resize-none disabled:opacity-40 text-[15px] min-h-[56px] placeholder:text-zinc-600 leading-relaxed"
            style={{ overflowY: query.split('\n').length > 4 ? 'auto' : 'hidden' }}
          />

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-4 pb-3 gap-3">
            {/* Left: Depth selector */}
            <div ref={depthRef} className="relative">
              <button
                type="button"
                onClick={() => setShowDepthMenu(p => !p)}
                disabled={isSearching}
                className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 hover:text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] px-2.5 py-1.5 rounded-lg transition-all duration-200 disabled:opacity-40"
              >
                <span>{currentDepth.label}</span>
                <span className="text-zinc-700">{currentDepth.desc}</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${showDepthMenu ? 'rotate-180' : ''}`} />
              </button>

              {showDepthMenu && (
                <div className="absolute bottom-full mb-2 left-0 bg-[#111118] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 min-w-[140px]">
                  {DEPTH_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setDepth(opt.value); setShowDepthMenu(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-[13px] text-left transition-colors ${
                        depth === opt.value
                          ? 'bg-white/10 text-white font-medium'
                          : 'text-zinc-400 hover:bg-white/[0.07] hover:text-white'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className="text-zinc-600 text-[11px]">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Hint + Actions */}
            <div className="flex items-center gap-2">
              {!query && !isSearching && (
                <button
                  type="button"
                  onClick={() => setShowHistory(p => !p)}
                  className="p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.07] rounded-lg transition-all duration-200"
                  title="Recent searches"
                >
                  <History size={15} />
                </button>
              )}
              <span className="text-[11px] text-zinc-700 hidden sm:block">
                <kbd className="bg-white/[0.06] border border-white/10 px-1.5 py-0.5 rounded text-[10px]">↵</kbd> to search
              </span>

              {isSearching ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-xl transition-all duration-200 text-[13px] shadow-lg shadow-red-500/10 font-semibold shrink-0"
                >
                  <div className="relative w-4 h-4">
                    <Loader2 size={14} className="animate-spin absolute inset-0" />
                    <Square size={6} fill="currentColor" className="absolute inset-0 m-auto" />
                  </div>
                  Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-[#0a0a0f] font-semibold rounded-xl hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 text-[13px] shadow-lg shadow-white/10 shrink-0"
                >
                  <Search size={14} strokeWidth={2.5} />
                  Research
                </button>
              )}
            </div>
          </div>
        </div>

        {/* History dropdown — appears above */}
        {showHistory && (history.length > 0 || isLoadingHistory) && !query && (
          <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 bg-[#111118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 backdrop-blur-xl">
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/[0.06]">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Recent Searches</span>
            </div>
            <ul className="max-h-[260px] overflow-y-auto scrollbar-hide">
              {isLoadingHistory ? (
                [1, 2, 3].map(i => (
                  <li key={i} className="flex items-center px-4 py-3 gap-3">
                    <div className="w-3 h-3 rounded-full bg-white/[0.07] animate-pulse shrink-0" />
                    <div className="h-3.5 bg-white/[0.07] rounded animate-pulse flex-1" />
                  </li>
                ))
              ) : (
                history.slice(0, 8).map((h, i) => (
                  <li key={i} className="group/item flex items-center border-b border-white/[0.04] last:border-0 hover:bg-white/[0.04] transition-colors">
                    <button
                      type="button"
                      onClick={() => handleHistoryClick(h)}
                      className="flex-1 text-left px-4 py-3 text-[13px] text-zinc-300 flex items-center gap-3"
                    >
                      <Clock size={13} className="text-zinc-600 shrink-0" />
                      <span className="truncate">{h.query}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteHistory(e, h.id)}
                      className="p-3 text-zinc-600 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all duration-200"
                    >
                      <Trash2 size={13} />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}
