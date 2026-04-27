import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter, Printer, Clock, CheckCircle, XCircle, Calculator, X, Calendar, User, FileText, Settings, Box, Package, ChevronDown, Check } from 'lucide-react';

interface JobCard {
  id: string;
  jcNo: string;
  jcDate: string;
  customerID: string; // Linked ID
  party: string;
  productType: 'Brochure' | 'Visiting Card' | 'Booklet' | 'Banner' | 'Label' | 'Other';
  bookTitle: string;
  size: string;
  quantity: string;
  colorType: 'B/W' | '2 Color' | '4 Color';
  paperType: string;
  gsm: string;
  printingType: 'Offset' | 'Digital' | 'Screen' | 'Flex' | 'Packaging';
  finishing: string[];
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delivered';
  priority: 'High' | 'Medium' | 'Normal';
  deadline: string;
  date: string;
  // Production specific (from the physical card image)
  machine?: string;
  noOfForms?: string;
  noOfPages?: string;
  finishSize?: string;
  bindingType?: 'Side' | 'Middle';
  direction?: 'Left' | 'Right' | 'Top';
  paperToUsed?: string;
  reamWt?: string;
  plateType?: string[];
  plateMaker?: string;
}

const mockJobs: JobCard[] = [
  { 
    id: '1',
    jcNo: 'SOP/JC/013',
    jcDate: '2024-03-24',
    customerID: 'C-001',
    party: 'Malhotra Publishing',
    productType: 'Booklet',
    bookTitle: 'GANITH Textbook Cover Cls 4',
    size: 'A4',
    quantity: '9,200',
    colorType: '4 Color',
    paperType: 'BILT Art Card',
    gsm: '220',
    printingType: 'Offset',
    finishing: ['Lamination', 'Perfect Binding'],
    status: 'In Progress',
    priority: 'High',
    deadline: '2024-03-30',
    date: '2024-03-24',
    machine: 'Heidelberg 102 4Clr'
  }
];

