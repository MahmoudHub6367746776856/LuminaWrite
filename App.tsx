
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Studio from './components/Studio';
import Library from './components/Library';
import Analytics from './components/Analytics';
import { AppView, ContentDraft } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [drafts, setDrafts] = useState<ContentDraft[]>(() => {
    const saved = localStorage.getItem('lumina_drafts');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('lumina_drafts', JSON.stringify(drafts));
  }, [drafts]);

  const handleSaveDraft = (updatedDraft: ContentDraft) => {
    setDrafts(prev => {
      const exists = prev.find(d => d.id === updatedDraft.id);
      if (exists) {
        return prev.map(d => d.id === updatedDraft.id ? updatedDraft : d);
      }
      return [updatedDraft, ...prev];
    });
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  const handleEditDraft = (id: string) => {
    setCurrentDraftId(id);
    setView('studio');
  };

  const handleCreateNew = () => {
    setCurrentDraftId(null);
    setView('studio');
  };

  return (
    <Layout activeView={view} onViewChange={setView}>
      {view === 'landing' && <Hero onStart={() => setView('studio')} />}
      {view === 'studio' && (
        <Studio 
          draft={drafts.find(d => d.id === currentDraftId)} 
          onSave={handleSaveDraft} 
        />
      )}
      {view === 'library' && (
        <Library 
          drafts={drafts} 
          onEdit={handleEditDraft} 
          onDelete={handleDeleteDraft}
          onCreateNew={handleCreateNew}
        />
      )}
      {view === 'analytics' && <Analytics />}
    </Layout>
  );
};

export default App;
