import React, { useState, useEffect } from 'react';
import { Link, Phone, Mail, X, Award, GraduationCap, Info } from 'lucide-react';
import './Doctors.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/doctors');
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
            <div className={`doctor-card reveal`} key={doc.id} onClick={() => setSelectedDoctor(doc)} style={{cursor:'pointer'}}>
              <div className="doctor-img-wrapper">
                <img src={doc.image} alt={doc.name} className="doctor-img" />
                <div className="doctor-hover-hint">
                  <Info size={20} /> View Profile
                </div>
              </div>
              <div className="doctor-info glass-panel">
                <h3 className="doctor-name">{doc.name}</h3>
                <p className="doctor-specialty">{doc.specialty}</p>
                <div className="doctor-meta">
                  <span className="doctor-qual">{doc.qualification}</span>
                  <span className="doctor-exp">{doc.experience}</span>
                </div>
                <div className="doctor-availability mt-3 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', fontSize: '0.85rem', color: 'var(--primary)' }}>
                  <strong>Availability:</strong> {doc.availability || 'Mon-Sat: 10AM - 5PM'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Profile Modal */}
      {selectedDoctor && (
        <div className="doc-modal-overlay" onClick={() => setSelectedDoctor(null)}>
          <div className="doc-modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <button className="doc-modal-close" onClick={() => setSelectedDoctor(null)}><X size={24}/></button>
            <div className="doc-modal-grid">
              <div className="doc-modal-left">
                <img src={selectedDoctor.image} alt={selectedDoctor.name} />
                <div className="doc-modal-summary">
                  <h3>{selectedDoctor.name}</h3>
                  <p className="text-primary font-bold">{selectedDoctor.specialty}</p>
                  <p className="text-sm">{selectedDoctor.qualification}</p>
                  <div className="mt-4 flex gap-2">
                    <a href="#appointment" onClick={() => setSelectedDoctor(null)} className="btn btn-primary w-100 text-center py-2 text-sm">Book Appointment</a>
                  </div>
                </div>
              </div>
              <div className="doc-modal-right">
                <div className="doc-modal-section">
                  <h4><Info size={18}/> About Doctor</h4>
                  <p>{selectedDoctor.bio || 'Experienced specialist dedicated to patient care and medical excellence.'}</p>
                </div>
                <div className="doc-modal-section">
                  <h4><GraduationCap size={18}/> Education & Training</h4>
                  <p>{selectedDoctor.education || 'Top-tier medical education with specialized training in clinical practices.'}</p>
                </div>
                {selectedDoctor.awards && (
                  <div className="doc-modal-section">
                    <h4><Award size={18}/> Awards & Recognition</h4>
                    <p>{selectedDoctor.awards}</p>
                  </div>
                )}
                <div className="doc-modal-section">
                  <h4>🗓️ Availability</h4>
                  <p>{selectedDoctor.availability || 'Mon-Sat: 10:00 AM - 05:00 PM'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Doctors;
