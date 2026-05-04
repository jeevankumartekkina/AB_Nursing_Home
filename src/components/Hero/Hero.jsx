import React from 'react';
import { Calendar, PhoneCall, Star, Award, Shield } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-gradient-overlay"></div>
      
      <div className="container hero-container">
        <div className="hero-content reveal">
          <div className="hero-badge reveal delay-100">
            <Star size={16} fill="currentColor" /> 5-Star Rated Care
          </div>
          <h1 className="hero-title reveal delay-200">
            Archana Bhaskara <br/><span className="text-gradient">Nursing Home</span>
          </h1>
          <p className="hero-description reveal delay-300">
            Experience world-class maternity and gynecology care. We combine advanced medical technology with a deeply compassionate approach, available 24/7.
          </p>
          <div className="hero-actions reveal delay-300">
            <a href="#appointment" className="btn btn-primary hero-btn">
              <Calendar size={20} />
              Book Appointment
            </a>
            <a href="tel:09573687858" className="btn btn-secondary hero-btn hero-btn-outline">
              <PhoneCall size={20} />
              Emergency 24/7
            </a>
          </div>
        </div>

        {/* Overlapping Stats Card */}
        <div className="hero-stats-card reveal delay-300">
          <div className="stat-item">
            <div className="stat-icon-wrapper"><Award size={24} /></div>
            <div>
              <span className="stat-number">20+</span>
              <span className="stat-label">Years of Trust</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon-wrapper"><Shield size={24} /></div>
            <div>
              <span className="stat-number">24/7</span>
              <span className="stat-label">Emergency Care</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
