
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Zap, Clock, ArrowUpRight } from 'lucide-react';

const DATA = [
  { name: 'Mon', reach: 4000, efficiency: 2400 },
  { name: 'Tue', reach: 3000, efficiency: 1398 },
  { name: 'Wed', reach: 2000, efficiency: 9800 },
  { name: 'Thu', reach: 2780, efficiency: 3908 },
  { name: 'Fri', reach: 1890, efficiency: 4800 },
  { name: 'Sat', reach: 2390, efficiency: 3800 },
  { name: 'Sun', reach: 3490, efficiency: 4300 },
];

const Analytics: React.FC = () => {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Performance Hub</h1>
          <p className="text-gray-500">Insights into your content strategy.</p>
        </div>
        <button className="px-6 py-3 rounded-2xl glass border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2">
          Export Report <ArrowUpRight size={18} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users className="text-purple-400" />} label="Total Reach" value="1.2M" change="+12.5%" />
        <StatCard icon={<TrendingUp className="text-cyan-400" />} label="Engagement" value="48.2k" change="+5.2%" />
        <StatCard icon={<Zap className="text-yellow-400" />} label="Content Efficiency" value="94%" change="+2.4%" />
        <StatCard icon={<Clock className="text-pink-400" />} label="Avg. Writing Time" value="12m" change="-18.0%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reach Chart */}
        <div className="glass p-8 rounded-[40px] border border-white/5">
          <h3 className="text-xl font-bold mb-8">Content Reach Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ background: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="reach" stroke="#a855f7" fillOpacity={1} fill="url(#colorReach)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Chart */}
        <div className="glass p-8 rounded-[40px] border border-white/5">
          <h3 className="text-xl font-bold mb-8">Content Efficiency Score</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ background: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                   cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="efficiency" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; change: string }> = ({ icon, label, value, change }) => (
  <div className="p-6 rounded-3xl glass border border-white/5 hover:border-white/10 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">{icon}</div>
      <span className={`text-sm font-bold ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
    </div>
    <div className="text-3xl font-black mb-1 tracking-tight">{value}</div>
    <div className="text-sm text-gray-500 font-medium">{label}</div>
  </div>
);

export default Analytics;
