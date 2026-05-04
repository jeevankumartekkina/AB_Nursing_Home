import React from 'react';
import { BedDouble, ShieldPlus, TestTube, Plus, Pill } from 'lucide-react';
import './Facilities.css';

const Facilities = () => {
  const facilitiesData = [
    { name: '24/7 Emergency Care', icon: <ShieldPlus size={40} />, delay: "100" },
    { name: 'Modern Operation Theatres', icon: <Plus size={40} />, delay: "200" },
    { name: 'Advanced Diagnostics & Lab', icon: <TestTube size={40} />, delay: "300" },
    { name: 'Private Recovery Rooms', icon: <BedDouble size={40} />, delay: "100" },
    { name: '24/7 Pharmacy', icon: <Pill size={40} />, delay: "200" },
  ];

  return (
    <section id="facilities" className="section bg-white facilities-section">
      <div className="container relative z-10">
        <span className="section-subtitle reveal">Infrastructure</span>
        <h2 className="section-title reveal delay-100">World-Class Facilities</h2>
        
        <div className="facilities-grid mt-5">
          {facilitiesData.map((facility, index) => (
            <div className={`facility-item reveal delay-${facility.delay}`} key={index}>
              <div className="facility-icon">
                {facility.icon}
              </div>
              <h4>{facility.name}</h4>
              <div className="facility-bg-icon">{facility.icon}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Facilities;
