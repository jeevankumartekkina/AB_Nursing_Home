import React from 'react';
import { Baby, Activity, HeartPulse, Stethoscope, Syringe } from 'lucide-react';
import './Specialties.css';

const Specialties = () => {
  const specialtiesData = [
    {
      id: 1,
      title: "Pregnancy & Maternity",
      description: "Comprehensive care for you and your baby from conception through delivery and beyond.",
      icon: <Baby size={32} />,
      delay: "100"
    },
    {
      id: 2,
      title: "Obstetrics & Gynecology",
      description: "Expert diagnosis and treatment for all women's health issues across all stages of life.",
      icon: <HeartPulse size={32} />,
      delay: "200"
    },
    {
      id: 3,
      title: "Fetal Medicine",
      description: "Advanced ultrasound and fetal monitoring to ensure the optimal health of your baby.",
      icon: <Activity size={32} />,
      delay: "300"
    },
    {
      id: 4,
      title: "Infertility Evaluation",
      description: "Compassionate support and advanced medical solutions for couples trying to conceive.",
      icon: <Stethoscope size={32} />,
      delay: "100"
    },
    {
      id: 5,
      title: "High-Risk Pregnancy",
      description: "Specialized monitoring and care for complex pregnancies to ensure safe outcomes.",
      icon: <Syringe size={32} />,
      delay: "200"
    }
  ];

  return (
    <section id="specialties" className="section bg-main">
      <div className="container">
        <span className="section-subtitle reveal">Core Services</span>
        <h2 className="section-title reveal delay-100">Our Specialties</h2>
        <p className="text-center mb-5 reveal delay-200" style={{ maxWidth: '700px', margin: '0 auto 4rem' }}>
          We offer a wide range of specialized services focused on women's health, ensuring top-tier medical care with a compassionate approach.
        </p>

        <div className="specialties-grid">
          {specialtiesData.map((spec) => (
            <div className={`specialty-card reveal delay-${spec.delay}`} key={spec.id}>
              <div className="specialty-icon-wrapper">
                {spec.icon}
              </div>
              <h3 className="specialty-title">{spec.title}</h3>
              <p className="specialty-desc">{spec.description}</p>
              <a href="#contact" className="specialty-link">Learn More <span>&rarr;</span></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specialties;
