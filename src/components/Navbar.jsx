import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Safety", path: "/safety" },
    { name: "Service", path: "/service" },
    { name: "Terms", path: "/terms" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 w-full h-20 flex justify-between items-center px-[5%] z-[999] bg-[#050505]/60 backdrop-blur-md border-b border-white/5"
    >
      <Link to="/" className="font-bold text-2xl text-white">
        ACBFLY
      </Link>

      <ul className="hidden md:flex gap-8">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className={`text-sm uppercase ${
                location.pathname === link.path
                  ? "text-accent"
                  : "text-gray-300 hover:text-accent"
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      <div>
        {!user ? (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 border border-accent text-accent text-xs uppercase hover:bg-accent hover:text-black transition"
          >
            Join Waitlist
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <img
              src={user.photoURL}
              alt="profile"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-white text-sm">
              {user.displayName}
            </span>
            <button
              onClick={logout}
              className="text-xs text-red-400 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;