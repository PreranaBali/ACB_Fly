import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Cursor = () => {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    
    // Initial hide until mouse moves
    gsap.set(cursor, { xPercent: -50, yPercent: -50, scale: 0 });

    const moveCursor = (e) => {
      gsap.to(cursor, { 
        x: e.clientX, 
        y: e.clientY, 
        scale: 1,
        duration: 0.2, 
        ease: 'power2.out' 
      });
    };

    const checkHover = (e) => {
      // Check interactive elements (buttons, links, inputs, etc.)
      const target = e.target;
      const isInteractive = target.closest(`
        a, 
        button, 
        .hover-target, 
        input, 
        textarea, 
        select, 
        label, 
        [role="button"]
      `);

      const isPointer = window.getComputedStyle(target).cursor === 'pointer';

      if (isInteractive || isPointer) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', checkHover);
    window.addEventListener('mouseout', checkHover);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', checkHover);
      window.removeEventListener('mouseout', checkHover);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block mix-blend-difference"
    >
      <div className="relative flex justify-center items-center">
        
        {/* Center Dot */}
        <div className={`w-2 h-2 bg-[#00ffcc] rounded-full absolute z-10 shadow-[0_0_10px_#00ffcc] transition-transform duration-300 ${isHovering ? 'scale-50' : 'scale-100'}`}></div>

        {/* Vertical Line - Increased height to 200vh */}
        <div className="absolute w-[1px] h-[200vh] bg-[#00ffcc]/50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

        {/* Horizontal Line - Increased width to 200vw */}
        <div className="absolute w-[200vw] h-[1px] bg-[#00ffcc]/50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

        {/* TARGET BRACKETS */}
        <div className={`absolute w-10 h-10 border border-[#00ffcc] transition-all duration-300 ease-out
          ${isHovering ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-150 rotate-45'}`}
        ></div>

      </div>
    </div>
  );
};

export default Cursor;