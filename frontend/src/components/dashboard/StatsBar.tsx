import { useState, useEffect } from 'react';
import { FileText, Folder, Activity } from 'lucide-react';
import { API_BASE } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface StatsBarProps {
  collectionsCount: number;
}

export function StatsBar({ collectionsCount }: StatsBarProps) {
  const { token } = useAuth();
  const [reportCount, setReportCount] = useState(0);
  const [lastActive, setLastActive] = useState<string>('Never');
  
  useEffect(() => {
    if (!token) return;
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const history = await res.json();
          setReportCount(history.length);
          if (history.length > 0) {
            const lastDate = new Date(history[0].created_at);
            const now = new Date();
            const diffMs = now.getTime() - lastDate.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);
            
            if (diffMins < 60) setLastActive(`${diffMins}m ago`);
            else if (diffHours < 24) setLastActive(`${diffHours}h ago`);
            else if (diffDays === 1) setLastActive(`Yesterday`);
            else setLastActive(`${diffDays}d ago`);
          }
        }
      } catch (e) {
        console.error('Failed to load stats', e);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
      <div className="stat-card flex items-center gap-3 px-5 py-3 glass-panel rounded-2xl transition-all duration-300">
        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
          <FileText size={15} className="text-indigo-400" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Reports</span>
          <span className="text-sm font-bold text-white">{reportCount}</span>
        </div>
      </div>
      
      <div className="stat-card flex items-center gap-3 px-5 py-3 glass-panel rounded-2xl transition-all duration-300">
        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
          <Folder size={15} className="text-purple-400" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Projects</span>
          <span className="text-sm font-bold text-white">{collectionsCount}</span>
        </div>
      </div>
      
      <div className="stat-card flex items-center gap-3 px-5 py-3 glass-panel rounded-2xl transition-all duration-300">
        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <Activity size={15} className="text-emerald-400" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Last Active</span>
          <span className="text-sm font-bold text-white">{lastActive}</span>
        </div>
      </div>
    </div>
  );
}
