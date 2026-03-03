import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const safetyLevels = [
  {
    id: "01",
    title: "Pre-Flight Protocols",
    checks: [
      { id: "A1", title: "Hardware Integrity", desc: "Rigorous inspection of propulsion systems, motor torque, and high-capacity battery cell health before every ignition." },
      { id: "A2", title: "Avionics Diagnostic", desc: "Full-spectrum synchronization of dual-GPS arrays and secondary redundant sensors for pinpoint positioning." },
      { id: "A3", title: "MET Data Clearance", desc: "Real-time atmospheric analysis and weather-window verification to ensure a 100% safe flight environment." },
      { id: "A4", title: "Airspace Auth", desc: "Automated verification of approved flight corridors, government permissions, and temporary flight restrictions." }
    ],
    readout: [
      "PROP_PITCH: OPTIMAL",
      "BATT_CELLS: 4.2V NOMINAL",
      "GPS_SIGNAL: TRIPLE_LOCK",
      "AUTH_CODE: ACB_2026_PROT"
    ]
  },
  {
    id: "02",
    title: "Elite Operations Team",
    checks: [
      { id: "B1", title: "Executive Licensing", desc: "Operations managed exclusively by DGCA-certified Commercial Drone Pilots with over 1,000+ logged hours." },
      { id: "B2", title: "SOP Adherence", desc: "Strict maintenance of Standard Operating Procedures developed for zero-failure high-stakes environments." },
      { id: "B3", title: "Visual Overwatch", desc: "Continuous Visual Line of Sight (VLOS) or certified remote telemetry monitoring by a dedicated ground station." },
      { id: "B4", title: "Recurrent Training", desc: "Pilots undergo monthly simulation testing for emergency maneuver mastery and new airspace protocol updates." }
    ],
    readout: [
      "DGCA_STATUS: VERIFIED",
      "PILOT_RATING: ELITE",
      "SOP_SYNC: 100%",
      "CONTROL: ACTIVE_OVERRIDE"
    ]
  },
  {
    id: "03",
    title: "Safe Corridor Practices",
    checks: [
      { id: "C1", title: "Geofence Hardlock", desc: "Flight paths are digitally restricted to strictly permitted executive air corridors with zero margin for drift." },
      { id: "C2", title: "Sensitive Zone Bypass", desc: "Automatic hardware-level avoidance of airports, government facilities, and restricted defense sectors." },
      { id: "C3", title: "Population Protocol", desc: "Zero-flight-over-crowd policy enforced via real-time satellite density mapping and AI computer vision." },
      { id: "C4", title: "NPNT Enforcement", desc: "Strict 'No Permission – No Takeoff' firmware integration ensures no unit leaves the ground without authority." }
    ],
    readout: [
      "ALTITUDE: MSL < 400FT",
      "ZONE_LOCK: SECURE",
      "NPNT: FULLY_ENGAGED",
      "GEOFENCE: ACTIVE"
    ]
  },
  {
    id: "04",
    title: "Data & Public Privacy",
    checks: [
      { id: "D1", title: "Privacy Shield", desc: "Proprietary blurring algorithms ensure public privacy and anonymity during all visual data acquisition missions." },
      { id: "D2", title: "Data Custody", desc: "Mission assets are hardware-encrypted and restricted to authorized client stakeholders with multi-sig access." },
      { id: "D3", title: "Liability Coverage", desc: "Comprehensive aerospace insurance protection for every mission, providing peace of mind for third-party risks." },
      { id: "D4", title: "Instant Termination", desc: "Military-grade E-Stop protocols allow for immediate, controlled flight termination and parachute deployment." }
    ],
    readout: [
      "ENCRYPTION: AES_256",
      "INSURANCE: PREMIUM_ACTIVE",
      "E_STOP: SYSTEM_READY",
      "AUDIT: COMPLIANCE_PASS"
    ]
  }
];

