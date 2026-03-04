import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 💰 Data passed from Service Booking Page
  const { bookingData } = location.state || { 
    bookingData: { totalPrice: 0, serviceType: "None", quantity: 0 } 
  };

  const [method, setMethod] = useState('upi');
  const [loading, setLoading] = useState(false);

  const handleFinalPayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🚀 Step 1: Initialize Payment with Backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bookings`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({
          ...bookingData, // includes serviceType, quantity, lat, lon, etc.
          paymentMethod: method
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.detail);

      alert(`Success! ${result.message} ID: ${result.booking_id}`);
      navigate('/my-bookings');
      
    } catch (err) {
      alert("Payment Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1a1a1a] pt-28 pb-20 font-sans selection:bg-black selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-12 border-b border-gray-200 pb-8 flex justify-between items-end">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2 block">Checkout // Terminal</span>
            <h1 className="text-4xl font-black tracking-tighter text-black uppercase">Complete Order</h1>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Payable</p>
             <p className="text-3xl font-black text-black tracking-tighter">₹{bookingData.totalPrice || 0}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* 💳 Payment Methods */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Execution Method</h3>
            {[
              { id: 'upi', label: 'UPI / Google Pay', icon: '📱' },
              { id: 'card', label: 'Debit / Credit Card', icon: '💳' },
              { id: 'netbanking', label: 'Net Banking', icon: '🏛️' }
            ].map((item) => (
              <button key={item.id} onClick={() => setMethod(item.id)} className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 ${method === item.id ? 'border-black bg-white shadow-xl scale-[1.02]' : 'border-gray-100 opacity-50 hover:opacity-100'}`}>
                <div className="flex items-center gap-4">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-extrabold text-xs uppercase tracking-widest">{item.label}</span>
                </div>
                {method === item.id && <div className="w-2 h-2 rounded-full bg-black"></div>}
              </button>
            ))}
          </div>

          {/* 📝 Form Layout */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100">
            <form onSubmit={handleFinalPayment} className="space-y-8">
              
              {method === 'upi' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex gap-4 mb-8">
                    <button type="button" className="flex-1 p-4 border border-gray-100 rounded-xl hover:bg-gray-50"><img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" className="h-5 mx-auto" alt="GPay"/></button>
                    <button type="button" className="flex-1 p-4 border border-gray-100 rounded-xl hover:bg-gray-50"><img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" className="h-5 mx-auto" alt="PhonePe"/></button>
                  </div>
                  <input required type="text" placeholder="VPA ID (e.g. user@okhdfc)" className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white p-4 rounded-xl outline-none font-bold transition-all" />
                </div>
              )}

              {method === 'card' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-5">
                  <input required maxLength="16" placeholder="CARD NUMBER" className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white p-4 rounded-xl outline-none font-bold tracking-widest" />
                  <input required placeholder="BANK IFSC CODE" className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white p-4 rounded-xl outline-none font-bold" />
                  <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="MM/YY" className="bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white p-4 rounded-xl outline-none font-bold" />
                    <input required type="password" placeholder="CVV" className="bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white p-4 rounded-xl outline-none font-bold" />
                  </div>
                </div>
              )}

              {method === 'netbanking' && (
                <select className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white p-4 rounded-xl outline-none font-bold appearance-none">
                  <option>HDFC BANK EXECUTIVE</option>
                  <option>ICICI PRIVATE BANKING</option>
                  <option>SBI CORPORATE</option>
                </select>
              )}

              <button disabled={loading} type="submit" className="w-full py-6 bg-black text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl active:scale-95 transition-all disabled:bg-gray-300">
                {loading ? "Verifying Transaction..." : `Pay ₹${bookingData.totalPrice}`}
              </button>

              <div className="flex items-center justify-center gap-2 opacity-30">
                <span className="text-[9px] font-black uppercase tracking-widest">Encrypted Terminal // Aircab Secure</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;