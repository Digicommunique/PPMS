import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Wallet, TrendingUp, TrendingDown, History, Search,
  Download, Filter, ArrowUpRight, ArrowDownRight, PieChart,
  BookOpen, Scale, Landmark, Briefcase, FileText, MoreHorizontal,
  ChevronDown, Calendar, Calculator, Plus, X, Share2, 
  RefreshCw, CheckCircle2, AlertCircle, FileCode
} from 'lucide-react';

interface LedgerEntry {
  id: string;
  date: string;
  particulars: string;
  category: 'Asset' | 'Liability' | 'Income' | 'Expense';
  debit: number;
  credit: number;
  balance: number;
}

const mockLedger: LedgerEntry[] = [
  { id: 'TXN-001', date: '2024-03-24', particulars: 'Sales: Inv/24/042 (Malhotra Publishing)', category: 'Income', debit: 0, credit: 47040, balance: 145000 },
  { id: 'TXN-002', date: '2024-03-24', particulars: 'Electricity Bill - Mar 2024', category: 'Expense', debit: 12500, credit: 0, balance: 132500 },
  { id: 'TXN-003', date: '2024-03-25', particulars: 'Vendor: Toyo Ink (Ink Purchase)', category: 'Asset', debit: 8500, credit: 0, balance: 124000 },
  { id: 'TXN-004', date: '2024-03-25', particulars: 'GST Payment: Q4 FY24', category: 'Liability', debit: 45000, credit: 0, balance: 79000 },
];

