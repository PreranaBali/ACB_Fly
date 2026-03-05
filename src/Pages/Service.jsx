import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sliderImages = [
  { title: "Executive Transit", img: "https://tse4.mm.bing.net/th/id/OIP.ZLVPnCc6IY_F4A-wsPZ1WAHaEK?pid=Api&P=0&h=180" },
  { title: "Precision Agriculture", img: "https://images.unsplash.com/photo-1713952160156-bb59cac789a9" },
  { title: "Critical Logistics", img: "https://vedanadosah.cvtisr.sk/wp-content/uploads/2022/10/Mestska-letecka-mobilita-Urban-Air-Mobility-%E2%80%93-UAM_Zdroj_Asociacia-Mam-Dron-900x510.jpg" },
  { title: "Urban Infrastructure", img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=800&auto=format&fit=crop" },
  { title: "Advanced Telemetry", img: "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=800&auto=format&fit=crop" },
  { title: "Military Observation", img: "https://tse3.mm.bing.net/th/id/OIP.LH039y0QQbtie15j90zrtQHaEU?pid=Api&P=0&h=180" },
];

const detailedServices = [
  {
    id: "01",
    title: "Precision Agriculture",
    img: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=1200&auto=format&fit=crop",
    desc: "Data-driven farming that increases crop yields while reducing chemical usage and labor costs.",
    problem: "Traditional farming relies on guesswork, leading to wasted water, overuse of pesticides, and uneven crop growth.",
    solution: "Autonomous multispectral drones that scan field health in minutes and targeted spray drones that treat only the affected plants.",
    steps: ["Aerial Scan", "AI Analysis", "Precision Spray"],
    benefits: ["Reduce chemical cost by 30%", "Monitor 500+ acres daily", "Early disease detection", "Fully autonomous flight"],
    note: "Scale: Currently supporting heavy-lift swarm operations for industrial estates."
  },
  {
    id: "02",
    title: "Medical Logistics",
    img: "https://images.unsplash.com/photo-1627309366653-2dedc084cdf1",
    desc: "Instant air transport for critical medical supplies, bypassing urban congestion to save lives.",
    problem: "In emergencies, ground ambulances get stuck in traffic. A 20-minute delay can result in the loss of organs or blood samples.",
    solution: "A dedicated 'Sky Lane' network for drones to ferry payloads up to 5kg between hospitals and labs at 80km/h.",
    steps: ["Hospital Request", "Secure Loading", "Rapid Flight"],
    benefits: ["Traffic-free transport", "Temperature controlled", "24/7 Availability", "Secure chain of custody"],
    note: "Safety: Systems include parachute failsafes and redundant batteries for 99.9% uptime."
  },
  {
    id: "03",
    title: "Events & Media",
    img: "https://t3.ftcdn.net/jpg/06/33/02/16/360_F_633021684_jFGtVY5d3fbxQLkkzMZKG2VCRuUFKvu8.jpg",
    desc: "Next-generation aerial cinematography and sustainable alternatives to traditional fireworks.",
    problem: "Fireworks cause noise pollution and fire hazards. Helicopter filming is prohibitively expensive and restricted in cities.",
    solution: "Synchronized drone light shows that tell stories in the sky, and high-speed FPV drones for immersive action filming.",
    steps: ["3D Choreography", "Fleet Sync", "Live Performance"],
    benefits: ["Zero smoke/pollution", "Reusable technology", "4K/8K Stabilization", "Indoor & Outdoor capable"],
    note: "Future: Integrated holographic projection capabilities currently in development."
  },
  {
    id: "04",
    title: "Urban Air Mobility",
    img: "https://thumbs.dreamstime.com/b/futuristic-urban-air-mobility-drone-taxi-over-skyscraper-cityscape-353348799.jpg?w=768",
    desc: "The flagship of Aircab Black. Electric Vertical Takeoff and Landing (eVTOL) aircraft for inner-city transit.",
    problem: "Urban infrastructure is crumbling. Expanding roads is impossible. Commuters lose hundreds of hours annually in gridlock.",
    solution: "Quiet, electric air taxis that utilize rooftops and vertiports to turn a 1-hour drive into a 10-minute flight.",
    steps: ["Book App", "Security Check", "Board & Fly"],
    benefits: ["100% Electric", "4x Faster than cars", "Noise reduction", "Affordable ride-sharing"],
    note: "Status: Certification phase. Pilot routes launching in select cities by 2026."
  }
];

const Service = () => {
  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const xPercent = useRef(0);
  const direction = useRef(-1);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => { direction.current = self.direction === 1 ? -1 : 1; }
      });

      const animate = () => {
        if (sliderRef.current) {
          if (xPercent.current <= -50) xPercent.current = 0;
          if (xPercent.current > 0) xPercent.current = -50;
          gsap.set(sliderRef.current, { xPercent: xPercent.current });
          xPercent.current += 0.015 * direction.current;
        }
      };
      gsap.ticker.add(animate);

      gsap.utils.toArray('.reveal-text').forEach((el) => {
        gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%" } });
      });

      gsap.utils.toArray('.service-row').forEach((row) => {
        gsap.fromTo(row.querySelector('.text-col'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power2.out", scrollTrigger: { trigger: row, start: "top 80%" } });
        gsap.fromTo(row.querySelector('.img-col'), { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: row, start: "top 80%" } });
      });

      return () => gsap.ticker.remove(animate);
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  const SlideCard = ({ slide }) => (
    <div className="w-[300px] md:w-[400px] h-[220px] md:h-[280px] relative rounded-3xl overflow-hidden border border-gray-100 group flex-shrink-0 bg-white shadow-sm">
      <img src={slide.img} alt={slide.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" />
      <div className="absolute bottom-0 left-0 w-full p-6">
        <span className="font-extrabold text-black tracking-tight text-lg uppercase">{slide.title}</span>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="w-full bg-[#FFFFFF] min-h-screen text-[#111] pt-32 font-sans selection:bg-black selection:text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
      `}</style>
      
      {/* SECTION 1: HERO */}
      <section className="min-h-[60vh] flex flex-col justify-center items-center text-center px-6 relative overflow-hidden mb-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_0%,transparent_70%)] pointer-events-none"></div>
        <h1 className="font-black text-[clamp(2.5rem,7vw,6rem)] leading-[1] mb-8 tracking-tighter uppercase reveal-text text-black">
          Engineering the <br/> <span className="text-gray-300">New Standard</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed font-medium reveal-text">
          Aircab Black applies aerospace-grade autonomous technology to solve the most critical challenges in logistics and urban mobility.
        </p>
      </section>

      {/* SECTION 2: INFINITE SLIDER */}
      <section className="py-16 bg-[#FAFAFA] overflow-hidden border-y border-gray-100 relative">
        <div ref={sliderRef} className="flex gap-6 w-max will-change-transform">
          {sliderImages.map((slide, i) => <SlideCard key={`a-${i}`} slide={slide} />)}
          {sliderImages.map((slide, i) => <SlideCard key={`b-${i}`} slide={slide} />)}
        </div>
      </section>

      {/* 👨‍💼 SECTION 3: FOUNDER SECTION (Moved to top per request) */}
      <section className="py-32 px-[6%] lg:px-[10%] bg-white border-b border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-5 reveal-text">
            <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100 aspect-[4/5] border border-gray-100">
              <img 
                src="/images/f.png" 
                alt="Mr. Muthyal Ashwin Kumar" 
                className="w-full h-full object-cover  group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-white text-[10px] font-black uppercase tracking-[0.4em] block mb-1">Founder & CEO</span>
                <p className="text-white font-bold text-2xl tracking-tighter">M. Ashwin Kumar</p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-7">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6 block reveal-text">Our Visionary</span>
            <h2 className="font-black text-4xl md:text-6xl tracking-tighter uppercase mb-8 leading-tight text-black reveal-text">
              Mr. Muthyal <br/> <span className="text-gray-300">Ashwin Kumar</span>
            </h2>
            <p className="text-gray-500 font-medium text-lg mb-10 leading-relaxed reveal-text">
              With over a decade of leadership in autonomous systems, Mr. Muthyal Ashwin Kumar founded ACBfly to revolutionize how goods and people move across the sky. His vision for a zero-failure, electric aerial network is the heartbeat of our technical innovation.
            </p>
            <div className="flex gap-12 border-t border-gray-100 pt-10 reveal-text">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Philosophy</span>
                <p className="text-black font-bold text-sm">Safety-First Autonomous Design</p>
              </div>
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Target</span>
                <p className="text-black font-bold text-sm">Net-Zero Urban Logistics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CAPABILITY GRID */}
      <section className="py-32 px-[6%] lg:px-[10%] bg-white">
        <div className="mb-20 text-left border-l-4 border-black pl-8">
          <p className="text-gray-400 font-bold tracking-[0.3em] text-xs uppercase mb-4 reveal-text">Core Operations</p>
          <h2 className="font-black text-4xl md:text-6xl tracking-tight uppercase reveal-text text-black">Defining Capability</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Agriculture", desc: "Fully autonomous multispectral scanning and precision treatment protocols to maximize agricultural output.", tag: "Operational", icon: "M12 2L2 7l10 5 10-5-10-5zm0 9l2.95-1.476L12 17.5l-2.95-7.976L12 11zm-10 1L12 17l10-5v5l-10 5-10-5v-5z" },
            { title: "Medical", desc: "High-priority, zero-latency transport for critical medical assets, bypassing all ground-level constraints.", tag: "Operational", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4H6v-2h4V7h2v4h4v2h-4v4z" },
            { title: "Mobility", desc: "On-demand eVTOL charter services designed to compress hour-long urban commutes into minutes.", tag: "In Certification", highlight: true, icon: "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" }
          ].map((card, i) => (
            <div key={i} className={`p-12 rounded-3xl border transition-all duration-500 group reveal-text shadow-sm
              ${card.highlight 
                ? 'bg-black border-black text-white' 
                : 'bg-white border-gray-100 hover:border-black'
              }`}
            >
              <svg className={`w-10 h-10 mb-8 ${card.highlight ? 'fill-white' : 'fill-black'}`} viewBox="0 0 24 24"><path d={card.icon}/></svg>
              <h3 className="font-black text-2xl mb-4 tracking-tight uppercase">{card.title}</h3>
              <p className={`text-sm leading-relaxed mb-10 font-medium ${card.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{card.desc}</p>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border 
                ${card.highlight ? 'bg-white text-black border-white' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                {card.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: DETAILED SERVICES */}
      <section className="pb-32 px-[6%] lg:px-[10%] bg-[#FAFAFA]">
        {detailedServices.map((service, index) => (
          <div key={service.id} className={`service-row flex flex-col lg:flex-row gap-16 lg:gap-24 items-center mb-40 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
            <div className="text-col flex-1 w-full">
              <span className="text-7xl font-black text-gray-200 block mb-4 tracking-tighter">{service.id}</span>
              <h2 className="font-black text-3xl md:text-5xl uppercase tracking-tighter mb-8 leading-none text-black">{service.title}</h2>
              <p className="text-gray-500 font-medium text-lg mb-10 leading-relaxed">{service.desc}</p>

              <div className="bg-white p-8 border border-gray-100 rounded-3xl mb-10 shadow-sm">
                <div className="mb-6">
                  <span className="text-black text-[10px] font-black uppercase tracking-widest block mb-2 opacity-30">Operational Challenge</span>
                  <p className="text-gray-600 text-sm font-semibold leading-relaxed">{service.problem}</p>
                </div>
                <div className="h-px w-full bg-gray-100 mb-6"></div>
                <div>
                  <span className="text-black text-[10px] font-black uppercase tracking-widest block mb-2 opacity-30">Technical Solution</span>
                  <p className="text-black text-sm font-bold leading-relaxed">{service.solution}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-10">
                {service.steps.map((step, i) => (
                  <div key={i} className="flex items-center text-[10px] font-black uppercase tracking-widest bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-xs">
                    {step}
                    {i !== service.steps.length - 1 && <span className="ml-3 text-gray-300">/</span>}
                  </div>
                ))}
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-10">
                {service.benefits.map((benefit, i) => (
                  <li key={i} className="text-gray-600 text-sm font-bold flex items-start gap-3">
                    <span className="text-black mt-1">●</span> {benefit}
                  </li>
                ))}
              </ul>

              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest border-t border-gray-100 pt-6 italic">{service.note}</p>
            </div>

            <div className="img-col flex-1 h-[400px] md:h-[600px] w-full relative rounded-[2rem] overflow-hidden border border-gray-200 group bg-white shadow-xl">
              <img src={service.img} alt={service.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
            </div>
          </div>
        ))}
      </section>

      {/* SECTION 6: CTA */}
      <section className="min-h-[60vh] flex flex-col justify-center items-center text-center bg-white border-t border-gray-100 px-6">
        <h2 className="font-black text-4xl md:text-7xl tracking-tighter uppercase mb-12 reveal-text text-black">Ready for <br/> <span className="text-gray-200">Takeoff</span></h2>
        <button className="px-14 py-6 bg-black text-white font-black uppercase text-sm tracking-[0.2em] rounded-full hover:bg-gray-800 transition-all duration-500 shadow-xl active:scale-95 reveal-text">
          Initiate Request
        </button>
      </section>

    </div>
  );
};

export default Service;