import React from 'react';
import { Clock, Heart, UserCheck, ShieldCheck } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="section bg-white about-section">
      <div className="about-bg-shape"></div>
      <div className="container relative z-10">
        <div className="grid grid-cols-2 align-center">
          <div className="about-image-wrapper reveal">
            <div className="image-decoration"></div>
            <img 
              src="/hospital_about_image.png" 
              alt="Archana Bhaskara Medical Team" 
              className="about-img main-img"
            />
            <div className="experience-badge glass-panel">
              <div className="badge-icon"><ShieldCheck size={32} /></div>
              <div>
                <span className="years">24/7</span>
                <span className="text">Available<br/>Care</span>
              </div>
            </div>
          </div>
          
          <div className="about-content">
            <span className="section-subtitle reveal" style={{ textAlign: 'left' }}>About Us</span>
            <h2 className="section-title reveal delay-100" style={{ textAlign: 'left' }}>Dedicated to Women's Health & Complete Family Care</h2>
            <p className="description reveal delay-200">
              Archana Bhaskara Nursing Home is a premier healthcare facility located in the heart of Vizianagaram. We specialize in comprehensive gynecology, obstetrics, and maternity care.
            </p>
            <p className="description mb-4 reveal delay-200">
              Our 5-star rated facility is known for its excellent service, obedient staff, and experienced doctors. We ensure that every patient receives personalized care in a comfortable and safe environment.
            </p>
            
            <div className="features-list">
              <div className="feature-item reveal delay-300">
                <div className="feature-icon"><Clock size={24} /></div>
                <div>
                  <h4>Open 24 Hours</h4>
                  <p>Round-the-clock medical assistance and emergency services.</p>
                </div>
              </div>
              <div className="feature-item reveal delay-300">
                <div className="feature-icon"><Heart size={24} /></div>
                <div>
                  <h4>Expert Maternity Care</h4>
                  <p>Safe and guided pregnancy journey for mother and baby.</p>
                </div>
              </div>
              <div className="feature-item reveal delay-300">
                <div className="feature-icon"><UserCheck size={24} /></div>
                <div>
                  <h4>Experienced Doctors</h4>
                  <p>Highly qualified specialists dedicated to your well-being.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
