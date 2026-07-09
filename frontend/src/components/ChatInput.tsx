import React, { useState, useEffect, useRef } from 'react';
import { API_BASE } from '../lib/api';
import { Search, Square, Loader2, Clock, History, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

interface ChatInputProps {
  onSearch: (query: string, depth: string) => void;
  onStop: () => void;
  isSearching: boolean;
  onRestore?: (query: string, report: string, depth: string, id: number) => void;
}

const PLACEHOLDERS = [
  "Ask a complex research question...",
  "What are the economic impacts of AI in 2024?",
  "Compare different architectures for multi-agent systems...",
  "Summarize the latest breakthroughs in fusion energy..."
];

export function ChatInput({ onSearch, onStop, isSearching, onRestore }: ChatInputProps) {
  const { token } = useAuth();
  const [query, setQuery] = useState('');
  const [depth, setDepth] = useState('standard');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [history, setHistory] = useState<Array<{id: number, query: string, depth: string, created_at: string}>>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (showHistory && token) {
      const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
          const baseUrl = API_BASE;
          const res = await fetch(`${baseUrl}/history`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setHistory(data);
          }
        } catch (e) {
          console.error("Failed to load history", e);
        } finally {
          setIsLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [showHistory, token]);

  // ⌘K to focus
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // ⌘1, ⌘2, ⌘3 for depth
  useEffect(() => {
    const handleDepthShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !isSearching) {
        if (e.key === '1') { e.preventDefault(); setDepth('quick'); }
        if (e.key === '2') { e.preventDefault(); setDepth('standard'); }
        if (e.key === '3') { e.preventDefault(); setDepth('deep'); }
      }
    };
    window.addEventListener('keydown', handleDepthShortcut);
    return () => window.removeEventListener('keydown', handleDepthShortcut);
  }, [isSearching]);

  // Cycle placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Click outside to close history
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
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
      const q = query.trim();
      onSearch(q, depth);
      setQuery('');
      setShowHistory(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.blur();
      }
    }
  };

  const handleHistoryClick = async (h: any) => {
    setShowHistory(false);
    try {
      const baseUrl = API_BASE;
      const res = await fetch(`${baseUrl}/history/${h.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (onRestore) {
           onRestore(data.query, data.report, data.depth, data.id);
        }
      }
    } catch (e) {
        console.error("Failed to restore", e);
    }
  };

  const handleDeleteHistory = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      const baseUrl = API_BASE;
      await fetch(`${baseUrl}/history/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setHistory(prev => prev.filter(h => h.id !== id));
      toast.success('Search removed from history');
    } catch (err) {
      console.error("Failed to delete history", err);
      toast.error('Failed to delete from history');
    }
  };

  return (
    <div className="w-full relative">
      <form ref={formRef} onSubmit={handleSubmit} className="relative flex flex-col items-end group">
        <div className={`w-full relative rounded-2xl overflow-hidden transition-all duration-300 border ${isSearching ? 'border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)] bg-zinc-900/80' : 'border-white/10 hover:border-white/20 bg-zinc-900/50 focus-within:bg-zinc-900 focus-within:border-white/30'}`}>
          <textarea
            ref={textareaRef}
            value={query}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowHistory(true)}
            disabled={isSearching}
            placeholder={PLACEHOLDERS[placeholderIdx]}
            rows={1}
            className="w-full bg-transparent text-white py-4 pl-5 pr-16 focus:outline-none resize-none disabled:opacity-50 transition-all text-base min-h-[56px] placeholder:text-zinc-500 leading-relaxed"
            style={{ overflowY: query.split('\n').length > 5 ? 'auto' : 'hidden' }}
          />
          <div className="absolute right-3 bottom-3 z-10 flex items-center gap-2">
            {history.length > 0 && !query && !isSearching && (
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center justify-center h-8 w-8"
                title="Recent Searches"
              >
                <History size={16} />
              </button>
            )}
            {isSearching ? (
              <button
                type="button"
                onClick={onStop}
                className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-all flex items-center justify-center h-8 w-8 border border-red-500/20"
                title="Stop Search"
              >
                <Loader2 size={16} className="animate-spin absolute" />
                <Square size={8} fill="currentColor" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!query.trim()}
                className="p-1.5 bg-white text-[#09090b] hover:bg-zinc-200 disabled:bg-white/5 disabled:text-zinc-600 rounded-lg transition-all flex items-center justify-center h-8 w-8 relative z-20 shadow-md disabled:shadow-none"
              >
                <Search size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* History Dropdown showing UPWARDS */}
        {showHistory && (history.length > 0 || isLoadingHistory) && !query && (
          <div className="absolute bottom-[calc(100%+12px)] left-0 right-0 glass-panel rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="px-4 py-2.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 flex justify-between items-center">
              <span>Recent Searches</span>
            </div>
            <ul className="max-h-[300px] overflow-y-auto">
              {isLoadingHistory ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-center border-b border-white/5 last:border-0 px-4 py-3">
                      <div className="w-3.5 h-3.5 rounded-full bg-white/10 animate-pulse mr-3 shrink-0" />
                      <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
                    </li>
                  ))}
                </>
              ) : (
                history.map((h, i) => (
                  <li key={i} className="group/item flex items-center border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <button
                      type="button"
                      onClick={() => handleHistoryClick(h)}
                      className="flex-1 text-left px-4 py-3 text-[14px] text-zinc-300 flex items-center gap-3"
                    >
                      <Clock size={14} className="text-zinc-500 shrink-0" />
                      <span className="truncate">{h.query}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteHistory(e, h.id)}
                      className="p-3 text-zinc-500 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all"
                      title="Delete from history"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        <div className="text-[11px] text-zinc-500 mt-2.5 px-2 flex justify-between items-center w-full font-medium">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
              <span className="opacity-60">Depth:</span>
              <select 
                value={depth} 
                onChange={(e) => setDepth(e.target.value)}
                disabled={isSearching}
                className="bg-transparent text-zinc-300 focus:outline-none disabled:opacity-50 cursor-pointer appearance-none outline-none py-0.5"
              >
                <option value="quick">Quick</option>
                <option value="standard">Standard</option>
                <option value="deep">Deep</option>
              </select>
            </div>
          </div>
          <span className="opacity-60 hidden sm:inline-block">Press <kbd className="bg-white/10 border border-white/10 px-1.5 py-0.5 rounded text-zinc-300 ml-1 mr-1 text-[10px]">Enter</kbd> to search</span>
        </div>
      </form>
    </div>
  );
}
