import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, Plus, Search, Filter, AlertCircle, ArrowDownCircle, ArrowUpCircle, X, 
  Tag, Box, Layers, History, Users, TrendingDown, TrendingUp, Info, MoreHorizontal,
  ChevronDown, DollarSign, Calculator, Printer, FileText, Truck
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: 'Paper' | 'Ink & Chemicals' | 'Plates' | 'Spare Parts' | 'Packaging';
  unit: 'Sheets' | 'Kg' | 'Liters' | 'Nos' | 'Rolls';
  openingStock: number;
  currentStock: number;
  reorderLevel: number;
  purchasePrice: number;
  supplierId: string;
  supplierName: string;
  lastUpdated: string;
  batchInfo?: string;
}

const mockInventory: InventoryItem[] = [
  { 
    id: 'MAT-P001', 
    name: '220 GSM BILT Art Card (A1)', 
    category: 'Paper', 
    openingStock: 5000,
    currentStock: 1200, 
    unit: 'Sheets', 
    reorderLevel: 2000, 
    purchasePrice: 12.50,
    supplierId: 'SUP-001',
    supplierName: 'Reliable Paper House',
    lastUpdated: '2024-03-24'
  },
  { 
    id: 'MAT-I002', 
    name: 'Standard Cyan Ink (Toyo)', 
    category: 'Ink & Chemicals', 
    openingStock: 100,
    currentStock: 45, 
    unit: 'Kg', 
    reorderLevel: 30, 
    purchasePrice: 850.00,
    supplierId: 'SUP-022',
    supplierName: 'Toyo Ink India',
    lastUpdated: '2024-03-25'
  },
  { 
    id: 'MAT-PL003', 
    name: 'Thermal CTP Plates (Small)', 
    category: 'Plates', 
    openingStock: 200,
    currentStock: 25, 
    unit: 'Nos', 
    reorderLevel: 50, 
    purchasePrice: 180.00,
    supplierId: 'SUP-045',
    supplierName: 'Imaging Systems',
    lastUpdated: '2024-03-22'
  },
  { 
    id: 'MAT-PK004', 
    name: 'Stretch Wrap Film (500mm)', 
    category: 'Packaging', 
    openingStock: 50,
    currentStock: 12, 
    unit: 'Rolls', 
    reorderLevel: 10, 
    purchasePrice: 420.00,
    supplierId: 'SUP-012',
    supplierName: 'EcoPack Solutions',
    lastUpdated: '2024-03-26'
  },
];

const categories = ['All', 'Paper', 'Ink & Chemicals', 'Plates', 'Spare Parts', 'Packaging'];

