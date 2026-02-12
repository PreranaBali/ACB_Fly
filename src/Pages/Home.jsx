import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const slidesData = [
  { 
    title: "RENT", 
    sub: "01 // FOR EVERYONE", 
    desc: "Don't buy a drone. Just rent one for the hour you need it.", 
    img: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=1920&auto=format&fit=crop" 
  },
  { 
    title: "BUY", 
    sub: "02 // OWNERSHIP", 
    desc: "Love flying? You can buy the best professional drones directly from us.", 
    img: "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=1920&auto=format&fit=crop" 
  },
  { 
    title: "HIRE", 
    sub: "03 // SERVICES", 
    desc: "Need a pilot? We have certified experts ready to fly for you.", 
    img: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=1920&auto=format&fit=crop" 
  }
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const descRef = useRef(null);
  
  // Refs for slice manipulation
  const imagesARef = useRef([]);
  const imagesBRef = useRef([]);

  // --- SLIDER LOGIC ---
  const changeSlide = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    let nextIndex = direction === 'next' 
      ? (currentIndex + 1) % slidesData.length 
      : (currentIndex - 1 + slidesData.length) % slidesData.length;
    
    const nextSlideData = slidesData[nextIndex];

    const ctx = gsap.context(() => {
      // 1. Prep next image in the hidden "B" slots
      imagesBRef.current.forEach((img, i) => {
        if(img) {
          img.style.backgroundImage = `url(${nextSlideData.img})`;
          gsap.set(img, { yPercent: i % 2 === 0 ? 100 : -100 });
        }
      });

      // 2. Animate Text Out
      gsap.to([titleRef.current, descRef.current, subRef.current], { 
        x: -50, opacity: 0, duration: 0.4, stagger: 0.1 
      });

      // 3. Animate Slices
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentIndex(nextIndex);
          setIsAnimating(false);
          // Reset A to show the new image permanently
          imagesARef.current.forEach((img) => {
             if(img) {
               img.style.backgroundImage = `url(${nextSlideData.img})`;
               gsap.set(img, { yPercent: 0 });
             }
          });
        }
      });

      // Staggered slice animation
      imagesARef.current.forEach((_, i) => {
        let dir = i % 2 === 0 ? -100 : 100;
        tl.to(imagesARef.current[i], { yPercent: dir, duration: 1.2, ease: "power3.inOut" }, i * 0.1);
        tl.to(imagesBRef.current[i], { yPercent: 0, duration: 1.2, ease: "power3.inOut" }, "<");
      });

      // 4. Animate Text In (after delay)
      gsap.delayedCall(0.8, () => {
        gsap.to([subRef.current, titleRef.current, descRef.current], { 
          x: 0, opacity: 1, duration: 0.6, stagger: 0.1 
        });
      });

    }, containerRef);

    return () => ctx.revert();
  };

  // --- INITIAL ANIMATION ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Intro animations
      gsap.from('.slice-wrapper', { 
        y: '100%', duration: 1.5, stagger: 0.1, ease: 'power4.out', delay: 0.5 
      });
      gsap.from(titleRef.current, { y: 100, opacity: 0, duration: 1, delay: 1 });
      gsap.from([subRef.current, descRef.current], { opacity: 0, duration: 1, delay: 1.2 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // --- 3D CARD COMPONENT ---
  const Card3D = ({ icon, title, text }) => {
    const cardRef = useRef(null);

    const handleMove = (e) => {
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      gsap.to(card, { rotationX: rotateX, rotationY: rotateY, duration: 0.1, ease: 'none' });
    };

    const handleLeave = () => {
      gsap.to(cardRef.current, { rotationX: 0, rotationY: 0, duration: 0.5 });
    };

    return (
      <div 
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="card-3d bg-white/5 border border-white/10 p-10 rounded-lg transition-colors hover:bg-[#00ffcc]/5 hover:border-accent hover-target"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        <span className="block text-5xl mb-5 translate-z-20">{icon}</span>
        <h3 className="font-head text-2xl mb-4 translate-z-15">{title}</h3>
        <p className="text-gray-400 translate-z-10">{text}</p>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full">
      
      {/* HERO SLIDER */}
      <div className="relative w-screen h-screen overflow-hidden">
        {/* Slices Generation */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="slice-wrapper absolute top-0 bottom-0 overflow-hidden border-r border-white/5"
            style={{ 
              width: '20%', 
              left: `${i * 20}%`,
              zIndex: 1 
            }}
          >
            {/* Image A (Current) */}
            <div 
              ref={el => imagesARef.current[i] = el}
              className="absolute top-0 h-full w-[500%] bg-cover bg-center"
              style={{ 
                left: `${-i * 100}%`,
                backgroundImage: `url(${slidesData[currentIndex].img})` 
              }}
            />
            {/* Image B (Next) */}
            <div 
              ref={el => imagesBRef.current[i] = el}
              className="absolute top-0 h-full w-[500%] bg-cover bg-center"
              style={{ 
                left: `${-i * 100}%`,
                backgroundImage: `url(${slidesData[(currentIndex + 1) % slidesData.length].img})`,
                transform: `translateY(${i % 2 === 0 ? '100%' : '-100%'})` // Initial hidden state
              }}
            />
          </div>
        ))}

        {/* Content */}
        <div className="absolute bottom-[15%] left-[10%] z-10 pointer-events-none">
          <span ref={subRef} className="block text-accent tracking-[4px] font-bold mb-4">
            {slidesData[currentIndex].sub}
          </span>
          <h1 ref={titleRef} className="font-head text-[clamp(3rem,7vw,9rem)] leading-[0.9] text-transparent uppercase" style={{ WebkitTextStroke: '1px #fff' }}>
            {slidesData[currentIndex].title}
          </h1>
          <div ref={descRef} className="max-w-[500px] mt-5 text-xl text-gray-300 bg-black/60 p-5 border-l-4 border-accent">
            {slidesData[currentIndex].desc}
            <span className="block mt-4 text-accent font-bold tracking-widest text-sm uppercase">
              Safe. Autonomous. On-Demand.
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-12 right-12 flex gap-4 z-20">
          <button onClick={() => changeSlide('prev')} className="w-16 h-16 border border-white/30 rounded-full text-white bg-black/50 hover:bg-accent hover:text-black hover:border-accent transition-all text-xl flex justify-center items-center hover-target">←</button>
          <button onClick={() => changeSlide('next')} className="w-16 h-16 border border-white/30 rounded-full text-white bg-black/50 hover:bg-accent hover:text-black hover:border-accent transition-all text-xl flex justify-center items-center hover-target">→</button>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <section className="py-32 px-[10%] relative border-b border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-head text-[clamp(2rem,4vw,3.5rem)] uppercase mb-5">
              What is <span className="text-accent">ACBFLY</span>?
            </h2>
          </div>
          <div>
            <p className="text-xl text-gray-400 leading-relaxed max-w-[700px]">
              Think of us as a <strong className="text-white">Taxi Service for the Air</strong>.<br/><br/>
              Whether you need to move a camera, a package, or yourself—we provide the aerial vehicle instantly. You don't need a pilot license; you just need our app.
            </p>
            <div className="text-2xl text-white border-l-2 border-accent pl-5 mt-5 italic">
              "Urban mobility, reimagined in the air."
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-32 px-[10%] relative border-b border-white/5">
        <h2 className="font-head text-[clamp(2rem,4vw,3.5rem)] uppercase mb-5">What can we do?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <Card3D icon="📦" title="Instant Delivery" text="Send packages across the city in minutes, soaring above traffic." />
          <Card3D icon="🎥" title="Aerial Filming" text="Rent professional camera drones for events, real estate, or movies." />
          <Card3D icon="🚑" title="Emergency Aid" text="Rapid transport of medical supplies to accident scenes or remote areas." />
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-32 px-[10%] relative border-b border-white/5">
        <h2 className="font-head text-[clamp(2rem,4vw,3.5rem)] uppercase mb-5">How to Use</h2>
        <div className="flex flex-wrap justify-between mt-16 gap-8 relative">
          {[
            { num: "01", title: "Request", text: "Open the app and select your service type." },
            { num: "02", title: "Deploy", text: "An autonomous unit flies to your location instantly." },
            { num: "03", title: "Done", text: "The drone completes the task, and you pay via the app." }
          ].map((step) => (
            <div key={step.num} className="flex-1 min-w-[250px] bg-[#0a0a0a] p-8 border-t-2 border-accent relative hover-target group">
              <span className="text-6xl text-white/5 font-bold absolute top-2 right-5 group-hover:text-accent/10 transition-colors">{step.num}</span>
              <h3 className="font-head text-2xl mb-4">{step.title}</h3>
              <p className="text-gray-400">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-12 px-[10%] bg-black text-center text-gray-600 border-t border-white/10">
        <p>© 2025 ACBFLY. The Future of Urban Air Mobility.</p>
      </footer>
    </div>
  );
};

export default Home;