import React from 'react';
import './Insurance.css';

const Insurance = () => {
  // Placeholders for insurance logos
  const insuranceProviders = [
    { name: "Star Health", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=Star+Health" },
    { name: "Apollo Munich", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=Apollo+Munich" },
    { name: "HDFC ERGO", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=HDFC+ERGO" },
    { name: "ICICI Lombard", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=ICICI+Lombard" },
    { name: "Bajaj Allianz", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=Bajaj+Allianz" },
    { name: "Religare", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=Religare" }
  ];

  return (
    <section id="insurance" className="section bg-white">
      <div className="container text-center">
        <span className="section-subtitle reveal">Cashless Facilities</span>
        <h2 className="section-title reveal delay-100">Accepted Insurances</h2>
        <p className="reveal delay-200" style={{ maxWidth: '700px', margin: '0 auto 3rem' }}>
          We partner with major health insurance providers to ensure you receive a hassle-free, cashless medical experience.
        </p>

        <div className="insurance-grid reveal delay-300">
          {insuranceProviders.map((provider, index) => (
            <div key={index} className="insurance-card glass-panel">
              <img src={provider.logo} alt={provider.name} className="insurance-logo" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Insurance;
