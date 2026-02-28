import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // 🔥 Added navigation hook
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🎨 Professional Aviation Icons (Unchanged)
const lzIcon = new L.DivIcon({
  html: `<div style="font-size: 28px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));">🎯</div>`,
  className: "custom-leaflet-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const availableFleetIcon = new L.DivIcon({
  html: `<div style="font-size: 20px; filter: drop-shadow(0 0 6px #22c55e); background: rgba(34,197,94,0.15); border: 2px solid #22c55e; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">🚁</div>`,
  className: "custom-leaflet-icon",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const busyFleetIcon = new L.DivIcon({
  html: `<div style="font-size: 20px; filter: grayscale(100%) drop-shadow(0 0 6px #f97316); background: rgba(249,115,22,0.15); border: 2px solid #f97316; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; opacity: 1;">🚁</div>`,
  className: "custom-leaflet-icon",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const activeAircabIcon = new L.DivIcon({
  html: `<div style="font-size: 28px; filter: drop-shadow(0 0 12px #ef4444); background: rgba(239,68,68,0.2); border: 2px solid #ef4444; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; animation: pulse 1.5s infinite;">🚁</div>`,
  className: "custom-leaflet-icon",
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

// 🔥 MapUpdater (Unchanged)
const MapUpdater = ({ center, zoomLevel, isFullscreen }) => {
  const map = useMap();
  
  useEffect(() => { 
    if (center) {
      map.flyTo(center, zoomLevel, { duration: 1.5, easeLinearity: 0.25 });
    } 
  }, [center, zoomLevel, map]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();
      if (center) map.setView(center, zoomLevel);
    }, 100);
    return () => clearTimeout(timeout);
  }, [isFullscreen, map, center, zoomLevel]);

  return null;
};

const ServiceBooking = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // 🔥 Initialize navigation
  
  const [minDate, setMinDate] = useState("");
  const [bookingData, setBookingData] = useState({
    serviceType: "Crop Spraying",
    date: "",
    time: "",
    quantity: 0,
    address: "",
    paymentMethod: "Account Billed"
  });
  
  const [totalPrice, setTotalPrice] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const defaultCenter = [20.5937, 78.9629]; 
  const [userLoc, setUserLoc] = useState(null); 
  const [nearbyFleet, setNearbyFleet] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false); 
  
  const [activeFlight, setActiveFlight] = useState(null); 
  const [liveAircabLoc, setLiveAircabLoc] = useState(null); 
  const trackingInterval = useRef(null);

  const priceChart = {
    "Crop Spraying": { rate: 600, unit: "Acres" },
    "Crop Monitoring": { rate: 400, unit: "Acres" },
    "Field Mapping": { rate: 800, unit: "Acres" },
    "Seed Spreading": { rate: 500, unit: "Acres" },
    "Emergency Delivery": { rate: 300, unit: "KM" },
    "Medicine Transport": { rate: 200, unit: "KM" },
    "Disaster Relief Drop": { rate: 400, unit: "KM" },
    "Wedding Shoot": { rate: 4000, unit: "Hours" },
    "Property Shoot": { rate: 3000, unit: "Hours" }
  };

  const fetchLiveFleet = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/pilots/live"); 
      if (!res.ok) return;
      const data = await res.json();
      if (data.pilots && data.pilots.length > 0) {
        setNearbyFleet(data.pilots.map(p => ({ 
          id: p.pilot_id, 
          lat: p.current_location.lat, 
          lon: p.current_location.lon,
          status: p.status 
        })));
      } else {
        setNearbyFleet([]); 
      }
    } catch (err) { console.error("Network Fetch Failed.", err); }
  };

  useEffect(() => {
    // Only fetch fleet and set dates if user is logged in
    if (user) {
      const today = new Date().toISOString().split("T")[0];
      setMinDate(today);
      fetchLiveFleet();
    }
    return () => clearInterval(trackingInterval.current);
  }, [user]);

  useEffect(() => {
    const selectedService = priceChart[bookingData.serviceType];
    setTotalPrice((selectedService && bookingData.quantity > 0) ? selectedService.rate * bookingData.quantity : 0);
  }, [bookingData.serviceType, bookingData.quantity]);

  const establishLandingZone = () => {
    if (!navigator.geolocation) return setStatus({ type: "error", text: "GPS not supported." });
    
    setStatus({ type: "info", text: "Acquiring satellite lock..." });
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;
      setUserLoc({ lat, lon });
      fetchLiveFleet(); 

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await res.json();
        setBookingData(prev => ({ ...prev, address: data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}` }));
        setStatus({ type: "success", text: "Landing Zone Coordinates Verified." });
      } catch (err) {
        setBookingData(prev => ({ ...prev, address: `${lat.toFixed(4)}, ${lon.toFixed(4)}` }));
        setStatus({ type: "success", text: "LZ Coordinates Locked." });
      }
    });
  };

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!userLoc || !bookingData.address) return setStatus({ type: "error", text: "Landing Zone must be established." });
    if (!bookingData.date || !bookingData.time || bookingData.quantity <= 0) return setStatus({ type: "error", text: "Flight parameters incomplete." });

    setProcessing(true);
    setStatus({ type: "info", text: "Transmitting coordinates to dispatch..." });

    try {
      const token = await user.getIdToken();
      const payload = { ...bookingData, totalPrice, lat: userLoc.lat, lon: userLoc.lon };

      const res = await fetch("http://localhost:8000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Dispatch rejected.");
      
      if (data.pilot_uid) {
        setStatus({ type: "success", text: `🚨 AIRCAB ${data.pilot_uid} DISPATCHED TO LZ.` });
        setActiveFlight({ id: data.pilot_uid, eta: data.eta, bookingId: data.booking_id });
        startLiveTracking(data.pilot_uid);
      } else {
        setStatus({ type: "success", text: `✅ Scheduled Flight Logged (ID: ${data.booking_id}). Awaiting Pilot Assignment.` });
        setBookingData({ ...bookingData, date: "", time: "", quantity: 0 });
      }

    } catch (err) {
      setStatus({ type: "error", text: `Dispatch Failed: ${err.message}` });
    } finally {
      setProcessing(false);
    }
  };

  const startLiveTracking = (aircabId) => {
    pollFlightLocation(aircabId);
    trackingInterval.current = setInterval(() => pollFlightLocation(aircabId), 3000);
  };

  const pollFlightLocation = async (aircabId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/pilots/${aircabId}/location`);
      if (res.ok) {
        const data = await res.json();
        setLiveAircabLoc(data.pilot.current_location);
      }
    } catch (err) { console.error("Telemetry lost", err); }
  };

  const currentZoom = activeFlight ? 15 : (userLoc ? 14 : 5);
  const currentCenter = liveAircabLoc || userLoc || defaultCenter;

  // 🛑 SECURITY CHECK: If user is NOT logged in, block access!
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 font-sans text-center">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        `}</style>
        <div className="max-w-md w-full bg-[#111] border border-[#222] rounded-xl p-8 shadow-2xl">
          <span className="text-5xl block mb-4">🔒</span>
          <h2 className="text-2xl text-white font-bold mb-2 tracking-tight">Terminal Locked</h2>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            You must be authenticated to access the dispatch terminal and schedule flight operations.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full px-6 py-3 border border-blue-500 text-blue-400 text-sm font-bold uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-colors rounded-lg"
          >
            Authenticate Now
          </button>
        </div>
      </div>
    );
  }

  // ✅ If user IS logged in, render the main terminal
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-300 font-sans p-4 pb-32">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        .pro-card { background: #111; border: 1px solid #222; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5); }
        input, select { background: #000 !important; color: white !important; border-radius: 0.5rem !important; border: 1px solid #333 !important; width: 100%; padding: 0.75rem 1rem !important; font-family: 'Inter', sans-serif; }
        label { color: #888; font-weight: 600; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; display: block; }
        .alert-box { padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; font-weight: 600; font-size: 0.85rem; border: 1px solid transparent; text-transform: uppercase; letter-spacing: 0.05em; }
        .alert-success { background: rgba(34, 197, 94, 0.1); color: #4ade80; border-color: rgba(34, 197, 94, 0.3); }
        .alert-error { background: rgba(239, 68, 68, 0.1); color: #f87171; border-color: rgba(239, 68, 68, 0.3); }
        .alert-info { background: rgba(59, 130, 246, 0.1); color: #60a5fa; border-color: rgba(59, 130, 246, 0.3); }
        .leaflet-container { background: #e5e5e5; z-index: 10; font-family: 'Inter', sans-serif; }
        .leaflet-popup-content-wrapper { background: #fff; color: #000; font-weight: 600; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); }
        .leaflet-popup-tip { background: #fff; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.15); box-shadow: 0 0 15px #ef4444; } 100% { transform: scale(1); } }
      `}</style>

      <div className="max-w-2xl mx-auto pt-6" style={{ fontFamily: "'Inter', sans-serif" }}>
        <h1 className="text-2xl font-bold text-white tracking-tight mb-4">Aircab Dispatch Terminal</h1>

        {/* Fullscreen Wrapper */}
        <div className={
          isFullscreen 
            ? 'fixed inset-0 z-[9999] w-screen h-[100dvh] bg-[#0a0a0a] m-0 p-0 rounded-none border-none' 
            : `relative w-full overflow-hidden ${activeFlight ? 'h-96' : 'h-64'} rounded-lg border ${activeFlight ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-[#222]'} mb-6`
        }>
          
          <button 
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)} 
            className="absolute top-4 right-4 z-[99999] bg-white text-black px-4 py-2 text-xs font-bold uppercase rounded shadow-lg hover:bg-gray-200 transition-colors"
          >
            {isFullscreen ? "✖ Exit Map" : "⛶ Expand Map"}
          </button>

          {!userLoc && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent pointer-events-none z-20">
               <div className="bg-white/90 shadow-xl backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200 flex items-center gap-3">
                 <span className="animate-pulse text-black">🛰️</span>
                 <p className="text-black font-bold tracking-widest text-xs uppercase">Awaiting Target Coordinates</p>
               </div>
             </div>
          )}
          
          <MapContainer center={defaultCenter} zoom={5} style={{ height: "100%", width: "100%" }} zoomControl={false}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <MapUpdater center={currentCenter} zoomLevel={currentZoom} isFullscreen={isFullscreen} />

            {userLoc && (
              <>
                <Marker position={userLoc} icon={lzIcon} />
                {!activeFlight && <Circle center={userLoc} radius={3000} pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.1, weight: 1 }} />}
              </>
            )}

            {!activeFlight && nearbyFleet.map(aircab => (
              <Marker 
                key={aircab.id} 
                position={[aircab.lat, aircab.lon]} 
                icon={aircab.status === "available" ? availableFleetIcon : busyFleetIcon} 
              >
                <Popup>
                  <div className="text-center font-sans p-1">
                    <p className={`font-bold mb-1 ${aircab.status === 'available' ? 'text-green-600' : 'text-orange-500'}`}>
                      {aircab.id}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                      {aircab.status.replace("_", " ")}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {activeFlight && liveAircabLoc && userLoc && (
              <>
                <Marker position={[liveAircabLoc.lat, liveAircabLoc.lon]} icon={activeAircabIcon} />
                <Polyline positions={[[liveAircabLoc.lat, liveAircabLoc.lon], [userLoc.lat, userLoc.lon]]} color="#ef4444" dashArray="6, 8" weight={3} opacity={0.8} />
              </>
            )}
          </MapContainer>
        </div>

        {status.text && <div className={`alert-box alert-${status.type}`}>{status.text}</div>}

        {activeFlight ? (
          <div className="pro-card border-red-900/50 bg-[#1a0505]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-red-500 font-bold uppercase tracking-widest text-xs mb-1">Flight Status</p>
                <p className="text-2xl text-white font-bold tracking-tight">{activeFlight.id} Inbound</p>
              </div>
              <div className="text-right">
                <p className="text-red-500 font-bold uppercase tracking-widest text-xs mb-1">T-Minus</p>
                <p className="text-3xl text-white font-bold">{activeFlight.eta} <span className="text-lg text-red-400">MIN</span></p>
              </div>
            </div>
            <button onClick={() => window.location.reload()} className="w-full py-3 bg-[#111] border border-red-900/50 text-slate-300 rounded-md text-xs font-bold uppercase hover:bg-[#222] transition-colors">
              Clear Terminal
            </button>
          </div>
        ) : (
          <form onSubmit={handleDispatch}>
            <div className="pro-card">
              <label>Target Landing Zone (LZ)</label>
              <div className="flex gap-2 mb-3">
                <button type="button" onClick={establishLandingZone} className="px-4 py-3 bg-[#222] hover:bg-[#333] text-white rounded-md font-bold text-sm transition shrink-0">
                  🎯 Auto-Locate
                </button>
                <input type="text" placeholder="Coordinates or Address..." value={bookingData.address} readOnly className="opacity-70 cursor-not-allowed" />
              </div>
            </div>

            <div className="pro-card">
              <div className="space-y-4">
                <div>
                  <label>Flight Requirement</label>
                  <select value={bookingData.serviceType} onChange={(e) => setBookingData({...bookingData, serviceType: e.target.value, quantity: 0})}>
                    <optgroup label="🚨 RAPID RESPONSE (AUTO-DISPATCH)">
                      <option value="Emergency Delivery">Emergency Delivery (₹300/KM)</option>
                      <option value="Medicine Transport">Medicine Transport (₹200/KM)</option>
                      <option value="Disaster Relief Drop">Disaster Relief Drop (₹400/KM)</option>
                    </optgroup>
                    <optgroup label="🌾 AGRICULTURAL VTOL">
                      <option value="Crop Spraying">Crop Spraying (₹600/Acre)</option>
                      <option value="Crop Monitoring">Crop Monitoring (₹400/Acre)</option>
                      <option value="Field Mapping">Field Mapping (₹800/Acre)</option>
                      <option value="Seed Spreading">Seed Spreading (₹500/Acre)</option>
                    </optgroup>
                    <optgroup label="🎥 AERIAL MEDIA">
                      <option value="Wedding Shoot">Wedding Shoot (₹4000/Hour)</option>
                      <option value="Property Shoot">Property Shoot (₹3000/Hour)</option>
                    </optgroup>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label>Amount ({priceChart[bookingData.serviceType].unit})</label>
                    <input type="number" placeholder="0" value={bookingData.quantity || ""} onChange={(e) => setBookingData({...bookingData, quantity: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div>
                    <label>Date</label>
                    <input type="date" min={minDate} value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} />
                  </div>
                  <div>
                    <label>Time</label>
                    <input type="time" value={bookingData.time} onChange={(e) => setBookingData({...bookingData, time: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-[#222] z-50">
              <div className="max-w-2xl mx-auto flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-[#888] uppercase font-bold tracking-wider">Est. Flight Cost</p>
                  <p className="text-xl font-bold text-white">₹{totalPrice.toLocaleString()}</p>
                </div>
                <button type="submit" disabled={processing || !userLoc} className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-md font-bold uppercase text-sm tracking-wide disabled:opacity-50 transition">
                  {processing ? "Authorizing..." : "Dispatch Aircab"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ServiceBooking;