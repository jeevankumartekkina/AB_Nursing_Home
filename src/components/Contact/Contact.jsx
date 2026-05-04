import React from 'react';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="section bg-white">
      <div className="container">
        <div className="contact-wrapper grid grid-cols-2">
          <div className="contact-info">
            <h2 className="section-title" style={{ left: '0', transform: 'none', textAlign: 'left' }}>Get in Touch</h2>
            <p className="mb-4">
              We are here to assist you 24/7. Whether it's an emergency, a general inquiry, or booking an appointment, please reach out to us.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon"><MapPin size={24} /></div>
                <div>
                  <h4>Location</h4>
                  <p>5-9-1, MRO Office Rd, Burle Peta,<br />Santha Pet, Vizianagaram,<br />Andhra Pradesh 535001</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon"><Phone size={24} /></div>
                <div>
                  <h4>Phone Number</h4>
                  <p><a href="tel:09573687858">095736 87858</a></p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon"><Clock size={24} /></div>
                <div>
                  <h4>Working Hours</h4>
                  <p>Open 24 hours</p>
                  <p className="text-sm text-secondary">Emergency services always available</p>
                </div>
              </div>
            </div>

            <a href="https://maps.google.com/?q=Archana+Bhaskara+Nursing+Home+Vizianagaram" target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-4 get-directions">
              <Navigation size={18} />
              Get Directions
            </a>
          </div>

          <div className="contact-map">
            {/* Placeholder for Google Maps iframe */}
            <div className="map-placeholder">
              <MapPin size={48} className="mb-2" color="var(--primary)" />
              <h3>Interactive Map</h3>
              <p>5-9-1, MRO Office Rd, Vizianagaram</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
