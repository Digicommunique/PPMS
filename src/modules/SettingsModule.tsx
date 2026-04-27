import React from 'react';
import { motion } from 'motion/react';
import { User, Shield, Bell, Database, Globe, Lock, Mail, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function SettingsModule() {
  const [activeTab, setActiveTab] = useState('Profile');

  const tabs = [
    { id: 'Profile', icon: User },
    { id: 'Permissions', icon: Shield },
    { id: 'Notifications', icon: Bell },
    { id: 'System', icon: Database },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Settings</h2>
          <p className="text-secondary text-sm">Configure your personal profile and application preferences.</p>
        </div>
        <button className="bg-primary hover:bg-accent-cyan text-white px-6 py-2.5 rounded-lg font-bold transition-all">
          Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <aside className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                activeTab === tab.id ? 'bg-accent-cyan text-white shadow-md' : 'text-secondary hover:bg-gray-100'
              }`}
            >
              <tab.icon size={18} />
              {tab.id}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
           {activeTab === 'Profile' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="flex items-center gap-6 pb-8 border-b border-gray-100">
                   <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-accent-cyan flex items-center justify-center text-white text-3xl font-bold shadow-xl">A</div>
                      <button className="absolute inset-0 bg-black/40 text-white text-[10px] font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center uppercase tracking-wider">Change</button>
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-primary">Admin User</h3>
                      <p className="text-sm text-secondary">Super Admin • Joined March 2024</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-primary/80">Full Name</label>
                      <input type="text" defaultValue="Admin User" className="w-full px-4 py-2.5 bg-app-bg border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-accent-cyan transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-primary/80">Email Address</label>
                      <input type="email" defaultValue="admin@ppms.com" className="w-full px-4 py-2.5 bg-app-bg border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-accent-cyan transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-primary/80">Phone Number</label>
                      <input type="text" defaultValue="+91 98765 43210" className="w-full px-4 py-2.5 bg-app-bg border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-accent-cyan transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-primary/80">Role</label>
                      <input type="text" defaultValue="Super Admin" disabled className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-secondary" />
                   </div>
                </div>

                <div className="pt-4 space-y-4">
                   <h4 className="font-bold text-primary border-l-4 border-accent-cyan pl-3">Security & Privacy</h4>
                   <div className="flex items-center justify-between p-4 bg-app-bg rounded-xl">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white rounded-lg shadow-sm text-secondary"><Lock size={18} /></div>
                         <div>
                            <p className="text-sm font-bold text-primary">Password</p>
                            <p className="text-xs text-secondary">Last changed 2 weeks ago</p>
                         </div>
                      </div>
                      <button className="text-sm font-bold text-accent-cyan hover:underline">Change</button>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-app-bg rounded-xl">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white rounded-lg shadow-sm text-secondary"><Shield size={18} /></div>
                         <div>
                            <p className="text-sm font-bold text-primary">Two-Factor Auth</p>
                            <p className="text-xs text-secondary">Add an extra layer of security</p>
                         </div>
                      </div>
                      <div className="w-10 h-6 bg-gray-300 rounded-full relative cursor-pointer ring-offset-2 focus:ring-2 focus:ring-accent-cyan transition-all">
                         <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                      </div>
                   </div>
                </div>
             </motion.div>
           )}

            {activeTab === 'Permissions' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-primary">Team & RBAC</h3>
                    <button 
                      onClick={() => alert('Launching User onboarding wizard...')}
                      className="bg-accent-cyan text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-accent-cyan/20"
                    >
                       Add User
                    </button>
                 </div>
                 <div className="space-y-4">
                    {[
                      { name: 'Admin User', role: 'Super Admin', email: 'admin@ppms.com' },
                      { name: 'Rajesh K.', role: 'Machine Operator', email: 'rajesh@ppms.com' },
                      { name: 'Sunil V.', role: 'Production In-charge', email: 'sunil@ppms.com' },
                      { name: 'Amit S.', role: 'Designer', email: 'amit@ppms.com' },
                    ].map((user, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-app-bg rounded-xl border border-gray-100 hover:border-accent-cyan transition-all group">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{user.name[0]}</div>
                             <div>
                                <p className="text-sm font-bold text-primary">{user.name}</p>
                                <p className="text-[10px] text-secondary font-medium tracking-widest uppercase">{user.role}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <span className="text-xs text-secondary italic opacity-0 group-hover:opacity-100 transition-opacity">{user.email}</span>
                             <button className="p-2 text-gray-400 hover:text-danger rounded-lg transition-all"><Trash2 size={16} /></button>
                          </div>
                       </div>
                    ))}
                 </div>
              </motion.div>
            )}

            {(activeTab === 'Notifications' || activeTab === 'System') && (
              <div className="text-center py-20 text-secondary">
                 <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab)!.icon, { size: 24, className: 'opacity-40' })}
                 </div>
                 <p className="font-medium text-lg capitalize">{activeTab} Preferences</p>
                 <p className="text-sm">Manage {activeTab.toLowerCase()} related configurations and sync schedules.</p>
                 <button 
                  onClick={() => alert(`${activeTab} sync initiated...`)}
                  className="mt-6 px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105"
                 >
                   Sync & Refresh
                 </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
