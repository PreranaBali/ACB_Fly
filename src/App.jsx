import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';

// Components
import Navbar from './components/Navbar';
import Cursor from './components/Cursor'; // Import the new cursor
import Home from './Pages/Home';
import Safety from './Pages/Safety';
import Service from './Pages/Service';
import Terms from './Pages/Terms';
import Profile from './Pages/Profile';
import ServiceBooking from './Pages/Service_booking';
import PilotDashboard from './Pages/PilotDashboard';
import D from './Pages/D';
import MyBookings from './Pages/MyBookings';
//Test
import Login from './Pages/Login';

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      {/* Use the new Cursor Component here */}
      <Cursor />
      
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/service" element={<Service />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/servicebookings" element={<ServiceBooking/>}/>
        <Route path="/pilot" element={<PilotDashboard/>}/>
        <Route path="/D" element={<D/>}/>
        <Route path="/mybookings" element={<MyBookings/>}/>
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;