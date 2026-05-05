import React, { useState } from 'react';
import { Calendar, User, Phone, Mail, FileText } from 'lucide-react';
import './AppointmentForm.css';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    department: '',
    message: ''
  });
  const [departments, setDepartments] = useState([]);
  const [showToast, setShowToast] = useState(false);

  React.useEffect(() => {
    fetch('/api/departments')
      .then(res => res.json())
      .then(data => {
        setDepartments(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, department: data[0].name }));
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
        setFormData({ name: '', phone: '', date: '', department: departments[0]?.name || '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      alert('Failed to submit request. Please call us directly.');
    }
  };

  return (
    <section id="appointment" className="section appointment-section">
      <div className="container">
        <div className="appointment-wrapper">
          <div className="appointment-info">
            <h2 className="title text-white">Book an Appointment</h2>
            <p className="text-white mb-4">
              Schedule your visit with our specialists. We ensure minimal waiting time and the best care for you and your family.
            </p>
            <div className="info-box">
              <h3>Emergency Case?</h3>
              <p>Call us immediately. We are open 24/7 for all emergencies.</p>
              <a href="tel:09573687858" className="btn btn-secondary mt-2">095736 87858</a>
            </div>
          </div>

          <div className="appointment-form-container">
            <form onSubmit={handleSubmit} className="appointment-form">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Enter your phone number" />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Preferred Date</label>
                  <div className="input-wrapper">
                    <Calendar size={18} className="input-icon" />
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select name="department" value={formData.department} onChange={handleChange} required className="form-select">
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                    {departments.length === 0 && <option value="">Loading departments...</option>}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Additional Message (Optional)</label>
                <div className="input-wrapper align-start">
                  <FileText size={18} className="input-icon textarea-icon" />
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="Any specific concerns?"></textarea>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100">Request Appointment</button>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`toast-notification ${showToast ? 'show' : ''}`}>
        <div className="toast-content">
          <div className="toast-icon">✓</div>
          <div className="toast-message">
            <h4>Request Submitted</h4>
            <p>We will contact you shortly to confirm your appointment.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;
