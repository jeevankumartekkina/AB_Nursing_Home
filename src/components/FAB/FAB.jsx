import React from 'react';
import { MessageCircle } from 'lucide-react';
import './FAB.css';

const FAB = () => {
  return (
    <a 
      href="https://wa.me/919573687858" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="fab-container"
      aria-label="Chat on WhatsApp"
    >
      <div className="fab-tooltip">Chat with us</div>
      <div className="fab-button">
        <MessageCircle size={28} />
      </div>
    </a>
  );
};

export default FAB;
