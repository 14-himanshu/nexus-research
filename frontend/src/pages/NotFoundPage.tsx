import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      <div className="relative z-10 w-20 h-20 bg-white/5 text-white rounded-2xl flex items-center justify-center font-bold text-3xl mb-8 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
        404
      </div>
      <h1 className="relative z-10 text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Page not found</h1>
      <p className="relative z-10 text-zinc-400 max-w-md mb-10 text-lg">
        The intelligence you are looking for doesn't exist or has been relocated.
      </p>
      <Link 
        to="/"
        className="relative z-10 group flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Return to Nexus
      </Link>
    </div>
  );
}
