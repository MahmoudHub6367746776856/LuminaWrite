
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, Hash, Layout as LayoutIcon, RefreshCw, 
  CheckCircle2, Copy, Instagram, Linkedin, Twitter, 
  Wand2, Save, Image as ImageIcon, Send, MessageSquare
} from 'lucide-react';
import { getContentSuggestions, generateDraft, refineContent, generateContentImage } from '../services/contentService';
import { ContentSuggestions, ContentDraft } from '../types';

interface StudioProps {
  draft?: ContentDraft;
  onSave: (draft: ContentDraft) => void;
}

const Studio: React.FC<StudioProps> = ({ draft, onSave }) => {
  const [title, setTitle] = useState(draft?.title || '');
  const [content, setContent] = useState(draft?.body || '');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(draft?.generatedImage || '');
  
  const [suggestions, setSuggestions] = useState<ContentSuggestions>({
    headlines: [],
    keywords: [],
    summary: '',
    sentiment: ''
  });
  
  const [activePreview, setActivePreview] = useState<'insta' | 'linked' | 'tweet'>('insta');

  // Load draft data when switching
  useEffect(() => {
    if (draft) {
      setTitle(draft.title);
      setContent(draft.body);
      setGeneratedImageUrl(draft.generatedImage || '');
    } else {
      setTitle('');
      setContent('');
      setGeneratedImageUrl('');
    }
  }, [draft]);

  const handleGenerateDraft = async () => {
    if (!topic) return;
    setIsGenerating(true);
    try {
      const data = await generateDraft(topic);
      setTitle(data.title);
      setContent(data.body);
      handleSync(data.body);
    } catch (err) {
      const msg = (err as Error).message; if(msg==="API_QUOTA_EXCEEDED"){alert("⚠️ API quota exceeded. Please check your billing at ai.google.dev or try again tomorrow.")} else if(msg==="API_KEY_INVALID"){alert("❌ Invalid API key. Please check your .env.local file.")} else {alert("Failed to generate draft. Please try again.")};
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSync = async (textOverride?: string) => {
    const textToAnalyze = textOverride || content;
    if (!textToAnalyze) return;
    setIsSyncing(true);
    try {
      const data = await getContentSuggestions(textToAnalyze);
      setSuggestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRefine = async () => {
    const instruction = prompt("How should I refine this text? (e.g. 'Make it more professional', 'Shorten it', 'Add a call to action')");
    if (!instruction || !content) return;
    setIsSyncing(true);
    const refined = await refineContent(content, instruction);
    setContent(refined);
    setIsSyncing(false);
  };

  const handleGenerateImage = async () => {
    if (!content && !title) return;
    setIsGeneratingImage(true);
    try {
      const url = await generateContentImage(title || content.substring(0, 100));
      setGeneratedImageUrl(url);
    } catch (err) {
      const msg = (err as Error).message; if(msg==="API_QUOTA_EXCEEDED"){alert("⚠️ API quota exceeded. Please check your billing at ai.google.dev or try again tomorrow.")} else {alert("Image generation failed. Please try again.")};
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSave = () => {
    const newDraft: ContentDraft = {
      id: draft?.id || Date.now().toString(),
      title: title || 'Untitled Content',
      body: content,
      status: draft?.status || 'draft',
      createdAt: draft?.createdAt || new Date().toISOString().split('T')[0],
      tags: suggestions.keywords,
      thumbnail: generatedImageUrl || 'https://picsum.photos/400/300',
      generatedImage: generatedImageUrl
    };
    onSave(newDraft);
    alert("Draft saved to library!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 h-[calc(100vh-120px)] overflow-hidden">
      {/* Editor Panel */}
      <div className="lg:col-span-7 flex flex-col gap-4 h-full">
        <div className="glass p-4 rounded-2xl flex items-center gap-4 mb-2">
          <input 
            type="text" 
            placeholder="What's the topic? (e.g. Impact of Technology on UX Design)"
            className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-purple-500/50"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button 
            onClick={handleGenerateDraft}
            disabled={isGenerating || !topic}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 disabled:opacity-50 transition-all neon-purple"
          >
            {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Wand2 size={18} />}
            {isGenerating ? 'Drafting...' : 'Magic Draft'}
          </button>
        </div>

        <div className="flex-grow glass rounded-3xl flex flex-col overflow-hidden border border-white/10">
          <input 
            type="text"
            className="w-full p-6 text-2xl font-bold bg-transparent border-b border-white/5 outline-none placeholder-gray-700"
            placeholder="Draft Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full flex-grow p-8 bg-transparent border-none outline-none resize-none text-lg leading-relaxed text-gray-200 placeholder-gray-600"
            placeholder="Start writing or use 'Magic Draft' above..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="p-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleRefine}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-400"
              >
                <Sparkles size={14} /> Refine Content
              </button>
              <button 
                onClick={() => handleSync()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-400"
              >
                <Hash size={14} /> Generate Tags
              </button>
            </div>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-500 transition-all shadow-lg neon-cyan"
            >
              <Save size={14} /> Save Draft
            </button>
          </div>
        </div>
      </div>

      {/* Smart Panel */}
      <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar pb-10">
        <div className="flex flex-col gap-6">
          {/* Headlines */}
          <section className="glass p-6 rounded-3xl border border-white/5">
            <div className="flex items-center gap-2 mb-4 text-purple-400 font-bold">
              <LayoutIcon size={20} />
              <h3>Smart Headlines</h3>
            </div>
            <div className="flex flex-col gap-3">
              {suggestions.headlines.length > 0 ? (
                suggestions.headlines.map((h, i) => (
                  <div 
                    key={i} 
                    onClick={() => setTitle(h)}
                    className="group flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer"
                  >
                    <span className="text-sm font-medium">{h}</span>
                    <CheckCircle2 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">Press "Sync" to get headline ideas</p>
              )}
            </div>
          </section>

          {/* Keywords & Sentiment */}
          <section className="glass p-6 rounded-3xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Hash size={20} />
                <h3>SEO Optimization</h3>
              </div>
              {suggestions.sentiment && (
                <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Tone: <span className="text-cyan-400">{suggestions.sentiment}</span>
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.keywords.length > 0 ? (
                suggestions.keywords.map((k, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
                    #{k}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">Keywords will appear here</p>
              )}
            </div>
          </section>

          {/* Multi-Channel Preview with Image Gen */}
          <section className="glass p-6 rounded-3xl border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-pink-400 font-bold">
                <ImageIcon size={20} />
                <h3>Visual Preview</h3>
              </div>
              <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                <button onClick={() => setActivePreview('insta')} className={`p-2 rounded-lg ${activePreview === 'insta' ? 'bg-pink-500/20 text-pink-400' : 'text-gray-500'}`}><Instagram size={18} /></button>
                <button onClick={() => setActivePreview('linked')} className={`p-2 rounded-lg ${activePreview === 'linked' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500'}`}><Linkedin size={18} /></button>
                <button onClick={() => setActivePreview('tweet')} className={`p-2 rounded-lg ${activePreview === 'tweet' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500'}`}><Twitter size={18} /></button>
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 relative group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold">LuminaWrite User</span>
                  <span className="text-[10px] text-gray-500">Draft Preview</span>
                </div>
              </div>
              <p className="text-xs text-gray-300 mb-3 line-clamp-3">
                {content || "Start writing to see preview..."}
              </p>
              
              <div className="aspect-video bg-white/5 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center relative">
                {generatedImageUrl ? (
                  <img src={generatedImageUrl} alt="Generated" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <p className="text-[10px] text-gray-600 font-mono uppercase">Visual representation</p>
                    <button 
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage}
                      className="mt-2 text-xs text-pink-400 font-bold flex items-center gap-2 hover:underline disabled:opacity-50"
                    >
                      {isGeneratingImage ? <RefreshCw className="animate-spin" size={14} /> : <Wand2 size={14} />}
                      {isGeneratingImage ? "Imagining..." : "Generate Image"}
                    </button>
                  </div>
                )}
                {generatedImageUrl && (
                   <button 
                    onClick={handleGenerateImage}
                    className="absolute bottom-2 right-2 p-2 rounded-full glass bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <RefreshCw size={14} />
                   </button>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/5 text-gray-500">
                <span className="text-[10px] flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> Platform Optimized</span>
                <span className="text-[10px] font-bold text-gray-400">Preview Mode</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Studio;
