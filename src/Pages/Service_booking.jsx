import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// 🚗 Enhanced Minimalist Markers
const userLocIcon = new L.DivIcon({
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px;">
      <div style="position: absolute; width: 100%; height: 100%; background: rgba(0,0,0,0.15); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="background: #000; width: 14px; height: 14px; border: 2.5px solid #fff; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3); z-index: 10;"></div>
    </div>
  `,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const availableFleetIcon = new L.DivIcon({
  html: `<div style="background: #fff; border-radius: 50%; padding: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); font-size: 18px; text-align: center; border: 1px solid #f3f4f6; transition: transform 0.2s;">🚁</div>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const activeAircabIcon = new L.DivIcon({
  html: `<div style="background: #000; color: #fff; border-radius: 50%; padding: 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.3); font-size: 22px; text-align: center;">🚁</div>`,
  className: "",
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const MapUpdater = ({ center, zoomLevel }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoomLevel, { duration: 1.2, easeLinearity: 0.25 });
  }, [center, zoomLevel, map]);
  return null;
};

const ServiceBooking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
  
  const [activeFlight, setActiveFlight] = useState(null); 
  const [liveAircabLoc, setLiveAircabLoc] = useState(null); 
  const trackingInterval = useRef(null);

  // 🟢 State for Top Panel
  const [showTopPanel, setShowTopPanel] = useState(false);

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
      const res = await fetch(`${BASE_URL}/api/pilots/live`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.pilots) {
        setNearbyFleet(data.pilots.map(p => ({ 
          id: p.pilot_id, lat: p.current_location.lat, lon: p.current_location.lon, status: p.status 
        })));
      }
    } catch (err) { console.error("Fleet fetch failed.", err); }
  };

  useEffect(() => {
    if (user) {
      setMinDate(new Date().toISOString().split("T")[0]);
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
    
    setStatus({ type: "info", text: "Locating..." });
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;
      handleLocationSelect(lat, lon);
    });
  };

  // 🟢 Shared function to handle location setting
  const handleLocationSelect = async (lat, lon) => {
    setUserLoc({ lat, lon });
    setShowTopPanel(true); // 🟢 Slide down the panel
    fetchLiveFleet(); 

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      const shortAddress = data.display_name.split(",").slice(0, 3).join(", ");
      setBookingData(prev => ({ ...prev, address: shortAddress || `${lat.toFixed(4)}, ${lon.toFixed(4)}` }));
      setStatus({ type: "", text: "" });
    } catch (err) {
      setBookingData(prev => ({ ...prev, address: `${lat.toFixed(4)}, ${lon.toFixed(4)}` }));
      setStatus({ type: "", text: "" });
    }
  };

  // 🟢 Component to capture Map Clicks
  const MapEventsHandler = () => {
    useMapEvents({
      click(e) {
        handleLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!userLoc || !bookingData.address) return setStatus({ type: "error", text: "Please establish a pickup location." });
    if (!bookingData.date || !bookingData.time || bookingData.quantity <= 0) return setStatus({ type: "error", text: "Please fill all flight details." });

    setProcessing(true);

    try {
      const token = await user.getIdToken();
      const payload = { ...bookingData, totalPrice, lat: userLoc.lat, lon: userLoc.lon };

      const res = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Booking failed.");
      
      if (data.pilot_uid) {
        setStatus({ type: "", text: "" });
        setActiveFlight({ id: data.pilot_uid, eta: data.eta, bookingId: data.booking_id });
        startLiveTracking(data.pilot_uid);
      } else {
        setStatus({ type: "success", text: "Flight scheduled. Awaiting pilot assignment." });
        setBookingData({ ...bookingData, date: "", time: "", quantity: 0 });
      }
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const startLiveTracking = (aircabId) => {
    trackingInterval.current = setInterval(async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/pilots/${aircabId}/location`);
        if (res.ok) {
          const data = await res.json();
          setLiveAircabLoc(data.pilot.current_location);
        }
      } catch (err) { console.error("Telemetry lost", err); }
    }, 3000);
  };

  const currentZoom = activeFlight ? 15 : (userLoc ? 14 : 5);
  const currentCenter = liveAircabLoc || userLoc || defaultCenter;

  const isLocating = status.text === "Locating...";

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans text-center">
        <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase">Aircab Black</h1>
        <p className="text-gray-400 mb-8 max-w-xs font-medium">Premium terminal access is restricted to verified members.</p>
        <button onClick={() => navigate("/login")} className="w-full max-w-sm bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition shadow-xl active:scale-95">
          Initialize Login
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] w-full bg-gray-100 font-sans overflow-hidden">
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>

      {/* 🟢 TOP PANEL: Sliding Logic Fixed with z-[9999] and fixed position */}
      <div 
        className={`fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-gray-100 shadow-2xl p-6 transition-transform duration-500 ease-in-out transform ${showTopPanel ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1 block">Deployment Zone</span>
            <p className="text-sm font-extrabold text-black truncate max-w-[200px] md:max-w-xs">{bookingData.address || "Selecting Location..."}</p>
          </div>
          <button 
            onClick={() => setShowTopPanel(false)}
            className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 active:scale-95 transition-all shadow-lg"
          >
            Confirm
          </button>
        </div>
      </div>

      {/* 🗺️ LAYER 1: Full-Bleed Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer center={defaultCenter} zoom={5} className="h-full w-full" zoomControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          <MapUpdater center={currentCenter} zoomLevel={currentZoom} />
          <MapEventsHandler />

          {userLoc && (
            <>
              <Marker position={userLoc} icon={userLocIcon} />
              {!activeFlight && <Circle center={userLoc} radius={1500} pathOptions={{ color: '#000', fillColor: '#000', fillOpacity: 0.03, weight: 1 }} />}
            </>
          )}

          {!activeFlight && nearbyFleet.map(aircab => (
            <Marker key={aircab.id} position={[aircab.lat, aircab.lon]} icon={availableFleetIcon} />
          ))}

          {activeFlight && liveAircabLoc && userLoc && (
            <>
              <Marker position={[liveAircabLoc.lat, liveAircabLoc.lon]} icon={activeAircabIcon} />
              <Polyline positions={[[liveAircabLoc.lat, liveAircabLoc.lon], [userLoc.lat, userLoc.lon]]} color="#000" weight={3} dashArray="6, 8" opacity={0.7} />
            </>
          )}
        </MapContainer>
      </div>

      {/* 🔍 LAYER 2: Floating Search Bar */}
      <div className="absolute top-24 left-4 right-4 z-[500] max-w-md mx-auto">
        <div 
          onClick={establishLandingZone}
          className="bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-4 flex items-center gap-3 cursor-pointer border border-gray-100 transition-all hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] active:scale-[0.98]"
        >
          <div className={`w-3 h-3 rounded-full shadow-sm flex-shrink-0 transition-colors duration-300 ${isLocating ? 'bg-blue-500 animate-pulse' : 'bg-black'}`}></div>
          <p className={`font-semibold truncate flex-1 text-sm ${bookingData.address && !isLocating ? 'text-black' : 'text-gray-400'}`}>
            {isLocating ? "Syncing Satellites..." : (bookingData.address || "Where is the LZ?")}
          </p>
          <div className="bg-gray-50 border border-gray-100 p-2 rounded-full flex-shrink-0 px-3">
            <span className="text-[10px] text-black font-black uppercase tracking-widest">📍 Locate</span>
          </div>
        </div>
      </div>

      {/* 📱 LAYER 3: Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-[500] bg-white rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.1)] pb-10 pt-4 px-6 max-w-md mx-auto">
        <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8"></div>

        {status.text && !isLocating && (
          <div className={`mb-6 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center border ${status.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
            {status.text}
          </div>
        )}

        {activeFlight ? (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b border-gray-50 pb-6">
              <div>
                <h3 className="text-2xl font-black text-black tracking-tighter uppercase">{activeFlight.id}</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Intercept in Progress</p>
              </div>
              <div className="bg-black rounded-2xl p-5 text-center shadow-xl">
                <span className="block text-3xl font-black text-white leading-none">{activeFlight.eta}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1 block">MIN</span>
              </div>
            </div>
            <button onClick={() => window.location.reload()} className="w-full py-5 bg-gray-100 text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors">
              Abort Mission
            </button>
          </div>
        ) : (
          <form onSubmit={handleDispatch} className="space-y-4">
            <div className="relative bg-gray-50 rounded-2xl border border-gray-100 focus-within:border-black transition-all">
              <select 
                value={bookingData.serviceType} 
                onChange={(e) => setBookingData({...bookingData, serviceType: e.target.value, quantity: 0})}
                className="w-full bg-transparent text-black font-extrabold p-4 pr-10 outline-none appearance-none cursor-pointer uppercase text-xs tracking-widest"
              >
                <optgroup label="🌾 Agriculture">
                  <option value="Crop Spraying">Crop Spraying</option>
                  <option value="Crop Monitoring">Crop Monitoring</option>
                  <option value="Field Mapping">Field Mapping</option>
                </optgroup>
                <optgroup label="🚨 Rapid Response">
                  <option value="Emergency Delivery">Emergency Delivery</option>
                  <option value="Medicine Transport">Medicine Transport</option>
                </optgroup>
                <optgroup label="🎥 Media">
                   <option value="Wedding Shoot">Wedding Shoot</option>
                </optgroup>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[8px]">▼</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-3">
                <label className="text-[8px] uppercase font-black text-gray-400 block mb-1">{priceChart[bookingData.serviceType].unit}</label>
                <input type="number" placeholder="0" value={bookingData.quantity || ""} onChange={(e) => setBookingData({...bookingData, quantity: parseFloat(e.target.value) || 0})} className="w-full bg-transparent text-black font-black outline-none text-sm" />
              </div>
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-3">
                <label className="text-[8px] uppercase font-black text-gray-400 block mb-1">Date</label>
                <input type="date" min={minDate} value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} className="w-full bg-transparent text-black font-black outline-none text-[10px]" />
              </div>
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-3">
                <label className="text-[8px] uppercase font-black text-gray-400 block mb-1">Time</label>
                <input type="time" value={bookingData.time} onChange={(e) => setBookingData({...bookingData, time: e.target.value})} className="w-full bg-transparent text-black font-black outline-none text-xs" />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex flex-col flex-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Est. Premium</span>
                <span className="text-2xl font-black text-black tracking-tighter">₹{totalPrice.toLocaleString()}</span>
              </div>
              <button 
                type="submit" 
                disabled={processing || !userLoc} 
                className="flex-[1.5] py-5 bg-black text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl active:scale-95 disabled:bg-gray-100 disabled:text-gray-300 transition-all"
              >
                {processing ? "Linking..." : "Dispatch"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ServiceBooking;