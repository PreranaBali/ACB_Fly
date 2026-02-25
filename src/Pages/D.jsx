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

  useEffect(() => {
    const timer = setInterval(() => {
      setEta((prev) => (prev > 1 ? prev - 1 : 1));
      if (eta > 9) setStatusIndex(0);
      else if (eta > 7) setStatusIndex(1);
      else if (eta > 2) setStatusIndex(2);
      else setStatusIndex(3);

      setDronePos((prev) => ({
        lat: prev.lat + 0.0002,
        lng: prev.lng + 0.0002
      }));
    }, 5000);

    return () => clearInterval(timer);
  }, [eta]);

  return (
    <div className="min-h-screen bg-[#020202] text-slate-300 font-sans overflow-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');
        
        .glass-overlay {
          background: rgba(10, 10, 10, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 2.5rem;
          padding: 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .pulse-dot {
          width: 14px;
          height: 14px;
          background: #3b82f6;
          border-radius: 50%;
          box-shadow: 0 0 15px #3b82f6;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }

        .map-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          filter: grayscale(1) brightness(0.4) contrast(1.2);
        }

        .content-layer {
          position: relative;
          z-index: 10;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 5%;
        }
      `}</style>

      {/* 🗺️ IMMERSIVE BACKGROUND MAP */}
      <div className="map-bg">
        <iframe
          title="Live Map"
          className="w-full h-full"
          frameBorder="0"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${dronePos.lng - 0.01}%2C${dronePos.lat - 0.01}%2C${dronePos.lng + 0.01}%2C${dronePos.lat + 0.01}&layer=mapnik&marker=${dronePos.lat}%2C${dronePos.lng}`}
        ></iframe>
      </div>

      <div className="content-layer">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          
          {/* Left Column: Status and Identity */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-6 mb-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter">Live Mission</h1>
              <span className="bg-blue-600 text-white text-xs px-5 py-2 rounded-full font-bold tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)]">ID: ACB-449</span>
            </div>

            <div className="glass-overlay">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-blue-500 text-xs font-bold uppercase tracking-[0.3em] mb-3">System Status</p>
                  <h2 className="text-4xl font-bold text-white uppercase mb-2">{statuses[statusIndex].label}</h2>
                  <p className="text-lg text-slate-400 font-medium">{statuses[statusIndex].sub}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-3">Est. Arrival</p>
                  <h2 className="text-6xl font-bold text-blue-500 tracking-tighter">{eta} <span className="text-xl">MIN</span></h2>
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="flex gap-4 h-3">
                {statuses.map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-full transition-all duration-1000 ${i <= statusIndex ? 'bg-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.6)]' : 'bg-white/10'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pilot and Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-overlay">
              <div className="flex items-center gap-8 mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-400 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-2xl">
                  👨‍✈️
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-1">{pilotInfo.name}</h3>
                  <p className="text-sm text-blue-400 font-bold uppercase tracking-widest">{pilotInfo.drone}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-orange-400 text-lg">{pilotInfo.rating}</span>
                    <span className="text-slate-500 text-xs uppercase font-bold tracking-widest border-l border-white/10 pl-2">Certified Pilot</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <a 
                  href={`tel:${pilotInfo.phone}`}
                  className="flex-1 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl font-bold uppercase tracking-widest text-xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.505 5.505l.773-1.548a1 1 0 011.06-.539l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Contact Pilot
                </a>
              </div>
            </div>

            <button className="w-full py-6 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl text-xs font-bold uppercase tracking-[0.4em] transition-all backdrop-blur-md">
              Emergency Mission Abort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;