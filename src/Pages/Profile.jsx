import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [location, setLocation] = useState(null);
  
  const [localPaymentMethods, setLocalPaymentMethods] = useState([]);
  const [paymentInput, setPaymentInput] = useState({
    type: "CARD",
    provider: "",
    last4: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const triggerMessage = (setter, msg) => {
    setter(msg);
    setTimeout(() => setter(null), 4000);
  };

  const getToken = async () => await user.getIdToken();

  // 🔥 Fetch initial profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const res = await fetch("http://localhost:8000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

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

  // 🔹 Update location locally
  const handleGetLocationLocal = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          type: "Point",
          coordinates: [pos.coords.longitude, pos.coords.latitude],
        });
        triggerMessage(setSuccess, "📍 GPS fetched! Remember to save changes.");
      },
      () => triggerMessage(setError, "Please allow location access in your browser.")
    );
  };

  // 🔹 Add payment method locally
  const handleAddPaymentLocal = () => {
    if (!paymentInput.provider || !paymentInput.last4) {
      triggerMessage(setError, "Please fill in both provider and last 4 digits.");
      return;
    }
    setLocalPaymentMethods([...localPaymentMethods, paymentInput]);
    setPaymentInput({ type: "CARD", provider: "", last4: "" });
  };

  const handleRemovePaymentLocal = (index) => {
    const updated = localPaymentMethods.filter((_, i) => i !== index);
    setLocalPaymentMethods(updated);
  };

  // 🚀 Single "Save All" Function
  const saveAllChanges = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      
      const payload = {
        name: formData.name,
        phone: formData.phone,
        location: location,
        paymentMethods: localPaymentMethods,
      };

      const res = await fetch("http://localhost:8000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save profile changes.");

      setProfile({ ...profile, ...payload });
      triggerMessage(setSuccess, "🎉 All profile changes saved successfully!");
    } catch (err) {
      triggerMessage(setError, err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="font-medium tracking-wide">Loading your profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      {/* Import Inter Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');`}</style>
      
      <div 
        className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 flex justify-center selection:bg-blue-500/30"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="w-full max-w-5xl space-y-8 pb-24">
          
          {/* Header Section */}
          <div className="bg-slate-900 rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-6 border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <img
              src={profile.photoURL || user.photoURL || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-slate-800 shadow-xl object-cover"
            />
            <div className="text-center md:text-left">
              <h2 className="text-5xl font-semibold font-sans tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
{formData.name || "User Profile"}</h2>
              <p className="text-slate-400 mt-1 font-medium tracking-wide">{profile.email}</p>
            </div>
            <div className="md:ml-auto flex flex-col gap-2 items-end z-10">
               {success && (
                  <span className="bg-green-500/10 text-green-400 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide border border-green-500/20 shadow-sm transition-all">
                      {success}
                  </span>
               )}
               {error && (
                  <span className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide border border-red-500/20 shadow-sm transition-all">
                      {error}
                  </span>
               )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-8">
              {/* Personal Details */}
              <div className="bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-800">
                <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Personal Details</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2 tracking-wide uppercase">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-600"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2 tracking-wide uppercase">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-600"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-800">
                <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Payment Methods</h3>
                
                <div className="space-y-3 mb-6">
                  {localPaymentMethods.length > 0 ? (
                    localPaymentMethods.map((p, i) => (
                      <div key={i} className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800 group transition-colors hover:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-800 px-2 py-1 rounded text-xs font-bold text-slate-300 tracking-wider uppercase">{p.type}</div>
                          <span className="font-semibold text-slate-200">{p.provider}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-slate-400 font-mono tracking-widest">•••• {p.last4}</span>
                          <button 
                            onClick={() => handleRemovePaymentLocal(i)}
                            className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity p-1 font-bold"
                            title="Remove card"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-6 bg-slate-950 rounded-xl border border-dashed border-slate-800 text-sm font-medium">No payment methods added yet.</p>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-800 space-y-4">
                  <h4 className="text-sm font-semibold text-slate-400 tracking-wide uppercase">Add New Card</h4>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Provider (e.g. Visa)"
                      value={paymentInput.provider}
                      onChange={(e) => setPaymentInput({ ...paymentInput, provider: e.target.value })}
                      className="w-1/2 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all placeholder-slate-600"
                    />
                    <input
                      type="text"
                      placeholder="Last 4 digits"
                      maxLength="4"
                      value={paymentInput.last4}
                      onChange={(e) => setPaymentInput({ ...paymentInput, last4: e.target.value.replace(/\D/g, '') })}
                      className="w-1/2 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all placeholder-slate-600"
                    />
                  </div>
                  <button
                    onClick={handleAddPaymentLocal}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold tracking-wide rounded-xl transition-colors border border-slate-700"
                  >
                    + Add to List
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-800 h-fit sticky top-8">
              <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Current Location</h3>
              
              {location ? (
                <div className="space-y-4">
                  {/* Colorful Map with glow effect */}
                  <div className="w-full h-64 bg-slate-800 rounded-xl overflow-hidden border-2 border-slate-700 shadow-lg shadow-blue-500/10 relative">
                    <iframe 
                      title="User Location Map"
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      scrolling="no" 
                      className="w-full h-full"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.coordinates[0]-0.01}%2C${location.coordinates[1]-0.01}%2C${location.coordinates[0]+0.01}%2C${location.coordinates[1]+0.01}&layer=mapnik&marker=${location.coordinates[1]}%2C${location.coordinates[0]}`}
                    ></iframe>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono tracking-wide">
                     <span>Lat: <span className="text-slate-200 font-semibold">{location.coordinates[1].toFixed(4)}</span></span>
                     <span>Lng: <span className="text-slate-200 font-semibold">{location.coordinates[0].toFixed(4)}</span></span>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center bg-slate-950 rounded-xl border border-dashed border-slate-800 text-slate-500 mb-4">
                  <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <p className="font-semibold tracking-wide">No location pinned</p>
                </div>
              )}

              <button
                onClick={handleGetLocationLocal}
                className="w-full py-3 mt-6 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold tracking-wide rounded-xl transition-colors border border-slate-700"
              >
                {location ? "Fetch New GPS Coordinates" : "Locate Me via GPS"}
              </button>
            </div>

          </div>

          {/* Master Save Button */}
          <div className="fixed bottom-0 left-0 w-full bg-slate-900/80 backdrop-blur-md border-t border-slate-800 p-4 md:static md:bg-transparent md:border-none md:p-0 md:mt-8 z-50">
             <div className="max-w-5xl mx-auto">
               <button
                  onClick={saveAllChanges}
                  disabled={saving}
                  className={`w-full py-4 text-lg font-bold tracking-wide text-white rounded-xl shadow-lg transition-all ${
                    saving 
                      ? "bg-blue-800 cursor-not-allowed opacity-70" 
                      : "bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/25 hover:-translate-y-0.5"
                  }`}
                >
                  {saving ? "Saving Changes..." : "Save All Profile Changes"}
                </button>
             </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;