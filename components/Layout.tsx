
import React from 'react';
import { Layout as LayoutIcon, BookOpen, PenTool, BarChart3, Rocket, LogOut } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-200">
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full -z-10" />

      {/* Navigation */}
      {activeView !== 'landing' && (
        <nav className="sticky top-0 z-50 px-6 py-4 glass border-b border-white/5 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onViewChange('landing')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg neon-purple">
              <Rocket className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              LUMINA<span className="text-purple-400">WRITE</span>
            </span>
          </div>

          <div className="flex items-center gap-8">
            <NavItem 
              icon={<PenTool size={20} />} 
              label="Studio" 
              active={activeView === 'studio'} 
              onClick={() => onViewChange('studio')} 
            />
            <NavItem 
              icon={<BookOpen size={20} />} 
              label="Library" 
              active={activeView === 'library'} 
              onClick={() => onViewChange('library')} 
            />
            <NavItem 
              icon={<BarChart3 size={20} />} 
              label="Analytics" 
              active={activeView === 'analytics'} 
              onClick={() => onViewChange('analytics')} 
            />
          </div>

          <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2 text-sm">
            <LogOut size={16} />
            Sign Out
          </button>
        </nav>
      )}

      <main className="flex-grow">
        {children}
      </main>

      {activeView !== 'landing' && (
        <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/5">
          © 2024 LuminaWrite. Illuminating the future of content.
        </footer>
      )}
    </div>
  );
};

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 transition-all duration-300 ${
      active ? 'text-purple-400 scale-105' : 'text-gray-400 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
    {active && <div className="absolute -bottom-6 left-0 w-full h-[2px] bg-purple-400 shadow-[0_0_8px_#a855f7]" />}
  </button>
);

export default Layout;
