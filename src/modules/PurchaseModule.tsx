import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, Plus, Search, Filter, Truck, CheckCircle, 
  Clock, DollarSign, X, Download, Printer, Send, 
  MoreHorizontal, Users, Package, FileCheck, ArrowUpCircle,
  TrendingUp, Info, ChevronDown, ListOrdered, Factory
} from 'lucide-react';

interface PurchaseOrder {
  id: string;
  poNo: string;
  vendorName: string;
  date: string;
  expectedDate: string;
  items: { name: string; qty: number; unit: string; rate: number }[];
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Received' | 'Partially Received' | 'Cancelled';
}

const mockPOs: PurchaseOrder[] = [
  {
    id: 'PO-001',
    poNo: 'SOP-PO-24-102',
    vendorName: 'Toyo Ink India',
    date: '2024-03-24',
    expectedDate: '2024-03-28',
    items: [
      { name: 'Cyan Offset Ink', qty: 10, unit: 'Kg', rate: 850 },
      { name: 'Standard Fountain Solution', qty: 20, unit: 'Liters', rate: 120 }
    ],
    totalAmount: 10900,
    status: 'Sent'
  },
  {
    id: 'PO-002',
    poNo: 'SOP-PO-24-103',
    vendorName: 'Reliable Paper House',
    date: '2024-03-25',
    expectedDate: '2024-03-27',
    items: [
      { name: '220 GSM Art Card', qty: 5000, unit: 'Sheets', rate: 12.50 }
    ],
    totalAmount: 62500,
    status: 'Received'
  }
];

