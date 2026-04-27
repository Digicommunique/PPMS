import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, Search, Filter, Phone, Mail, 
  MessageSquare, Calendar, Star, Clock, ArrowRight,
  MoreHorizontal, Tag, CheckCircle, X, Plus,
  MapPin, Send, History, Target, TrendingUp, Info
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Closed';
  lastFollowUp: string;
  score: number;
}

const mockLeads: Lead[] = [
  {
    id: 'LD-101',
    name: 'Anil Kapoor',
    company: 'Everest Agencies',
    phone: '+91 98765 43210',
    email: 'anil@everest.com',
    source: 'Website Form',
    status: 'Qualified',
    lastFollowUp: '2024-03-24',
    score: 85
  },
  {
    id: 'LD-102',
    name: 'Sonia Verma',
    company: 'Bright Horizon Edu',
    phone: '+91 91234 56789',
    email: 'sonia@brighthorizon.in',
    source: 'Reference',
    status: 'Proposal Sent',
    lastFollowUp: '2024-03-25',
    score: 92
  },
  {
    id: 'LD-103',
    name: 'Vikram Singh',
    company: 'Auto Master Parts',
    phone: '+91 99887 76655',
    email: 'vikram@automaster.com',
    source: 'Cold Call',
    status: 'New',
    lastFollowUp: '2024-03-22',
    score: 45
  }
];

