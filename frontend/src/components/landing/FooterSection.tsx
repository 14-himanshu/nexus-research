import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function FooterSection() {
  return (
    <>
      {/* Bottom CTA */}
      <section className="relative z-10 py-32 px-6 bg-[#09090b] border-t border-zinc-900 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Ready to scale your research?
        </h2>
        <p className="text-zinc-400 mb-10 max-w-lg">
          Join the teams building the future with autonomous AI agents. Get started in seconds.
        </p>
        <Link 
          to="/signup"
          className="group flex items-center gap-2 px-8 py-4 bg-white text-black text-sm font-bold rounded-lg hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
        >
          Get Started Free
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* Actual Footer */}
      <footer className="relative z-10 py-16 px-6 border-t border-zinc-900 bg-black">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-white text-black rounded text-xs flex items-center justify-center font-bold">N</div>
              <span className="text-sm font-bold">Nexus</span>
            </div>
            <p className="text-zinc-600 text-sm font-medium tracking-tight mb-6">
              Designed for serious intelligence.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="https://github.com/14-himanshu/nexus-research" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="https://github.com/14-himanshu/nexus-research" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub Repository</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="max-w-[1200px] mx-auto mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600 font-medium">
          <p>© 2026 Nexus Research. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-400">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-400">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}
