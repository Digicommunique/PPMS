import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Users, FileText, CheckCircle, Clock, 
  AlertTriangle, ArrowRight, Activity, Zap, Layers,
  ChevronRight, Calendar, UserPlus, ShoppingCart, 
  DollarSign, Package, MoreHorizontal, MousePointerClick
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

const data = [
  { name: 'Mon', jobs: 12, sales: 4000 },
  { name: 'Tue', jobs: 19, sales: 3000 },
  { name: 'Wed', jobs: 15, sales: 5000 },
  { name: 'Thu', jobs: 22, sales: 4500 },
  { name: 'Fri', jobs: 30, sales: 6000 },
  { name: 'Sat', jobs: 18, sales: 3500 },
  { name: 'Sun', jobs: 8, sales: 2000 },
];

const categoryData = [
  { name: 'Offset', value: 400, color: '#1E3A5F' },
  { name: 'Digital', value: 300, color: '#06B6D4' },
  { name: 'Special', value: 300, color: '#D946EF' },
];

export default function DashboardHome() {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-primary rounded-[50px] p-12 text-white relative overflow-hidden group shadow-2xl">
        <div className="relative z-10 space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
              <Zap size={14} className="text-accent-cyan" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">System Status: Optimal</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black font-sans leading-none uppercase tracking-tighter italic">
              Empowering your <br /> <span className="text-accent-cyan">Printing Universe.</span>
           </h1>
           <p className="text-white/60 font-medium max-w-lg leading-relaxed italic">
              Unified command center for production, logistics, and financial intelligence. Everything you need to scale your print house in one place.
           </p>
           <div className="pt-4 flex gap-4">
              <button 
                onClick={() => navigate('/production')}
                className="px-8 py-4 bg-accent-cyan text-primary rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform flex items-center gap-3 shadow-xl shadow-accent-cyan/20"
              >
                 Browse Shop Floor <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => navigate('/reports')}
                className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all flex items-center gap-3"
              >
                 Generate Audit
              </button>
           </div>
        </div>
        <Activity size={400} className="absolute -right-20 -bottom-20 text-white/5 group-hover:scale-110 transition-transform duration-[2000ms]" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
             { label: 'Active Pipeline', value: '48 Jobs', icon: <Layers />, trend: '+12%', sub: 'Queued for today', color: '#06B6D4', path: '/jobs' },
             { label: 'Revenue (MTD)', value: '₹14.2L', icon: <TrendingUp />, trend: '+8.4%', sub: 'Target: ₹20L', color: '#D946EF', path: '/billing' },
             { label: 'Acquisition', value: '254', icon: <UserPlus />, trend: '+15', sub: 'New leads this week', color: '#10B981', path: '/crm' },
             { label: 'Procurement', value: '12 POs', icon: <ShoppingCart />, trend: 'Pending', sub: '₹4.5L Payable', color: '#F59E0B', path: '/procurement' },
           ].map((stat, idx) => (
              <div 
               key={idx} 
               onClick={() => navigate(stat.path)}
               className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative cursor-pointer"
              >
              <div className="relative z-10 h-full flex flex-col justify-between">
                 <div className="flex items-center justify-between mb-8">
                    <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all text-primary">
                       {stat.icon}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${stat.trend.includes('+') ? 'text-success' : 'text-secondary opacity-50'}`}>
                       {stat.trend}
                    </span>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary opacity-40">{stat.label}</p>
                    <h3 className="text-3xl font-black text-primary mt-1 tracking-tighter uppercase italic">{stat.value}</h3>
                    <p className="text-[9px] text-secondary/60 font-bold mt-2 uppercase italic tracking-widest">{stat.sub}</p>
                 </div>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.06] transition-all duration-1000">
                 {React.cloneElement(stat.icon as React.ReactElement, { size: 150 })}
              </div>
           </div>
        ))}
      </div>

      {/* Main Grid: Charts & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Production Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[50px] shadow-sm border border-gray-100 relative overflow-hidden group">
           <div className="flex items-center justify-between mb-12 relative z-10">
              <div>
                 <h3 className="text-2xl font-black text-primary font-sans uppercase tracking-tighter">Production Velocity</h3>
                 <p className="text-[11px] text-secondary font-black uppercase tracking-widest opacity-40">Job completion dynamics over 7 days</p>
              </div>
              <div className="flex gap-2">
                 <button 
                  onClick={() => alert('Opening date range selector...')}
                  className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all"
                 >
                   <Calendar size={20} className="text-primary" />
                 </button>
                 <button 
                  onClick={() => alert('Chart export options...')}
                  className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all"
                 >
                   <MoreHorizontal size={20} className="text-primary" />
                 </button>
              </div>
           </div>

           <div className="h-[400px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data}>
                    <defs>
                       <linearGradient id="colorSalesHome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 900}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 900}} />
                    <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}} />
                    <Area type="monotone" dataKey="sales" stroke="#1E3A5F" strokeWidth={5} fillOpacity={1} fill="url(#colorSalesHome)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
           <MousePointerClick size={300} className="absolute -right-20 -bottom-20 text-gray-50 opacity-20 pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
        </div>

        {/* Right Column: Recent Activity & Jobs */}
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 h-full">
              <h3 className="text-xl font-black text-primary font-sans uppercase tracking-tighter mb-8 italic">Live production log</h3>
              <div className="space-y-6">
                  {[
                    { title: 'Corporate Brochure', id: 'JOB-452', status: 'In Design', color: '#06B6D4' },
                    { title: 'Menu Cards (Pizza Hut)', id: 'JOB-451', status: 'Printing', color: '#F59E0B' },
                    { title: 'Yearbook 2024', id: 'JOB-450', status: 'Binding', color: '#10B981' },
                    { title: 'Flex Banner (Big Bazaar)', id: 'JOB-449', status: 'Finished', color: '#6366F1' },
                    { title: 'Visiting Cards (Self)', id: 'JOB-448', status: 'Queued', color: '#D946EF' },
                  ].map((job, i) => (
                    <div 
                      key={i} 
                      onClick={() => navigate('/production')}
                      className="flex items-center gap-4 group cursor-pointer"
                    >
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-[10px] border-2 shadow-sm transition-all group-hover:scale-110" style={{ borderColor: job.color, color: job.color }}>
                       {job.id.split('-')[1]}
                    </div>
                    <div className="flex-1">
                       <h4 className="text-sm font-black text-primary group-hover:text-accent-cyan transition-colors">{job.title}</h4>
                       <p className="text-[10px] text-secondary font-black uppercase tracking-widest opacity-40">{job.status} • 35% Completed</p>
                    </div>
                    <ChevronRight size={16} className="text-secondary opacity-20 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
               <button 
                  onClick={() => navigate('/production')}
                  className="w-full mt-10 py-5 bg-gray-50 hover:bg-gray-100 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  View All Production Assets
                </button>
           </div>
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div 
          onClick={() => navigate('/inventory')}
          className="bg-accent-amber/5 border border-accent-amber/20 p-8 rounded-[40px] flex items-center gap-6 group overflow-hidden relative cursor-pointer hover:bg-accent-amber/10 transition-colors"
         >
            <div className="p-4 bg-white rounded-2xl shadow-xl shadow-accent-amber/10 group-hover:rotate-12 transition-transform duration-500">
               <AlertTriangle size={32} className="text-accent-amber" />
            </div>
            <div>
               <h4 className="text-sm font-black text-primary font-sans uppercase tracking-widest">Inventory alert</h4>
               <p className="text-xs text-secondary font-medium italic mt-1 leading-relaxed">Paper usage is exceeding forecasts for 210GSM Art Card.</p>
            </div>
         </div>

         <div 
          onClick={() => navigate('/production')}
          className="bg-success/5 border border-success/20 p-8 rounded-[40px] flex items-center gap-6 group overflow-hidden relative cursor-pointer hover:bg-success/10 transition-colors"
         >
            <div className="p-4 bg-white rounded-2xl shadow-xl shadow-success/10 group-hover:rotate-12 transition-transform duration-500">
               <CheckCircle size={32} className="text-success" />
            </div>
            <div>
               <h4 className="text-sm font-black text-primary font-sans uppercase tracking-widest">Efficiency score</h4>
               <p className="text-xs text-secondary font-medium italic mt-1 leading-relaxed">Your shop floor uptime hit a 30-day high of <span className="text-success font-black">98.4%</span>.</p>
            </div>
         </div>

         <div 
          onClick={() => navigate('/crm')}
          className="bg-primary/5 border border-primary/20 p-8 rounded-[40px] flex items-center gap-6 group overflow-hidden relative cursor-pointer hover:bg-primary/10 transition-colors"
         >
            <div className="p-4 bg-white rounded-2xl shadow-xl shadow-primary/10 group-hover:rotate-12 transition-transform duration-500">
               <Zap size={32} className="text-primary" />
            </div>
            <div>
               <h4 className="text-sm font-black text-primary font-sans uppercase tracking-widest">Growth Engine</h4>
               <p className="text-xs text-secondary font-medium italic mt-1 leading-relaxed">AI has identified <span className="text-primary font-black">3 potential leads</span> with 90% conversion probability.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
