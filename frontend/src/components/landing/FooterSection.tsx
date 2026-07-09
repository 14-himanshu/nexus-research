import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function FooterSection() {
  return (
    <>
      {/* CTA Section */}
      <section className="relative py-28 px-6 border-t border-white/[0.05] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(99,102,241,0.08),transparent)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5 leading-tight">
            Ready to scale your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              research?
            </span>
          </h2>
          <p className="text-zinc-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Join researchers and analysts building the future with autonomous AI agents. Start in seconds, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/signup"
              className="group flex items-center gap-2 px-8 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-zinc-100 transition-all text-[14px] shadow-xl shadow-white/10"
            >
              Get Started Free
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="https://github.com/14-himanshu/nexus-research"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-8 py-3.5 border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/15 hover:bg-white/[0.04] font-medium rounded-xl transition-all text-[14px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.4 13.4 0 0 0-7 0C6.3 1.5 5 1.9 5 1.9a5.5 5.5 0 0 0-.1 3.8A5.5 5.5 0 0 0 3.4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>
              Star on GitHub
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.05] bg-[#07070d] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 bg-white text-black rounded-lg flex items-center justify-center font-bold text-sm">N</div>
                <span className="text-[14px] font-bold text-white">Nexus</span>
              </div>
              <p className="text-[13px] text-zinc-600 leading-relaxed">
                Autonomous AI research for serious intelligence work.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-[12px] font-bold text-white uppercase tracking-widest mb-5">Product</h4>
              <ul className="space-y-3.5 text-[13px] text-zinc-500">
                <li><a href="#features" className="hover:text-zinc-200 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-zinc-200 transition-colors">How it works</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-zinc-200 transition-colors">Changelog</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-[12px] font-bold text-white uppercase tracking-widest mb-5">Resources</h4>
              <ul className="space-y-3.5 text-[13px] text-zinc-500">
                <li><a href="https://github.com/14-himanshu/nexus-research" target="_blank" rel="noreferrer" className="hover:text-zinc-200 transition-colors">GitHub Repository</a></li>
                <li><a href="https://github.com/14-himanshu/nexus-research" target="_blank" rel="noreferrer" className="hover:text-zinc-200 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-zinc-200 transition-colors">API Reference</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[12px] font-bold text-white uppercase tracking-widest mb-5">Legal</h4>
              <ul className="space-y-3.5 text-[13px] text-zinc-500">
                <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-zinc-200 transition-colors">Privacy Policy</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-zinc-200 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-zinc-700">
            <p>© {new Date().getFullYear()} Nexus Research. Built with ❤️ using LangGraph + Gemini.</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-600">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
