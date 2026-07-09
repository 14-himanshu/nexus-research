import { Copy, Check, FileText, Maximize2, Minimize2, Clock, Sun, Moon, Zap } from 'lucide-react';

interface ReportToolbarProps {
  words: number;
  readTime: number;
  totalTime?: number | null;
  isStreaming: boolean;
  paperMode: boolean;
  setPaperMode: (mode: boolean) => void;
  copied: boolean;
  handleCopy: () => void;
  handlePrint: () => void;
  isFullscreen: boolean;
  setIsFullscreen: (mode: boolean) => void;
}

export function ReportToolbar({
  words,
  readTime,
  totalTime,
  isStreaming,
  paperMode,
  setPaperMode,
  copied,
  handleCopy,
  handlePrint,
  isFullscreen,
  setIsFullscreen,
}: ReportToolbarProps) {
  const bg = paperMode ? 'border-b border-zinc-200 bg-white' : 'border-b border-white/[0.07] bg-[#0d0d14]/80 backdrop-blur-xl';
  const btnBase = paperMode
    ? 'p-2 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-all duration-200'
    : 'p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.08] transition-all duration-200';

  return (
    <div className={`flex items-center justify-between px-5 py-3 print:hidden ${bg}`}>
      {/* Left: meta */}
      <div className="flex items-center gap-3">
        <span className={`text-[13px] font-semibold ${paperMode ? 'text-zinc-800' : 'text-zinc-200'}`}>
          Research Report
        </span>
        {!isStreaming && (
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border ${
              paperMode ? 'bg-zinc-100 border-zinc-200 text-zinc-500' : 'bg-white/[0.05] border-white/[0.07] text-zinc-500'
            }`}>
              {words.toLocaleString()} words
            </span>
            <span className={`hidden sm:flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg border ${
              paperMode ? 'bg-zinc-100 border-zinc-200 text-zinc-500' : 'bg-white/[0.05] border-white/[0.07] text-zinc-500'
            }`}>
              <Clock size={11} />
              {readTime}m read
            </span>
            {totalTime && (
              <span className={`hidden md:flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border ${
                paperMode ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400'
              }`}>
                <Zap size={10} />
                Generated in {totalTime}s
              </span>
            )}
          </div>
        )}
        {isStreaming && (
          <div className="flex items-center gap-1.5 text-[12px] text-zinc-500">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Writing…
          </div>
        )}
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => setPaperMode(!paperMode)}
          className={btnBase}
          title={paperMode ? 'Dark mode' : 'Paper mode'}
        >
          {paperMode ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        <button
          onClick={handleCopy}
          disabled={isStreaming}
          className={`${btnBase} disabled:opacity-30`}
          title="Copy markdown"
        >
          {copied
            ? <Check size={16} className={paperMode ? 'text-emerald-600' : 'text-emerald-400'} />
            : <Copy size={16} />
          }
        </button>
        <button
          onClick={handlePrint}
          disabled={isStreaming}
          className={`${btnBase} hidden sm:block disabled:opacity-30`}
          title="Export as PDF"
        >
          <FileText size={16} />
        </button>
        <div className={`w-px h-4 mx-1 ${paperMode ? 'bg-zinc-200' : 'bg-white/[0.08]'}`} />
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className={btnBase}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </div>
  );
}
