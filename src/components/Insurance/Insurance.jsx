import React, { useState, useEffect } from 'react';
import './Insurance.css';

const Insurance = () => {
  const [insurances, setInsurances] = useState([]);

  useEffect(() => {
    fetch('/api/insurance')
      .then(res => res.json())
      .then(data => setInsurances(data))
      .catch(err => console.error("Error fetching insurances:", err));
  }, []);

  return (
    <section id="insurance" className="section bg-white">
      <div className="container text-center">
        <span className="section-subtitle reveal">Cashless Facilities</span>
        <h2 className="section-title reveal delay-100">Accepted Insurances</h2>
        <p className="reveal delay-200" style={{ maxWidth: '700px', margin: '0 auto 3rem' }}>
          We partner with major health insurance providers to ensure you receive a hassle-free, cashless medical experience.
        </p>

        <div className="insurance-grid reveal delay-300">
          {insurances.length === 0 ? (
            <p>Loading insurances...</p>
          ) : (
            insurances.map((provider, index) => (
              <div key={provider.id || index} className="insurance-card glass-panel">
                <img src={provider.logo} alt={provider.name} className="insurance-logo" />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Insurance;
