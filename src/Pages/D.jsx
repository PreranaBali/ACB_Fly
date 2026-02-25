import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const LiveTracking = () => {
  const { user } = useAuth();
  const [eta, setEta] = useState(12); 
  const [statusIndex, setStatusIndex] = useState(0);
  const [dronePos, setDronePos] = useState({ lat: 15.4589, lng: 75.0078 });

  const statuses = [
    { label: "Preparing Drone", sub: "Checking rotors and sensors" },
    { label: "Takeoff Successful", sub: "Drone is in the air" },
    { label: "In Transit", sub: "Moving toward your location" },
    { label: "Mission Started", sub: "Work is in progress" }
  ];

  const pilotInfo = {
    name: "Santhosh Kumar",
    phone: "+91 7829806696",
    rating: "4.9 ⭐",
    drone: "ACBFLY-Agri X1"
  };

  // 🔄 Dynamic Simulation Logic
  useEffect(() => {
    const timer = setInterval(() => {
      // Decrease ETA
      setEta((prev) => (prev > 1 ? prev - 1 : 1));
      
      // Progress through statuses based on ETA
      if (eta > 9) setStatusIndex(0);
      else if (eta > 7) setStatusIndex(1);
      else if (eta > 2) setStatusIndex(2);
      else setStatusIndex(3);

      // Simulate Movement on Map
      setDronePos((prev) => ({
        lat: prev.lat + 0.0002,
        lng: prev.lng + 0.0002
      }));
    }, 5000); // Updates every 5 seconds

    return () => clearInterval(timer);
  }, [eta]);

  return (
    <div className="min-h-screen bg-[#020202] text-slate-300 font-sans p-4 pb-32 pt-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');
        
        .tracking-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 2rem;
          padding: 2rem;
          margin-bottom: 1.5rem;
        }

        .pulse-dot {
          width: 10px;
          height: 10px;
          background: #3b82f6;
          border-radius: 50%;
          box-shadow: 0 0 10px #3b82f6;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>

      <div className="max-w-xl mx-auto" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        
        {/* Title Area */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Live Mission</h1>
          <span className="bg-blue-600/20 text-blue-400 text-[10px] px-3 py-1 rounded-full font-bold border border-blue-500/30">ID: ACB-449</span>
        </div>

        {/* 🗺️ DYNAMIC MAP */}
        <div className="w-full h-[35vh] rounded-[2rem] overflow-hidden border border-white/5 mb-6 shadow-2xl relative">
          <iframe
            title="Live Map"
            className="w-full h-full grayscale brightness-[0.7] contrast-[1.2]"
            frameBorder="0"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${dronePos.lng - 0.003}%2C${dronePos.lat - 0.003}%2C${dronePos.lng + 0.003}%2C${dronePos.lat + 0.003}&layer=mapnik&marker=${dronePos.lat}%2C${dronePos.lng}`}
          ></iframe>
          
          {/* Overlay Tag */}
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-2">
            <div className="pulse-dot"></div>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Signal Strength: 98%</span>
          </div>
        </div>

        {/* 🛸 STATUS STEPPER */}
        <div className="tracking-card">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
              <h2 className="text-xl font-bold text-white uppercase">{statuses[statusIndex].label}</h2>
              <p className="text-xs text-slate-500 mt-1">{statuses[statusIndex].sub}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Arrival</p>
              <h2 className="text-3xl font-bold text-blue-500">{eta} <span className="text-xs">MIN</span></h2>
            </div>
          </div>

          {/* Step Progress Bar */}
          <div className="flex gap-2">
            {statuses.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= statusIndex ? 'bg-blue-600 shadow-[0_0_10px_#2563eb]' : 'bg-white/5'}`}
              ></div>
            ))}
          </div>
        </div>

        {/* 👨‍✈️ PILOT CONTACT */}
        <div className="tracking-card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              👨‍✈️
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{pilotInfo.name}</h3>
              <p className="text-[10px] text-slate-500 uppercase">{pilotInfo.drone} • {pilotInfo.rating}</p>
            </div>
            <a 
              href={`tel:${pilotInfo.phone}`}
              className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition-all active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.505 5.505l.773-1.548a1 1 0 011.06-.539l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Support Button */}
        <button className="w-full py-5 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
          Emergency Support
        </button>

      </div>
    </div>
  );
};

export default LiveTracking;