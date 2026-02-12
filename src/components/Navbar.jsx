import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Safety', path: '/safety' },
    { name: 'Service', path: '/service' },
    { name: 'Terms', path: '/terms' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] }}
      className="fixed top-0 left-0 w-full h-20 flex justify-between items-center px-[5%] z-[999] bg-[#050505]/60 backdrop-blur-md border-b border-white/5"
    >
      <Link to="/" className="font-head font-bold text-2xl tracking-[2px] text-white hover-target">
        ACBFLY
      </Link>

      <ul className="hidden md:flex gap-8 list-none">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link 
              to={link.path} 
              className={`text-sm uppercase transition-colors duration-300 hover-target ${location.pathname === link.path ? 'text-accent' : 'text-gray-300 hover:text-accent'}`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      <div>
        <button className="px-6 py-3 bg-transparent border border-accent text-accent font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:bg-accent hover:text-black hover-target">
          Join Waitlist
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;