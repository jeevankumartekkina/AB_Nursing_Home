import React, { useState, useEffect } from 'react';
import { X, Megaphone, ArrowRight } from 'lucide-react';
import './CampaignBanner.css';

const CampaignBanner = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetch('/api/campaigns')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCampaigns(data.filter(c => c.isActive));
        }
      })
      .catch(err => console.error("Error fetching campaigns:", err));
  }, []);

  if (!isVisible || campaigns.length === 0) return null;

  const current = campaigns[currentIndex];

  return (
    <div className="campaign-banner">
      <div className="campaign-content container">
        <div className="campaign-left">
          <div className="campaign-badge">
            <Megaphone size={16} />
            <span>Special Offer</span>
          </div>
          <div className="campaign-text">
            <h4>{current.title}</h4>
            <p>{current.description}</p>
          </div>
        </div>
        <div className="campaign-right">
          <a href="#appointment" className="campaign-btn">
            {current.buttonText} <ArrowRight size={16} />
          </a>
          <button className="campaign-close" onClick={() => setIsVisible(false)}>
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignBanner;
