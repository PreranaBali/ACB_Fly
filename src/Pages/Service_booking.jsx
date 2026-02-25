import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ServiceBooking = () => {
  const { user } = useAuth();
  const [minDate, setMinDate] = useState("");
  const [bookingData, setBookingData] = useState({
    serviceType: "Crop Spraying",
    date: "",
    time: "",
    area: "",
    address: "",
    notes: "",
    paymentMethod: "GPay"
  });
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMinDate(today);
  }, []);

  const triggerMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const openPicker = (e) => {
    try {
      e.target.showPicker();
    } catch (err) {
      e.target.focus();
    }
  };

  const handleAutoLocation = () => {
    if (!navigator.geolocation) {
      triggerMsg("error", "Location not supported.");
      return;
    }
    triggerMsg("success", "Finding your address...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await response.json();
          if (data && data.display_name) {
            setBookingData({ ...bookingData, address: data.display_name });
            triggerMsg("success", "Address found!");
          }
        } catch (error) {
          setBookingData({ ...bookingData, address: `Lat: ${lat}, Long: ${lon}` });
        }
      },
      () => triggerMsg("error", "Please allow location access.")
    );
  };

  return (
    <div className="min-h-screen bg-[#020202] text-slate-300 font-sans p-4 pb-32 md:p-12">
      <style>{`
        /* MOBILE OPTIMIZED STYLES */
        .mobile-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        /* 🎨 ACCESSIBLE DROPDOWN */
        select {
          background-color: #111 !important;
          color: #fff !important;
          width: 100%;
          height: 60px;
          padding: 0 1rem !important;
          font-size: 1rem !important;
          border-radius: 1rem !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          appearance: none;
        }

        select option {
          background-color: #000;
          color: #fff;
        }

        /* ⏰ LARGE TOUCH TARGETS FOR PICKERS */
        input[type="date"], input[type="time"] {
          color-scheme: dark;
          height: 60px;
          font-size: 1rem !important;
        }

        input, textarea {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          padding: 1rem !important;
          width: 100%;
          border-radius: 1rem !important;
        }

        label {
          color: #3b82f6;
          font-weight: 800;
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
          display: block;
        }
      `}</style>

      <div className="max-w-2xl mx-auto">
        {/* Simplified Header for Phone */}
        <div className="mb-8 text-center mt-15">
          <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Book a Drone</h1>
          <p className="text-sm text-slate-400">Easy booking in 3 steps</p>
        </div>

        <form>
          {/* STEP 1 */}
          <div className="mobile-card">
            <h2 className="text-xl text-white font-bold mb-6 flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Service & Time
            </h2>
            
            <div className="space-y-6">
              <div>
                <label>What work do you need?</label>
                <select 
                  value={bookingData.serviceType}
                  onChange={(e) => setBookingData({...bookingData, serviceType: e.target.value})}
                >
                  <optgroup label="🌾 Agriculture">
                    <option value="Crop Spraying">Crop Spraying</option>
                    <option value="Crop Monitoring">Crop Monitoring</option>
                    <option value="Field Mapping">Field Mapping</option>
                    <option value="Seed Spreading">Seed Spreading</option>
                  </optgroup>
                  <optgroup label="🚑 Medical">
                    <option value="Emergency Delivery">Emergency Delivery</option>
                    <option value="Medical Supply Transport">Medicine Transport</option>
                    <option value="Disaster Relief Drop">Disaster Relief Drop</option>
                  </optgroup>
                  <optgroup label="🎥 Events">
                    <option value="Wedding Shoot">Wedding Shoot</option>
                    <option value="Real Estate Shoot">Property Shoot</option>
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Day</label>
                  <input 
                    type="date" 
                    min={minDate}
                    onClick={openPicker}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label>Time</label>
                  <input 
                    type="time" 
                    onClick={openPicker}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="mobile-card">
            <h2 className="text-xl text-white font-bold mb-6 flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Where to work?
            </h2>
            <div className="space-y-4">
              <button 
                type="button"
                onClick={handleAutoLocation}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold active:scale-95 transition-all text-sm"
              >
                📍 Find My Address Now
              </button>
              <textarea 
                rows="3" 
                placeholder="Or type the location..." 
                value={bookingData.address}
                onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
              ></textarea>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="mobile-card">
            <h2 className="text-xl text-white font-bold mb-6 flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Payment
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {['GPay', 'PhonePe', 'Paytm', 'Cash'].map((method) => (
                <div 
                  key={method}
                  onClick={() => setBookingData({...bookingData, paymentMethod: method})}
                  className={`flex items-center justify-center py-4 px-2 rounded-xl border-2 transition-all font-bold text-xs ${
                    bookingData.paymentMethod === method 
                    ? 'border-blue-500 bg-blue-600/20 text-white' 
                    : 'border-white/5 bg-white/5 text-slate-500'
                  }`}
                >
                  {method}
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Bottom Button for Easy Access */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#020202]/80 backdrop-blur-md border-t border-white/10 z-50">
            {message.text && (
              <p className="text-center text-[10px] mb-2 uppercase font-bold text-blue-400">
                {message.text}
              </p>
            )}
            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 text-white rounded-xl text-lg font-bold uppercase shadow-xl active:scale-95"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceBooking;