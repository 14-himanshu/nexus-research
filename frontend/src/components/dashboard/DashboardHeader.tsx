import { LogOut, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  user: { username: string; [key: string]: any };
  backendStatus: 'online' | 'checking' | 'error' | 'offline';
  onSettingsClick: () => void;
  onLogout: () => void;
  lastQuery: string;
  totalReports?: number;
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
}

export function DashboardHeader({ user, backendStatus, onSettingsClick, onLogout, lastQuery, totalReports, isSidebarOpen, toggleSidebar }: DashboardHeaderProps) {
  const navigate = useNavigate();

  const statusConfig = {
    online: { dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]', text: 'Live', color: 'text-emerald-400' },
    checking: { dot: 'bg-amber-400', text: 'Connecting', color: 'text-amber-400' },
    error: { dot: 'bg-red-400', text: 'Error', color: 'text-red-400' },
    offline: { dot: 'bg-zinc-500', text: 'Offline', color: 'text-zinc-500' },
  };
  const status = statusConfig[backendStatus] || statusConfig.offline;

  return (
    <header className="h-14 px-4 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl shrink-0 z-20">
      {/* Left: Toggle + Logo */}
      <div className="flex items-center gap-3">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="p-2 text-zinc-500 hover:text-white hover:bg-white/[0.07] rounded-lg transition-all duration-200"
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
        )}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => navigate('/dashboard')}
        >
          <img src="/favicon.svg" alt="Nexus Logo" className="w-7 h-7 drop-shadow-md group-hover:scale-105 transition-transform" />
          <span className="text-sm font-bold tracking-tight text-white hidden sm:block">Nexus</span>
        </div>
        {lastQuery && (
          <div className="hidden md:flex items-center gap-2 text-[13px]">
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-400 truncate max-w-[280px] font-medium">{lastQuery}</span>
          </div>
        )}
      </div>

      {/* Right: Status + User */}
      <div className="flex items-center gap-2">
        {/* Backend Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-xs font-medium">
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`} />
          <span className={status.color}>{status.text}</span>
        </div>

        <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500/40 to-purple-500/40 text-white flex items-center justify-center text-xs font-bold border border-white/10 shrink-0">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-[13px] font-medium text-zinc-200 leading-tight">{user.username}</span>
            {totalReports !== undefined && (
              <span className="text-[10px] text-zinc-500">{totalReports} reports</span>
            )}
          </div>
        </div>

        <button
          onClick={onSettingsClick}
          className="p-2 text-zinc-500 hover:text-white hover:bg-white/[0.07] rounded-lg transition-all duration-200"
          title="Settings"
        >
          <Settings size={16} />
        </button>
        <button
          onClick={() => { if (window.confirm('Sign out of Nexus?')) onLogout(); }}
          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
