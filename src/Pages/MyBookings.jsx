import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; 

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("active"); // 'active' | 'past'

  useEffect(() => {
    const fetchMyBookings = async () => {
      if (!user) {
        setLoading(false);
        return; 
      }
      
      try {
        setLoading(true);
        const token = await user.getIdToken();
        
        const res = await fetch(`${BASE_URL}/api/bookings/my-bookings`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Failed to fetch flight history");
        
        const data = await res.json();
        const sortedBookings = (data.bookings || []).reverse();
        setBookings(sortedBookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [user]);

  // 🎨 Premium Status Badge Helper
  const getStatusBadge = (status) => {
    switch(status) {
      case "pending": return "bg-[#F5F5F5] text-gray-500 border border-gray-200";
      case "Accepted": return "bg-[#111] text-white shadow-md";
      case "in_progress": return "bg-[#EBF4FF] text-[#0052CC] border border-[#BDE0FE]";
      case "Delivered": return "bg-[#F0FFF4] text-[#008A27] border border-[#E0FFE8]";
      default: return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  // 🛑 SECURITY CHECK (Matching the new Dark Premium Login Screen)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        `}</style>
        <div className="w-16 h-16 bg-white rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center mb-6">
          <span className="text-3xl">🚁</span>
        </div>
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-white">Aircab Black</h1>
        <p className="text-gray-400 mb-10 text-center font-medium tracking-wide">Sign in to view your activity.</p>
        <button onClick={() => navigate("/login")} className="w-full max-w-sm bg-white text-[#111] py-4 rounded-2xl font-bold text-lg hover:bg-gray-200 transition active:scale-95 shadow-[0_4px_20px_rgba(255,255,255,0.1)]">
          Sign In
        </button>
      </div>
    );
  }

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "active") {
      return booking.status !== "Delivered";
    } else {
      return booking.status === "Delivered";
    }
  });

  return (
    // Changed pt-10 to pt-28 md:pt-32 to clear the navbar, and added the premium font
    <div className="min-h-screen bg-[#FAFAFA] text-[#111] pb-32 pt-28 md:pt-32" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>

      <div className="max-w-2xl mx-auto px-5 md:px-0">
        
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#111] mb-1">Activity</h1>
            <p className="text-gray-500 font-medium text-sm md:text-base">Your flight history and upcoming requests.</p>
          </div>
          <button onClick={() => window.location.reload()} className="w-12 h-12 bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.05)] text-lg hover:bg-gray-50 transition-colors active:scale-95 border border-gray-100 flex items-center justify-center">
            🔄
          </button>
        </div>

        {/* 🎛️ Premium Segmented Control (Tabs) */}
        <div className="flex bg-gray-200/60 p-1.5 rounded-2xl mb-8">
          <button 
            onClick={() => setFilter("active")}
            className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${filter === "active" ? "bg-white text-[#111] shadow-[0_2px_12px_rgba(0,0,0,0.08)]" : "text-gray-500 hover:text-[#111]"}`}
          >
            Active Requests
          </button>
          <button 
            onClick={() => setFilter("past")}
            className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${filter === "past" ? "bg-white text-[#111] shadow-[0_2px_12px_rgba(0,0,0,0.08)]" : "text-gray-500 hover:text-[#111]"}`}
          >
            Past Flights
          </button>
        </div>

        {error && (
          <div className="bg-[#FFF0F0] border border-[#FFE0E0] text-[#D00000] p-4 rounded-2xl mb-6 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-60">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#111] rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Syncing logs...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-[32px] text-center py-16 px-6 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl block text-gray-400">📭</span>
            </div>
            <h2 className="text-2xl font-extrabold mb-2 tracking-tight text-[#111]">
              {filter === "active" ? "No Active Flights" : "No Past Flights"}
            </h2>
            <p className="text-gray-500 font-medium">
              {filter === "active" 
                ? "You don't have any flights currently in progress." 
                : "Your completed trips will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div 
                key={booking.booking_id} 
                className={`bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 ${booking.status === 'Delivered' ? 'opacity-80 hover:opacity-100' : ''}`}
              >
                
                {/* Header Row */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#F9F9F9] rounded-2xl border border-gray-100 flex items-center justify-center text-2xl shadow-sm">
                      🚁
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight text-[#111]">{booking.service_type}</h2>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {booking.booking_id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black tracking-tight text-[#111]">₹{booking.total_price}</p>
                    <div className="mt-1.5">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide ${getStatusBadge(booking.status)}`}>
                        {booking.status === 'Delivered' ? 'Completed' : booking.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="bg-[#F9F9F9] rounded-2xl p-5 grid grid-cols-2 gap-5 mb-5 border border-gray-50">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1.5">Date & Time</p>
                    <p className="font-bold text-sm text-[#111]">{booking.date} at {booking.time}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1.5">Requirement</p>
                    <p className="font-bold text-sm text-[#111]">{booking.quantity} Units</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1.5">Destination</p>
                    <p className="text-sm font-bold text-[#111] truncate">{booking.address}</p>
                  </div>
                </div>

                {/* Footer Logic: Pilot Info */}
                {booking.status === "Delivered" ? (
                   <div className="pt-2 text-center">
                     <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                       Flight Completed Successfully
                     </p>
                   </div>
                ) : booking.pilot_uid ? (
                  <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#111] flex items-center justify-center text-white text-sm font-bold shadow-md">
                        {booking.pilot_details?.name ? booking.pilot_details.name.charAt(0).toUpperCase() : "P"}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Assigned Pilot</p>
                        <p className="text-sm font-bold text-[#111]">
                          {booking.pilot_details?.name || "Pilot Assigned"}
                        </p>
                      </div>
                    </div>
                    {booking.pilot_details?.phone && (
                      <a href={`tel:${booking.pilot_details.phone}`} className="bg-[#F5F5F5] hover:bg-[#EBEBEB] text-[#111] transition-colors px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                        📞 Contact
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-[#111] rounded-full animate-ping"></div>
                    <p className="text-sm font-bold text-gray-500">
                      Finding a nearby pilot...
                    </p>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyBookings;