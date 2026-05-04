import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2 className="footer-logo">Archana Bhaskara <span>Nursing Home</span></h2>
            <p className="footer-desc">
              Providing compassionate maternity and gynecology care with 24/7 emergency services in Vizianagaram.
            </p>
          </div>
          
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#specialties">Specialties</a></li>
              <li><a href="#facilities">Facilities</a></li>
              <li><a href="#doctors">Doctors</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h3>Patient Support</h3>
            <ul>
              <li><a href="#appointment">Book Appointment</a></li>
              <li><a href="#reviews">Patient Reviews</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Archana Bhaskara Nursing Home. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
