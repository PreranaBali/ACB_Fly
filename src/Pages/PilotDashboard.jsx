import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
// 🚁 Professional Pilot Icon for the Map
const pilotIcon = new L.DivIcon({
  html: `<div style="font-size: 24px; filter: drop-shadow(0 0 8px #3b82f6); background: rgba(59,130,246,0.2); border: 2px solid #3b82f6; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite;">🚁</div>`,
  className: "custom-leaflet-icon",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// 🔥 Map Auto-Centering Hook
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1 });
  }, [center, map]);
  return null;
};

const PilotDashboard = () => {
  // 🔐 Custom Auth State
  const [pilotToken, setPilotToken] = useState(localStorage.getItem("pilotToken"));
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ username: "", password: "", name: "", phone: "", drone_model: "DJI Agras T20" });
  const [authLoading, setAuthLoading] = useState(false);

  // 🚁 Dashboard State
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [viewMode, setViewMode] = useState("available");

  // 📍 Telemetry & Location State
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // ==========================================
  // 📡 LIVE TELEMETRY ENGINE
  // ==========================================
  useEffect(() => {
    // Only track if logged in
    if (!pilotToken) return;

    let watchId;
    if ("geolocation" in navigator) {
      setIsBroadcasting(true);
      watchId = navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentLocation([latitude, longitude]);

          // Ping Backend!
          try {
            await fetch(`${BASE_URL}/api/pilots/telemetry`, {
              method: "PUT",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${pilotToken}` 
              },
              body: JSON.stringify({ 
                lat: latitude, 
                lon: longitude, 
                battery_level: 100 // You can make this dynamic later!
              })
            });
          } catch (err) {
            console.error("Telemetry Ping Failed:", err);
          }
        },
        (err) => {
          console.error("GPS Error:", err);
          setIsBroadcasting(false);
          setStatusMsg({ type: "error", text: "GPS signal lost. Please enable location services." });
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    }

    // Cleanup watcher on unmount or logout
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [pilotToken]);

  // ==========================================
  // 1. AUTHENTICATION HANDLERS
  // ==========================================
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setStatusMsg({ type: "info", text: "Authenticating..." });

    try {
      const endpoint = authMode === "login" 
        ? `${BASE_URL}/api/pilots/login` 
        : `${BASE_URL}/api/pilots/register`;

      const payload = authMode === "login" 
        ? { username: authForm.username, password: authForm.password }
        : authForm;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Authentication failed");

      if (authMode === "register") {
        setStatusMsg({ type: "success", text: "✅ Registered! Please log in." });
        setAuthMode("login");
      } else {
        localStorage.setItem("pilotToken", data.token);
        localStorage.setItem("pilotName", data.name);
        setPilotToken(data.token);
        setStatusMsg({ type: "success", text: `✅ Welcome back, ${data.name}!` });
        setTimeout(() => setStatusMsg({ type: "", text: "" }), 3000);
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: `❌ ${err.message}` });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("pilotToken");
    localStorage.removeItem("pilotName");
    setPilotToken(null);
    setJobs([]);
    setCurrentLocation(null);
    setIsBroadcasting(false);
  };

  // ==========================================
  // 2. DASHBOARD HANDLERS
  // ==========================================
  const fetchJobs = async () => {
    if (!pilotToken) return;
    try {
      setLoading(true);
      const endpoint = viewMode === "available" 
        ? `${BASE_URL}/api/pilots/available-jobs`
        : `${BASE_URL}/api/pilots/my-jobs`;

      const res = await fetch(endpoint, {
        method: "GET",
        headers: { "Authorization": `Bearer ${pilotToken}` },
      });

      if (!res.ok) {
        if (res.status === 401) handleLogout();
        throw new Error("Failed to fetch jobs");
      }
      
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      setStatusMsg({ type: "error", text: `❌ Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pilotToken) fetchJobs();
  }, [pilotToken, viewMode]);

  const acceptJob = async (bookingId) => {
    try {
      setStatusMsg({ type: "info", text: "⏳ Accepting job..." });
      const res = await fetch(`${BASE_URL}/api/pilots/jobs/${bookingId}/accept`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${pilotToken}` },
      });

      if (!res.ok) throw new Error("Failed to accept job");

      setStatusMsg({ type: "success", text: "✅ Job Accepted! Moving to your active jobs." });
      setViewMode("my_jobs");
      setTimeout(() => setStatusMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setStatusMsg({ type: "error", text: `❌ Error: ${err.message}` });
    }
  };

  const updateJobStatus = async (bookingId, newStatus) => {
    try {
      setStatusMsg({ type: "info", text: "⏳ Updating status..." });
      const res = await fetch(`${BASE_URL}/api/pilots/jobs/${bookingId}/status?status=${newStatus}`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${pilotToken}` },
      });

      if (!res.ok) throw new Error("Failed to update status");

      setStatusMsg({ type: "success", text: `✅ Job marked as ${newStatus.replace("_", " ")}!` });
      fetchJobs(); 
      setTimeout(() => setStatusMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setStatusMsg({ type: "error", text: `❌ Error: ${err.message}` });
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "pending": return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      case "Accepted": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "in_progress": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Delivered": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  // ==========================================
  // 3. RENDER UI
  // ==========================================
  return (
    <div className="min-h-screen bg-[#020202] text-slate-300 font-sans p-4 pb-32 relative mt-15">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        .mobile-card { background: rgba(255,255,255,0.02); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); border-radius: 1.5rem; padding: 1.5rem; margin-bottom: 1.25rem; }
        .alert-box { padding: 1rem; border-radius: 0.75rem; margin-bottom: 1.5rem; font-weight: 600; text-align: center; font-size: 0.9rem; border: 1px solid transparent; transition: all 0.3s ease; }
        .alert-success { background: rgba(34, 197, 94, 0.1); color: #4ade80; border-color: rgba(34, 197, 94, 0.3); }
        .alert-error { background: rgba(239, 68, 68, 0.1); color: #f87171; border-color: rgba(239, 68, 68, 0.3); }
        .alert-info { background: rgba(59, 130, 246, 0.1); color: #60a5fa; border-color: rgba(59, 130, 246, 0.3); }
        input, select { background: rgba(255,255,255,0.05); color: white; border-radius: 0.75rem; border: 1px solid rgba(255,255,255,0.1); width: 100%; padding: 0.75rem 1rem; margin-bottom: 1rem; outline: none; }
        input:focus, select:focus { border-color: #60a5fa; }
        .leaflet-container { background: #111; z-index: 10; font-family: 'Space Grotesk', sans-serif; border-radius: 1rem; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); box-shadow: 0 0 12px #3b82f6; } 100% { transform: scale(1); } }
      `}</style>

      <div className="max-w-3xl mx-auto pt-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        
        {statusMsg.text && (
          <div className={`alert-box alert-${statusMsg.type}`}>{statusMsg.text}</div>
        )}

        {!pilotToken ? (
          /* 🛑 LOGIN/REGISTER FORM */
          <div className="mobile-card max-w-md mx-auto mt-10">
            <h1 className="text-3xl font-bold text-white text-center mb-2 uppercase">Pilot Access</h1>
            <p className="text-center text-sm opacity-60 mb-8">
              {authMode === "login" ? "Enter your credentials to link with terminal." : "Register your drone to join the fleet."}
            </p>

            <form onSubmit={handleAuthSubmit}>
              <input type="text" placeholder="Username" required value={authForm.username} onChange={(e) => setAuthForm({...authForm, username: e.target.value})} />
              <input type="password" placeholder="Password" required value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} />

              {authMode === "register" && (
                <>
                  <input type="text" placeholder="Full Name" required value={authForm.name} onChange={(e) => setAuthForm({...authForm, name: e.target.value})} />
                  <input type="tel" placeholder="Phone Number" required value={authForm.phone} onChange={(e) => setAuthForm({...authForm, phone: e.target.value})} />
                  <select value={authForm.drone_model} onChange={(e) => setAuthForm({...authForm, drone_model: e.target.value})}>
                    <option value="DJI Agras T20">DJI Agras T20</option>
                    <option value="DJI Matrice 300 RTK">DJI Matrice 300 RTK</option>
                    <option value="Custom VTOL">Custom VTOL</option>
                  </select>
                </>
              )}

              <button disabled={authLoading} type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold uppercase shadow-lg transition-colors mb-4">
                {authLoading ? "Processing..." : (authMode === "login" ? "Initialize Link" : "Register Drone")}
              </button>
            </form>

            <button onClick={() => setAuthMode(authMode === "login" ? "register" : "login")} className="w-full text-center text-sm text-blue-400 hover:text-blue-300">
              {authMode === "login" ? "New pilot? Register here." : "Already have an account? Log in."}
            </button>
          </div>
        ) : (
          /* 🟢 DASHBOARD */
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white uppercase">Pilot Terminal</h1>
                <p className="text-sm text-blue-400 font-bold mt-1 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isBroadcasting ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                  {isBroadcasting ? "Broadcasting Telemetry" : "GPS Signal Lost"}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={fetchJobs} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">Refresh</button>
                <button onClick={handleLogout} className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500/40 transition">Logout</button>
              </div>
            </div>

            {/* 🗺️ LIVE PILOT MAP */}
            <div className="w-full h-48 rounded-2xl overflow-hidden border border-white/10 mb-6 relative">
              {!currentLocation ? (
                <div className="absolute inset-0 bg-[#111] flex flex-col items-center justify-center z-20">
                  <span className="text-3xl animate-bounce mb-2">🛰️</span>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Acquiring GPS Lock...</p>
                </div>
              ) : (
                <MapContainer center={currentLocation} zoom={15} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                  <MapUpdater center={currentLocation} />
                  <Marker position={currentLocation} icon={pilotIcon}>
                    <Popup>
                      <div className="font-bold text-black text-center text-xs">
                        <p>YOU ARE HERE</p>
                        <p className="text-green-600">Broadcasting Live</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>

            {/* 🎛️ View Toggle Tabs */}
            <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode("available")}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${viewMode === "available" ? "bg-white/10 text-white shadow" : "text-slate-500 hover:text-slate-300"}`}
              >
                📋 Job Board
              </button>
              <button 
                onClick={() => setViewMode("my_jobs")}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${viewMode === "my_jobs" ? "bg-white/10 text-white shadow" : "text-slate-500 hover:text-slate-300"}`}
              >
                🚁 My Missions
              </button>
            </div>

            {/* 📦 JOBS LIST */}
            {loading ? (
              <div className="text-center py-10 opacity-50 animate-pulse">Scanning frequencies...</div>
            ) : jobs.length === 0 ? (
              <div className="mobile-card text-center py-12">
                <span className="text-4xl block mb-4">{viewMode === "available" ? "📡" : "🚁"}</span>
                <h2 className="text-xl text-white font-bold mb-2">
                  {viewMode === "available" ? "No new requests" : "No active assignments"}
                </h2>
                <p className="text-sm opacity-60">
                  {viewMode === "available" ? "Check back soon for new user requests." : "You haven't accepted any jobs yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.booking_id} className="mobile-card flex flex-col">
                    <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                      <div>
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Job ID: {job.booking_id}</p>
                        <h2 className="text-xl text-white font-bold">{job.service_type}</h2>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(job.status)}`}>
                          {job.status.replace("_", " ")}
                        </span>
                        <p className="text-sm font-bold text-emerald-400">₹{job.total_price}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div><p className="text-[10px] opacity-50 uppercase mb-1">Schedule</p><p className="font-bold text-white">{job.date} @ {job.time}</p></div>
                      <div><p className="text-[10px] opacity-50 uppercase mb-1">Workload</p><p className="font-bold text-white">{job.quantity} Units</p></div>
                      <div className="col-span-2"><p className="text-[10px] opacity-50 uppercase mb-1">Location</p><p className="text-slate-300">{job.address}</p></div>
                    </div>

                    <div className="flex gap-3 mt-auto pt-2">
                      {job.location && (
                        <a href={`https://www.google.com/maps/search/?api=1&query=$${job.location.lat},${job.location.lon}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-xs uppercase transition-colors">
                          🗺️ Map
                        </a>
                      )}
                      {viewMode === "available" && <button onClick={() => acceptJob(job.booking_id)} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase shadow-lg transition-colors">⚡ Accept</button>}
                      {viewMode === "my_jobs" && job.status === "Accepted" && <button onClick={() => updateJobStatus(job.booking_id, "in_progress")} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase shadow-lg transition-colors">▶️ Start</button>}
                      {viewMode === "my_jobs" && job.status === "in_progress" && <button onClick={() => updateJobStatus(job.booking_id, "Delivered")} className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-xs uppercase shadow-lg transition-colors">✅ Delivered</button>}
                      {viewMode === "my_jobs" && job.status === "Delivered" && <div className="flex-1 py-3 bg-green-900/30 text-green-500 border border-green-500/20 text-center rounded-xl font-bold text-xs uppercase">🎉 Done</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PilotDashboard;