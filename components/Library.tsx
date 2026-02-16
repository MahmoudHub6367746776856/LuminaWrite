
import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Eye, Edit3, Trash2 } from 'lucide-react';
import { ContentDraft } from '../types';

interface LibraryProps {
  drafts: ContentDraft[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

const Library: React.FC<LibraryProps> = ({ drafts, onEdit, onDelete, onCreateNew }) => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = drafts.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Content Library</h1>
          <p className="text-gray-500">Your intelligent content repository.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search content..."
              className="pl-12 pr-6 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-purple-500/50 transition-all w-full md:w-[300px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={onCreateNew}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-all neon-purple"
          >
            <Plus size={18} /> New Draft
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8 p-1 bg-white/5 w-fit rounded-2xl border border-white/5">
        <FilterButton label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
        <FilterButton label="Drafts" active={filter === 'draft'} onClick={() => setFilter('draft')} />
        <FilterButton label="Generated" active={filter === 'generated'} onClick={() => setFilter('generated')} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 glass rounded-[40px] border border-white/5">
          <p className="text-gray-500 text-lg">No content found. Start by creating a new draft!</p>
          <button onClick={onCreateNew} className="mt-4 text-purple-400 font-bold hover:underline">Create Now</button>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {filtered.map((item) => (
            <div key={item.id} className="break-inside-avoid relative group glass rounded-3xl border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-300">
              <img src={item.thumbnail} alt={item.title} className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    item.status === 'published' ? 'bg-green-500/20 text-green-400' :
                    item.status === 'draft' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {item.status.replace('-', ' ')}
                  </span>
                  <div className="text-[10px] text-gray-500">{item.createdAt}</div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{item.title}</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags.map(t => (
                    <span key={t} className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-md">#{t}</span>
                  ))}
                </div>
              </div>
              
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                <button onClick={() => onEdit(item.id)} className="flex flex-col items-center gap-1 text-white hover:text-purple-400 transition-colors">
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center bg-white/10 hover:bg-white/20"><Edit3 size={20} /></div>
                  <span className="text-[10px] font-bold uppercase">Edit</span>
                </button>
                <button onClick={() => onDelete(item.id)} className="flex flex-col items-center gap-1 text-white hover:text-red-400 transition-colors">
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center bg-white/10 hover:bg-white/20"><Trash2 size={20} /></div>
                  <span className="text-[10px] font-bold uppercase">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      active ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-white'
    }`}
  >
    {label}
  </button>
);

export default Library;
