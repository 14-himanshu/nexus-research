import { Copy, Check, FileText, Maximize2, Minimize2, Clock, Sun, Moon } from 'lucide-react';

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
  setIsFullscreen
}: ReportToolbarProps) {
  const headerClasses = paperMode
    ? 'border-b border-zinc-200 bg-white/50'
    : 'border-b border-white/5 bg-white/[0.02]';

  const buttonClasses = paperMode
    ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
    : 'text-zinc-400 hover:text-white hover:bg-white/10';

  return (
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
  );
}
