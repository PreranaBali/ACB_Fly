import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [location, setLocation] = useState(null);
  const [localPaymentMethods, setLocalPaymentMethods] = useState([]);
  const [paymentInput, setPaymentInput] = useState({ type: "CARD", provider: "", last4: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const triggerMessage = (setter, msg) => {
    setter(msg);
    setTimeout(() => setter(null), 4000);
  };

  const getToken = async () => await user.getIdToken();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const res = await fetch("http://localhost:8000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Connection Failure");
        const data = await res.json();
        setProfile(data);
        setFormData({ name: data.name || "", phone: data.phone || "" });
        setLocation(data.location || null);
        setLocalPaymentMethods(data.paymentMethods || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleGetLocationLocal = (e) => {
    e.preventDefault(); 
    if (!navigator.geolocation) {
      triggerMessage(setError, "Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          type: "Point",
          coordinates: [pos.coords.longitude, pos.coords.latitude],
        });
        triggerMessage(setSuccess, "Target coordinates locked.");
      },
      () => triggerMessage(setError, "Geolocation access denied."),
      { enableHighAccuracy: true }
    );
  };

  const handleAddPaymentLocal = () => {
    // VALIDATION: Check Provider and Last 4 digits (exactly 4 digits)
    if (!paymentInput.provider) {
      triggerMessage(setError, "Provider name required.");
      return;
    }
    if (!/^\d{4}$/.test(paymentInput.last4)) {
      triggerMessage(setError, "PIN/Last4 must be exactly 4 digits.");
      return;
    }

    setLocalPaymentMethods([...localPaymentMethods, paymentInput]);
    setPaymentInput({ type: "CARD", provider: "", last4: "" });
  };

  const handleRemovePaymentLocal = (index) => {
    setLocalPaymentMethods(localPaymentMethods.filter((_, i) => i !== index));
  };

  const saveAllChanges = async () => {
    // VALIDATION: Mobile number (basic 10-digit check)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      triggerMessage(setError, "Invalid mobile number sequence.");
      return;
    }

    // VALIDATION: Email (already in profile, but checking validity before sync)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (profile?.email && !emailRegex.test(profile.email)) {
      triggerMessage(setError, "Profile email link corrupted.");
      return;
    }

    setSaving(true);
    try {
      const token = await getToken();
      const payload = {
        name: formData.name,
        phone: formData.phone,
        location,
        paymentMethods: localPaymentMethods,
      };
      const res = await fetch("http://localhost:8000/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Sync failed.");
      setProfile({ ...profile, ...payload });
      triggerMessage(setSuccess, "System Synchronized.");
    } catch (err) {
      triggerMessage(setError, err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-24 h-1 bg-blue-500 animate-pulse rounded-full shadow-[0_0_15px_blue]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020202] text-slate-300 font-sans selection:bg-blue-600 selection:text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');`}</style>

      {/* 🗺️ LOCATION SECTION */}
      <div className="relative h-[60vh] w-full border-b border-blue-500/20 overflow-hidden bg-slate-900 pt-16">
        {location ? (
          <div className="relative w-full h-full z-10">
             <iframe
              title="Immersive Map"
              className="w-full h-full opacity-100" 
              frameBorder="0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.coordinates[0] - 0.01}%2C${location.coordinates[1] - 0.01}%2C${location.coordinates[0] + 0.01}%2C${location.coordinates[1] + 0.01}&layer=mapnik&marker=${location.coordinates[1]}%2C${location.coordinates[0]}`}
            />
            <div className="absolute top-10 left-6 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 z-20 pointer-events-none">
               <div className="flex gap-4">
                  <div>
                    <span className="text-[8px] text-blue-400 block tracking-widest uppercase">Longitude</span>
                    <span className="text-white font-mono text-xs">{location.coordinates[0].toFixed(6)}</span>
                  </div>
                  <div className="w-px h-6 bg-white/10"></div>
                  <div>
                    <span className="text-[8px] text-blue-400 block tracking-widest uppercase">Latitude</span>
                    <span className="text-white font-mono text-xs">{location.coordinates[1].toFixed(6)}</span>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 z-10">
            <div className="w-16 h-16 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-blue-500 animate-pulse">Establishing Signal...</p>
          </div>
        )}
        
        <div className="absolute top-20 right-6 flex flex-col items-end gap-3 z-50">
          {success && <div className="bg-blue-600 text-white text-[10px] font-bold px-4 py-2 rounded shadow-lg">{success}</div>}
          {error && <div className="bg-red-600 text-white text-[10px] font-bold px-4 py-2 rounded shadow-lg">{error}</div>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-20 relative z-30 pb-20" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-12">
          <img
            src={profile?.photoURL ? profile.photoURL : user?.photoURL && !user.photoURL.includes("googleusercontent") ? user.photoURL : "/images/prerana.png"}
            alt="Profile"
            className="w-32 h-32 md:w-44 md:h-44 rounded-xl object-cover"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase mb-2">
              {formData.name || "UNREGISTERED"}
            </h1>
            <p className="text-blue-500 tracking-[0.2em] text-[10px] font-semibold uppercase">{profile?.email} </p>
          </div>
          
          <button 
            onClick={handleGetLocationLocal}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold transition-all shadow-xl active:scale-95 z-40"
          >
            Relocate Signal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-8 rounded-[2rem]">
            <span className="text-[10px] uppercase tracking-[0.2em] text-blue-500 block mb-6 font-bold">Identity Node</span>
            <div className="space-y-6">
              <div>
                <label className="text-[9px] text-slate-500 uppercase block mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 uppercase block mb-1">Phone No</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-8 rounded-[2rem]">
            <span className="text-[10px] uppercase tracking-[0.2em] text-blue-500 block mb-6 font-bold">Finance Module</span>
            <div className="space-y-3 mb-6 max-h-40 overflow-y-auto custom-scrollbar">
              {localPaymentMethods.map((p, i) => (
                <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-bold uppercase">{p.provider} •••• {p.last4}</span>
                  <button onClick={() => handleRemovePaymentLocal(i)} className="text-red-500 text-xs">✕</button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="PROV"
                value={paymentInput.provider}
                onChange={(e) => setPaymentInput({ ...paymentInput, provider: e.target.value })}
                className="bg-black/40 border border-white/10 p-2 rounded-lg text-[10px] outline-none"
              />
              <input
                type="text"
                placeholder="L4"
                maxLength="4"
                value={paymentInput.last4}
                onChange={(e) => setPaymentInput({ ...paymentInput, last4: e.target.value.replace(/\D/g, '') })}
                className="bg-black/40 border border-white/10 p-2 rounded-lg text-[10px] outline-none"
              />
              <button onClick={handleAddPaymentLocal} className="col-span-2 py-3 bg-white/5 rounded-lg text-[9px] uppercase hover:bg-white/10 transition-all">Add Node</button>
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-blue-500 block mb-4 font-bold">Global Sync</span>
              <p className="text-[10px] text-slate-400 italic">Verify all telemetry data before committing to the global ledger.</p>
            </div>
            <button
              onClick={saveAllChanges}
              disabled={saving}
              className="mt-6 w-full py-5 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-blue-500 disabled:opacity-50 transition-all shadow-lg"
            >
              {saving ? "Syncing..." : "Commit Changes"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2563eb; }
      `}</style>
    </div>
  );
};

export default Profile;