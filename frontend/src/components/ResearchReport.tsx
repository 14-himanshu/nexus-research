import { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import GithubSlugger from 'github-slugger';
import { motion } from 'framer-motion';
import { Copy, Check, FileText, Maximize2, Minimize2, Clock, Sun, Moon, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';

interface ResearchReportProps {
  content: string;
  isStreaming: boolean;
  totalTime?: number | null;
  reportId?: number | null;
}

export function ResearchReport({ content, isStreaming, totalTime, reportId }: ResearchReportProps) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [paperMode, setPaperMode] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (content.length < 50 && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [content]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  const headings = useMemo(() => {
    if (!content) return [];
    const slugger = new GithubSlugger();
    const matches = [...content.matchAll(/^(#{2,3})\s+(.+)$/gm)];
    return matches.map(m => ({
      level: m[1].length,
      title: m[2],
      id: slugger.slug(m[2])
    }));
  }, [content]);

  if (!content) return null;

  const words = content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Report copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
      toast.error('Failed to copy text');
    }
  };

  const handlePrint = () => window.print();

  const handleRate = async (val: number) => {
    if (!reportId) return;
    setRating(val);
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      await fetch(`${baseUrl}/history/${reportId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: val })
      });
      toast.success(val === 1 ? 'Glad it was helpful!' : 'Thanks for the feedback');
    } catch (err) {
      toast.error('Failed to submit rating');
    }
  };

  const modeClasses = paperMode 
    ? 'bg-[#f5f5f4] text-zinc-900 border-zinc-200' 
    : 'glass-panel text-white';

  const headerClasses = paperMode
    ? 'border-b border-zinc-200 bg-white/50'
    : 'border-b border-white/5 bg-white/[0.02]';

  const buttonClasses = paperMode
    ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
    : 'text-zinc-400 hover:text-white hover:bg-white/10';

  const proseClasses = paperMode
    ? 'prose-stone prose-headings:text-zinc-900 prose-a:text-blue-600 prose-strong:text-zinc-900'
    : 'prose-invert prose-zinc prose-headings:text-white prose-a:text-white prose-strong:text-white';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full flex flex-col transition-all duration-500 print:border-none print:shadow-none print:bg-white print:text-black overflow-hidden ${modeClasses} ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'rounded-3xl max-h-[calc(100vh-140px)]'
      }`}
    >
      {/* Header bar */}
      <div className={`flex justify-between items-center px-8 py-4 print:hidden transition-colors ${headerClasses}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className={`text-sm font-semibold tracking-wide ${paperMode ? 'text-zinc-800' : 'text-white'}`}>Research Document</span>
          {!isStreaming && (
            <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
              <span className={`px-2 py-1 rounded border ${paperMode ? 'bg-zinc-100 border-zinc-200' : 'bg-white/5 border-white/5'}`}>
                {words} words
              </span>
              <span className={`flex items-center gap-1.5 px-2 py-1 rounded border ${paperMode ? 'bg-zinc-100 border-zinc-200' : 'bg-white/5 border-white/5'}`}>
                <Clock size={12} />
                {readTime}m read
              </span>
              {totalTime && (
                <span className={`border-l pl-3 hidden sm:inline ${paperMode ? 'border-zinc-300' : 'border-white/10'}`}>
                  Generated in {totalTime}s
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-1 sm:gap-2">
          <button 
            onClick={() => setPaperMode(!paperMode)}
            className={`p-2 rounded-xl transition-all ${buttonClasses}`}
            title="Toggle Paper Mode"
          >
            {paperMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button 
            onClick={handleCopy}
            disabled={isStreaming}
            className={`p-2 rounded-xl transition-all disabled:opacity-30 ${buttonClasses}`}
            title="Copy Markdown"
          >
            {copied ? <Check size={18} className={paperMode ? "text-zinc-900" : "text-white"} /> : <Copy size={18} />}
          </button>
          <button 
            onClick={handlePrint}
            disabled={isStreaming}
            className={`p-2 rounded-xl transition-all disabled:opacity-30 hidden sm:block ${buttonClasses}`}
            title="Export as PDF"
          >
            <FileText size={18} />
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded-xl transition-all ${buttonClasses}`}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden print:overflow-visible">
        {/* TOC Sidebar */}
        {headings.length > 0 && !isFullscreen && (
          <div className={`hidden xl:block w-64 overflow-y-auto p-6 border-r print:hidden transition-colors ${paperMode ? 'border-zinc-200 bg-zinc-50' : 'border-white/5 bg-white/[0.01]'}`}>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4 opacity-50">On this page</h4>
            <div className="flex flex-col gap-2.5">
              {headings.map(h => (
                <a 
                  key={h.id}
                  href={`#${h.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`text-sm transition-colors opacity-70 hover:opacity-100 ${
                    h.level === 3 ? 'ml-3 text-xs' : 'font-medium'
                  }`}
                >
                  {h.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Content area */}
        <div ref={scrollRef} className="p-8 lg:p-12 overflow-y-auto flex-1 print:p-0 print:overflow-visible scroll-smooth relative">
          <div className={`prose max-w-[800px] mx-auto prose-headings:font-semibold prose-headings:tracking-tight prose-a:underline-offset-4 prose-li:marker:text-zinc-600 print:prose-p:text-black print:prose-headings:text-black transition-colors ${proseClasses}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
              {content}
            </ReactMarkdown>
          </div>
          
          {isStreaming && (
            <div className="max-w-[800px] mx-auto mt-8 flex gap-2 items-center text-zinc-500 print:hidden">
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${paperMode ? 'bg-zinc-400' : 'bg-white/50'}`}></div>
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${paperMode ? 'bg-zinc-400' : 'bg-white/50'}`} style={{ animationDelay: '0.2s' }}></div>
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${paperMode ? 'bg-zinc-400' : 'bg-white/50'}`} style={{ animationDelay: '0.4s' }}></div>
              <span className="ml-2 text-sm font-medium tracking-wide">Synthesizing...</span>
            </div>
          )}

          {!isStreaming && reportId && (
            <div className={`max-w-[800px] mx-auto mt-12 pt-8 border-t flex flex-col items-center gap-4 print:hidden transition-colors ${paperMode ? 'border-zinc-200' : 'border-white/10'}`}>
              <span className="text-sm font-medium opacity-60">Was this report helpful?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRate(1)}
                  className={`p-3 rounded-full transition-all ${
                    rating === 1 
                      ? 'bg-green-500/20 text-green-500' 
                      : `${buttonClasses}`
                  }`}
                >
                  <ThumbsUp size={20} />
                </button>
                <button
                  onClick={() => handleRate(-1)}
                  className={`p-3 rounded-full transition-all ${
                    rating === -1 
                      ? 'bg-red-500/20 text-red-500' 
                      : `${buttonClasses}`
                  }`}
                >
                  <ThumbsDown size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
