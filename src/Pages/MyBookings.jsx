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

  // 🔥 New Filter State
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

  // 🎨 Status Color Helper
  const getStatusBadge = (status) => {
    switch(status) {
      case "pending": return "bg-slate-800 text-slate-400 border-slate-700";
      case "Accepted": return "bg-yellow-900/30 text-yellow-500 border-yellow-700/50";
      case "in_progress": return "bg-blue-900/30 text-blue-400 border-blue-700/50";
      case "Delivered": return "bg-green-900/30 text-green-500 border-green-700/50";
      default: return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  // 🛑 SECURITY CHECK
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 font-sans text-center">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        `}</style>
        <div className="max-w-md w-full bg-[#111] border border-[#222] rounded-xl p-8 shadow-2xl">
          <span className="text-5xl block mb-4">🔒</span>
          <h2 className="text-2xl text-white font-bold mb-2 tracking-tight">Access Denied</h2>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            You must be authenticated to view flight logs, track active dispatches, and manage your Aircab history.
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

  // 🔥 Filter the bookings based on the active tab
  const filteredBookings = bookings.filter((booking) => {
    if (filter === "active") {
      return booking.status !== "Delivered";
    } else {
      return booking.status === "Delivered";
    }
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-300 font-sans p-4 pb-32 mt-15">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        .history-card { background: #111; border: 1px solid #222; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5); transition: all 0.3s ease; }
        .history-card.delivered { opacity: 0.75; border-color: #1a2e1a; background: #0c120c; }
      `}</style>

      <div className="max-w-2xl mx-auto pt-6" style={{ fontFamily: "'Inter', sans-serif" }}>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Flight Logs</h1>
          <button onClick={() => window.location.reload()} className="text-xs bg-[#222] hover:bg-[#333] px-3 py-2 rounded text-white font-bold transition">
            🔄 Refresh
          </button>
        </div>

        {/* 🎛️ TABS FOR FILTERING */}
        <div className="flex gap-2 mb-6 bg-[#111] p-1 rounded-lg border border-[#222]">
          <button 
            onClick={() => setFilter("active")}
            className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${filter === "active" ? "bg-[#222] text-white shadow" : "text-slate-500 hover:text-slate-300"}`}
          >
            Active Missions
          </button>
          <button 
            onClick={() => setFilter("past")}
            className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${filter === "past" ? "bg-[#222] text-white shadow" : "text-slate-500 hover:text-slate-300"}`}
          >
            Past Flights
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-500 p-4 rounded-lg mb-6 text-sm font-bold">
            ❌ {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 opacity-50 animate-pulse">
            <span className="text-3xl block mb-2">📡</span>
            Retrieving flight logs...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="history-card text-center py-12">
            <span className="text-4xl block mb-4 text-slate-600">📭</span>
            <h2 className="text-xl text-white font-bold mb-2">
              {filter === "active" ? "No Active Flights" : "No Past Flights"}
            </h2>
            <p className="text-sm opacity-60">
              {filter === "active" 
                ? "You have no pending or in-progress aircab services." 
                : "You don't have any completed flights yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              // Apply special 'delivered' class if status is Delivered
              <div key={booking.booking_id} className={`history-card ${booking.status === 'Delivered' ? 'delivered' : ''}`}>
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4 border-b border-[#222] pb-4">
                  <div>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-1">{booking.booking_id}</p>
                    <h2 className="text-lg text-white font-bold">{booking.service_type}</h2>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(booking.status)}`}>
                      {booking.status === 'Delivered' ? '✅ Delivered' : booking.status.replace("_", " ")}
                    </span>
                    <p className="text-sm font-bold text-white">₹{booking.total_price}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-[10px] text-[#888] uppercase mb-1 font-semibold">Scheduled For</p>
                    <p className="font-bold text-slate-300">{booking.date} @ {booking.time}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#888] uppercase mb-1 font-semibold">Requirement</p>
                    <p className="font-bold text-slate-300">{booking.quantity} Units</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-[#888] uppercase mb-1 font-semibold">Destination LZ</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{booking.address}</p>
                  </div>
                </div>

                {/* Footer Logic: Show different UI based on completion status */}
                {booking.status === "Delivered" ? (
                   <div className="mt-4 pt-4 border-t border-[#222]/50 text-center">
                     <p className="text-xs text-green-600 font-bold uppercase tracking-widest">
                       Mission Accomplished
                     </p>
                   </div>
                ) : booking.pilot_uid ? (
                  <div className="mt-4 pt-4 border-t border-[#222] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-900/30 border border-blue-500/30 flex items-center justify-center text-xl">
                      🚁
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Assigned Pilot</p>
                      <p className="text-sm font-bold text-white">
                        {booking.pilot_details?.name || booking.pilot_uid}
                      </p>
                      {booking.pilot_details?.phone && (
                        <p className="text-xs text-slate-400">📞 {booking.pilot_details.phone}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-[#222]">
                    <p className="text-xs text-[#888] flex items-center gap-2">
                      <span className="animate-pulse">⏳</span> Searching for nearby pilots...
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