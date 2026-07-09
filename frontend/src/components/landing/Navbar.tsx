import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-white/[0.05]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-zinc-100 text-black rounded-lg flex items-center justify-center font-bold text-lg">
          N
        </div>
        <span className="text-sm font-semibold tracking-tight text-zinc-100">Nexus</span>
      </div>
      <div className="flex items-center gap-4">
        <Link 
          to="/login"
          className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          Log in
        </Link>
        <Link 
          to="/signup"
          className="px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 transition-colors"
        >
          Start for free
        </Link>
      </div>
    </nav>
  );
}
