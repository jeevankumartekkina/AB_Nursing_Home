import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Share2, X } from 'lucide-react';
import './HealthTips.css';

const HealthTips = () => {
  const [tips, setTips] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTips(data.slice(0, 3)); // Show latest 3
      })
      .catch(err => console.error("Error fetching tips:", err));
  }, []);

  const handleShare = (tip) => {
    const text = `Check out this health tip from Archana Bhaskara Hospital: ${tip.title} \n\n Read more on our website!`;
    const url = window.location.href;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`, '_blank');
  };

  if (tips.length === 0) return null;

  return (
    <section className="section health-tips-section" id="health-tips">
      <div className="container">
        <div className="section-header text-center reveal">
          <span className="subtitle">Knowledge Hub</span>
          <h2 className="title">Daily Health Awareness</h2>
          <p className="description">Expert advice from our doctors to help you live a healthier, longer life.</p>
        </div>

        <div className="tips-grid">
          {tips.map((tip, index) => (
            <div key={tip.id} className={`tip-card reveal delay-${index + 1}`}>
              <div className="tip-image">
                <img src={tip.image || 'https://images.unsplash.com/photo-1505751172107-5739a00723a5?auto=format&fit=crop&q=80&w=800'} alt={tip.title} />
                <div className="tip-category">{tip.category}</div>
              </div>
              <div className="tip-content">
                <div className="tip-meta">
                  <span><Calendar size={14} /> {new Date(tip.createdAt).toLocaleDateString()}</span>
                  <span><User size={14} /> {tip.author}</span>
                </div>
                <h3>{tip.title}</h3>
                <p>{tip.content.substring(0, 120)}...</p>
                <div className="tip-footer">
                  <button className="read-more" onClick={() => setSelectedTip(tip)}>Read More <ArrowRight size={16} /></button>
                  <button className="share-btn" onClick={() => handleShare(tip)}>
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Tip Modal */}
      {selectedTip && (
        <div className="tip-modal-overlay" onClick={() => setSelectedTip(null)}>
          <div className="tip-modal-content" onClick={e => e.stopPropagation()}>
            <button className="tip-modal-close" onClick={() => setSelectedTip(null)}><X size={24}/></button>
            <div className="tip-modal-body">
              <img src={selectedTip.image || 'https://images.unsplash.com/photo-1505751172107-5739a00723a5?auto=format&fit=crop&q=80&w=800'} alt={selectedTip.title} className="tip-modal-img" />
              <div className="tip-modal-padding">
                <div className="tip-category mb-3" style={{position:'static', display:'inline-block'}}>{selectedTip.category}</div>
                <h2>{selectedTip.title}</h2>
                <div className="tip-meta my-3">
                  <span><Calendar size={14} /> {new Date(selectedTip.createdAt).toLocaleDateString()}</span>
                  <span><User size={14} /> {selectedTip.author}</span>
                </div>
                <div className="tip-full-content">
                  {selectedTip.content.split('\n').map((para, i) => <p key={i}>{para}</p>)}
                </div>
                <button className="btn btn-primary mt-4 w-100" onClick={() => handleShare(selectedTip)}>Share this Tip on WhatsApp</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HealthTips;
