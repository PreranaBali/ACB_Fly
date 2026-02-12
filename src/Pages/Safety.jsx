import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const safetyLevels = [
  {
    id: "LVL_01",
    title: "Pre-Flight Safety Checks",
    checks: [
      { id: "A1", title: "HARDWARE", desc: "Inspect propellers, motors, and battery health before ignition." },
      { id: "A2", title: "AVIONICS", desc: "Full diagnostic sync of GPS and onboard sensors." },
      { id: "A3", title: "MET_DATA", desc: "Verified weather data clearance for safe flight window." },
      { id: "A4", title: "AUTHORIZATION", desc: "Verification of approved flight permissions and airspace." }
    ],
    readout: [
      "PROP_PITCH: NORM",
      "BATT_CELLS: 4.2V/ea",
      "GPS_SIGNAL: LOCKED",
      "AUTH_CODE: ACB_229"
    ]
  },
  {
    id: "LVL_02",
    title: "Certified Personnel",
    checks: [
      { id: "B1", title: "LICENSING", desc: "Operations exclusively handled by Licensed Drone Pilots." },
      { id: "B2", title: "COMPLIANCE", desc: "Pilot training conducted strictly under DGCA Guidelines." },
      { id: "B3", title: "SOP_MASTERY", desc: "Adherence to Standard Operating Procedures at all times." },
      { id: "B4", title: "VISUAL_LINK", desc: "Maintenance of Full Control and Visual Line of Sight (VLOS)." }
    ],
    readout: [
      "DGCA_ID: VALID",
      "PILOT_RATING: MASTER",
      "SOP_SYNC: 100%",
      "CONTROL: MANUAL_OVERRIDE"
    ]
  },
  {
    id: "LVL_03",
    title: "Safe Flying Practices",
    checks: [
      { id: "C1", title: "GEO_FENCE", desc: "Operation limited to strictly permitted flying zones." },
      { id: "C2", title: "NO_FLY_ZONE", desc: "Avoidance of airports, defense areas, and restricted zones." },
      { id: "C3", title: "PUBLIC_DENSITY", desc: "Zero-flight protocol over crowds or busy urban roads." },
      { id: "C4", title: "NPNT_HARDLOCK", desc: "Strict enforcement of the No Permission – No Takeoff rule." }
    ],
    readout: [
      "ALTITUDE: < 400FT",
      "ZONE_LOCK: GREEN",
      "NPNT_STATUS: ENGAGED",
      "GEOFENCE: ARMED"
    ]
  },
  {
    id: "LVL_04",
    title: "Data & Public Safety",
    checks: [
      { id: "D1", title: "PRIVACY", desc: "Full respect for public privacy during recording operations." },
      { id: "D2", title: "USAGE_LIMITS", desc: "Data utilization restricted to authorized client purposes." },
      { id: "D3", title: "RISK_PROT", desc: "Comprehensive insurance coverage for all mission risks." },
      { id: "D4", title: "E_TERMINATE", desc: "Instant operation termination protocols in emergencies." }
    ],
    readout: [
      "PRIVACY_HASH: ENCRYPTED",
      "INSURANCE: ACTIVE_VAL",
      "E_STOP: STANDBY",
      "AUDIT: PASSED"
    ]
  }
];

const Safety = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    // Reveal Animations
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-section').forEach(section => {
        gsap.fromTo(section, 
          { y: 50, opacity: 0 },
          { 
            y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 85%" }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050505] text-[#d1d5db] font-body pt-32 pb-20 overflow-hidden cursor-none">
      
      {/* --- BLUEPRINT GRID BACKGROUND --- */}
      {/* Cyan Grid Lines */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: `
            linear-gradient(rgba(0, 255, 204, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 204, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* --- CONTAINER --- */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-[5%] md:px-[60px]">

        {/* HEADER */}
        <header className="reveal-section border border-accent/30 p-8 mb-20 flex justify-between items-start relative bg-black/40 backdrop-blur-sm">
          <div className="absolute -top-3 left-5 bg-[#050505] px-2 text-xs font-mono text-accent">
            REF_DRWG: ACB-2026-SAF
          </div>
          <div>
            <h1 className="font-head text-[clamp(2rem,4vw,3.5rem)] font-bold uppercase leading-none text-white">
              Safety <span className="text-accent">Architecture</span>
            </h1>
            {/* Kept the yellow hint for the status line */}
            <p className="font-mono text-[#ffcc00] text-xs mt-3 tracking-widest">
              &gt;_ INITIALIZING PRE-FLIGHT PROTOCOLS // 2026_EDITION
            </p>
          </div>
          <div className="hidden md:block font-mono text-[0.65rem] opacity-50 text-right leading-relaxed">
            SCALE: 1:1 <br /> UNIT: METRIC <br /> AUTH: ACB_SYSTEMS
          </div>
        </header>

        {/* SCHEMATIC LEVELS */}
        <div className="flex flex-col gap-24">
          {safetyLevels.map((level) => (
            <section key={level.id} className="reveal-section grid grid-cols-1 lg:grid-cols-[120px_1fr_300px] gap-10 relative items-start">
              
              {/* Level Number */}
              <div className="font-mono text-xl text-accent border-b lg:border-b-0 lg:border-r border-accent/30 pb-4 lg:pb-0 h-full">
                {level.id}
              </div>

              {/* Main Content */}
              <div>
                <h2 className="font-head text-2xl md:text-3xl text-white uppercase mb-8">{level.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {level.checks.map((check) => (
                    <div key={check.id} className="relative p-6 bg-white/5 border border-white/5 pl-6 hover:border-accent/30 transition-colors duration-300">
                      {/* Left bar is Cyan (Main Theme) */}
                      <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
                      
                      {/* ID tag is Yellow (Subtle Hint) */}
                      <h4 className="font-mono text-xs text-[#ffcc00] mb-2">[{check.id}] {check.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{check.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Readout Panel - Styled in Yellow for "Warning/Info" feel */}
              <div className="bg-[#ffcc00]/5 border border-dashed border-[#ffcc00]/40 p-6 font-mono text-[0.7rem] text-[#ffcc00] h-fit">
                <h5 className="border-b border-[#ffcc00]/40 pb-2 mb-4 font-bold tracking-widest">SYSTEM_CHECK_LOG</h5>
                <ul className="space-y-2">
                  {level.readout.map((line, i) => (
                    <li key={i}>- {line}</li>
                  ))}
                </ul>
              </div>

            </section>
          ))}
        </div>

        {/* FOOTER SEAL - Yellow */}
        <footer className="reveal-section mt-24 pt-10 border-t border-accent/30 flex justify-between items-center">
          <div className="font-mono text-xs text-gray-500">
            ACBFLY // THE SKY IS A UTILITY <br />
            <span className="text-accent">STATUS: SAFE_LEGAL_PROFESSIONAL</span>
          </div>
          
          {/* Stamp/Seal in Yellow */}
          <div className="border-2 border-[#ffcc00] p-4 text-center text-[#ffcc00] font-bold text-xs -rotate-3 uppercase tracking-widest hover:bg-[#ffcc00] hover:text-black transition-colors duration-300">
            DGCA RULESET <br /> COMPLIANT
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Safety;