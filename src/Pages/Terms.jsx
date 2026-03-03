import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const clauses = [
  {
    id: "01",
    title: "Service Scope",
    icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />,
    content: [
      { head: "Mission Details", text: "Services are provided exactly as per the agreed project specifications. Precision is our baseline." },
      { head: "Expansion", text: "Work outside the original brief is classified as 'Additional Scope' and may incur extra service charges." }
    ]
  },
  {
    id: "02",
    title: "Legal Compliance",
    icon: <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />,
    content: [
      { head: "DGCA Rules", text: "Zero exceptions. All operations strictly follow DGCA rules and federal government aviation regulations." },
      { head: "Permissions", text: "Operations occur ONLY in permitted areas. If the government denies access, the mission will be rescheduled.", warning: true }
    ]
  },
  {
    id: "03",
    title: "Access & Permits",
    icon: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />,
    content: [
      { head: "Location", text: "The client is responsible for providing physical access to the launch and operation sites." },
      { head: "Local Permits", text: "Client must handle local authority permissions that fall outside the scope of drone aviation laws." }
    ]
  },
  {
    id: "04",
    title: "Safety Ops",
    icon: <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />,
    content: [
      { head: "Weather Shield", text: "Flights will NOT proceed in unsafe conditions. Rain, high winds, or low visibility trigger an automatic safety hold.", warning: true },
      { head: "Termination", text: "The Pilot-in-Command has full authority to stop operations if a safety risk to life or property is detected." }
    ]
  },
  {
    id: "05",
    title: "Payment Terms",
    icon: <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />,
    content: [
      { head: "Quotation", text: "All financial obligations are based on the final signed quotation provided to the client." },
      { head: "Advance", text: "A mission-start advance may be required. Unpaid balances will result in an immediate pause of project delivery." }
    ]
  },
  {
    id: "06",
    title: "Data Privacy",
    icon: <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />,
    content: [
      { head: "Confidentiality", text: "All captured data is for the client only. We do not sell, leak, or share your mission assets." },
      { head: "Ethical Recording", text: "Aircab strictly respects privacy laws. We do not use collected data for any unauthorized or unethical purpose." }
    ]
  },
  {
    id: "07",
    title: "Timeline",
    icon: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />,
    content: [
      { head: "Delivery", text: "Final results are delivered within the timeframe agreed upon during project onboarding." },
      { head: "Delays", text: "We are not responsible for delays caused by government lockdowns, weather changes, or permission denials.", warning: true }
    ]
  },
  {
    id: "08",
    title: "Liability",
    icon: <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />,
    content: [
      { head: "Exclusions", text: "We are not liable for delays caused by nature, government intervention, or unforeseen mechanical events.", warning: true },
      { head: "Cap", text: "Total financial liability is capped at the amount of the specific service contract value." }
    ]
  },
  {
    id: "09",
    title: "Cancellation",
    icon: <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />,
    content: [
      { head: "Notice", text: "Cancellation must be provided in writing. Late-notice cancellations may incur operational fees." },
      { head: "Refunds", text: "Refunds and charges are processed as per the specific project agreement milestones." }
    ]
  }
];

const Terms = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen bg-[#FAFAFA] text-[#111] pt-20 md:pt-24 md:overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        /* Hide scrollbar for neatness */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}</style>
      
      {/* 📚 SIDEBAR NAVIGATION */}
      <aside 
        className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-gray-100 flex flex-col flex-shrink-0 z-20 md:h-full overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
      >
        {/* Header */}
        <div className="p-6 md:p-8 pb-4 md:pb-8 border-b border-gray-100">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#111]">Legal Agreement</h1>
          <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-1">Aircab Black // 2026</p>
        </div>

        {/* Navigation List (Horizontal scroll on mobile, Vertical on desktop) */}
        <nav className="flex-1 overflow-x-auto overflow-y-hidden md:overflow-x-hidden md:overflow-y-auto flex md:flex-col p-4 md:p-6 gap-2">
          {clauses.map((clause, index) => (
            <button
              key={clause.id}
              onClick={() => setActiveTab(index)}
              className={`flex-shrink-0 md:flex-shrink md:w-full px-5 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-bold transition-all duration-300
                ${activeTab === index 
                  ? 'bg-[#111] text-white shadow-md scale-[0.98]' 
                  : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-[#111]'
                }`}
            >
              <svg className={`w-5 h-5 fill-current transition-transform duration-300 ${activeTab === index ? 'scale-110' : ''}`} viewBox="0 0 24 24">
                {clause.icon}
              </svg>
              {clause.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* 📄 MAIN CONTENT AREA */}
      <main 
        className="flex-1 relative bg-[#FAFAFA] p-6 md:p-16 overflow-y-auto"
      >
        <div className="max-w-3xl mx-auto min-h-full pb-20 md:pb-10 pt-4 md:pt-0">
          
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Clause Header */}
              <div className="mb-10 md:mb-14">
                <span className="inline-block px-4 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">
                  Section {clauses[activeTab].id}
                </span>
                
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#111] leading-tight">
                  {clauses[activeTab].title}
                </h2>
              </div>

              {/* Terms Items */}
              <div className="space-y-6">
                {clauses[activeTab].content.map((item, i) => (
                  <div 
                    key={i} 
                    className={`p-6 md:p-8 bg-white border rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300
                      ${item.warning 
                        ? 'border-[#FFE0E0] bg-[#FFF8F8]' 
                        : 'border-gray-100' 
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {item.warning && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#D00000]"></span>
                      )}
                      <h4 className={`text-sm uppercase tracking-widest font-extrabold
                        ${item.warning ? 'text-[#D00000]' : 'text-[#111]'}`}>
                        {item.head}
                      </h4>
                    </div>
                    
                    <p className={`text-base md:text-lg font-medium leading-relaxed
                      ${item.warning ? 'text-[#900000]' : 'text-gray-500'}`}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

            </motion.div>
          </AnimatePresence>

        </div>

        {/* 🔒 CLEAN FOOTER BAR */}
        <footer className="fixed bottom-0 right-0 w-full md:w-[calc(100%-20rem)] bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 px-6 md:px-10 flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest z-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
            Aircab Official Document
          </div>
          <div>Confidential // 2026</div>
        </footer>

      </main>
    </div>
  );
};

export default Terms;