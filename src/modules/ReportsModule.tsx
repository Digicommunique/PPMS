import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart2, TrendingUp, Users, Package, FileText, Download, 
  Filter, Clock, AlertCircle, Cpu, Droplet, Layers,
  ChevronDown, Calendar, Search, PieChart as PieChartIcon,
  Send, Target, Star, CheckCircle, Smartphone
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area,
  LineChart, Line
} from 'recharts';

const salesData = [
  { name: 'Jan', value: 45000, margin: 12000 },
  { name: 'Feb', value: 52000, margin: 15600 },
  { name: 'Mar', value: 48000, margin: 13200 },
  { name: 'Apr', value: 61000, margin: 19800 },
  { name: 'May', value: 55000, margin: 16500 },
  { name: 'Jun', value: 67000, margin: 23400 },
];

const categoryData = [
  { name: 'Offset', value: 45, color: '#1E3A5F' },
  { name: 'Digital', value: 30, color: '#06B6D4' },
  { name: 'Packaging', value: 15, color: '#D946EF' },
  { name: 'Post-Press', value: 10, color: '#F59E0B' },
];

const machineUptimeData = [
  { time: '08:00', load: 40 },
  { time: '10:00', load: 85 },
  { time: '12:00', load: 95 },
  { time: '14:00', load: 80 },
  { time: '16:00', load: 90 },
  { time: '18:00', load: 60 },
  { time: '20:00', load: 30 },
];

export default function ReportsModule() {
  const [reportType, setReportType] = React.useState('Daily');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black font-sans uppercase tracking-[0.2em] text-primary">Strategic Intelligence</h2>
          <p className="text-secondary text-sm font-medium">Real-time data visualization of your print ecosystem.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-gray-200 rounded-2xl flex p-1">
             {['Daily', 'Monthly', 'Yearly'].map((type) => (
               <button 
                key={type}
                onClick={() => setReportType(type)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  reportType === type ? 'bg-primary text-white shadow-lg' : 'text-secondary hover:bg-gray-50'
                }`}
               >
                {type}
               </button>
             ))}
          </div>
          <button 
            onClick={() => {
              const link = document.createElement('a');
              link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Strategic Audit Data...');
              link.download = `SOP_Audit_${new Date().toISOString().split('T')[0]}.txt`;
              link.click();
              alert('Strategic audit report generated and download initiated.');
            }}
            className="bg-success text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shadow-xl shadow-success/20 transition-all hover:scale-105 active:scale-95"
          >
            <Download size={20} /> Export Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Shop Floor Load', value: '82%', icon: <Cpu />, color: '#06B6D4' },
           { label: 'Paper Wastage', value: '1.4%', icon: <Layers />, color: '#EF4444' },
           { label: 'Inking Efficiency', value: '94%', icon: <Droplet />, color: '#10B981' },
           { label: 'Staff Attendance', value: '42/45', icon: <Users />, color: '#6366F1' },
         ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
               <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="p-3 bg-gray-50 rounded-2xl w-fit group-hover:bg-primary group-hover:text-white transition-all mb-4">
                     {stat.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-60">{stat.label}</p>
                    <h4 className="text-2xl font-black text-primary mt-1">{stat.value}</h4>
                  </div>
               </div>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden">
           <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                 <h3 className="text-xl font-black text-primary uppercase tracking-tighter">Growth & Revenue Matrix</h3>
                 <p className="text-[10px] text-secondary font-black uppercase tracking-widest opacity-40">Monthly performance analysis</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-black uppercase text-secondary">Sales</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                    <span className="text-[10px] font-black uppercase text-secondary">Profit</span>
                 </div>
              </div>
           </div>
           
           <div className="h-[400px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                    <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="value" fill="#1E3A5F" radius={[10, 10, 0, 0]} barSize={20} />
                    <Bar dataKey="margin" fill="#06B6D4" radius={[10, 10, 0, 0]} barSize={20} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
           <BarChart2 size={300} className="absolute -right-20 -bottom-20 text-gray-50/50" />
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center">
           <h3 className="text-xl font-black text-primary uppercase tracking-tighter self-start mb-10">Vertical Distribution</h3>
           <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={categoryData}
                       cx="50%"
                       cy="50%"
                       innerRadius={80}
                       outerRadius={110}
                       paddingAngle={8}
                       dataKey="value"
                    >
                       {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="w-full mt-6 space-y-3">
              {categoryData.map(item => (
                 <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                       <span className="text-[10px] font-black uppercase text-primary">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-primary">{item.value}%</span>
                 </div>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-primary p-12 rounded-[50px] shadow-2xl relative overflow-hidden group">
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center text-white">
            <div className="space-y-4">
               <h3 className="text-3xl font-black font-sans uppercase tracking-tighter">Machine Uptime Logs</h3>
               <p className="text-white/40 text-sm font-medium italic">Peak production analysis for Heidelberg Speedmaster XL75</p>
               <div className="flex gap-4 pt-4">
                  <div className="text-center">
                     <p className="text-2xl font-black text-accent-cyan">98.2%</p>
                     <p className="text-[10px] font-bold uppercase opacity-40">Uptime</p>
                  </div>
                  <div className="w-[1px] h-10 bg-white/10" />
                  <div className="text-center">
                     <p className="text-2xl font-black text-accent-magenta">1.8%</p>
                     <p className="text-[10px] font-bold uppercase opacity-40">Downtime</p>
                  </div>
               </div>
            </div>
            <div className="lg:col-span-2 h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={machineUptimeData}>
                     <defs>
                        <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                           <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <Tooltip contentStyle={{backgroundColor: '#1E3A5F', border: 'none', borderRadius: '15px', color: 'white'}} />
                     <Area type="monotone" dataKey="load" stroke="#06B6D4" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={4} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
}
