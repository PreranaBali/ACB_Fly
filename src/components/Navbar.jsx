import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Safety", path: "/safety" },
    { name: "Service & About", path: "/service" },
    { name: "Terms", path: "/terms" },
    { name: "My Bookings", path: "/mybookings" },
    { name: "Book Now", path: "/servicebookings" },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 w-full h-20 flex justify-between items-center px-[5%] z-[999] bg-[#050505]/80 backdrop-blur-xl border-b border-white/5"
    >
      {/* 🚀 Brand Logo */}
      <Link to="/" className="font-black text-2xl text-white tracking-tighter" onClick={closeMenu}>
        ACBFLY
      </Link>

      {/* 💻 Desktop Links */}
      <ul className="hidden lg:flex gap-8">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                location.pathname === link.path ? "text-white" : "text-gray-500 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* 📱 Mobile Menu Toggle & User Section */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <img src={user.photoURL} alt="p" className="w-8 h-8 rounded-full border border-white/10" />
            <button onClick={logout} className="hidden sm:block text-[10px] font-black uppercase text-red-500 hover:text-red-400">
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:block px-5 py-2 border border-white text-white text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all"
          >
            Join Waitlist
          </button>
        )}

        {/* Hamburger Icon */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="lg:hidden flex flex-col gap-1.5 p-2"
        >
          <motion.div animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 7 : 0 }} className="w-6 h-0.5 bg-white" />
          <motion.div animate={{ opacity: isOpen ? 0 : 1 }} className="w-6 h-0.5 bg-white" />
          <motion.div animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -7 : 0 }} className="w-6 h-0.5 bg-white" />
        </button>
      </div>

      {/* 📱 Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "100vh", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-20 left-0 w-full bg-[#050505] z-[-1] overflow-hidden border-b border-white/5"
          >
            <div className="flex flex-col p-10 gap-8 h-full">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * i }}
                  key={link.name}
                >
                  <Link
                    to={link.path}
                    onClick={closeMenu}
                    className={`text-4xl font-black uppercase tracking-tighter ${
                      location.pathname === link.path ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <div className="mt-10 pt-10 border-t border-white/5 space-y-6">
                 {!user ? (
                   <button onClick={() => { navigate("/login"); closeMenu(); }} className="text-xl font-bold uppercase text-white border-b border-white pb-2">Join Waitlist</button>
                 ) : (
                   <button onClick={() => { logout(); closeMenu(); }} className="text-xl font-bold uppercase text-red-500">Sign Out Account</button>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;