export default function CRMModule() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Closed': return 'bg-success/10 text-success border-success/20';
      case 'Proposal Sent': return 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20';
      case 'Qualified': return 'bg-accent-magenta/10 text-accent-magenta border-accent-magenta/20';
      case 'Contacted': return 'bg-accent-amber/10 text-accent-amber border-accent-amber/20';
      default: return 'bg-gray-100 text-secondary border-gray-200';
    }
  };

  const handleRegisterLead = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newLead: Lead = {
      id: `LD-${100 + leads.length + 1}`,
      name: formData.get('name') as string,
      company: formData.get('company') as string,
      phone: '+91 ' + Math.floor(Math.random() * 9000000000 + 1000000000).toString(),
      email: (formData.get('name') as string).split(' ')[0].toLowerCase() + '@' + (formData.get('company') as string).toLowerCase().replace(/\s/g, '') + '.com',
      source: 'Direct Entry',
      status: 'New',
      lastFollowUp: new Date().toISOString().split('T')[0],
      score: 50
    };
    setLeads([newLead, ...leads]);
    setIsModalOpen(false);
    alert('Lead registered and added to active pipeline.');
  };

  const handleAction = (type: string, name: string) => {
    alert(`${type} initiated for ${name}`);
  };

  return (
    <div className="space-y-6">
      {isModalOpen && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl border border-gray-100"
          >
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black text-primary uppercase italic">Add New Lead</h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                  <X size={20} />
               </button>
            </div>
            <form onSubmit={handleRegisterLead} className="space-y-4">
               <div>
                  <label className="text-[10px] font-black uppercase text-secondary mb-1 block">Full Name</label>
                  <input name="name" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" placeholder="Customer Name..." />
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase text-secondary mb-1 block">Company</label>
                  <input name="company" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" placeholder="Brand/Entity..." />
               </div>
               <button 
                type="submit"
                className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-accent-cyan transition-all mt-4"
               >
                 Register Lead
               </button>
            </form>
          </motion.div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-sans uppercase tracking-[0.2em] text-primary">CRM & Lead Intelligence</h2>
          <p className="text-secondary text-sm font-medium">Capture inquiries, manage follow-ups, and convert leads into jobs.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => alert('Opening follow-up calendar...')}
            className="bg-white border border-gray-200 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm group"
          >
            <Calendar size={18} className="text-accent-cyan group-hover:scale-110 transition-transform" /> Follow-up Calendar
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-accent-cyan text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shadow-xl shadow-primary/20 transition-all font-sans"
          >
            <UserPlus size={20} /> Add New Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total active leads', value: '154', icon: <Target className="text-accent-cyan" /> },
          { label: 'Won this month', value: '28', icon: <CheckCircle className="text-success" /> },
          { label: 'Conversion Rate', value: '18.4%', icon: <TrendingUp className="text-accent-magenta" /> },
          { label: 'Pipeline Value', value: '₹12.4L', icon: <Star className="text-accent-amber" /> }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="relative z-10">
              <div className="p-3 bg-gray-50 rounded-2xl w-fit group-hover:bg-primary group-hover:text-white transition-all mb-4">
                {stat.icon}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-60">{stat.label}</p>
              <h4 className="text-2xl font-black text-primary mt-1">{stat.value}</h4>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700">
               {stat.icon && React.cloneElement(stat.icon as React.ReactElement, { size: 100 })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between bg-gray-50/20">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, company, email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-accent-cyan bg-white text-sm font-medium"
            />
          </div>
          <div className="flex gap-2">
             <button className="px-5 py-2.5 bg-gray-50 text-secondary border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all">Filter</button>
             <button className="px-5 py-2.5 bg-gray-50 text-secondary border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all">Bulk Action</button>
          </div>
        </div>

        <div className="overflow-x-auto font-sans">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] uppercase tracking-widest font-black text-secondary">
                <th className="px-8 py-5">Lead Identification</th>
                <th className="px-8 py-5">Contact Details</th>
                <th className="px-8 py-5">Lead Metrics</th>
                <th className="px-8 py-5">Current Pipeline</th>
                <th className="px-8 py-5 text-right">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.filter(l => 
                l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                l.company.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-black text-primary border border-white shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-black text-sm text-primary tracking-tight">{lead.name}</span>
                        <p className="text-[10px] text-secondary mt-1 font-bold italic uppercase tracking-tighter opacity-60">{lead.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary opacity-80 cursor-pointer hover:text-accent-cyan">
                        <Phone size={12} className="text-success" /> {lead.phone}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-primary opacity-80 cursor-pointer hover:text-accent-cyan">
                        <Mail size={12} className="text-secondary" /> {lead.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                       <div className="flex justify-between items-center w-32">
                          <span className="text-[10px] font-black uppercase text-secondary/40">Score</span>
                          <span className={`text-[10px] font-black ${lead.score > 80 ? 'text-success' : lead.score > 50 ? 'text-accent-amber' : 'text-danger'}`}>{lead.score}</span>
                       </div>
                       <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${lead.score > 80 ? 'bg-success' : lead.score > 50 ? 'bg-accent-amber' : 'bg-danger'}`} 
                            style={{ width: `${lead.score}%` }} 
                          />
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border w-fit ${getStatusStyle(lead.status)}`}>
                         {lead.status}
                       </span>
                       <span className="text-[9px] text-secondary font-bold italic">Source: {lead.source}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleAction('WhatsApp Message', lead.name)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-success hover:text-white transition-all shadow-sm" title="WhatsApp Message"
                      >
                        <MessageSquare size={18} />
                      </button>
                      <button 
                        onClick={() => handleAction('Task Assignment', lead.name)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <Plus size={18} />
                      </button>
                      <button 
                        onClick={() => handleAction('Details View', lead.name)}
                        className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-900 to-primary p-12 rounded-[50px] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
         <div className="relative z-10 space-y-4">
            <h3 className="text-3xl font-black font-sans uppercase tracking-tighter flex items-center gap-3">
               <Send size={32} className="text-accent-cyan" /> Automated Lead Nurturing
            </h3>
            <p className="max-w-lg text-white/60 font-medium italic">Our CRM bots automatically send follow-up reminders via WhatsApp & Email based on lead temperature. <span className="text-success font-black">12 touchpoints pending for today.</span></p>
            <div className="flex gap-4 pt-4">
               <button 
                onClick={() => alert('Executing automated follow-up queue for 12 leads...')}
                className="px-8 py-4 bg-accent-cyan text-primary rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl shadow-accent-cyan/20"
               >
                 Execute Queue
               </button>
               <button 
                onClick={() => alert('Opening bot configuration settings...')}
                className="px-8 py-4 bg-white/10 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all"
               >
                 Configure Bots
               </button>
            </div>
         </div>
         <Target size={300} className="absolute -right-20 -bottom-20 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
      </div>
    </div>
  );
}
