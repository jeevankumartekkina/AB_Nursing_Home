import React from 'react';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="section bg-white">
      <div className="container">
        <h2 className="section-title text-center mb-5">Contact Us</h2>
        <div className="contact-wrapper grid grid-cols-2 gap-4">
          <div className="contact-info flex flex-col gap-4">
            <div className="info-card glass-panel reveal p-4 flex gap-4 align-center">
              <div className="icon-circle">
                <MapPin size={24} />
              </div>
              <div className="info-content">
                <h3>Our Location</h3>
                <p>MRO Office Road, Burle Peta, Santha Pet,<br />Vizianagaram, Andhra Pradesh - 535001</p>
              </div>
            </div>
            
            <div className="info-card glass-panel reveal p-4 flex gap-4 align-center">
              <div className="icon-circle">
                <Phone size={24} />
              </div>
              <div className="info-content">
                <h3>Phone Number</h3>
                <p><a href="tel:09573687858">095736 87858</a></p>
              </div>
            </div>
            
            <div className="info-card glass-panel reveal p-4 flex gap-4 align-center">
              <div className="icon-circle">
                <Clock size={24} />
              </div>
              <div className="info-content">
                <h3>Working Hours</h3>
                <p>Open 24 hours (Emergency services always available)</p>
              </div>
            </div>

            <a href="https://maps.google.com/?q=Archana+Bhaskara+Nursing+Home+Vizianagaram" target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-2 flex align-center justify-center gap-2">
              <Navigation size={18} />
              Get Directions on Phone
            </a>
          </div>

          <div className="contact-map reveal glass-panel" style={{ overflow: 'hidden', minHeight: '400px' }}>
            <iframe 
              title="Hospital Location"
              src="https://maps.google.com/maps?q=Archana%20Bhaskara%20Nursing%20Home%20Vizianagaram&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
