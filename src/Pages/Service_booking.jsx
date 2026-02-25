import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ServiceBooking = () => {
  const { user } = useAuth();
  const [minDate, setMinDate] = useState("");
  const [bookingData, setBookingData] = useState({
    serviceType: "Crop Spraying",
    date: "",
    time: "",
    quantity: 0, // Used for Acres, KM, or Hours
    address: "",
    paymentMethod: "GPay"
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 💰 Official Rate Chart based on your provided list
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

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMinDate(today);
  }, []);

  // 🔄 Update Price whenever service or quantity changes
  useEffect(() => {
    const selectedService = priceChart[bookingData.serviceType];
    if (selectedService && bookingData.quantity > 0) {
      setTotalPrice(selectedService.rate * bookingData.quantity);
    } else {
      setTotalPrice(0);
    }
  }, [bookingData.serviceType, bookingData.quantity]);

  const triggerMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const openPicker = (e) => {
    try { e.target.showPicker(); } catch (err) { e.target.focus(); }
  };

  const handleAutoLocation = () => {
    if (!navigator.geolocation) {
      triggerMsg("error", "Location not supported.");
      return;
    }
    triggerMsg("success", "Finding address...");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
        const data = await res.json();
        if (data.display_name) setBookingData({ ...bookingData, address: data.display_name });
      } catch (err) {
        setBookingData({ ...bookingData, address: `Position fixed at Lat: ${pos.coords.latitude.toFixed(4)}` });
      }
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!bookingData.date || !bookingData.time || !bookingData.address || bookingData.quantity <= 0) {
      triggerMsg("error", "Please fill in all details and quantity.");
      return;
    }

    setProcessing(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:8000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...bookingData, totalPrice }),
      });

      if (!res.ok) throw new Error("Could not send booking. Try again.");
      triggerMsg("success", "Booking confirmed! We will contact you soon.");
    } catch (err) {
      triggerMsg("error", err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-slate-300 font-sans p-4 pb-32">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        .mobile-card { background: rgba(255,255,255,0.02); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); border-radius: 1.5rem; padding: 1.5rem; margin-bottom: 1.25rem; }
        input, select, textarea { background: #111 !important; color: white !important; border-radius: 0.75rem !important; border: 1px solid rgba(255,255,255,0.1) !important; width: 100%; padding: 1rem !important; }
        label { color: #60a5fa; font-weight: 700; font-size: 0.7rem; text-transform: uppercase; margin-bottom: 0.5rem; display: block; }
        .price-tag { background: linear-gradient(90deg, #2563eb, #3b82f6); color: white; padding: 1.25rem; border-radius: 1rem; text-align: center; margin-top: 1rem; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3); }
      `}</style>

      <div className="max-w-2xl mx-auto pt-24" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <h1 className="text-3xl font-bold text-white uppercase mb-8">Book a Drone</h1>

        <form onSubmit={handleBooking}>
          {/* STEP 1: JOB & CALCULATION */}
          <div className="mobile-card">
            <h2 className="text-lg text-white font-bold mb-5 flex items-center gap-2">
              <span className="bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">1</span>
              Work Type & Amount
            </h2>
            
            <div className="space-y-5">
              <div>
                <label>What work do you need?</label>
                <select 
                  value={bookingData.serviceType}
                  onChange={(e) => setBookingData({...bookingData, serviceType: e.target.value, quantity: 0})}
                >
                  <optgroup label="🌾 Agriculture">
                    <option value="Crop Spraying">Crop Spraying (₹600/Acre)</option>
                    <option value="Crop Monitoring">Crop Monitoring (₹400/Acre)</option>
                    <option value="Field Mapping">Field Mapping (₹800/Acre)</option>
                    <option value="Seed Spreading">Seed Spreading (₹500/Acre)</option>
                  </optgroup>
                  <optgroup label="🚑 Medical">
                    <option value="Emergency Delivery">Emergency Delivery (₹300/KM)</option>
                    <option value="Medicine Transport">Medicine Transport (₹200/KM)</option>
                    <option value="Disaster Relief Drop">Disaster Relief Drop (₹400/KM)</option>
                  </optgroup>
                  <optgroup label="🎥 Events">
                    <option value="Wedding Shoot">Wedding Shoot (₹4000/Hour)</option>
                    <option value="Property Shoot">Property Shoot (₹3000/Hour)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label>How many {priceChart[bookingData.serviceType].unit}?</label>
                <input 
                  type="number" 
                  placeholder={`Enter total ${priceChart[bookingData.serviceType].unit}`}
                  value={bookingData.quantity || ""}
                  onChange={(e) => setBookingData({...bookingData, quantity: parseFloat(e.target.value) || 0})}
                />
              </div>

              {totalPrice > 0 && (
                <div className="price-tag">
                  <p className="text-[10px] uppercase font-bold opacity-80">Estimated Bill</p>
                  <p className="text-2xl font-bold">₹{totalPrice.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: TIME & DATE */}
          <div className="mobile-card">
             <div className="grid grid-cols-2 gap-3">
                <div onClick={openPicker}>
                  <label>Day</label>
                  <input type="date" min={minDate} className="text-sm" onChange={(e) => setBookingData({...bookingData, date: e.target.value})} required />
                </div>
                <div onClick={openPicker}>
                  <label>Time</label>
                  <input type="time" className="text-sm" onChange={(e) => setBookingData({...bookingData, time: e.target.value})} required />
                </div>
              </div>
          </div>

          {/* STEP 3: LOCATION */}
          <div className="mobile-card">
            <h2 className="text-lg text-white font-bold mb-5 flex items-center gap-2">
              <span className="bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">2</span>
              Where is the work?
            </h2>
            <button type="button" onClick={handleAutoLocation} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold mb-4 shadow-lg active:scale-95">📍 GET MY ADDRESS</button>
            <textarea placeholder="Tell us where to come..." value={bookingData.address} onChange={(e) => setBookingData({...bookingData, address: e.target.value})} required></textarea>
          </div>

          {/* Sticky Bottom Summary Bar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#020202]/95 backdrop-blur-lg border-t border-white/10 z-50">
            <div className="max-w-2xl mx-auto flex justify-between items-center">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Total Payable</p>
                <p className="text-xl font-bold text-white">₹{totalPrice.toLocaleString()}</p>
              </div>
              <button 
                type="submit" 
                disabled={processing}
                className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold uppercase text-xs shadow-xl active:scale-95 disabled:opacity-50"
              >
                {processing ? "Sending..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceBooking;