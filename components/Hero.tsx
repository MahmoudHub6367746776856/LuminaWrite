
import React from 'react';
import { Rocket, Sparkles, Wand2, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] -z-10" />
      
      <div className="flex flex-col items-center text-center max-w-4xl animate-in fade-in zoom-in duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-purple-500/30 text-purple-400 text-sm font-medium mb-8 animate-float">
          <Sparkles size={16} />
          <span>New: Lumina-3.0 Engine is Live</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
          Illuminate Your <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            Digital Universe
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The ultimate Content OS for creative professionals. Write faster, optimize better, and publish smarter with LuminaWrite's futuristic toolset.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden neon-purple"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center gap-2">
              Start Creating <Rocket size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <button className="px-8 py-4 rounded-2xl glass border border-white/10 text-white font-semibold hover:bg-white/5 transition-all">
            View Case Studies
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left w-full">
          <FeatureCard 
            icon={<Wand2 className="text-purple-400" />}
            title="Smart Assistant"
            desc="Real-time SEO suggestions and content generation that learns your brand voice."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-cyan-400" />}
            title="Privacy First"
            desc="Your data is fully encrypted and stays private. We never share or sell your content."
          />
          <FeatureCard 
            icon={<Rocket className="text-pink-400" />}
            title="Multi-Channel"
            desc="One draft, multiple platforms. Preview and optimize for social media instantly."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="p-6 rounded-3xl glass border border-white/5 hover:border-white/10 transition-all group">
    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Hero;
