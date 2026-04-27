import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, Plus, Search, Filter, FileText, CheckCircle, 
  Clock, DollarSign, ArrowUpRight, X, Download, Printer, 
  Send, MoreHorizontal, Percent, Receipt, Wallet, Banknote,
  ChevronDown, History, CheckSquare, ShieldCheck
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNo: string;
  jobId: string;
  customerName: string;
  date: string;
  dueDate: string;
  taxableAmount: number;
  gstRate: number; // percentage
  totalAmount: number;
  paidAmount: number;
  status: 'Unpaid' | 'Partial' | 'Paid' | 'Overdue';
  paymentMode?: 'Cash' | 'UPI' | 'Bank' | 'Cheque';
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    invoiceNo: 'SOP-INV/24/042',
    jobId: 'JC-013',
    customerName: 'Malhotra Publishing',
    date: '2024-03-20',
    dueDate: '2024-04-04',
    taxableAmount: 42000,
    gstRate: 12,
    totalAmount: 47040,
    paidAmount: 20000,
    status: 'Partial',
    paymentMode: 'Bank'
  },
  {
    id: 'INV-002',
    invoiceNo: 'SOP-INV/24/043',
    jobId: 'JC-014',
    customerName: 'Sharma Creative',
    date: '2024-03-21',
    dueDate: '2024-03-28',
    taxableAmount: 15500,
    gstRate: 18,
    totalAmount: 18290,
    paidAmount: 18290,
    status: 'Paid',
    paymentMode: 'UPI'
  },
  {
    id: 'INV-003',
    invoiceNo: 'SOP-INV/24/044',
    jobId: 'JC-010',
    customerName: 'Reliable Corp',
    date: '2024-03-15',
    dueDate: '2024-03-22',
    taxableAmount: 65000,
    gstRate: 12,
    totalAmount: 72800,
    paidAmount: 0,
    status: 'Overdue'
  }
];

export default function BillingModule() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const handleRecordPayment = (id: string) => {
    setInvoices(invoices.map(inv => {
      if (inv.id !== id) return inv;
      const outstanding = inv.totalAmount - inv.paidAmount;
      return { ...inv, paidAmount: inv.totalAmount, status: 'Paid' as const };
    }));
    alert('Full payment recorded successfully.');
  };

  const stats = {
    totalBilled: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    totalPaid: invoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
    outstanding: invoices.reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0),
    collectedRate: 72
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-success/10 text-success border-success/20 shadow-sm shadow-success/5';
      case 'Partial': return 'bg-accent-amber/10 text-accent-amber border-accent-amber/20';
      case 'Overdue': return 'bg-danger/10 text-danger border-danger/20 animate-pulse';
      default: return 'bg-gray-100 text-secondary border-gray-200';
    }
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const amount = parseFloat(formData.get('amount') as string) || 0;
    const gstRate = 18;
    const total = amount + (amount * gstRate / 100);

    const newInvoice: Invoice = {
      id: `INV-00${invoices.length + 1}`,
      invoiceNo: `SOP-INV/24/0${45 + invoices.length}`,
      jobId: 'JC-NEW',
      customerName: formData.get('customer') as string,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      taxableAmount: amount,
      gstRate: gstRate,
      totalAmount: total,
      paidAmount: 0,
      status: 'Unpaid'
    };
    setInvoices([newInvoice, ...invoices]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-sans uppercase tracking-[0.2em] text-primary">Billing & RevOps</h2>
          <p className="text-secondary text-sm font-medium">GST-compliant invoicing and receivables tracking.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => alert('Opening full payment history and logs...')}
            className="bg-white border border-gray-200 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm group"
          >
            <History size={18} className="text-accent-cyan group-hover:rotate-180 transition-transform duration-700" /> Payment Logs
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-accent-cyan text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shadow-xl shadow-primary/20 transition-all"
          >
            <Plus size={20} /> Create GST Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Sales (MTD)', value: stats.totalBilled, icon: <FileText className="text-accent-cyan" /> },
          { label: 'Total Received', value: stats.totalPaid, icon: <CheckCircle className="text-success" /> },
          { label: 'Outstanding', value: stats.outstanding, icon: <Clock className="text-danger" /> },
          { label: 'Collection Rate', value: `${stats.collectedRate}%`, icon: <Percent className="text-accent-magenta" /> }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="p-3 bg-gray-50/50 rounded-2xl w-fit group-hover:bg-white transition-colors duration-500 shadow-inner">
                {stat.icon}
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-60">{stat.label}</p>
                <h4 className="text-2xl font-black text-primary mt-1">
                  {typeof stat.value === 'number' ? `₹${stat.value.toLocaleString()}` : stat.value}
                </h4>
              </div>
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
              placeholder="Search invoice #, customer name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 border border-gray-100 rounded-[24px] outline-none focus:ring-4 focus:ring-accent-cyan/10 transition-all text-sm font-medium bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto font-sans">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] uppercase tracking-widest font-black text-secondary">
                <th className="px-8 py-5">Invoice Reference</th>
                <th className="px-8 py-5">Customer / Entity</th>
                <th className="px-8 py-5">Net Amount</th>
                <th className="px-8 py-5">Current Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.filter(inv => 
                inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/5 rounded-2xl">
                        <Receipt size={18} />
                      </div>
                      <div>
                        <span className="font-mono font-black text-sm text-primary tracking-tighter">{invoice.invoiceNo}</span>
                        <p className="text-[10px] text-secondary mt-1 font-bold italic">Raised: {invoice.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-primary opacity-80">{invoice.customerName}</td>
                  <td className="px-8 py-6">
                    <div>
                      <span className="font-black text-primary text-lg tracking-tighter">₹{invoice.totalAmount.toLocaleString()}</span>
                      <p className="text-[10px] text-secondary font-bold mt-1">Paid: ₹{invoice.paidAmount.toLocaleString()}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border w-fit ${getStatusStyle(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {invoice.status !== 'Paid' && (
                        <button 
                          onClick={() => handleRecordPayment(invoice.id)}
                          className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-success hover:text-white transition-all shadow-sm group/pay"
                          title="Record Full Payment"
                        >
                          <Wallet size={18} className="text-success group-hover/pay:text-white" />
                        </button>
                      )}
                      <button 
                        onClick={() => alert(`Downloading PDF for Invoice: ${invoice.invoiceNo}`)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-accent-cyan hover:text-white transition-all shadow-sm text-secondary hover:text-white"
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        onClick={() => alert(`Emailing Invoice ${invoice.invoiceNo} to ${invoice.customerName}...`)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Mock */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-primary/20 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                <h3 className="text-xl font-black text-primary mb-6">Create GST Invoice</h3>
                <form onSubmit={handleCreateInvoice} className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-secondary">Customer Name</label>
                      <input name="customer" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-accent-cyan" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-secondary">Taxable Amount</label>
                      <input name="amount" type="number" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-accent-cyan" />
                   </div>
                   <div className="pt-4 flex gap-3">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-secondary">Discard</button>
                      <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">Generate</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
