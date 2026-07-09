import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-xl shadow-black/20'
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold text-base shadow-lg shadow-white/10">
            N
          </div>
          <span className="text-[15px] font-bold tracking-tight text-white">Nexus</span>
        </div>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: 'Features', id: 'features' },
            { label: 'How it works', id: 'how-it-works' },
          ].map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={e => scrollTo(e, item.id)}
              className="px-4 py-2 text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/login"
            className="px-4 py-2 text-[13px] font-medium text-zinc-400 hover:text-white transition-colors duration-200"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-white text-black text-[13px] font-semibold rounded-xl hover:bg-zinc-100 transition-all duration-200 shadow-lg shadow-white/10"
          >
            Get started →
          </Link>
        </div>
      </div>
    </nav>
  );
}
