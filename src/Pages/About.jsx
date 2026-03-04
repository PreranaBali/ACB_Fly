import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.fromTo(el, 
          { y: 40, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            }
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F8F9FA] text-[#1a1a1a] font-sans selection:bg-black selection:text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .stat-card { background: #fff; border: 1px solid #F3F4F6; padding: 2.5rem; border-radius: 2rem; transition: 0.4s; }
        .stat-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.04); border-color: #000; }
      `}</style>

      {/* 🎬 Hero Section */}
      <section className="pt-40 pb-24 px-6 md:px-[10%] border-b border-gray-100 bg-white">
        <div className="max-w-5xl">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-6 block reveal">The Aircab Identity</span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-black reveal mb-10">
            Redefining <br /> <span className="text-gray-300">Aerial Mobility.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-3xl reveal">
            Aircab Black is more than a service—it's a commitment to efficiency, precision, and the future of autonomous aviation.
          </p>
        </div>
      </section>

      {/* 👨‍💼 Founder Section */}
      <section className="py-24 md:py-40 px-6 md:px-[10%]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Founder Image */}
          <div className="lg:col-span-5 reveal">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gray-100 rounded-[3rem] -z-10 group-hover:bg-black transition-colors duration-700"></div>
              <div className="overflow-hidden rounded-[2.5rem] border-[8px] border-white shadow-2xl aspect-[4/5]">
                <img 
                  src="/images/founder.png" 
                  alt="Mr. Muthyal Ashwin Kumar" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
              </div>
              {/* Floating Name Card */}
              <div className="absolute -bottom-6 -right-6 bg-black text-white p-8 rounded-3xl shadow-2xl hidden md:block">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-1">Authenticated</p>
                <h3 className="text-xl font-bold">M. Ashwin Kumar</h3>
              </div>
            </div>
          </div>

          {/* Founder Bio */}
          <div className="lg:col-span-7 lg:pl-10 reveal">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 block">Leadership</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black mb-8">
              Mr. Muthyal Ashwin Kumar
            </h2>
            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-10">CEO & Founder</h3>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
              <p>
                Under the leadership of Mr. Muthyal Ashwin Kumar, Aircab Black was established to solve the growing complexity of urban and industrial transit. 
              </p>
              <p>
                His vision for a zero-failure, autonomous aerial network has pushed the boundaries of what is possible in logistics and personalized transport, ensuring that Aircab remains the standard for aerospace excellence.
              </p>
            </div>

            <div className="mt-12 flex items-center gap-6">
               <div className="h-[2px] w-20 bg-black"></div>
               <span className="font-black text-xs uppercase tracking-widest">Executive Board // 2026</span>
            </div>
          </div>

        </div>
      </section>

      {/* 📊 High-End Stats Grid */}
      <section className="py-24 md:py-40 px-6 md:px-[10%] bg-white border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Flight Hours", val: "12,400+", sub: "Logged and Verified" },
            { label: "Active Fleet", val: "150+", sub: "Tier-1 Aircraft" },
            { label: "Safety Rating", val: "99.9%", sub: "Zero Incident Record" }
          ].map((stat, i) => (
            <div key={i} className="stat-card reveal">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">{stat.label}</p>
              <h4 className="text-5xl font-black tracking-tighter text-black mb-2">{stat.val}</h4>
              <p className="text-sm font-bold text-gray-400">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🏁 Footer CTA */}
      <section className="py-32 px-6 text-center reveal">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 italic text-gray-300">Innovating the skies since inception.</h2>
        <div className="w-12 h-1 bg-black mx-auto"></div>
      </section>

      {/* Bottom Legal bar */}
      <footer className="py-10 px-6 border-t border-gray-100 flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
        <span>Aircab Black // About</span>
        <span>© 2026 All Rights Reserved</span>
      </footer>
    </div>
  );
};

export default About;