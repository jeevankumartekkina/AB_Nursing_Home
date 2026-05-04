import React, { useState, useEffect } from 'react';
import { Link, Phone, Mail } from 'lucide-react';
import './Doctors.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/doctors');
        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <section id="doctors" className="section subtle-bg-section relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="doc-blob doc-blob-1"></div>
      <div className="doc-blob doc-blob-2"></div>

      <div className="container relative z-10">
        <span className="section-subtitle reveal">Medical Team</span>
        <h2 className="section-title reveal delay-100">Meet Our Specialists</h2>
        <p className="text-center mb-5 reveal delay-200" style={{ maxWidth: '700px', margin: '0 auto 4rem' }}>
          Our experienced and compassionate medical team is dedicated to providing the best healthcare for you and your family.
        </p>

        <div className="doctors-grid">
          {doctors.map(doc => (
            <div className={`doctor-card reveal delay-${doc.delay}`} key={doc.id}>
              <div className="doctor-img-wrapper">
                <img src={doc.image} alt={doc.name} className="doctor-img" />
                <div className="doctor-socials glass-panel">
                  <a href="#"><Link size={18} /></a>
                  <a href="#"><Phone size={18} /></a>
                  <a href="#"><Mail size={18} /></a>
                </div>
              </div>
              <div className="doctor-info glass-panel">
                <h3 className="doctor-name">{doc.name}</h3>
                <p className="doctor-specialty">{doc.specialty}</p>
                <div className="doctor-meta">
                  <span className="doctor-qual">{doc.qualification}</span>
                  <span className="doctor-exp">{doc.experience}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
