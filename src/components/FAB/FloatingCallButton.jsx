import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import './FloatingCallButton.css';

const FloatingCallButton = () => {
  const [phone, setPhone] = useState('09573687858');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.contactPhone) {
          setPhone(data.contactPhone);
        }
      })
      .catch(err => console.error("Error fetching phone for FAB:", err));
  }, []);

  return (
    <a href={`tel:${phone}`} className="floating-call-btn" title="Call Hospital">
      <div className="btn-content">
        <Phone size={24} fill="white" />
        <span className="btn-text">Call Now</span>
      </div>
    </a>
  );
};

export default FloatingCallButton;