export default function PurchaseModule() {
  const [pos, setPos] = useState<PurchaseOrder[]>(mockPOs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'Ongoing' | 'History' | 'Vendors'>('Ongoing');

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Received': return 'bg-success/10 text-success border-success/20';
      case 'Sent': return 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20';
      case 'Partially Received': return 'bg-accent-amber/10 text-accent-amber border-accent-amber/20';
      case 'Draft': return 'bg-gray-100 text-secondary border-gray-200';
      default: return 'bg-danger/10 text-danger border-danger/20';
    }
  };

  const handleCreatePO = () => {
    setIsModalOpen(true);
  };

  const handleAction = (type: string, poId: string) => {
    if (type === 'Verification') {
      setPos(pos.map(p => p.id === poId ? { ...p, status: 'Received' } : p));
      alert(`PO ${poId} marked as Received. Inventory updated.`);
    } else {
      alert(`${type} initiated for ${poId}`);
    }
  };

  const createPO = (e: React.FormEvent) => {
    e.preventDefault();
    const newPO: PurchaseOrder = {
      id: `PO-00${pos.length + 1}`,
      poNo: `SOP-PO-24-${110 + pos.length}`,
      vendorName: (e.target as any).vendor.value,
      date: new Date().toISOString().split('T')[0],
      expectedDate: (e.target as any).date.value,
      items: [{ name: 'Assorted Consumables', qty: 1, unit: 'Lot', rate: 5000 }],
      totalAmount: 5000,
      status: 'Sent'
    };
    setPos([newPO, ...pos]);
    setIsModalOpen(false);
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
               <h3 className="text-2xl font-black text-primary uppercase italic">New Purchase Order</h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                  <X size={20} />
               </button>
            </div>
            <form onSubmit={createPO} className="space-y-6">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-secondary mb-1 block tracking-widest pl-1">Vendor / Supplier</label>
                  <select name="vendor" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-accent-cyan transition-all">
                    <option>Toyo Ink India</option>
                    <option>Reliable Paper House</option>
                    <option>Super Graphics</option>
                  </select>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-secondary mb-1 block tracking-widest pl-1">Expected Delivery Date</label>
                  <input name="date" type="date" required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-primary focus:border-accent-cyan transition-all" />
               </div>
               <div className="p-4 bg-accent-cyan/5 rounded-2xl border border-accent-cyan/10">
                  <p className="text-[9px] font-black uppercase text-accent-cyan tracking-widest mb-2">Item Summary</p>
                  <p className="text-sm font-bold text-primary">Consumables Stock Refill Package</p>
                  <p className="text-[10px] text-secondary font-medium italic mt-1 font-sans">Automatic estimate applied: ₹5,000.00</p>
               </div>
               <button 
                type="submit"
                className="w-full py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:bg-accent-cyan transition-all mt-4"
               >
                 Authorize & Send PO
               </button>
            </form>
          </motion.div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-sans uppercase tracking-[0.2em] text-primary">Procurement & Vendors</h2>
          <p className="text-secondary text-sm font-medium">Manage supply chain, purchase orders, and supplier payments.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setViewMode('Vendors')}
            className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-sm ${viewMode === 'Vendors' ? 'bg-accent-cyan text-white border-transparent' : 'bg-white border border-gray-200 text-primary hover:bg-gray-50'}`}
          >
            <Users size={18} /> Vendor Directory
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-accent-cyan text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shadow-xl shadow-primary/20 transition-all"
          >
            <Plus size={20} /> Create Purchase Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active POs', value: '12', icon: <ListOrdered />, subText: '4 Expected today' },
          { label: 'Vendor Payables', value: '₹1,45,200', icon: <Factory />, subText: 'Across 8 Vendors' },
          { label: 'Purchases (MTD)', value: '₹5,12,000', icon: <ShoppingCart />, subText: '+12% from last month' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="p-3 bg-gray-50 rounded-2xl w-fit group-hover:bg-primary group-hover:text-white transition-all">
                {stat.icon}
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-60">{stat.label}</p>
                <h4 className="text-2xl font-black text-primary mt-1">{stat.value}</h4>
                <p className="text-[10px] text-secondary/60 font-bold mt-1 italic tracking-widest uppercase">{stat.subText}</p>
              </div>
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
              placeholder="Search PO #, vendor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-accent-cyan bg-white text-sm font-medium"
            />
          </div>
          <div className="flex bg-white rounded-xl border border-gray-100 p-1">
            <button 
              onClick={() => setViewMode('Ongoing')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === 'Ongoing' ? 'bg-primary text-white shadow-lg' : 'text-secondary hover:bg-gray-50'}`}
            >
              Ongoing
            </button>
            <button 
              onClick={() => setViewMode('History')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === 'History' ? 'bg-primary text-white shadow-lg' : 'text-secondary hover:bg-gray-50'}`}
            >
              History
            </button>
          </div>
        </div>

        <div className="overflow-x-auto font-sans">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] uppercase tracking-widest font-black text-secondary">
                <th className="px-8 py-5">PO Identification</th>
                <th className="px-8 py-5">Vendor / Supplier</th>
                <th className="px-8 py-5">PO Amount</th>
                <th className="px-8 py-5">Current Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pos.filter(po => 
                po.poNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                po.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((po) => (
                <tr key={po.id} className="hover:bg-gray-50/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent-amber/5 rounded-2xl group-hover:bg-accent-amber group-hover:text-white transition-all">
                        <ListOrdered size={18} />
                      </div>
                      <div>
                        <span className="font-mono font-black text-sm text-primary tracking-tighter">{po.poNo}</span>
                        <p className="text-[10px] text-secondary mt-1 font-bold italic">Date: {po.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className="text-sm font-black text-primary opacity-80">{po.vendorName}</span>
                     <p className="text-[10px] text-secondary/60 font-bold uppercase tracking-widest mt-1">Expected: {po.expectedDate}</p>
                  </td>
                  <td className="px-8 py-6">
                     <span className="font-black text-primary text-lg tracking-tighter">₹{po.totalAmount.toLocaleString()}</span>
                     <p className="text-[10px] text-secondary font-bold mt-1 uppercase tracking-tighter">{po.items.length} Line Items</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border w-fit ${getStatusStyle(po.status)}`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {po.status === 'Sent' && (
                        <button 
                          onClick={() => handleAction('Verification', po.id)}
                          className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-success hover:text-white transition-all shadow-sm group/btn"
                          title="Mark as Received"
                        >
                          <FileCheck size={18} className="text-success group-hover/btn:text-white" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleAction('Options', po.id)}
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

      <div className="bg-accent-amber/5 border border-accent-amber/20 p-8 rounded-[40px] flex flex-col md:flex-row items-center gap-8 group">
         <div className="p-6 bg-white rounded-3xl shadow-xl shadow-accent-amber/10 group-hover:scale-110 transition-transform duration-700">
            <Factory size={40} className="text-accent-amber" />
         </div>
         <div className="flex-1 space-y-2">
            <h3 className="text-xl font-black text-primary font-sans uppercase tracking-widest">Smart Stock replenishment</h3>
            <p className="text-secondary text-sm font-medium leading-relaxed italic">AI is recommending POs for 3 materials (BILT Art Card, Offset Ink, Packaging Wrap) as they are reaching reorder levels based on upcoming queue.</p>
         </div>
         <button 
          onClick={() => alert('Generating 3 Automated Purchase Orders for low-stock items...')}
          className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-accent-cyan transition-all shadow-xl shadow-primary/20"
         >
           Generate Auto-POs
         </button>
      </div>
    </div>
  );
}