export default function InventoryModule() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [showGRN, setShowGRN] = useState(false);
  const [showGRNLog, setShowGRNLog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [grnLines, setGrnLines] = useState<{itemName: string, qty: number}[]>([{itemName: '', qty: 0}]);

  const handleProcessGRN = () => {
    if (grnLines.some(line => !line.itemName || line.qty <= 0)) {
      alert('Please ensure all items have a selection and a valid quantity.');
      return;
    }
    
    setInventory(prev => prev.map(item => {
      const inward = grnLines.find(l => l.itemName === item.name);
      if (inward) {
        return { 
          ...item, 
          currentStock: item.currentStock + inward.qty, 
          lastUpdated: new Date().toISOString().split('T')[0] 
        };
      }
      return item;
    }));

    setShowGRN(false);
    setGrnLines([{itemName: '', qty: 0}]);
    alert(`GRN Processed Successfully. ${grnLines.length} item(s) inward registered. Batch code: GRN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`);
  };

  const addGrnLine = () => {
    setGrnLines([...grnLines, {itemName: '', qty: 0}]);
  };

  const updateGrnLine = (index: number, field: 'itemName' | 'qty', value: string | number) => {
    const updated = [...grnLines];
    updated[index] = { ...updated[index], [field]: value };
    setGrnLines(updated);
  };

  const removeGrnLine = (index: number) => {
    if (grnLines.length > 1) {
      setGrnLines(grnLines.filter((_, i) => i !== index));
    } else {
      setGrnLines([{itemName: '', qty: 0}]);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const categoryMapping: Record<string, InventoryItem['category']> = {
      'Paper': 'Paper',
      'Ink': 'Ink & Chemicals',
      'Plates': 'Plates',
      'Spare': 'Spare Parts',
      'Packaging': 'Packaging'
    };

    const newItem: InventoryItem = {
      id: `MAT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: formData.get('name') as string,
      category: categoryMapping[formData.get('category') as string] || 'Paper',
      openingStock: Number(formData.get('stock')),
      currentStock: Number(formData.get('stock')),
      unit: formData.get('unit') as InventoryItem['unit'],
      reorderLevel: Number(formData.get('reorderLevel')),
      purchasePrice: Number(formData.get('price')),
      supplierId: 'SUP-NEW',
      supplierName: formData.get('supplier') as string,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setInventory([newItem, ...inventory]);
    setIsModalOpen(false);
  };

  const filteredItems = inventory.filter(i => {
    const matchesCategory = activeCategory === 'All' || i.category === activeCategory;
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans">Inventory & Store Management</h2>
          <p className="text-secondary text-sm">Track raw materials, issue stock to jobs, and monitor reorder levels.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowGRN(true)}
            className="group bg-white border border-gray-200 text-primary px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            <ArrowDownCircle size={20} className="text-accent-cyan group-hover:text-white transition-colors" /> New GRN
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-accent-cyan text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
          >
            <Plus size={20} /> Add New Material
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Inventory Panel */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar w-full md:w-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                        activeCategory === cat ? 'bg-primary text-white shadow-lg' : 'text-secondary hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="relative w-full md:w-72">
                   <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                   <input 
                     type="text" 
                     placeholder="Search item or SKU..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent-cyan transition-all"
                   />
                </div>
             </div>
             
             <div className="overflow-x-auto font-sans">
               <table className="w-full text-left">
                 <thead>
                    <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest font-black text-secondary">
                      <th className="px-6 py-4">Item Identification</th>
                      <th className="px-6 py-4">Purchase Detail</th>
                      <th className="px-6 py-4 text-center">Current Stock</th>
                      <th className="px-6 py-4 text-center">Batch / Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                             <div className={`p-3 rounded-2xl ${
                               item.category === 'Paper' ? 'bg-accent-cyan/10 text-accent-cyan' :
                               item.category === 'Ink & Chemicals' ? 'bg-accent-magenta/10 text-accent-magenta' :
                               'bg-accent-amber/10 text-accent-amber'
                             }`}>
                                {item.category === 'Paper' && <FileText size={20} />}
                                {item.category === 'Ink & Chemicals' && <Tag size={20} />}
                                {item.category === 'Plates' && <Layers size={20} />}
                                {item.category === 'Packaging' && <Box size={20} />}
                             </div>
                             <div>
                               <p className="font-bold text-primary group-hover:text-accent-cyan transition-colors">{item.name}</p>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] text-secondary font-mono font-bold bg-gray-100 px-1.5 py-0.5 rounded">{item.id}</span>
                                  <span className="text-[10px] text-secondary/60 font-bold uppercase tracking-tighter italic">{item.category}</span>
                               </div>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm font-bold text-primary">₹{item.purchasePrice.toFixed(2)} / {item.unit}</p>
                           <p className="text-[10px] text-secondary font-bold flex items-center gap-1 mt-1">
                              <Users size={10} /> {item.supplierName}
                           </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-block text-center">
                            <p className={`text-xl font-black ${item.currentStock <= item.reorderLevel ? 'text-danger' : 'text-primary'}`}>
                               {item.currentStock.toLocaleString()}
                            </p>
                            <span className="text-[10px] text-secondary font-black uppercase opacity-40">{item.unit}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <div className="flex flex-col items-center gap-2">
                             <span className={`text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm border ${
                               item.currentStock <= item.reorderLevel ? 'bg-danger/10 text-danger border-danger/20' : 'bg-success/10 text-success border-success/20'
                             }`}>
                               {item.currentStock <= item.reorderLevel ? 'Low Stock' : 'Optimized'}
                             </span>
                             <span className="text-[9px] text-secondary opacity-50 font-bold">Updated: {item.lastUpdated}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => alert(`Initiating material issue for ${item.name}...`)}
                                className="p-2 hover:bg-accent-cyan/10 hover:text-accent-cyan rounded-xl transition-all"
                                title="Issue Material"
                              >
                                 <ArrowUpCircle size={18} />
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsViewModalOpen(true);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-all text-secondary"
                                title="View Details"
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
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative group">
             <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                   <h3 className="text-lg font-black text-primary mb-1 font-sans">Stock Health</h3>
                   <p className="text-secondary text-xs">Total material value in inventory: <span className="font-bold text-primary italic">₹1,45,200</span></p>
                </div>
                <div className="mt-8 space-y-4">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase text-secondary">Consumption Rate</span>
                      <TrendingUp size={16} className="text-success" />
                   </div>
                   <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-cyan w-[65%] rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                   </div>
                   <p className="text-[10px] text-secondary/60 font-bold italic text-right">Based on last 30 days job logs</p>
                </div>
             </div>
             <Calculator size={140} className="absolute -right-5 -bottom-5 text-gray-50/50 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-3 mb-6 text-accent-amber">
                <AlertCircle size={24} />
                <h3 className="text-lg font-bold text-primary font-sans">Critical Alerts</h3>
             </div>
             <div className="space-y-4">
                {inventory.filter(i => i.currentStock <= i.reorderLevel).map(item => (
                  <div key={item.id} className="p-4 rounded-2xl bg-danger/5 border border-danger/10 group hover:shadow-md transition-all">
                     <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-xs text-primary">{item.name}</p>
                        <button className="text-[9px] font-black text-white bg-accent-cyan px-2 py-1 rounded shadow-sm hover:scale-105 transition-transform uppercase tracking-tighter">Place PO</button>
                     </div>
                     <div className="flex justify-between text-[10px] text-secondary font-bold">
                        <span>Has: {item.currentStock} {item.unit}</span>
                        <span className="opacity-50">Min: {item.reorderLevel}</span>
                     </div>
                     <div className="mt-3 w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                        <div 
                          className="bg-danger h-1 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.3)]" 
                          style={{ width: `${(item.currentStock/item.reorderLevel)*100}%` }} 
                        />
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <button 
            onClick={() => setShowGRNLog(true)}
            className="w-full bg-white border-2 border-dashed border-gray-200 p-5 rounded-3xl text-secondary hover:border-accent-cyan hover:text-accent-cyan transition-all flex flex-col items-center gap-2 group"
          >
             <History size={24} className="group-hover:rotate-180 transition-transform duration-700" />
             <span className="text-xs font-black uppercase tracking-widest">Inventory Logs / GRN History</span>
          </button>
        </div>
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden font-sans"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-primary text-white">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/10 rounded-xl">
                      <Package size={20} />
                   </div>
                   <h3 className="text-xl font-bold">Catalog New Material</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/30">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-wider flex items-center gap-2">
                     Item Full Name / Description
                  </label>
                  <input name="name" required placeholder="e.g., Toyo Cyan Offset Ink 1.5Kg" className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-accent-cyan transition-all" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-wider">Category</label>
                  <select name="category" className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-accent-cyan text-sm font-bold">
                    <option value="Paper">Paper Stock</option>
                    <option value="Ink">Ink & Chemicals</option>
                    <option value="Plates">CTP Plates</option>
                    <option value="Spare">Spare Parts</option>
                    <option value="Packaging">Packaging Material</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-wider">Unit of Measure</label>
                  <select name="unit" className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-accent-cyan text-sm font-bold">
                    <option value="Sheets">Sheets</option>
                    <option value="Kg">Kilograms (Kg)</option>
                    <option value="Nos">Numbers (Nos)</option>
                    <option value="Ltr">Liters (Ltr)</option>
                    <option value="Rolls">Rolls</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-wider">Opening Stock</label>
                  <input name="stock" type="number" step="0.01" required placeholder="0.00" className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-accent-cyan" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-wider">Reorder Level (Alert at)</label>
                  <input name="reorderLevel" type="number" required placeholder="10" className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-accent-cyan border-accent-amber/30 bg-accent-amber/[0.02]" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-wider">Purchase Price (per unit)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-bold">₹</span>
                    <input name="price" type="number" step="0.01" required className="w-full pl-8 pr-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-accent-cyan" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-wider">Primary Supplier</label>
                  <input name="supplier" required placeholder="Vendor Name" className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-accent-cyan" />
                </div>

                <div className="md:col-span-2 pt-6 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-4 border border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-secondary hover:bg-gray-100 transition-all">
                    Dismiss
                  </button>
                  <button type="submit" className="flex-1 px-4 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-accent-cyan shadow-xl shadow-primary/20 transition-all">
                    Register Item
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GRN Modal (Simulated) */}
      <AnimatePresence>
        {isViewModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsViewModalOpen(false)} className="absolute inset-0 bg-primary/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100 font-sans">
               <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black text-primary uppercase italic">{selectedItem.name}</h3>
                    <p className="text-secondary text-[10px] font-bold tracking-widest uppercase mt-1">{selectedItem.id} • {selectedItem.category}</p>
                  </div>
                  <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
               </div>
               
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                     <p className="text-[10px] font-black text-secondary uppercase opacity-50 mb-1">Current Stock</p>
                     <p className="text-2xl font-black text-primary">{selectedItem.currentStock} <span className="text-sm opacity-50 font-bold uppercase">{selectedItem.unit}</span></p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                     <p className="text-[10px] font-black text-secondary uppercase opacity-50 mb-1">Purchase Price</p>
                     <p className="text-2xl font-black text-primary">₹{selectedItem.purchasePrice.toFixed(2)}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs py-2 border-b border-gray-50">
                     <span className="font-bold text-secondary">Preferred Supplier</span>
                     <span className="font-black text-primary uppercase italic">{selectedItem.supplierName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-gray-50">
                     <span className="font-bold text-secondary">Minimum Reorder Level</span>
                     <span className="font-black text-danger uppercase italic">{selectedItem.reorderLevel} {selectedItem.unit}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-gray-50">
                     <span className="font-bold text-secondary">Last Warehouse Update</span>
                     <span className="font-black text-primary uppercase italic">{selectedItem.lastUpdated}</span>
                  </div>
               </div>

               <div className="mt-8 grid grid-cols-2 gap-3">
                  <button onClick={() => alert('Generating full movement report...')} className="px-4 py-4 bg-gray-50 rounded-2xl text-[10px] font-black uppercase text-secondary hover:bg-gray-100 transition-all">Stock Report</button>
                  <button onClick={() => alert('Opening supplier contact...')} className="px-4 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-cyan shadow-xl shadow-primary/20 transition-all">Contact Vendor</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGRNLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowGRNLog(false)} className="absolute inset-0 bg-primary/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden font-sans flex flex-col border-4 border-white">
               <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-primary italic uppercase tracking-tighter">GRN Movement History</h3>
                    <p className="text-secondary text-xs font-bold uppercase tracking-widest">Historical material inward registry</p>
                  </div>
                  <button onClick={() => setShowGRNLog(false)} className="p-4 hover:bg-gray-100 rounded-full"><X size={20} /></button>
               </div>
               <div className="flex-1 overflow-y-auto p-8 space-y-4">
                  {[
                    { id: 'GRN/2024/042', date: '2024-03-24', item: '220 GSM BILT Art Card', qty: 500, vendor: 'Reliable Paper', status: 'Verified' },
                    { id: 'GRN/2024/041', date: '2024-03-22', item: 'Toyo Cyan Ink', qty: 10, vendor: 'Toyo Ink India', status: 'Pending QC' },
                    { id: 'GRN/2024/040', date: '2024-03-20', item: 'Thermal Plates', qty: 50, vendor: 'Imaging Systems', status: 'Verified' },
                  ].map((log, i) => (
                    <div key={i} className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between hover:bg-white hover:shadow-lg transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-white rounded-2xl group-hover:bg-accent-cyan/10 group-hover:text-accent-cyan transition-colors shadow-sm">
                             <TrendingDown size={20} />
                          </div>
                          <div>
                             <p className="text-sm font-black text-primary">{log.id}</p>
                             <p className="text-[10px] text-secondary font-bold uppercase tracking-tighter">{log.date} • {log.vendor}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-lg font-black text-primary">+{log.qty}</p>
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${log.status === 'Verified' ? 'bg-success/10 text-success' : 'bg-accent-amber/10 text-accent-amber'}`}>{log.status}</span>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="p-8 border-t border-gray-100 text-center">
                  <p className="text-[10px] font-black text-secondary uppercase opacity-40">End of recent logs</p>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showGRN && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGRN(false)}
              className="absolute inset-0 bg-primary/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden font-sans border-4 border-white"
            >
               <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="p-4 bg-accent-cyan/10 text-accent-cyan rounded-[25px]">
                        <Truck size={32} />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-primary">Goods Receipt Note</h3>
                        <p className="text-secondary text-xs uppercase tracking-widest font-bold">Register Incoming Material Inward</p>
                     </div>
                  </div>
                  <button onClick={() => setShowGRN(false)} className="p-4 hover:bg-gray-100 rounded-full transition-colors text-secondary">
                     <X size={24} />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-10 bg-gray-50/30">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="md:col-span-2 space-y-8">
                        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-2">
                             <TrendingDown size={14} className="text-accent-cyan" /> Shipment Identification
                           </h4>
                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-1">
                                 <label className="text-[10px] font-bold text-primary uppercase">Inward Date</label>
                                 <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[10px] font-bold text-primary uppercase">Vendor Invoice #</label>
                                 <input type="text" placeholder="INV-2024-001" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                              </div>
                           </div>
                           <div className="space-y-1">
                              <label className="text-[10px] font-bold text-primary uppercase">Select Supplier</label>
                              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-sm">
                                 <option>Reliable Paper House</option>
                                 <option>Toyo Ink India</option>
                                 <option>Imaging Systems</option>
                              </select>
                           </div>
                        </div>

                        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Material Details</h4>
                           <div className="space-y-4">
                              {grnLines.map((line, index) => (
                                <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                   <div className="flex-1">
                                      <p className="text-[10px] font-bold text-secondary uppercase mb-1">Item Selection</p>
                                      <select 
                                        value={line.itemName}
                                        onChange={(e) => updateGrnLine(index, 'itemName', e.target.value)}
                                        className="w-full bg-transparent font-bold text-sm outline-none"
                                      >
                                         <option value="">Select Item from Catalog...</option>
                                         {inventory.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                                      </select>
                                   </div>
                                   <div className="w-24">
                                      <p className="text-[10px] font-bold text-secondary uppercase mb-1">Qty</p>
                                      <input 
                                        type="number" 
                                        value={line.qty || ''}
                                        onChange={(e) => updateGrnLine(index, 'qty', Number(e.target.value))}
                                        className="w-full bg-transparent font-black text-sm outline-none" 
                                        placeholder="0" 
                                      />
                                   </div>
                                   <button 
                                      onClick={() => removeGrnLine(index)} 
                                      className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                                   >
                                      <X size={16} />
                                   </button>
                                </div>
                              ))}
                              <button 
                                onClick={addGrnLine}
                                className="text-[10px] font-black uppercase text-accent-cyan tracking-widest flex items-center gap-2 py-2 px-1 hover:underline"
                              >
                                 <Plus size={14} /> Add Another Item
                              </button>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="p-8 bg-primary rounded-[30px] text-white shadow-2xl relative overflow-hidden">
                           <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-8">Summary</h4>
                           <div className="space-y-4 relative z-10">
                              <div className="flex justify-between items-center text-xs">
                                 <span className="font-bold opacity-60">Total Items</span>
                                 <span className="font-black">{grnLines.length}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                 <span className="font-bold opacity-60">Batch Auto-Gen</span>
                                 <span className="font-black">ENABLED</span>
                              </div>
                              <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-end">
                                 <span className="text-[10px] font-black uppercase tracking-widest">Inward Units</span>
                                 <span className="text-2xl font-black">{grnLines.reduce((sum, line) => sum + line.qty, 0)}</span>
                              </div>
                           </div>
                           <TrendingDown size={140} className="absolute -right-10 -bottom-10 text-white/5 rotate-12" />
                        </div>
                        <div className="p-6 bg-accent-amber/10 border border-accent-amber/20 rounded-3xl space-y-3">
                           <div className="flex items-center gap-2 text-accent-amber font-black text-[10px] uppercase">
                              <Info size={14} /> QC Verification
                           </div>
                           <p className="text-[10px] text-primary/70 font-medium leading-relaxed italic">By confirming this GRN, stock levels will be incremented automatically and a batch code will be generated for tracking.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-8 border-t border-gray-100 bg-white flex justify-end gap-4">
                  <button onClick={() => setShowGRN(false)} className="px-8 py-4 border border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-secondary hover:bg-gray-50">Cancel Entry</button>
                  <button 
                    onClick={handleProcessGRN}
                    className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3 hover:bg-accent-cyan transition-all"
                  >
                     Process Material Inward <ArrowUpCircle size={18} />
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
