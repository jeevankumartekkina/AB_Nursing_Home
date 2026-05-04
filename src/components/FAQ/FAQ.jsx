import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: "What are the visiting hours for the hospital?",
      answer: "We are open 24 hours a day for emergencies. However, for general visiting, we recommend coming between 10:00 AM to 1:00 PM and 5:00 PM to 8:00 PM to ensure patients get adequate rest."
    },
    {
      question: "Do you have an emergency department for maternity cases?",
      answer: "Yes, our maternity and gynecology emergency department operates 24/7. Our specialists and nursing staff are always available to handle any critical situations."
    },
    {
      question: "What should I bring for a maternity admission?",
      answer: "We recommend bringing your medical records, ID proof, comfortable clothing, basic toiletries, and baby essentials. A detailed checklist will be provided by your doctor during the third trimester."
    },
    {
      question: "Do you accept health insurance?",
      answer: "Yes, we accept major health insurance providers. Please contact our front desk at 095736 87858 to verify if your specific insurance plan is covered."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="section bg-main">
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        
        <div className="faq-container mt-5">
          {faqs.map((faq, index) => (
            <div 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`} 
              key={index}
              onClick={() => toggleAccordion(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                {activeIndex === index ? <ChevronUp className="faq-icon" /> : <ChevronDown className="faq-icon" />}
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
