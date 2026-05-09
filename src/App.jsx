import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './App.css';

// Components
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Specialties from './components/Specialties/Specialties';
import Facilities from './components/Facilities/Facilities';
import Doctors from './components/Doctors/Doctors';
import Testimonials from './components/Testimonials/Testimonials';
import Gallery from './components/Gallery/Gallery';
import Insurance from './components/Insurance/Insurance';
import AppointmentForm from './components/AppointmentForm/AppointmentForm';
import FAQ from './components/FAQ/FAQ';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import FloatingCallButton from './components/FAB/FloatingCallButton';
import CampaignBanner from './components/CampaignBanner/CampaignBanner';

// Admin Components
import AdminDashboard from './components/Admin/AdminDashboard';

const MainSite = () => {
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add('active');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container">
      <CampaignBanner />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Specialties />
        <Facilities />
        <Gallery />
        <Doctors />
        <Testimonials />
        <Insurance />
        <AppointmentForm />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingCallButton />
      <Analytics />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
