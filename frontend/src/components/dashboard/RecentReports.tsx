import { useState, useEffect, useRef } from 'react';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { API_BASE } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

interface RecentReportsProps {
  onRestore: (query: string, report: string, depth: string, id: number) => void;
}

interface HistoryItem {
  id: number;
  query: string;
  depth: string;
  created_at: string;
}

export function RecentReports({ onRestore }: RecentReportsProps) {
  const { token } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/history?limit=5`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data.slice(0, 5));
        }
      } catch (e) {
        console.error('Failed to load recent reports', e);
      }
    };
    fetchHistory();
  }, [token]);

  const handleRestore = async (h: HistoryItem) => {
    try {
      const res = await fetch(`${API_BASE}/history/${h.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        onRestore(data.query, data.report, data.depth, data.id);
      }
    } catch (e) {
      console.error('Failed to restore report', e);
    }
  };

  const getRelativeTime = (dateStr: string) => {
    const diffMs = new Date().getTime() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return `Yesterday`;
    return `${diffDays}d ago`;
  };

  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mt-12 mb-4 relative z-10">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <Clock size={12} />
          Pick up where you left off
        </h3>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4 pt-1 scrollbar-hide snap-x"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {history.map((h, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={h.id}
            className="snap-start shrink-0 w-[240px]"
          >
            <button
              onClick={() => handleRestore(h)}
              className="recent-card w-full group relative flex flex-col items-start gap-3 p-4 glass-panel rounded-xl text-left transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.05] overflow-hidden"
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                  h.depth === 'quick' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                  h.depth === 'deep' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                  'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  {h.depth}
                </span>
                <span className="text-[10px] text-zinc-500">{getRelativeTime(h.created_at)}</span>
              </div>
              
              <div className="flex items-start gap-2.5 w-full">
                <BookOpen size={14} className="shrink-0 text-zinc-500 mt-0.5 group-hover:text-indigo-400 transition-colors" />
                <span className="text-sm font-medium text-zinc-300 group-hover:text-white line-clamp-2 leading-snug">
                  {h.query}
                </span>
              </div>

              <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight size={14} className="text-indigo-400" />
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