export default function AccountingModule() {
  const [activeTab, setActiveTab] = useState<'Ledger' | 'TrialBalance' | 'PL' | 'BalanceSheet' | 'Tally'>('Ledger');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [tallyConnected, setTallyConnected] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const stats = [
    { label: 'Current Balance', value: '₹5,42,000', icon: <Landmark />, change: '+5.2%', positive: true },
    { label: 'Receivables', value: '₹1,28,400', icon: <TrendingUp />, change: '+12%', positive: true },
    { label: 'Payables', value: '₹45,200', icon: <TrendingDown />, change: '-2.4%', positive: false },
    { label: 'Net Profit (MTD)', value: '₹88,000', icon: <Calculator />, change: '+8.1%', positive: true },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file format
    const allowedFormats = ['.xml', '.xls', '.xlsx'];
    const isSupported = allowedFormats.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isSupported) {
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    // Simulate parsing Tally Export
    setTimeout(() => {
      setUploadStatus('success');
      setTallyConnected(true);
    }, 2000);
  };

  const handleTallyExport = () => {
    setIsSyncing(true);
    // Simulate XML generation and export
    setTimeout(() => {
      const tallyXml = `
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
      </REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <!-- Sample Voucher Entry -->
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;
      
      const blob = new Blob([tallyXml], { type: 'text/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Tally_Export_${new Date().toISOString().split('T')[0]}.xml`;
      a.click();
      setIsSyncing(false);
      setTallyConnected(true);
    }, 1500);
  };

  const [showJournalModal, setShowJournalModal] = useState(false);

  const handleDownload = (type: 'pdf' | 'excel' | 'xml') => {
    setIsSyncing(true);
    
    // Simulate generation delay
    setTimeout(() => {
      const timestamp = new Date().toISOString().split('T')[0];
      const tallyDate = timestamp.replace(/-/g, '');
      let fileName = `Accounting_Records_${timestamp}`;
      let content = "";
      let contentType = "";

      if (type === 'xml') {
        fileName += ".xml";
        contentType = "text/xml";
        // Tally Compatible Balanced XML Structure
        const guid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        // Generate dynamic entries from mockLedger
        const ledgerEntriesXML = mockLedger.map((txn, idx) => `
          <VOUCHER VCHTYPE="Journal" ACTION="Create" OBJVIEW="Accounting VoucherView">
            <DATE>${ledgerDate(txn.date)}</DATE>
            <GUID>${guid}-${idx}</GUID>
            <VOUCHERTYPENAME>Journal</VOUCHERTYPENAME>
            <VOUCHERNUMBER>${txn.id}</VOUCHERNUMBER>
            <PARTYLEDGERNAME>${txn.particulars.split(':')[0]}</PARTYLEDGERNAME>
            <PERSISTEDVIEW>Accounting VoucherView</PERSISTEDVIEW>
            <ISOPTIONAL>No</ISOPTIONAL>
            <EFFECTIVEDATE>${ledgerDate(txn.date)}</EFFECTIVEDATE>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>${txn.particulars.split(':')[0]}</LEDGERNAME>
              <ISDEEMEDPOSITIVE>${txn.debit > 0 ? 'Yes' : 'No'}</ISDEEMEDPOSITIVE>
              <AMOUNT>${txn.debit > 0 ? txn.debit : -txn.credit}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Suspense Account</LEDGERNAME>
              <ISDEEMEDPOSITIVE>${txn.debit > 0 ? 'No' : 'Yes'}</ISDEEMEDPOSITIVE>
              <AMOUNT>${txn.debit > 0 ? -txn.debit : txn.credit}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
          </VOUCHER>`).join('\n');

        content = `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
        <STATICVARIABLES>
          <SVCURRENTCOMPANY>Sanjayshree Offset Printers</SVCURRENTCOMPANY>
        </STATICVARIABLES>
      </REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          ${ledgerEntriesXML}
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;
      } else if (type === 'excel') {
        fileName += ".csv";
        contentType = "text/csv";
        content = "Date,Particulars,Category,Debit,Credit,Balance\n" + 
          mockLedger.map(t => `${t.date},${t.particulars},${t.category},${t.debit},${t.credit},${t.balance}`).join('\n');
      } else {
        fileName += ".pdf";
        contentType = "application/pdf";
        content = "MOCK_PDF_CONTENT_FOR_DASHBOARD_AUDIT";
      }

      const blob = new Blob([content], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      
      setIsSyncing(false);
      alert(`${type.toUpperCase()} records generated successfully for Tally import. ${mockLedger.length} vouchers synced.`);
    }, 1500);
  };

  const ledgerDate = (dateStr: string) => dateStr.replace(/-/g, '');

  return (
    <div className="space-y-6">
      {showJournalModal && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl border border-gray-100"
          >
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black text-primary uppercase italic">New Journal Entry</h3>
               <button onClick={() => setShowJournalModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                  <X size={20} />
               </button>
            </div>
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black uppercase text-secondary mb-1 block">Particulars</label>
                  <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" placeholder="Transaction description..." />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-[10px] font-black uppercase text-secondary mb-1 block">Debit (₹)</label>
                     <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-danger" placeholder="0.00" />
                  </div>
                  <div>
                     <label className="text-[10px] font-black uppercase text-secondary mb-1 block">Credit (₹)</label>
                     <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-success" placeholder="0.00" />
                  </div>
               </div>
               <button 
                onClick={() => {
                  alert('Voucher posted successfully!');
                  setShowJournalModal(false);
                }}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-accent-cyan transition-all mt-4"
               >
                 Post Voucher
               </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black font-sans uppercase tracking-[0.2em] text-primary">Financial Ledger & Accounts</h2>
            {tallyConnected && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success text-[10px] font-black uppercase rounded-full border border-success/20">
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /> Tally Synced
              </span>
            )}
          </div>
          <p className="text-secondary text-sm font-medium">Double-entry accounting, P&L statements, and tax reconciliation.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab('Tally')}
            className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-sm ${
              activeTab === 'Tally' ? 'bg-accent-cyan text-white shadow-lg shadow-accent-cyan/20' : 'bg-white border border-gray-200 text-primary hover:bg-gray-50'
            }`}
          >
            <Share2 size={18} /> Tally Config
          </button>
          <button 
            onClick={() => setShowJournalModal(true)}
            className="bg-primary hover:bg-accent-cyan text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shadow-xl shadow-primary/20 transition-all"
          >
            <Plus size={20} /> Journal Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                 <div className="p-3 bg-gray-50 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                   {stat.icon}
                 </div>
                 <div className={`flex items-center gap-1 text-[10px] font-black ${stat.positive ? 'text-success' : 'text-danger'}`}>
                   {stat.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                   {stat.change}
                 </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-60">{stat.label}</p>
              <h4 className="text-2xl font-black text-primary mt-1">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between bg-gray-50/20">
          <div className="flex bg-white rounded-2xl border border-gray-100 p-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'Ledger', label: 'Journal Ledger', icon: <BookOpen size={14} /> },
              { id: 'TrialBalance', label: 'Trial Balance', icon: <Scale size={14} /> },
              { id: 'PL', label: 'Profit & Loss', icon: <TrendingUp size={14} /> },
              { id: 'BalanceSheet', label: 'Balance Sheet', icon: <Building2 size={14} /> },
              { id: 'Tally', label: 'Tally Integration', icon: <RefreshCw size={14} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-secondary hover:bg-gray-50'
                }`}
              >
                {tab.icon} {tab.label.split(' ')[0]}
              </button>
            ))}
          </div>
          {activeTab !== 'Tally' && (
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
              <input 
                type="text" 
                placeholder="Filter transactions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-accent-cyan text-sm font-medium"
              />
            </div>
          )}
        </div>

        <div className="overflow-x-auto font-sans">
          {activeTab === 'Ledger' && (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] uppercase tracking-widest font-black text-secondary">
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Particulars / Transaction</th>
                  <th className="px-8 py-5 text-right">Debit (Dr)</th>
                  <th className="px-8 py-5 text-right">Credit (Cr)</th>
                  <th className="px-8 py-5 text-right">Running Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockLedger.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50/30 transition-all group">
                    <td className="px-8 py-6 text-sm font-bold text-secondary">{txn.date}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-primary italic opacity-80">{txn.particulars}</span>
                        <span className={`text-[9px] font-black uppercase mt-1 px-1.5 py-0.5 rounded w-fit ${
                          txn.category === 'Income' ? 'bg-success/10 text-success' :
                          txn.category === 'Expense' ? 'bg-danger/10 text-danger' : 'bg-primary/5 text-primary'
                        }`}>
                          {txn.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={`font-black text-sm ${txn.debit > 0 ? 'text-danger' : 'text-secondary opacity-30'}`}>
                        {txn.debit > 0 ? `₹${txn.debit.toLocaleString()}` : '-'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={`font-black text-sm ${txn.credit > 0 ? 'text-success' : 'text-secondary opacity-30'}`}>
                        {txn.credit > 0 ? `₹${txn.credit.toLocaleString()}` : '-'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="font-black text-primary text-base tracking-tighter">₹{txn.balance.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'Tally' && (
            <div className="p-12 bg-gray-50/30">
               <div className="max-w-4xl mx-auto space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="p-4 bg-accent-magenta/10 text-accent-magenta rounded-2xl">
                              <Download size={24} />
                           </div>
                           <div>
                              <h4 className="text-lg font-black text-primary uppercase">Manual Import</h4>
                              <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Import XML/Excel from Tally</p>
                           </div>
                        </div>

                        <div className="pt-4 space-y-4">
                           <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-100 rounded-[28px] cursor-pointer hover:bg-gray-50 transition-all group overflow-hidden relative">
                              <div className="flex flex-col items-center justify-center pt-2">
                                 {uploadStatus === 'idle' && (
                                   <>
                                     <Download className="text-secondary opacity-30 group-hover:text-accent-magenta transform transition-all group-hover:-translate-y-1" size={32} />
                                     <p className="mt-2 text-[10px] font-black uppercase text-secondary tracking-widest italic group-hover:text-accent-magenta">Select Tally Export File</p>
                                   </>
                                 )}
                                 {uploadStatus === 'uploading' && (
                                   <RefreshCw className="text-accent-cyan animate-spin" size={32} />
                                 )}
                                 {uploadStatus === 'success' && (
                                   <CheckCircle2 className="text-success" size={32} />
                                 )}
                                 {uploadStatus === 'error' && (
                                   <AlertCircle className="text-danger" size={32} />
                                 )}
                              </div>
                              <input type='file' className="hidden" accept=".xml,.xls,.xlsx" onChange={handleFileUpload} />
                              
                              {uploadStatus === 'error' && (
                                <p className="absolute bottom-4 text-[8px] font-black uppercase text-danger">Unsupported Format (Use .XML or .XLSX)</p>
                              )}
                              {uploadStatus === 'success' && (
                                <p className="absolute bottom-4 text-[8px] font-black uppercase text-success">Import Complete</p>
                              )}
                           </label>
                           <p className="text-[9px] text-secondary font-medium leading-relaxed italic text-center px-4">
                             Extract data from Tally via <span className="font-bold">Display ➔ Daybook ➔ Export (Alt+E)</span> and upload here.
                           </p>
                        </div>
                     </div>

                     <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="p-4 bg-accent-cyan/10 text-accent-cyan rounded-2xl">
                              <RefreshCw size={24} className={isSyncing ? 'animate-spin' : ''} />
                           </div>
                           <div>
                              <h4 className="text-lg font-black text-primary uppercase">Desktop Bridge</h4>
                              <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Real-time Connector</p>
                           </div>
                        </div>
                        
                        <div className="space-y-4 pt-4">
                           <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                             <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-black uppercase text-secondary">Service URL</span>
                                <span className={`text-[10px] font-black uppercase ${tallyConnected ? 'text-success' : 'text-danger'}`}>
                                   {tallyConnected ? 'Active' : 'Offline'}
                                </span>
                             </div>
                             <code className="text-[10px] font-mono text-primary break-all block p-2 bg-white rounded border border-gray-100">
                                {window.location.host}/api/tally/sync
                             </code>
                           </div>

                           <div className="p-4 bg-accent-amber/5 border border-accent-amber/10 rounded-2xl flex items-start gap-3">
                              <AlertCircle size={16} className="text-accent-amber shrink-0 mt-0.5" />
                              <p className="text-[10px] text-primary/70 font-medium leading-relaxed italic">
                                Run <span className="font-bold text-primary italic">TallyAPIConnectorV1.0.exe</span> on your local PC setup to port 9000.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-primary p-10 rounded-[40px] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group">
                     <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl group-hover:scale-110 transition-transform duration-700">
                        <FileCode size={40} className="text-accent-cyan" />
                     </div>
                     <div className="flex-1 text-center md:text-left">
                        <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Automated Ledger Sync</h4>
                        <p className="text-white/60 text-sm font-medium leading-relaxed italic max-w-xl">
                          Your sales invoices from the 💰 Billing Module can be pushed directly to Tally as Sales Vouchers (F8). Ledgers are auto-created if they don't exist.
                        </p>
                     </div>
                     <button className="px-8 py-4 bg-accent-cyan text-primary rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-accent-cyan/20">Map Fields</button>
                     <RefreshCw size={200} className="absolute -right-10 -bottom-10 text-white/5 rotate-12" />
                  </div>
               </div>
            </div>
          )}

          {activeTab !== 'Ledger' && activeTab !== 'Tally' && (
            <div className="p-20 text-center space-y-4">
              <PieChart size={64} className="mx-auto text-gray-200" />
              <p className="text-secondary font-black uppercase tracking-widest text-sm italic">Report Generation Service Initializing...</p>
              <p className="max-w-md mx-auto text-xs text-secondary opacity-50 font-medium">Real-time financial synthesis is calculating based on your double-entry journal logs. Please wait or check back in a moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Data Export Console */}
      <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-black text-primary uppercase italic tracking-tighter mb-2">Accounting Export Console</h3>
            <p className="text-secondary text-sm font-medium leading-relaxed italic max-w-2xl mx-auto md:mx-0">
              Export your entire financial footprint for audits, statutory compliance, or legacy systems. Our <span className="font-bold text-primary">Tally XML</span> is compatible with TallyPrime standard voucher imports.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
            <button 
              onClick={() => handleDownload('pdf')}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 text-primary border border-gray-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:shadow-xl transition-all"
            >
              <FileText size={16} className="text-danger" /> Download PDF
            </button>
            <button 
              onClick={() => handleDownload('excel')}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 text-primary border border-gray-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:shadow-xl transition-all"
            >
              <Download size={16} className="text-success" /> Export Excel
            </button>
            <button 
              onClick={() => handleDownload('xml')}
              disabled={isSyncing}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-accent-cyan shadow-xl shadow-primary/20 transition-all disabled:opacity-50"
            >
              {isSyncing ? <RefreshCw size={16} className="animate-spin" /> : <FileCode size={16} className="text-accent-cyan" />}
              Tally XML Import
            </button>
          </div>
        </div>
        <Share2 size={240} className="absolute -right-20 -bottom-20 text-gray-50/5 opacity-40 -rotate-12 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col justify-between">
           <div>
              <h3 className="text-xl font-black text-primary mb-2 font-sans uppercase tracking-widest">Bank Reconciliation</h3>
              <p className="text-secondary text-sm font-medium mb-8">Match your cashbook with bank statements automatically.</p>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                       <Landmark className="text-accent-cyan" />
                       <div className="text-left">
                          <p className="text-sm font-black text-primary">HDFC Current A/c</p>
                          <p className="text-[10px] text-secondary font-bold font-mono">**** 4291</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-primary">₹3,45,000</p>
                       <p className="text-[10px] text-success font-black uppercase tracking-tighter">Synced</p>
                    </div>
                 </div>
              </div>
           </div>
           <button 
            onClick={() => {
              setIsSyncing(true);
              setTimeout(() => {
                alert('Auto-reconciliation complete. 12 matching transactions found.');
                setIsSyncing(false);
              }, 1500);
            }}
            className="mt-8 w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-accent-cyan transition-all"
           >
             {isSyncing ? 'Reconciling...' : 'Start Auto-Recon'}
           </button>
        </div>

        <div className="bg-gradient-to-br from-primary to-primary-dark p-10 rounded-[40px] text-white relative overflow-hidden group">
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Tax Liability Projection</p>
                 <h3 className="text-3xl font-black font-sans">₹1,45,200</h3>
                 <p className="text-xs font-bold opacity-40 mt-1 italic tracking-widest uppercase italic">Provisioned GST for Apr-Jun</p>
              </div>
              
              <div className="mt-12 space-y-2">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span>Tax Saved (ITC)</span>
                    <span className="text-success">₹18,400</span>
                 </div>
                 <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-cyan w-[45%]" />
                 </div>
              </div>
           </div>
           <TrendingUp size={200} className="absolute -right-10 -bottom-10 text-white/5 opacity-50 group-hover:scale-110 transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
}
