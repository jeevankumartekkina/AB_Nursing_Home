import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Specialties', href: '#specialties' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Doctors', href: '#doctors' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <a href="#home" className="navbar-logo">
          <span className="logo-icon">AB</span>
          <div className="logo-text">
            <h2>Archana Bhaskara</h2>
            <p>Nursing Home</p>
          </div>
        </a>

        <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <a href="#home" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <a href="#about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</a>
          <a href="#specialties" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
          <a href="#gallery" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Gallery</a>
          <a href="#doctors" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Doctors</a>
          <a href="#insurance" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Insurance</a>
          <a href="#contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
          <a href="#appointment" className="btn btn-primary nav-btn" onClick={() => setIsMobileMenuOpen(false)}>
            Book Appointment
          </a>
        </div>

        <div className="navbar-actions">
          <a href="tel:09573687858" className="emergency-call">
            <Phone size={18} />
            <span className="hidden-mobile">095736 87858</span>
          </a>
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
