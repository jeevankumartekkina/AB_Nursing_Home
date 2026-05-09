import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Phone, Calendar, ArrowRight } from 'lucide-react';
import './AIAssistant.css';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: "Hello! I am Archana AI, your digital health assistant. How can I help you today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const responses = {
    greetings: ["hi", "hello", "hey", "good morning", "good evening"],
    departments: {
      "heart": "Cardiology", "chest pain": "Cardiology",
      "bone": "Orthopedics", "fracture": "Orthopedics", "joint": "Orthopedics",
      "skin": "Dermatology", "rash": "Dermatology",
      "child": "Pediatrics", "baby": "Pediatrics", "kid": "Pediatrics",
      "eye": "Ophthalmology", "vision": "Ophthalmology",
      "pregnant": "Gynecology", "delivery": "Gynecology", "women": "Gynecology",
      "stomach": "Gastroenterology", "digestion": "Gastroenterology",
      "emergency": "Emergency Care", "accident": "Emergency Care"
    },
    general: {
      "hours": "We are open 24/7 for Emergency. Outpatient (OPD) hours are 9:00 AM to 8:00 PM.",
      "visiting": "Visiting hours are from 4:00 PM to 6:00 PM daily.",
      "location": "We are located at [Your Hospital Address]. You can find the map in our Contact section.",
      "insurance": "We accept major insurance providers. Please check our Insurance section for the full list.",
      "appointment": "You can book an appointment using the form on our homepage or by calling us directly."
    }
  };

  const handleSend = (text = input) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "I'm not sure about that. Would you like to speak with our reception desk?";
      const lowerText = text.toLowerCase().trim();

      // Check for Affirmative (Yes, Yeah, OK)
      const yesWords = ["yes", "yeah", "ok", "sure", "yep", "y"];
      const lastBotMsg = messages[messages.length - 1];
      
      if (yesWords.includes(lowerText) && lastBotMsg?.text.includes("speak with our reception")) {
        botResponse = "Great! You can click the green call button at the bottom right, or call us directly at +91 88888 88888. Our team is ready to help you.";
      }
      else if (responses.greetings.some(g => lowerText.includes(g))) {
        botResponse = "Hello! I am Archana AI. I can help you find the right doctor or answer questions about our hospital. What can I do for you?";
      } 
      else {
        // Check Departments with more keywords
        let foundDept = null;
        for (const [key, value] of Object.entries(responses.departments)) {
          if (lowerText.includes(key)) {
            foundDept = value;
            break;
          }
        }
        
        if (foundDept) {
          botResponse = `It sounds like you might need our ${foundDept} department. We have specialized doctors for this. Would you like to see our doctors or book an appointment?`;
        } else {
          // Check General info
          let foundGeneral = null;
          for (const [key, value] of Object.entries(responses.general)) {
            if (lowerText.includes(key)) {
              foundGeneral = value;
              break;
            }
          }
          if (foundGeneral) botResponse = foundGeneral;
        }
      }

      const botMsg = { id: Date.now() + 1, type: 'bot', text: botResponse, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const QuickActions = [
    { label: "Check Symptoms", icon: <Bot size={14}/> },
    { label: "Hospital Hours", icon: <Calendar size={14}/> },
    { label: "Book Appointment", icon: <ArrowRight size={14}/> }
  ];

  return (
    <div className={`ai-assistant-wrapper ${isOpen ? 'active' : ''}`}>
      {/* Bubble */}
      <button className="ai-bubble" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && <span className="ai-notification">1</span>}
      </button>

      {/* Chat Window */}
      <div className="ai-chat-window glass-panel">
        <div className="ai-chat-header">
          <div className="ai-header-info">
            <div className="ai-avatar">
              <Bot size={20} color="white" />
              <span className="online-status"></span>
            </div>
            <div>
              <h4>Archana AI</h4>
              <p>Online | Health Assistant</p>
            </div>
          </div>
          <button className="ai-close-btn" onClick={() => setIsOpen(false)}><X size={20}/></button>
        </div>

        <div className="ai-chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`ai-message ${msg.type}`}>
              <div className="ai-message-bubble">
                {msg.text}
                <span className="ai-message-time">{msg.time}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="ai-message bot">
              <div className="ai-message-bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="ai-quick-actions">
          {QuickActions.map((action, i) => (
            <button key={i} onClick={() => handleSend(action.label)}>
              {action.icon} {action.label}
            </button>
          ))}
        </div>

        <div className="ai-chat-input">
          <input 
            type="text" 
            placeholder="Ask me anything..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={() => handleSend()}>
            <Send size={18} />
          </button>
        </div>

        <div className="ai-footer-call">
          <span>Need immediate help?</span>
          <a href="tel:+918888888888" className="ai-call-link">
            <Phone size={14} /> Call Reception
          </a>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