const Safety = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-section').forEach(section => {
        gsap.fromTo(section, 
          { y: 30, opacity: 0 },
          { 
            y: 0, opacity: 1, duration: 1.2, ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 90%" }
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#F8F9FA] text-[#1a1a1a] pb-40 pt-28 md:pt-48 font-sans selection:bg-black selection:text-white">
      {/* Importing Inter for better premium legibility */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* --- REFINED SUBTLE GRID --- */}
      <div className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none" 
        style={{ 
          backgroundImage: `
            linear-gradient(#000 1px, transparent 1px),
            linear-gradient(90deg, #000 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

        {/* --- HEADER --- */}
        <header className="reveal-section mb-32">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b-2 border-gray-200 pb-16">
            <div className="max-w-4xl">
              <span className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] mb-6 block">
                Safety & Compliance Report // 2026_V4
              </span>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-black">
                Absolute <br /> <span className="text-gray-300">Safety Standards.</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 font-medium mt-10 leading-relaxed max-w-3xl">
                Aircab Black operates with a zero-failure mandate. Our safety framework is architected for professionals who demand total reliability in every flight.
              </p>
            </div>
            <div className="hidden lg:block text-right">
              <div className="w-20 h-20 bg-black rounded-[1.5rem] flex items-center justify-center text-white text-3xl mb-6 ml-auto shadow-xl">🚁</div>
              <p className="font-extrabold text-xs uppercase tracking-widest text-gray-400 leading-relaxed">
                Standard: DGCA_Aviation_Rules <br /> Authority: Aircab_Systems_International
              </p>
            </div>
          </div>
        </header>

        {/* --- SAFETY LEVELS --- */}
        <div className="flex flex-col gap-40">
          {safetyLevels.map((level) => (
            <section key={level.id} className="reveal-section grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              {/* Level Indicator */}
              <div className="lg:col-span-1 border-l-4 border-black pl-8 pt-2 h-full">
                <span className="font-black text-sm tracking-widest text-gray-300 uppercase">Level</span>
                <div className="text-5xl font-black leading-none mt-1">{level.id}</div>
              </div>

              {/* Grid of Checks */}
              <div className="lg:col-span-8">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-16 text-black">{level.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
                  {level.checks.map((check) => (
                    <div key={check.id} className="group">
                      <div className="flex items-center gap-4 mb-5">
                        <span className="text-xs font-black text-white bg-black px-3 py-1 rounded-lg shadow-sm">{check.id}</span>
                        <h4 className="text-lg font-black uppercase tracking-widest text-black">{check.title}</h4>
                      </div>
                      <p className="text-lg text-gray-600 font-medium leading-relaxed group-hover:text-black transition-colors duration-300">
                        {check.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Readout Spec Panel */}
              <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] self-start">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2.5 h-2.5 rounded-full bg-black animate-pulse"></div>
                  <h5 className="text-xs font-black text-black uppercase tracking-[0.2em]">Real-Time Sync</h5>
                </div>
                <ul className="space-y-6">
                  {level.readout.map((line, i) => (
                    <li key={i} className="flex justify-between border-b border-gray-50 pb-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{line.split(":")[0]}</span>
                      <span className="text-[10px] font-black text-black uppercase tracking-wider">{line.split(":")[1]}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <p className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest italic">Auth_Status: Operational</p>
                </div>
              </div>

            </section>
          ))}
        </div>

        {/* --- FOOTER BADGE --- */}
        <footer className="reveal-section mt-48 pt-20 border-t-2 border-gray-200 flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="text-center md:text-left">
            <p className="text-3xl font-black tracking-tighter text-black mb-2">Uncompromising Safety.</p>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em]">Built for those who value every second.</p>
          </div>
          
          {/* Executive Certification Badge */}
          <div className="group relative scale-110 md:scale-125">
            <div className="absolute inset-0 bg-black blur-2xl opacity-5 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative border-[4px] border-black p-8 md:p-10 text-center bg-white shadow-2xl rounded-2xl -rotate-1 group-hover:rotate-0 transition-transform duration-500">
              <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-2 text-gray-400">Civil Aviation Authority</p>
              <h3 className="text-3xl font-black text-black leading-none">DGCA COMPLIANT</h3>
              <p className="text-[10px] font-bold text-gray-500 mt-4 uppercase tracking-widest">Official Certification #2026-BLACK-X77</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Safety;