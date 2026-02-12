import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const clauses = [
  {
    id: "01",
    title: "Service Scope",
    icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />,
    content: [
      { head: "01.1 MISSION DETAILS", text: "Services are provided exactly as per the agreed project specifications. Precision is our baseline." },
      { head: "01.2 EXPANSION", text: "Work outside the original brief is classified as 'Additional Scope' and may incur extra service charges." }
    ]
  },
  {
    id: "02",
    title: "Legal Compliance",
    icon: <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />,
    content: [
      { head: "02.1 DGCA RULES", text: "Zero exceptions. All operations strictly follow DGCA rules and federal government aviation regulations." },
      { head: "02.2 PERMISSIONS", text: "Operations occur ONLY in permitted areas. If the government denies access, the mission will be rescheduled.", warning: true }
    ]
  },
  {
    id: "03",
    title: "Access & Permits",
    icon: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />,
    content: [
      { head: "03.1 LOCATION", text: "The client is responsible for providing physical access to the launch and operation sites." },
      { head: "03.2 LOCAL PERMITS", text: "Client must handle local authority permissions that fall outside the scope of drone aviation laws." }
    ]
  },
  {
    id: "04",
    title: "Safety Ops",
    icon: <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />,
    content: [
      { head: "04.1 WEATHER SHIELD", text: "Flights will NOT proceed in unsafe conditions. Rain, high winds, or low visibility trigger an automatic safety hold.", warning: true },
      { head: "04.2 TERMINATION", text: "The Pilot-in-Command has full authority to stop operations if a safety risk to life or property is detected." }
    ]
  },
  {
    id: "05",
    title: "Payment Terms",
    icon: <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />,
    content: [
      { head: "05.1 QUOTATION", text: "All financial obligations are based on the final signed quotation provided to the client." },
      { head: "05.2 ADVANCE", text: "A mission-start advance may be required. Unpaid balances will result in an immediate pause of project delivery." }
    ]
  },
  {
    id: "06",
    title: "Data Privacy",
    icon: <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />,
    content: [
      { head: "06.1 CONFIDENTIALITY", text: "All captured data is for the client only. We do not sell, leak, or share your mission assets." },
      { head: "06.2 ETHICAL RECORDING", text: "ACBFLY strictly respects privacy laws. We do not use collected data for any unauthorized or unethical purpose." }
    ]
  },
  {
    id: "07",
    title: "Timeline",
    icon: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />,
    content: [
      { head: "07.1 DELIVERY", text: "Final results are delivered within the timeframe agreed upon during project onboarding." },
      { head: "07.2 DELAYS", text: "We are not responsible for delays caused by government lockdowns, weather changes, or permission denials.", warning: true }
    ]
  },
  {
    id: "08",
    title: "Liability",
    icon: <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />,
    content: [
      { head: "08.1 EXCLUSIONS", text: "We are not liable for delays caused by nature, government intervention, or unforeseen mechanical events.", warning: true },
      { head: "08.2 CAP", text: "Total financial liability is capped at the amount of the specific service contract value." }
    ]
  },
  {
    id: "09",
    title: "Cancellation",
    icon: <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />,
    content: [
      { head: "09.1 NOTICE", text: "Cancellation must be provided in writing. Late-notice cancellations may incur operational fees." },
      { head: "09.2 REFUNDS", text: "Refunds and charges are processed as per the specific project agreement milestones." }
    ]
  }
];

const Terms = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen bg-[#050505] text-white pt-24 font-body md:overflow-hidden">
      
      {/* SIDEBAR DOCK */}
      <aside 
        data-lenis-prevent 
        className="w-full md:w-80 bg-[#0a0c10] border-b md:border-b-0 md:border-r border-white/10 flex flex-col flex-shrink-0 z-20 h-auto md:h-full overflow-y-auto overscroll-contain"
      >
        
        {/* Header */}
        <div className="p-8 border-b border-accent/20 bg-gradient-to-b from-accent/5 to-transparent">
          <h1 className="text-xl font-head font-black tracking-widest text-white uppercase">Agreement</h1>
          <span className="font-mono text-xs text-accent tracking-widest">VERSION_4.2 // 2026</span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1">
          {clauses.map((clause, index) => (
            <button
              key={clause.id}
              onClick={() => setActiveTab(index)}
              className={`w-full p-6 flex items-center gap-4 text-sm font-bold uppercase tracking-wide transition-all duration-200 border-b border-white/5 text-left group hover-target
                ${activeTab === index 
                  ? 'bg-black text-accent border-l-4 border-l-accent shadow-[inset_10px_0_20px_-10px_rgba(0,255,204,0.3)]' 
                  : 'text-gray-500 hover:bg-[#111] hover:text-accent'
                }`}
            >
              <svg className={`w-5 h-5 fill-current transition-transform duration-300 ${activeTab === index ? 'scale-125' : 'group-hover:scale-110'}`} viewBox="0 0 24 24">
                {clause.icon}
              </svg>
              {clause.id}. {clause.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main 
        data-lenis-prevent 
        className="flex-1 relative bg-[#050505] p-6 md:p-16 overflow-y-auto overscroll-contain"
      >
        <div className="max-w-4xl mx-auto min-h-full pb-20">
          
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              {/* Clause Header */}
              <span className="inline-block px-3 py-1 bg-accent text-black font-mono text-xs font-bold mb-6">
                NODE_{clauses[activeTab].id}
              </span>
              
              <h2 className="font-head text-[clamp(2.5rem,5vw,4rem)] leading-none font-black uppercase text-white mb-12">
                {clauses[activeTab].title.split(" ").map((word, i) => (
                   <span key={i} className="block">{word}</span>
                ))}
              </h2>

              {/* Terms Items */}
              {clauses[activeTab].content.map((item, i) => (
                <div 
                  key={i} 
                  // ADDED: 'hover-target' for cursor box
                  // ADDED: hover:shadow-glow logic for glow effect
                  className={`mb-6 p-8 bg-[#0a0a0a] border rounded-lg transition-all duration-300 hover-target
                    ${item.warning 
                      ? 'border-[#ff4d00] bg-[#1a0800] hover:shadow-[0_0_30px_rgba(255,77,0,0.15)]' 
                      : 'border-white/10 hover:border-accent hover:shadow-[0_0_30px_rgba(0,255,204,0.1)] hover:bg-[#0f0f0f]' 
                    }`}
                >
                  <h4 className={`font-mono text-sm uppercase mb-4 tracking-wider font-bold
                    ${item.warning ? 'text-[#ff4d00]' : 'text-accent'}`}>
                    {item.head}
                  </h4>
                  <p className="text-gray-300 text-lg font-light leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

        </div>

        {/* FOOTER STATUS BAR */}
        <footer className="fixed bottom-0 right-0 w-full md:w-[calc(100%-20rem)] bg-black border-t border-white/10 p-4 px-10 flex justify-between items-center font-mono text-xs text-gray-500 z-10 pointer-events-none">
          <div className="text-accent animate-pulse"> &gt; SYSTEM_READY</div>
          <div className="hidden md:block">ACBFLY // AEROSPACE COMPLIANCE 2026</div>
          <div>SECURE_DOC: 0X_SAF_77</div>
        </footer>

      </main>
    </div>
  );
};

export default Terms;