import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 💎 Data
const slidesData = [
  { 
    title: "Urban Air Mobility.", 
    sub: "01 // THE FUTURE OF TRANSIT", 
    desc: "Bypass the gridlock. Summon autonomous eVTOLs to your precise coordinates and cross the city in minutes.", 
    img: "https://thumbs.dreamstime.com/b/passenger-aavs-future-urban-air-mobility-futuristic-cityscape-ai-generative-created-technology-290207820.jpg", 
    cta: "Book a Flight",
    path: "/servicebookings"
  },
  { 
    title: "Heavy Payload.", 
    sub: "02 // ENTERPRISE FREIGHT", 
    desc: "Industrial-grade aerial delivery. Secure, zero-latency transport for critical assets, medical supplies, and freight.", 
    img: "https://dronexl.co/wp-content/uploads/2025/06/DJI-FlyCart-100-Unveiled-Heavy-Lift-Drone-with-80kg-Payload-Redefines-Cargo-Logistics-0003-1536x756.jpg", 
    cta: "Explore Freight",
    path: "/service"
  },
  { 
    title: "Cinematic Ops.", 
    sub: "03 // CERTIFIED EXPERTISE", 
    desc: "Deploy certified aviation professionals and elite camera rigs for surveying, real estate, and major motion pictures.", 
    img: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=2000&auto=format&fit=crop", 
    cta: "Hire a Pilot",
    path: "/service"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slidesData.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const changeSlide = (direction) => {
    setCurrentIndex(prev => direction === 'next' ? (prev + 1) % slidesData.length : (prev - 1 + slidesData.length) % slidesData.length);
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-text').forEach((el) => {
        gsap.fromTo(el, 
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 95%" } }
        );
      });
    }, containerRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-[#030303] text-white selection:bg-white selection:text-black font-sans overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>

      {/* 🧭 NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-5 md:px-12 md:py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black text-lg shadow-lg">🚁</div>
          <span className="font-black tracking-tighter text-xl uppercase">Aircab</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          {['Fleet', 'Safety', 'Services'].map(item => (
            <a key={item} href={`/${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</a>
          ))}
          <button onClick={() => navigate('/login')} className="px-6 py-2 border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all">Sign In</button>
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-[110]">
          <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </button>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center gap-8 p-10">
            {['Fleet', 'Safety', 'Services'].map(item => (
              <a key={item} href={`/${item.toLowerCase()}`} className="text-4xl font-black uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>{item}</a>
            ))}
            <button onClick={() => {navigate('/login'); setIsMenuOpen(false);}} className="w-full py-4 bg-white text-black font-bold rounded-full uppercase">Sign In</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎬 1. HERO SECTION */}
      <div className="relative w-full h-[100svh] bg-black">
        <AnimatePresence initial={false}>
          <motion.div key={currentIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slidesData[currentIndex].img})` }} />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#030303] z-10 pointer-events-none"></div>
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-16 md:px-[10%] md:pb-24 z-20">
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div key={currentIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <span className="text-gray-300 tracking-[0.3em] font-bold text-[8px] md:text-xs uppercase mb-4 block">{slidesData[currentIndex].sub}</span>
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-[1] tracking-tighter text-white mb-6">{slidesData[currentIndex].title}</h1>
                <p className="text-sm md:text-xl text-gray-300 font-light leading-relaxed max-w-2xl mb-8">{slidesData[currentIndex].desc}</p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button onClick={() => navigate(slidesData[currentIndex].path)} className="w-full sm:w-auto px-10 py-4 bg-white text-black font-extrabold rounded-full uppercase tracking-widest text-xs shadow-xl">{slidesData[currentIndex].cta}</button>
                  <button onClick={() => navigate('/fleet')} className="w-full sm:w-auto px-10 py-4 border border-white/20 rounded-full uppercase tracking-widest text-xs">View Fleet</button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 🏢 2. THE VISION */}
      <section className="py-20 md:py-32 px-6 md:px-[10%] border-t border-white/5 bg-[#050505]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="reveal-text order-2 lg:order-1">
            <p className="text-gray-500 font-bold tracking-[0.2em] text-[10px] uppercase mb-4">The Aircab Vision</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-6">Time is your <span className="text-gray-600">ultimate luxury.</span></h2>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed font-light mb-8">Aircab Black bridges the gap between ground gridlock and clear skies. We provide seamless, autonomous, and piloted aerial solutions on demand.</p>
            <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase"><span className="w-8 h-px bg-white"></span>Zero-Emission Flight</div>
          </div>
          <div className="relative h-[300px] md:h-[500px] order-1 lg:order-2">
            <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 grayscale opacity-40"><img src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1200" className="w-full h-full object-cover" alt="City" /></div>
          </div>
        </div>
      </section>

      {/* 🚁 3. THE FLEET */}
      <section className="py-20 md:py-32 px-6 md:px-[10%] bg-[#030303] border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 reveal-text">
          <div><p className="text-gray-500 font-bold tracking-[0.2em] text-[10px] uppercase mb-2">Inventory</p><h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">The Fleet.</h2></div>
          <p className="text-gray-400 max-w-md text-sm md:text-base font-light">Aerospace-grade vehicles designed for extreme reliability and silent operation.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Alpha", sub: "Passenger", img: "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=800" },
            { name: "Goliath X", sub: "Freight", img: "https://i.pinimg.com/originals/a7/8b/7e/a78b7eb1f3fb5f28a1b37722f8aaf212.jpg" },
            { name: "Specter Pro", sub: "Camera", img: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800" }
          ].map((fleet, i) => (
            <div key={i} className="group cursor-pointer reveal-text">
              <div className="overflow-hidden rounded-2xl bg-[#0A0A0A] mb-4 border border-white/5 aspect-[4/5] relative">
                <img src={fleet.img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" alt={fleet.name} />
              </div>
              <h3 className="text-xl font-black uppercase text-white tracking-tighter">{fleet.name}</h3>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{fleet.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🛡️ 4. TECHNOLOGY */}
      <section className="py-20 md:py-32 px-6 md:px-[10%] border-t border-white/5 bg-[#050505]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="reveal-text">
            <p className="text-gray-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-4">The Engine</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">Absolute <span className="text-gray-600">Certainty.</span></h2>
            <p className="text-gray-400 font-light text-base leading-relaxed max-w-md">Our centralized AI telemetry grid is backed by redundant human air-traffic controllers at every node.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Live Telemetry", desc: "120Hz GPS tracking.", theme: "from-blue-500/10" },
              { title: "Redundant Power", desc: "Dual-battery failsafe.", theme: "from-orange-500/10" },
              { title: "Military Encryption", desc: "AES-256 protocols.", theme: "from-purple-500/10" },
              { title: "Elite Operators", desc: "DGCA certified pilots.", theme: "from-emerald-500/10" }
            ].map((feature, i) => (
              <div key={i} className="relative bg-[#0A0A0A] p-6 rounded-2xl border border-white/5 overflow-hidden group reveal-text">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.theme} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <h4 className="text-sm font-black text-white uppercase mb-1 tracking-tighter">{feature.title}</h4>
                <p className="text-gray-500 font-light text-[11px] leading-tight">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⚙️ 5. HOW IT WORKS */}
      <section className="py-20 md:py-32 px-6 md:px-[10%] bg-[#030303] border-t border-white/5">
        <div className="text-left md:text-center mb-12 reveal-text">
          <p className="text-gray-500 font-bold tracking-[0.3em] text-[10px] uppercase mb-4">Execution</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Flawless Logistics.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 reveal-text">
          {[
            { num: "01", title: "Initiate", text: "Log coordinates and select your service tier." },
            { num: "02", title: "Deploy", text: "Autonomous unit is dispatched immediately." },
            { num: "03", title: "Execute", text: "Mission completed with pinpoint precision." }
          ].map((step) => (
            <div key={step.num} className="relative bg-[#0A0A0A] p-8 rounded-2xl border border-white/5 hover:border-white/20 transition-all group overflow-hidden">
              <div className="absolute -right-2 -top-4 text-7xl font-black text-white/[0.02] group-hover:text-white/[0.05] transition-colors select-none">{step.num}</div>
              <h3 className="text-lg font-black uppercase text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 font-light text-xs leading-relaxed">{step.text}</p>
              <div className="w-full h-px bg-white/10 mt-6 overflow-hidden"><div className="h-full bg-white w-0 group-hover:w-full transition-all duration-700 ease-out"></div></div>
            </div>
          ))}
        </div>
      </section>

      {/* 🏁 6. CALL TO ACTION */}
      <section className="py-24 md:py-40 px-6 md:px-[10%] bg-black text-center border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-white opacity-[0.03] blur-[100px] pointer-events-none"></div>
        <h2 className="text-4xl md:text-8xl font-black tracking-tighter text-white mb-6 reveal-text">The Sky is Yours.</h2>
        <button onClick={() => navigate('/login')} className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 transition-all reveal-text">Initialize Account</button>
      </section>
      
      {/* 🔒 7. FOOTER */}
      <footer className="py-10 px-6 md:px-[10%] bg-[#030303] flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
        <div className="flex items-center gap-3"><div className="w-6 h-6 bg-white rounded flex items-center justify-center text-black">🚁</div>Aircab Black</div>
        <p>© 2026 Aircab Mobility // All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;