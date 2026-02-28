import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const PilotDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  // 🔄 Fetch Pilot Jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = await user.getIdToken();
      
      const res = await fetch("http://localhost:8000/api/pilots/my-jobs", {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}` 
        },
      });

      if (!res.ok) throw new Error("Failed to fetch jobs");
      
      const data = await res.json();
      setJobs(data.jobs);
    } catch (err) {
      setStatusMsg({ type: "error", text: `❌ Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  // 🚀 Update Job Status
  const updateJobStatus = async (bookingId, newStatus) => {
    try {
      setStatusMsg({ type: "info", text: "⏳ Updating status..." });
      const token = await user.getIdToken();
      
      // Note: FastAPI expects status as a query parameter based on our backend code
      const res = await fetch(`http://localhost:8000/api/pilots/jobs/${bookingId}/status?status=${newStatus}`, {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${token}` 
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to update status");
      }

      setStatusMsg({ type: "success", text: `✅ Job marked as ${newStatus.replace("_", " ")}!` });
      
      // Refresh the job list to show the updated status
      fetchJobs();
      
      // Clear message after 3 seconds
      setTimeout(() => setStatusMsg({ type: "", text: "" }), 3000);
      
    } catch (err) {
      setStatusMsg({ type: "error", text: `❌ Error: ${err.message}` });
    }
  };

  // 🎨 Status Color Helper
  const getStatusBadge = (status) => {
    switch(status) {
      case "assigned": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "in_progress": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-slate-300 font-sans p-4 pb-32 relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        .mobile-card { background: rgba(255,255,255,0.02); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); border-radius: 1.5rem; padding: 1.5rem; margin-bottom: 1.25rem; }
        .alert-box { padding: 1rem; border-radius: 0.75rem; margin-bottom: 1.5rem; font-weight: 600; text-align: center; font-size: 0.9rem; border: 1px solid transparent; transition: all 0.3s ease; }
        .alert-success { background: rgba(34, 197, 94, 0.1); color: #4ade80; border-color: rgba(34, 197, 94, 0.3); }
        .alert-error { background: rgba(239, 68, 68, 0.1); color: #f87171; border-color: rgba(239, 68, 68, 0.3); }
        .alert-info { background: rgba(59, 130, 246, 0.1); color: #60a5fa; border-color: rgba(59, 130, 246, 0.3); }
      `}</style>

      <div className="max-w-3xl mx-auto pt-12" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white uppercase">Pilot Terminal</h1>
          <button onClick={fetchJobs} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
            🔄
          </button>
        </div>

        {statusMsg.text && (
          <div className={`alert-box alert-${statusMsg.type}`}>
            {statusMsg.text}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 opacity-50 animate-pulse">Scanning for assigned jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="mobile-card text-center py-12">
            <span className="text-4xl block mb-4">🚁</span>
            <h2 className="text-xl text-white font-bold mb-2">No active assignments</h2>
            <p className="text-sm opacity-60">You have no jobs scheduled at the moment. Take a break!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.booking_id} className="mobile-card">
                
                {/* Header: ID & Status */}
                <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Job ID: {job.booking_id}</p>
                    <h2 className="text-xl text-white font-bold">{job.service_type}</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(job.status)}`}>
                    {job.status.replace("_", " ")}
                  </span>
                </div>

                {/* Body: Details */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="text-[10px] opacity-50 uppercase mb-1">Schedule</p>
                    <p className="font-bold text-white">{job.date} @ {job.time}</p>
                  </div>
                  <div>
                    <p className="text-[10px] opacity-50 uppercase mb-1">Workload</p>
                    <p className="font-bold text-white">{job.quantity} Units</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] opacity-50 uppercase mb-1">Location</p>
                    <p className="text-slate-300">{job.address}</p>
                  </div>
                </div>

                {/* Footer: Actions */}
                <div className="flex gap-3 mt-2">
                  {/* Open Maps using the coordinates saved in DB */}
                  {job.location && (
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${job.location.lat},${job.location.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-xs uppercase transition-colors"
                    >
                      🗺️ Navigate
                    </a>
                  )}

                  {/* Dynamic Action Button based on Status */}
                  {job.status === "assigned" && (
                    <button 
                      onClick={() => updateJobStatus(job.booking_id, "in_progress")}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase shadow-lg transition-colors"
                    >
                      ▶️ Start Job
                    </button>
                  )}
                  
                  {job.status === "in_progress" && (
                    <button 
                      onClick={() => updateJobStatus(job.booking_id, "completed")}
                      className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-xs uppercase shadow-lg transition-colors"
                    >
                      ✅ Complete
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default PilotDashboard;