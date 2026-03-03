import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// 💎 Curated High-End Aviation/Drone Imagery
const slidesData = [
  { 
    title: "Urban Air Mobility.", 
    sub: "01 // THE FUTURE OF TRANSIT", 
    desc: "Bypass the gridlock. Summon autonomous eVTOLs to your precise coordinates and cross the city in minutes.", 
    img: "https://thumbs.dreamstime.com/b/passenger-aavs-future-urban-air-mobility-futuristic-cityscape-ai-generative-created-technology-290207820.jpg", 
    cta: "Book a Flight"
  },
  { 
    title: "Heavy Payload.", 
    sub: "02 // ENTERPRISE FREIGHT", 
    desc: "Industrial-grade aerial delivery. Secure, zero-latency transport for critical assets, medical supplies, and freight.", 
    img: "https://dronexl.co/wp-content/uploads/2025/06/DJI-FlyCart-100-Unveiled-Heavy-Lift-Drone-with-80kg-Payload-Redefines-Cargo-Logistics-0003-1536x756.jpg", 
    cta: "Explore Freight"
  },
  { 
    title: "Cinematic Ops.", 
    sub: "03 // CERTIFIED EXPERTISE", 
    desc: "Deploy certified aviation professionals and elite camera rigs for surveying, real estate, and major motion pictures.", 
    img: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=2000&auto=format&fit=crop", 
    cta: "Hire a Pilot"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cinematic Auto-Play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slidesData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const changeSlide = (direction) => {
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % slidesData.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + slidesData.length) % slidesData.length);
    }
  };

  return (
    <div className="w-full bg-[#030303] text-white selection:bg-white selection:text-black font-sans overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* 🎬 1. MASSIVE HERO SECTION */}
      <div className="relative w-full h-[100dvh] bg-black">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slidesData[currentIndex].img})` }}
          />
        </AnimatePresence>

        {/* Deep Gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#030303] z-10 pointer-events-none"></div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-24 lg:px-[10%] lg:pb-32 z-20">
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-8 h-px bg-white/50 block"></span>
                  <span className="text-gray-300 tracking-[0.3em] font-bold text-[10px] md:text-xs uppercase">
                    {slidesData[currentIndex].sub}
                  </span>
                </div>
                
                <h1 className="text-6xl md:text-[clamp(5rem,8vw,10rem)] font-extrabold leading-[1] tracking-tighter text-white mb-8">
                  {slidesData[currentIndex].title}
                </h1>
                
                <p className="text-lg md:text-2xl text-gray-300 font-light leading-relaxed max-w-2xl mb-12">
                  {slidesData[currentIndex].desc}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <button 
                    onClick={() => navigate('/booking')} 
                    className="w-full sm:w-auto px-10 py-5 bg-white text-black font-extrabold rounded-full text-sm md:text-base hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  >
                    {slidesData[currentIndex].cta}
                  </button>
                  <button 
                    onClick={() => navigate('/fleet')} 
                    className="w-full sm:w-auto px-10 py-5 bg-transparent border border-white/30 text-white font-bold rounded-full text-sm md:text-base hover:bg-white/10 transition-all active:scale-95"
                  >
                    View Fleet
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Hero Nav Controls */}
        <div className="hidden lg:flex absolute bottom-32 right-[10%] gap-4 z-20">
          <button onClick={() => changeSlide('prev')} className="w-16 h-16 border border-white/20 rounded-full text-white backdrop-blur-md bg-black/20 hover:bg-white hover:text-black transition-all duration-300 flex justify-center items-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button onClick={() => changeSlide('next')} className="w-16 h-16 border border-white/20 rounded-full text-white backdrop-blur-md bg-black/20 hover:bg-white hover:text-black transition-all duration-300 flex justify-center items-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>

      {/* 🏢 2. THE VISION (Editorial Layout) */}
      <section className="py-32 lg:py-48 px-6 lg:px-[10%] border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          <div className="lg:col-span-5">
            <p className="text-gray-500 font-bold tracking-[0.2em] text-[10px] uppercase mb-6">The Aircab Vision</p>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-8">
              Time is your <br className="hidden md:block"/>
              <span className="text-gray-600">ultimate luxury.</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light mb-10 max-w-md">
              Aircab Black bridges the gap between ground gridlock and clear skies. We provide seamless, autonomous, and piloted aerial solutions on demand. No pilot license required—just your coordinates.
            </p>
            <div className="flex items-center gap-6 text-sm font-bold tracking-widest uppercase text-white">
              <span className="w-12 h-px bg-white"></span>
              Zero-Emission Flight
            </div>
          </div>

          <div className="lg:col-span-7 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent z-10 rounded-3xl"></div>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111]">
              <img 
                src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1600&auto=format&fit=crop" 
                alt="Aerial Cityscape" 
                className="w-full h-[500px] lg:h-[700px] object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-1000 ease-out"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 🚁 3. THE FLEET (Showcase Section) */}
      <section className="py-32 lg:py-48 px-6 lg:px-[10%] bg-[#0A0A0A] border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <p className="text-gray-500 font-bold tracking-[0.2em] text-[10px] uppercase mb-4">Hardware</p>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">The Fleet.</h2>
          </div>
          <p className="text-gray-400 max-w-md text-base md:text-lg font-light leading-relaxed">
            Aerospace-grade vehicles designed for extreme reliability, silent operation, and heavy payloads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Fleet Card 1 */}
          <div className="group cursor-pointer">
            <div className="overflow-hidden rounded-3xl bg-[#111] mb-6 border border-[#222]">
              <img 
                src="https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=1200&auto=format&fit=crop" 
                alt="Passenger VTOL" 
                className="w-full h-[400px] object-cover mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-700"
              />
            </div>
            <div className="flex justify-between items-center px-2">
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-1">Aircab Alpha</h3>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Passenger / Executive</p>
              </div>
              <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                ↗
              </span>
            </div>
          </div>

          {/* Fleet Card 2 */}
          <div className="group cursor-pointer">
            <div className="overflow-hidden rounded-3xl bg-[#111] mb-6 border border-[#222]">
              <img 
                src="https://i.pinimg.com/originals/a7/8b/7e/a78b7eb1f3fb5f28a1b37722f8aaf212.jpg" 
                alt="Freight Drone" 
                className="w-full h-[400px] object-cover mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-700"
              />
            </div>
            <div className="flex justify-between items-center px-2">
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-1">Goliath X</h3>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Heavy Freight / Agriculture</p>
              </div>
              <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                ↗
              </span>
            </div>
          </div>
        </div>
      </section>

    {/* 🛡️ 4. TECHNOLOGY & SAFETY (Space-Optimized Anodized Layout) */}
      <section className="py-20 md:py-32 px-6 lg:px-[10%] border-t border-white/5 bg-[#030303] relative overflow-hidden">
        
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 relative z-10">
          
          {/* Left Column: Sticky Editorial Heading */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
             <div className="flex items-center gap-4 mb-6 reveal-text">
               <span className="w-10 h-px bg-gradient-to-r from-gray-500 to-transparent block"></span>
               <p className="text-gray-400 font-bold tracking-[0.2em] text-[10px] uppercase">Zero Tolerance Architecture</p>
             </div>
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6 leading-[1.05] reveal-text">
               Absolute <br/> 
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-300 via-gray-500 to-gray-700">
                 Certainty.
               </span>
             </h2>
             <p className="text-gray-400 font-light text-base leading-relaxed max-w-md reveal-text">
               Every mission is monitored by our centralized AI telemetry grid and backed by redundant human air-traffic controllers. Safety is not a feature; it is our foundation.
             </p>
          </div>
          
          {/* Right Column: Architectural Textured Cards (Tightened Grid) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 lg:pl-10">
            
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />,
                title: "Live Telemetry",
                desc: "Sub-millimeter GPS tracking and optical obstacle avoidance algorithms running at 120Hz.",
                theme: "from-[#002244]/40 via-[#001122]/10",
                iconGlow: "group-hover:text-blue-400 group-hover:bg-blue-900/20 group-hover:border-blue-500/30"
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />,
                title: "Redundant Power",
                desc: "Failsafe dual-battery architecture ensures safe, controlled landings during primary anomalies.",
                theme: "from-[#441a00]/40 via-[#220d00]/10",
                iconGlow: "group-hover:text-orange-400 group-hover:bg-orange-900/20 group-hover:border-orange-500/30"
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
                title: "Military Encryption",
                desc: "All video feeds, client coordinates, and flight paths are secured with AES-256 protocols.",
                theme: "from-[#2a0044]/40 via-[#150022]/10",
                iconGlow: "group-hover:text-purple-400 group-hover:bg-purple-900/20 group-hover:border-purple-500/30"
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
                title: "Elite Operators",
                desc: "Our intervention pilots are DGCA certified with thousands of hours in commercial operations.",
                theme: "from-[#00331a]/40 via-[#001a0d]/10",
                iconGlow: "group-hover:text-emerald-400 group-hover:bg-emerald-900/20 group-hover:border-emerald-500/30"
              }
            ].map((feature, i) => (
              <div key={i} className="relative bg-[#050505] p-8 rounded-3xl border border-white/5 overflow-hidden group transition-all duration-700 reveal-text shadow-xl">
                
                {/* Colored Metallic Texture Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.theme} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>
                
                {/* Specular Highlight */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-12 h-12 bg-[#111] rounded-xl flex items-center justify-center mb-6 border border-white/5 transition-all duration-500 ${feature.iconGlow}`}>
                    <svg className="w-5 h-5 text-white transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {feature.icon}
                    </svg>
                  </div>
                  <h4 className="text-xl font-extrabold mb-3 tracking-tight text-white">{feature.title}</h4>
                  <p className="text-gray-400 font-light text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⚙️ 5. HOW IT WORKS (Tightened Watermark Process) */}
      <section className="py-20 md:py-32 px-6 lg:px-[10%] bg-[#050505] border-t border-white/5 relative overflow-hidden">
        <div className="text-left md:text-center mb-12 lg:mb-16 max-w-3xl mx-auto">
          <p className="text-gray-500 font-bold tracking-[0.2em] text-[10px] uppercase mb-4 reveal-text">Execution Protocol</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight reveal-text">
            Flawless Logistics.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {[
            { num: "01", title: "Initiate", text: "Access the encrypted terminal. Log your exact coordinates and select your service tier." },
            { num: "02", title: "Deploy", text: "An autonomous or piloted unit is instantly dispatched. Track real-time telemetry." },
            { num: "03", title: "Execute", text: "The mission is completed with pinpoint precision. Billing and secure logs are automated." }
          ].map((step) => (
            <div key={step.num} className="relative bg-[#0A0A0A] p-8 md:p-10 rounded-3xl border border-white/5 hover:bg-[#0c0c0c] hover:border-white/10 transition-all duration-700 group flex flex-col justify-between reveal-text overflow-hidden">
              
              {/* Scaled-down Watermark Number */}
              <div className="absolute -right-2 -top-4 text-[100px] font-black text-white/[0.02] group-hover:text-white/[0.05] transition-colors duration-700 pointer-events-none select-none">
                {step.num}
              </div>

              <div className="relative z-10">
                <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-6 block opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                  Phase {step.num}
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold mb-4 tracking-tight text-white">{step.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">{step.text}</p>
              </div>
              
              <div className="relative z-10 w-full h-px bg-white/10 mt-8 overflow-hidden">
                <div className="h-full bg-white w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🏁 6. TIGHTENED CALL TO ACTION */}
      <section className="py-24 md:py-40 px-6 lg:px-[10%] bg-black text-left md:text-center border-t border-white/5 relative overflow-hidden">
        
        {/* Subtle Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white opacity-[0.03] blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 text-white leading-tight reveal-text">
            The Sky is Yours.
          </h2>
          <p className="text-gray-400 mb-10 md:mb-14 text-base md:text-xl font-light leading-relaxed reveal-text max-w-xl mx-auto">
            Join the exclusive network of enterprise professionals utilizing the sky for limitless mobility and logistics.
          </p>
          <div className="reveal-text">
            <button 
              onClick={() => navigate('/login')} 
              className="w-full sm:w-auto px-10 md:px-12 py-5 bg-white text-black font-extrabold uppercase tracking-[0.1em] text-sm rounded-full hover:bg-gray-200 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:-translate-y-1 active:scale-95"
            >
              Initialize Account
            </button>
          </div>
        </div>
      </section>

      {/* ⚙️ 5. HOW IT WORKS (Watermark Typographic Process) */}
      <section className="py-32 md:py-48 lg:py-56 px-6 lg:px-[10%] bg-[#050505] border-t border-white/5 relative overflow-hidden">
        <div className="text-left md:text-center mb-20 lg:mb-32 max-w-3xl mx-auto">
          <p className="text-gray-500 font-bold tracking-[0.3em] text-[10px] uppercase mb-6 reveal-text">Execution Protocol</p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter leading-tight reveal-text">
            Flawless <br className="md:hidden"/> Logistics.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
          {[
            { num: "01", title: "Initiate", text: "Access the encrypted terminal. Log your exact coordinates, select your service tier, and confirm payload requirements." },
            { num: "02", title: "Deploy", text: "An autonomous or piloted unit is instantly dispatched. Track real-time telemetry via your executive dashboard." },
            { num: "03", title: "Execute", text: "The mission is completed with pinpoint precision. Billing, secure logs, and flight data are generated automatically." }
          ].map((step) => (
            <div key={step.num} className="relative bg-[#0A0A0A] p-10 md:p-14 lg:p-16 rounded-[2.5rem] border border-white/5 hover:bg-[#0c0c0c] hover:border-white/10 transition-all duration-700 group flex flex-col justify-between min-h-[400px] reveal-text overflow-hidden">
              
              {/* Massive Watermark Number */}
              <div className="absolute -right-4 -top-8 text-[150px] font-black text-white/[0.02] group-hover:text-white/[0.05] transition-colors duration-700 pointer-events-none select-none">
                {step.num}
              </div>

              <div className="relative z-10">
                <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-8 block opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                  Phase {step.num}
                </span>
                <h3 className="text-2xl md:text-4xl font-extrabold mb-6 tracking-tight text-white">{step.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed text-base md:text-lg max-w-[90%]">{step.text}</p>
              </div>
              
              <div className="relative z-10 w-full h-px bg-white/10 mt-12 overflow-hidden">
                <div className="h-full bg-white w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🏁 6. MASSIVE CALL TO ACTION (Cinematic Lighting) */}
      <section className="py-32 md:py-48 lg:py-64 px-6 lg:px-[10%] bg-black text-left md:text-center border-t border-white/5 relative overflow-hidden">
        
        {/* Subtle Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white opacity-[0.03] blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl lg:text-[8rem] font-extrabold tracking-tighter mb-8 text-white leading-[1] reveal-text">
            The Sky <br className="md:hidden"/> is Yours.
          </h2>
          <p className="text-gray-400 mb-14 md:mb-20 text-lg md:text-2xl font-light leading-relaxed reveal-text max-w-2xl mx-auto">
            Join the exclusive network of enterprise professionals utilizing the sky for limitless mobility and logistics.
          </p>
          <div className="reveal-text">
            <button 
              onClick={() => navigate('/login')} 
              className="w-full sm:w-auto px-10 md:px-16 py-6 md:py-7 bg-white text-black font-extrabold uppercase tracking-[0.1em] text-sm md:text-base rounded-full hover:bg-gray-200 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:scale-95"
            >
              Initialize Account
            </button>
          </div>
        </div>
      </section>

      {/* 🔒 7. PREMIUM FOOTER */}
      <footer className="py-12 px-6 lg:px-[10%] bg-black flex flex-col md:flex-row justify-between items-center gap-6 border-t border-[#111]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black text-xl shadow-sm">🚁</div>
          <span className="font-extrabold tracking-tight text-xl text-white">Aircab Black</span>
        </div>
        <p className="text-[10px] md:text-xs text-gray-600 font-bold uppercase tracking-[0.2em] text-center">
          © 2026 Aircab Mobility // All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;