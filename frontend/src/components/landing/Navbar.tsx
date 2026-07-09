import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-colors duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent border-b border-transparent'}`}>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-100 text-black rounded-lg flex items-center justify-center font-bold text-lg">
            N
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-100">Nexus</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium ml-4">
          <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-zinc-400 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="text-zinc-400 hover:text-white transition-colors">How it works</a>
        </div>
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
