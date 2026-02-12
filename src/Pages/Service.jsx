import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sliderImages = [
  { title: "Future Air Taxi", img: "https://images.unsplash.com/photo-1559067515-bf7d799b6d4d?q=80&w=800&auto=format&fit=crop" },
  { title: "Smart Farming", img: "https://images.unsplash.com/photo-1713952160156-bb59cac789a9" },
  { title: "Medical Logistics", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop" },
  { title: "Urban Transport", img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=800&auto=format&fit=crop" },
  { title: "Advanced Tech", img: "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=800&auto=format&fit=crop" },
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
    note: "Note: Currently scaling to support heavy-lift swarm operations for large industrial estates."
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
    note: "Reliability: Systems include parachute failsafes and redundant batteries for 99.9% uptime."
  },
  {
    id: "03",
    title: "Events & Media",
    img: "https://images.unsplash.com/photo-1485546784815-e380f3297414?q=80&w=1200&auto=format&fit=crop",
    desc: "Next-generation aerial cinematography and sustainable alternatives to traditional fireworks.",
    problem: "Fireworks cause noise pollution and fire hazards. Helicopter filming is prohibitively expensive and restricted in cities.",
    solution: "Synchronized drone light shows that tell stories in the sky, and high-speed FPV drones for immersive action filming.",
    steps: ["3D Choreography", "Fleet Sync", "Live Performance"],
    benefits: ["Zero smoke/pollution", "Reusable technology", "4K/8K Stabilization", "Indoor & Outdoor capable"],
    note: "Future: Developing holographic projection capabilities for brand advertising."
  },
  {
    id: "04",
    title: "Urban Air Mobility",
    img: "https://images.unsplash.com/photo-1559067515-bf7d799b6d4d?q=80&w=1200&auto=format&fit=crop",
    desc: "The flagship of ACBFLY. Electric Vertical Takeoff and Landing (eVTOL) aircraft for inner-city transit.",
    problem: "Urban infrastructure is crumbling. Expanding roads is impossible. Commuters lose hundreds of hours annually in gridlock.",
    solution: "Quiet, electric air taxis that utilize rooftops and vertiports to turn a 1-hour drive into a 10-minute flight.",
    steps: ["Book App", "Security Check", "Board & Fly"],
    benefits: ["100% Electric", "4x Faster than cars", "Noise reduction", "Affordable ride-sharing"],
    note: "Status: Currently in certification phase. Pilot routes launching in select cities by 2026."
  }
];

const Service = () => {
  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  
  // Animation State
  const xPercent = useRef(0);
  const direction = useRef(-1);

  useLayoutEffect(() => {
    // Safety check
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      
      // 1. DIRECTION DETECTION
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          // Flip direction based on scroll
          direction.current = self.direction === 1 ? -1 : 1;
        }
      });

      // 2. SMOOTH SINGLE STRIP ANIMATION
      const animate = () => {
        if (sliderRef.current) {
          
          // Logic: We have 2 sets of images. 
          // 0% = Start of Set 1.
          // -50% = Start of Set 2 (which looks identical to Start of Set 1).
          // So we loop between 0 and -50.
          
          if (xPercent.current <= -50) {
            xPercent.current = 0;
          }
          if (xPercent.current > 0) {
            xPercent.current = -50;
          }

          gsap.set(sliderRef.current, { xPercent: xPercent.current });
          
          // Speed: 0.02 is very slow and smooth
          xPercent.current += 0.02 * direction.current;
        }
      };

      gsap.ticker.add(animate);

      // 3. OTHER ANIMATIONS
      gsap.utils.toArray('.reveal-text').forEach((el) => {
        gsap.fromTo(el, 
          { y: 50, opacity: 0 },
          { 
            y: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" }
          }
        );
      });

      gsap.utils.toArray('.service-row').forEach((row) => {
        gsap.fromTo(row.querySelector('.text-col'),
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, scrollTrigger: { trigger: row, start: "top 75%" } }
        );
        gsap.fromTo(row.querySelector('.img-col'),
          { x: 50, opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, duration: 1, scrollTrigger: { trigger: row, start: "top 75%" } }
        );
      });

      return () => {
        gsap.ticker.remove(animate);
      };

    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  const SlideCard = ({ slide }) => (
    <div className="w-[350px] h-[250px] relative rounded-xl overflow-hidden border border-white/10 group cursor-none flex-shrink-0">
      <img src={slide.img} alt={slide.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
        <span className="font-body font-bold text-white tracking-wide">{slide.title}</span>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="w-full bg-[#050505] min-h-screen text-white pt-20">
      
      {/* HERO SECTION */}
      <section className="h-[80vh] flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,204,0.08)_0%,transparent_60%)] pointer-events-none"></div>
        <h1 className="font-head text-[clamp(2.5rem,6vw,5rem)] leading-[1.1] mb-6 uppercase reveal-text">
          We Build The <br/> <span className="text-accent">Future of Flight</span>
        </h1>
        <p className="font-body text-xl text-gray-400 max-w-2xl leading-relaxed reveal-text">
          From delivering life-saving medicine to flying taxis that skip traffic. <br/>
          ACBFLY is making the sky useful for everyone.
        </p>
      </section>

      {/* --- CORRECTED INFINITE SLIDER --- */}
      <section className="py-20 bg-black overflow-hidden border-y border-white/5 relative">
        {/* Single Wrapper: w-max ensures it takes full width of content.
            flex & gap-8 ensures spacing is identical everywhere.
        */}
        <div ref={sliderRef} className="flex gap-8 w-max will-change-transform">
          
          {/* First Set */}
          {sliderImages.map((slide, i) => <SlideCard key={`a-${i}`} slide={slide} />)}
          
          {/* Duplicate Set (Identical) */}
          {sliderImages.map((slide, i) => <SlideCard key={`b-${i}`} slide={slide} />)}

        </div>
      </section>

      {/* WHAT WE DO (GRID) */}
      <section className="py-32 px-[10%]">
        <div className="mb-16 text-center md:text-left">
          <h2 className="font-head text-4xl uppercase mb-4 reveal-text">What We Do</h2>
          <p className="text-gray-400 font-body reveal-text">Advanced technology made simple for daily life.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              title: "Smart Farming", 
              desc: "We use drones to help farmers. Our drones spray crops automatically and check soil health.",
              tag: "Available Now",
              icon: <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.95-1.476L12 17.5l-2.95-7.976L12 11zm-10 1L12 17l10-5v5l-10 5-10-5v-5z" /> 
            },
            { 
              title: "Medical Delivery", 
              desc: "We fly medicine, blood, and organs directly to hospitals, bypassing road traffic entirely.",
              tag: "Available Now",
              icon: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4H6v-2h4V7h2v4h4v2h-4v4z" /> 
            },
            { 
              title: "Flying Taxis", 
              desc: "Imagine booking a flight across the city just like you book a cab today.",
              tag: "In Development",
              highlight: true,
              icon: <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /> 
            }
          ].map((card, i) => (
            <div key={i} className={`p-10 rounded-2xl border transition-all duration-300 group hover:-translate-y-2 reveal-text
              ${card.highlight 
                ? 'bg-gradient-to-b from-accent/5 to-[#111] border-accent/50' 
                : 'bg-[#111] border-white/10 hover:border-accent/50'
              }`}
            >
              <svg className="w-10 h-10 fill-accent mb-6" viewBox="0 0 24 24">{card.icon}</svg>
              <h3 className="font-head text-xl mb-4">{card.title}</h3>
              <p className="text-gray-400 font-body text-sm leading-relaxed mb-6">{card.desc}</p>
              <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider 
                ${card.highlight ? 'bg-white text-black' : 'bg-accent/10 text-accent'}`}>
                {card.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILED SECTIONS */}
      <section className="pb-32 px-[5%] md:px-[10%]">
        {detailedServices.map((service, index) => (
          <div key={service.id} className={`service-row flex flex-col md:flex-row gap-16 items-center mb-32 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            
            <div className="text-col flex-1">
              <span className="font-head text-4xl text-accent/20 block mb-2">{service.id}</span>
              <h2 className="font-head text-3xl uppercase mb-6">{service.title}</h2>
              <p className="text-gray-400 font-body text-lg mb-8">{service.desc}</p>

              <div className="bg-[#111] p-6 border-l-2 border-accent rounded-r-xl mb-8">
                <div className="mb-4">
                  <span className="text-white text-xs font-bold uppercase tracking-widest block mb-1">The Problem</span>
                  <p className="text-gray-500 text-sm">{service.problem}</p>
                </div>
                <div>
                  <span className="text-accent text-xs font-bold uppercase tracking-widest block mb-1">Our Solution</span>
                  <p className="text-gray-300 text-sm">{service.solution}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-body mb-8">
                {service.steps.map((step, i) => (
                  <div key={i} className="flex items-center">
                    {step}
                    {i !== service.steps.length - 1 && <span className="ml-4 text-accent">→</span>}
                  </div>
                ))}
              </div>

              <ul className="grid grid-cols-2 gap-y-2 gap-x-4 mb-8">
                {service.benefits.map((benefit, i) => (
                  <li key={i} className="text-gray-400 text-sm relative pl-4">
                    <span className="absolute left-0 text-accent">•</span> {benefit}
                  </li>
                ))}
              </ul>

              <p className="text-xs text-gray-600 italic border-t border-white/10 pt-4">{service.note}</p>
            </div>

            <div className="img-col flex-1 h-[500px] w-full relative rounded-2xl overflow-hidden border border-white/10 group">
              <img src={service.img} alt={service.title} className="w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
            </div>

          </div>
        ))}
      </section>

      {/* FOOTER CTA */}
      <section className="h-[50vh] flex flex-col justify-center items-center text-center bg-black border-t border-white/10">
        <h2 className="font-head text-4xl mb-8 reveal-text">Ready to Fly?</h2>
        <button className="px-10 py-4 bg-accent text-black font-bold rounded-full uppercase tracking-widest hover:bg-white transition-colors duration-300 hover-target reveal-text">
          Contact Us
        </button>
      </section>

    </div>
  );
};

export default Service;