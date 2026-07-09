import { LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  user: { username: string; [key: string]: any };
  backendStatus: 'online' | 'checking' | 'error' | 'offline';
  onSettingsClick: () => void;
  onLogout: () => void;
  lastQuery: string;
}

export function DashboardHeader({ user, backendStatus, onSettingsClick, onLogout, lastQuery }: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="px-6 sm:px-10 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          N
        </div>
        <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white hidden sm:block">Nexus</h1>
            {lastQuery && (
                <>
                    <span className="text-zinc-600">/</span>
                    <span className="text-sm font-medium text-zinc-400 truncate max-w-[200px] sm:max-w-md">"{lastQuery}"</span>
                </>
            )}
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium hidden sm:flex">
          <div className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : backendStatus === 'checking' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
          <span className={backendStatus === 'online' ? 'text-zinc-300' : 'text-zinc-500'}>
            {backendStatus === 'online' ? 'Systems Nominal' : backendStatus === 'checking' ? 'Connecting...' : 'Offline'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 border-l border-white/10 pl-6">
            <div className="flex items-center gap-2 mr-2">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/20">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-zinc-300">{user.username}</span>
            </div>
            <button 
                onClick={onSettingsClick}
                className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                title="Settings"
            >
                <Settings size={16} />
            </button>
            <button 
                onClick={onLogout}
                className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                title="Sign Out"
            >
                <LogOut size={16} />
            </button>
        </div>
      </div>
    </header>
  );
}