export default function JobsModule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState<JobCard[]>(mockJobs);
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Pending', 'In Progress', 'Completed', 'Delivered', 'Cancelled'];

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newJob: JobCard = {
      id: String(jobs.length + 1),
      jcNo: formData.get('jcNo') as string,
      jcDate: formData.get('jcDate') as string,
      customerID: 'C-NEW',
      party: formData.get('party') as string,
      productType: formData.get('productType') as any || 'Other',
      bookTitle: formData.get('bookTitle') as string,
      size: formData.get('size') as string || 'Custom',
      quantity: formData.get('quantity') as string,
      colorType: formData.get('colorType') as any || '4 Color',
      paperType: formData.get('paperType') as string || 'Standard',
      gsm: formData.get('gsm') as string || '80',
      printingType: formData.get('printingType') as any || 'Offset',
      finishing: formData.getAll('finishing') as string[],
      status: 'Pending',
      priority: formData.get('priority') as any || 'Normal',
      deadline: formData.get('deadline') as string || new Date().toISOString().split('T')[0],
      date: new Date().toISOString().split('T')[0],
      machine: formData.get('machine') as string,
      noOfForms: formData.get('noOfForms') as string,
      noOfPages: formData.get('noOfPages') as string,
      finishSize: formData.get('finishSize') as string,
      bindingType: formData.get('bindingType') as any,
      direction: formData.get('direction') as any,
      paperToUsed: formData.get('paperToUsed') as string,
      reamWt: formData.get('reamWt') as string,
      plateType: formData.getAll('plateType') as string[],
      plateMaker: formData.get('plateMaker') as string,
    };
    setJobs([newJob, ...jobs]);
    setIsModalOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Completed': return <CheckCircle size={14} className="text-success" />;
      case 'Delivered': return <Box size={14} className="text-accent-magenta" />;
      case 'Pending': return <Clock size={14} className="text-warning" />;
      case 'In Progress': return <Printer size={14} className="text-accent-cyan" />;
      case 'Cancelled': return <XCircle size={14} className="text-danger" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Production Control</h2>
          <p className="text-secondary text-sm">Manage shop-floor work orders, machine schedules, and job status.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => alert('Accessing Estimation Engine & Historical Pricing Data...')}
            className="bg-white border border-gray-200 text-primary px-5 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-50 transition-all"
          >
            <Calculator size={20} /> Estimation Engine
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-accent-cyan text-white px-5 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
          >
            <Plus size={20} /> Create Work Order
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab ? 'bg-primary text-white shadow-md' : 'text-secondary hover:bg-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.filter(j => activeTab === 'All' || j.status === activeTab).map((job) => (
          <motion.div
            layout
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-accent-cyan/30 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{job.jcNo}</p>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                    job.priority === 'High' ? 'bg-danger text-white shadow-sm' : 
                    job.priority === 'Medium' ? 'bg-accent-amber text-white' : 'bg-gray-200 text-secondary'
                  }`}>
                    {job.priority}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-primary group-hover:text-accent-cyan transition-colors">{job.bookTitle}</h3>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-accent-cyan/10 transition-colors">
                {getStatusIcon(job.status)}
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Customer:</span>
                <span className="font-bold text-primary">{job.party}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Product:</span>
                <span className="font-bold text-primary">{job.productType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Quantity:</span>
                <span className="font-bold text-primary">{job.quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Deadline:</span>
                <span className={`font-bold flex items-center gap-1 ${
                  new Date(job.deadline) < new Date() ? 'text-danger' : 'text-primary'
                }`}>
                  <Clock size={12} /> {job.deadline}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold px-2 py-1 bg-gray-50 text-secondary rounded">{job.printingType}</span>
                <span className="text-xs font-bold px-2 py-1 bg-accent-cyan/10 text-accent-cyan rounded">{job.colorType}</span>
              </div>
              <p className="text-xs text-secondary font-medium">{job.date}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Job Card Modal - REPLICATING PAPER FORM EXACTLY */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden"
            >
              {/* Toolbar */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={20} className="text-secondary" />
                  </button>
                  <h3 className="font-bold text-primary">New Production Job Card</h3>
                </div>
                <div className="flex gap-3">
                   <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-secondary hover:bg-gray-100 rounded-lg transition-all">
                     <Printer size={16} /> Print Preview
                   </button>
                   <button 
                      form="job-card-form"
                      type="submit" 
                      className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-accent-cyan shadow-lg shadow-primary/20 transition-all text-sm"
                   >
                     Submit Job Card
                   </button>
                </div>
              </div>

              {/* The Job Card Content */}
              <div className="flex-1 overflow-y-auto p-12 bg-app-bg flex justify-center">
                <form 
                  id="job-card-form"
                  onSubmit={handleCreateJob}
                  className="bg-white border-2 border-black w-full max-w-[800px] text-black font-sans shadow-[0_0_50px_rgba(0,0,0,0.1)] relative"
                >
                  {/* Form Header */}
                  <div className="p-6 border-b-2 border-black flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-black tracking-tight leading-none mb-1">
                        Sanjayshree <span className="font-light">Offset Printers</span>
                      </h1>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold border-2 border-black px-2 py-0.5 bg-black text-white text-center">JOB CARD</span>
                        <div className="flex items-center gap-1 opacity-40">
                           <div className="w-8 h-[1px] bg-black"></div>
                           <span className="text-[8px] font-bold">SINCE 1983</span>
                        </div>
                      </div>
                    </div>
                    {/* Decorative Stamp Area */}
                    <div className="w-16 h-16 border-2 border-black/10 rounded-full flex items-center justify-center border-dashed">
                      <span className="text-[8px] text-black/20 font-bold rotate-12">OFFICIAL STAMP</span>
                    </div>
                  </div>

                  {/* Section Title */}
                  <div className="px-4 py-1.5 bg-gray-100 border-b-2 border-black">
                     <h2 className="text-xs font-black uppercase tracking-widest italic flex items-center gap-2">
                       <FileText size={12} /> Job Description
                     </h2>
                  </div>

                  {/* Grid Layout Fields */}
                  <div className="grid grid-cols-12 text-xs divide-x-2 divide-y-2 divide-black border-b-2 border-black">
                    {/* Row 1 */}
                    <div className="col-span-4 p-3 flex gap-2">
                      <span className="font-bold whitespace-nowrap">J.C. No.:</span>
                      <input name="jcNo" defaultValue={`SOP/JC/01${jobs.length + 1}`} className="flex-1 font-mono font-bold bg-transparent outline-none underline decoration-black/20" />
                    </div>
                    <div className="col-span-4 p-3 flex items-center gap-2">
                       <span className="font-bold">Date:</span>
                       <input name="jcDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="flex-1 bg-transparent outline-none font-mono" />
                    </div>
                    <div className="col-span-4 p-3 flex items-center gap-2">
                       <span className="font-bold">Deadline:</span>
                       <input name="deadline" type="date" required className="flex-1 bg-transparent outline-none font-mono text-danger font-bold" />
                    </div>

                    {/* New Priority Row */}
                    <div className="col-span-12 p-2 bg-gray-50 flex items-center gap-6 px-4">
                       <span className="font-black text-[10px] uppercase tracking-widest">Priority Level:</span>
                       <div className="flex gap-6">
                          {['Normal', 'Medium', 'High'].map(p => (
                            <label key={p} className="flex items-center gap-2 cursor-pointer">
                               <input type="radio" name="priority" value={p} defaultChecked={p === 'Normal'} className="accent-black w-3 h-3" />
                               <span className={`text-[10px] font-bold ${p === 'High' ? 'text-danger' : 'text-primary'}`}>{p}</span>
                            </label>
                          ))}
                       </div>
                    </div>

                    {/* Row 2 */}
                    <div className="col-span-12 p-3 flex items-center gap-4">
                      <span className="font-bold min-w-20">Machine:</span>
                      <input name="machine" placeholder="e.g., Heidelberg 102 4Clr" className="flex-1 italic font-medium bg-transparent outline-none" />
                    </div>

                    {/* Row 3 */}
                    <div className="col-span-12 p-3 flex items-center gap-4">
                      <span className="font-bold min-w-20">Party:</span>
                      <input name="party" required placeholder="Customer Name" className="flex-1 font-bold text-base bg-transparent outline-none" />
                    </div>

                    {/* Row 4 */}
                    <div className="col-span-8 p-3 flex items-center gap-4 bg-gray-50/30">
                      <span className="font-bold min-w-20">Book/Title:</span>
                      <input name="bookTitle" required placeholder="Book Title or Product Name" className="flex-1 font-bold text-lg text-accent-cyan bg-transparent outline-none" />
                    </div>
                    <div className="col-span-4 p-3 flex items-center gap-4">
                      <span className="font-bold">Product:</span>
                      <select name="productType" className="flex-1 bg-transparent outline-none font-bold">
                        <option value="Booklet">Booklet</option>
                        <option value="Brochure">Brochure</option>
                        <option value="Visiting Card">Visiting Card</option>
                        <option value="Banner">Banner</option>
                        <option value="Label">Label</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Row 5 */}
                    <div className="col-span-6 p-3 flex items-center gap-4">
                      <span className="font-bold min-w-20">Size:</span>
                      <input name="size" placeholder="A4, Custom, etc." className="flex-1 font-medium bg-transparent outline-none" />
                    </div>
                    <div className="col-span-6 p-3 flex items-center gap-4">
                      <span className="font-bold min-w-20">Printing Type:</span>
                      <select name="printingType" className="flex-1 bg-transparent outline-none font-bold text-accent-magenta">
                        <option value="Offset">Offset Printing</option>
                        <option value="Digital">Digital Printing</option>
                        <option value="Screen">Screen Printing</option>
                        <option value="Flex">Flex / Banner</option>
                        <option value="Packaging">Packaging / Label</option>
                      </select>
                    </div>

                    {/* Row 6 */}
                    <div className="col-span-6 p-3 flex items-center gap-4">
                      <span className="font-extrabold min-w-20">Quantity:</span>
                      <input name="quantity" required placeholder="9,200/-" className="flex-1 font-black text-xl text-danger bg-transparent outline-none" />
                    </div>
                    <div className="col-span-6 p-3 flex items-center gap-4">
                      <span className="font-bold min-w-20">Color Type:</span>
                      <select name="colorType" className="flex-1 bg-transparent outline-none font-bold">
                        <option value="4 Color">4 Color (CMYK)</option>
                        <option value="2 Color">2 Color</option>
                        <option value="B/W">B/W (Single)</option>
                      </select>
                    </div>

                    {/* Row 7 */}
                    <div className="col-span-6 p-3 flex items-center gap-4">
                       <span className="font-bold min-w-20">Binding Type:</span>
                       <div className="flex gap-4">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" name="bindingType" value="Side" defaultChecked className="accent-black w-3 h-3" />
                            <span className="text-[10px] font-bold">Side</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer opacity-60">
                            <input type="radio" name="bindingType" value="Middle" className="accent-black w-3 h-3" />
                            <span className="text-[10px] font-bold">Middle</span>
                          </label>
                       </div>
                    </div>
                    <div className="col-span-6 p-3 flex items-center gap-4">
                       <span className="font-bold min-w-20">Direction:</span>
                       <div className="flex gap-3">
                          <label className="flex items-center gap-1.5 cursor-pointer opacity-60">
                            <input type="radio" name="direction" value="Left" className="accent-black w-3 h-3" />
                            <span className="text-[10px] font-bold">Left</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer opacity-60">
                            <input type="radio" name="direction" value="Right" className="accent-black w-3 h-3" />
                            <span className="text-[10px] font-bold">Right</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" name="direction" value="Top" defaultChecked className="accent-black w-3 h-3" />
                            <span className="text-[10px] font-bold">Top</span>
                          </label>
                       </div>
                    </div>

                    {/* Row 8 (Paper & GSM) */}
                    <div className="col-span-7 p-3 flex items-center gap-4">
                      <span className="font-bold min-w-24">Paper Type:</span>
                      <input name="paperType" defaultValue="BILT Art Card" className="flex-1 font-bold bg-transparent outline-none" />
                    </div>
                    <div className="col-span-5 p-3 flex items-center gap-2">
                       <span className="font-bold">GSM:</span>
                       <input name="gsm" defaultValue="220" className="flex-1 bg-transparent outline-none font-bold" />
                    </div>

                    {/* Row 9 (Finishing) */}
                    <div className="col-span-12 p-3 flex items-center gap-4">
                      <span className="font-bold min-w-24">Finishing:</span>
                      <div className="flex gap-4 flex-wrap">
                         {['Lamination', 'Binding', 'Cutting', 'UV Coat', 'Foil'].map(f => (
                           <label key={f} className="flex items-center gap-1.5 cursor-pointer">
                              <input type="checkbox" name="finishing" value={f} className="w-3 h-3 accent-black" />
                              <span className="text-[10px] font-bold">{f}</span>
                           </label>
                         ))}
                      </div>
                    </div>

                    {/* Row 10 */}
                    <div className="col-span-6 p-3 flex items-center gap-4">
                      <span className="font-bold min-w-20">Job Type:</span>
                      <input name="jobType" defaultValue="PRINT ONLY" className="flex-1 font-bold uppercase italic bg-transparent outline-none" />
                    </div>
                    <div className="col-span-6 p-3 flex items-center gap-4">
                      <span className="font-bold min-w-20">No. of Clrs:</span>
                      <input name="noOfClrs" defaultValue="4Clr" className="flex-1 font-bold underline bg-transparent outline-none" />
                    </div>

                    {/* Row 11 */}
                    <div className="col-span-6 p-3 flex items-center gap-4">
                      <span className="font-bold min-w-20">Print Edition:</span>
                      <div className="flex gap-4">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" name="printEdition" value="NEW" defaultChecked className="accent-black w-3 h-3" />
                            <span className="text-[10px] font-bold">NEW</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer opacity-60">
                            <input type="radio" name="printEdition" value="RE-PRINT" className="accent-black w-3 h-3" />
                            <span className="text-[10px] font-bold">RE-PRINT</span>
                          </label>
                       </div>
                    </div>
                    <div className="col-span-6 p-3 flex items-center gap-4">
                      <span className="font-bold min-w-20">UPS:</span>
                      <input name="ups" defaultValue="1/4" className="flex-1 font-bold bg-transparent outline-none" />
                    </div>

                    {/* Row 12 (Special Plates Grid) */}
                    <div className="col-span-6 p-3 space-y-2">
                       <span className="font-bold underline block mb-1">Plate Type:</span>
                       <div className="grid grid-cols-2 gap-2">
                          {['CTP', 'P/S', 'D/E', 'BAKED'].map(type => (
                            <label key={type} className="flex items-center gap-1.5 cursor-pointer">
                               <input 
                                 type="checkbox" 
                                 name="plateType" 
                                 value={type} 
                                 defaultChecked={type === 'CTP' || type === 'BAKED'}
                                 className="w-3 h-3 accent-black" 
                               />
                               <span className="text-[9px] font-bold">{type}</span>
                            </label>
                          ))}
                       </div>
                    </div>
                    <div className="col-span-6 p-0 divide-y-2 divide-black divide-x-2">
                       <div className="flex divide-black divide-x-2">
                          <div className="flex-1 p-2 flex gap-2">
                            <span className="font-bold">Total Plate:</span>
                            <input name="totalPlate" defaultValue="4" className="w-full bg-transparent outline-none font-bold" />
                          </div>
                       </div>
                       <div className="flex divide-black divide-x-2">
                          <div className="flex-1 p-2 flex gap-2">
                             <span className="font-bold">Old Plate:</span>
                             <input name="oldPlate" defaultValue="-" className="w-full bg-transparent outline-none" />
                          </div>
                          <div className="flex-1 p-2 flex gap-2">
                             <span className="font-bold">New Plate:</span>
                             <input name="newPlate" defaultValue="4" className="w-full bg-transparent outline-none" />
                          </div>
                       </div>
                    </div>

                    {/* Row 13 - Final Plates & Times */}
                    <div className="col-span-6 p-3 flex items-center gap-4">
                      <span className="font-bold min-w-20">Plate Used:</span>
                      <input name="plateUsed" defaultValue="6" className="flex-1 font-medium bg-transparent outline-none" />
                    </div>
                    <div className="col-span-6 p-3 flex items-center gap-4 border-b-2 border-black">
                      <span className="font-bold min-w-20">Plate Maker:</span>
                      <input name="plateMaker" defaultValue="Global" className="flex-1 italic font-medium bg-transparent outline-none underline underline-offset-4" />
                    </div>
                  </div>

                  {/* Operational Timestamps - EXACTLY AS PER IMAGE */}
                  <div className="grid grid-cols-12 divide-x-2 divide-black border-b-2 border-black text-[9px] uppercase font-bold sticky bottom-0 bg-white">
                    <div className="col-span-6 p-2 flex items-center gap-2">
                       <span>Start Date:</span>
                       <div className="flex gap-0.5">
                          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="w-3 h-4 border border-black/30"></div>)}
                       </div>
                       <span className="ml-2">Time:</span>
                       <div className="flex gap-0.5">
                          {[1,2,3,4].map(i => <div key={i} className="w-3 h-4 border border-black/30"></div>)}
                       </div>
                    </div>
                    <div className="col-span-6 p-2 flex items-center gap-2">
                       <span>End Date:</span>
                       <div className="flex gap-0.5">
                          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="w-3 h-4 border border-black/30"></div>)}
                       </div>
                       <span className="ml-2">Time:</span>
                       <div className="flex gap-0.5">
                          {[1,2,3,4].map(i => <div key={i} className="w-3 h-4 border border-black/30"></div>)}
                       </div>
                    </div>
                  </div>

                  {/* Forms Description Section */}
                  <div className="px-4 py-1.5 bg-gray-100 border-b-2 border-black">
                     <h2 className="text-xs font-black uppercase tracking-widest italic flex items-center gap-2">
                       <Box size={12} /> Forms Description
                     </h2>
                  </div>

                  <div className="grid grid-cols-12 border-b-2 border-black divide-x-2 divide-black">
                    {[0, 1, 2].map(colIndex => (
                      <div key={colIndex} className="col-span-4 divide-y-2 divide-black divide-x-0">
                        <div className="grid grid-cols-12 bg-gray-50/50 text-[8px] font-bold text-center uppercase tracking-tighter divide-x divide-black border-y-0">
                           <div className="col-span-2 py-1">#</div>
                           <div className="col-span-6 py-1">Page To-From</div>
                           <div className="col-span-4 py-1">Counter</div>
                        </div>
                        {Array.from({ length: 10 }).map((_, rowIndex) => {
                          const id = colIndex * 10 + rowIndex + 1;
                          return (
                            <div key={id} className="grid grid-cols-12 text-[10px] items-center divide-x divide-black/30">
                               <div className="col-span-2 py-1 px-1 bg-gray-50 text-center font-bold">{id}.</div>
                               <div className="col-span-6 py-1 px-1">
                                  <input className="w-full bg-transparent outline-none font-mono text-[9px]" placeholder="..." />
                               </div>
                               <div className="col-span-4 py-1 px-1">
                                  <input className="w-full bg-transparent outline-none font-mono text-[9px] text-right" />
                               </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Footer Stats / Remarks Area */}
                  <div className="p-3 bg-gray-50/30 border-b-2 border-black min-h-16 relative">
                     <span className="absolute top-1 left-2 text-[8px] font-bold uppercase opacity-30">Remarks:</span>
                     <textarea name="remarks" className="w-full h-full bg-transparent outline-none text-xs font-medium resize-none px-1 py-4" placeholder="..." />
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-2 text-xs divide-x-2 divide-black uppercase font-bold italic h-24">
                     <div className="p-4 flex flex-col justify-between">
                        <span>Created By:</span>
                        <div className="border-t-2 border-black border-dotted pt-1 mt-8 opacity-20 text-[8px] text-center not-italic">Authorized Signature</div>
                     </div>
                     <div className="p-4 flex flex-col justify-between">
                        <span>Operator / Prod. Manager On Duty:</span>
                        <div className="border-t-2 border-black border-dotted pt-1 mt-8 opacity-20 text-[8px] text-center not-italic">Supervisor Signature</div>
                     </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
