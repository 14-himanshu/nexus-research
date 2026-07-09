import { useState } from 'react';
import { Plus, Trash2, Library, Hash, FolderOpen, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Collection {
  id: number;
  name: string;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  collections: Collection[];
  activeCollectionId: number | null;
  onSelectCollection: (id: number | null) => void;
  onCreateCollection: (name: string) => void;
  onDeleteCollection: (id: number) => void;
}

export function Sidebar({
  isOpen,
  collections,
  activeCollectionId,
  onSelectCollection,
  onCreateCollection,
  onDeleteCollection
}: SidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      onCreateCollection(newCollectionName.trim());
      setNewCollectionName('');
      setIsCreating(false);
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 240 : 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="h-full border-r border-white/[0.06] bg-[#0d0d14] flex flex-col shrink-0 print:hidden overflow-hidden"
    >
      <div className="w-[240px] flex flex-col h-full">
        {/* Header */}
        <div className="px-4 pt-5 pb-3">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3 px-1">Library</p>
          <button
            onClick={() => onSelectCollection(null)}
            className={`sidebar-item w-full ${activeCollectionId === null ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
          >
            <Library size={15} className="shrink-0" />
            <span>All Research</span>
            {activeCollectionId === null && <ChevronRight size={13} className="ml-auto opacity-40" />}
          </button>
        </div>

        <div className="mx-4 h-px bg-white/[0.05]" />

        {/* Collections */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 scrollbar-hide">
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Projects</p>
            <button
              onClick={() => setIsCreating(true)}
              className="p-1 text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.07] rounded-md transition-all duration-200"
              title="New Project"
            >
              <Plus size={13} />
            </button>
          </div>

          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-2 overflow-hidden"
              >
                <form onSubmit={handleCreateSubmit}>
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Project name..."
                    autoFocus
                    onBlur={() => { if (!newCollectionName.trim()) setIsCreating(false); }}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-indigo-500/50 placeholder:text-zinc-600 transition-colors"
                  />
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-0.5">
            {collections.length === 0 && !isCreating && (
              <div className="text-center py-8">
                <FolderOpen size={24} className="mx-auto text-zinc-700 mb-2" />
                <p className="text-xs text-zinc-600">No projects yet</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 mt-1 transition-colors"
                >
                  Create one →
                </button>
              </div>
            )}
            {collections.map(c => (
              <div
                key={c.id}
                className={`group sidebar-item ${activeCollectionId === c.id ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
              >
                <button
                  onClick={() => onSelectCollection(c.id)}
                  className="flex-1 flex items-center gap-3 truncate text-left"
                >
                  <Hash size={13} className="shrink-0 opacity-60" />
                  <span className="truncate">{c.name}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this project and all its reports?')) {
                      onDeleteCollection(c.id);
                    }
                  }}
                  className="p-1 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all duration-200 shrink-0"
                  title="Delete project"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
