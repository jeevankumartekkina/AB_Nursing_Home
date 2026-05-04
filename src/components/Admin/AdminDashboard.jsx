import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, Plus, Trash2, LogOut } from 'lucide-react';
import './AdminDashboard.css';

const API_URL = '/api';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [gallery, setGallery] = useState([]);
  
  // New Doctor Form State
  const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '', qualification: '', experience: '', image: '' });
  
  // New Gallery Form State
  const [newImage, setNewImage] = useState({ url: '', caption: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appRes, docRes, revRes, galRes] = await Promise.all([
        fetch(`${API_URL}/appointments`),
        fetch(`${API_URL}/doctors`),
        fetch(`${API_URL}/reviews`),
        fetch(`${API_URL}/gallery`)
      ]);
      setAppointments(await appRes.json());
      setDoctors(await docRes.json());
      setReviews(await revRes.json());
      setGallery(await galRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoctor)
      });
      if (res.ok) {
        setNewDoctor({ name: '', specialty: '', qualification: '', experience: '', image: '' });
        fetchData(); // refresh lists
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if(!window.confirm("Are you sure you want to remove this doctor?")) return;
    try {
      await fetch(`${API_URL}/doctors/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newImage)
      });
      if (res.ok) {
        setNewImage({ url: '', caption: '' });
        fetchData();
      }
    } catch (error) {
      console.error("Error adding image:", error);
    }
  };

  const handleDeleteImage = async (id) => {
    if(!window.confirm("Are you sure you want to remove this image?")) return;
    try {
      await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h3>Hospital Admin</h3>
        </div>
        <ul className="admin-nav">
          <li className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}>
            <Calendar size={20}/> Appointments
          </li>
          <li className={activeTab === 'doctors' ? 'active' : ''} onClick={() => setActiveTab('doctors')}>
            <Users size={20}/> Doctors
          </li>
          <li className={activeTab === 'gallery' ? 'active' : ''} onClick={() => setActiveTab('gallery')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg> Gallery
          </li>
          <li className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>
            <MessageSquare size={20}/> Reviews
          </li>
        </ul>
        <div className="admin-logout" onClick={onLogout}>
          <LogOut size={20}/> Logout
        </div>
      </div>

      <div className="admin-content">
        {/* APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div>
            <div className="admin-header">
              <h2>Recent Appointments</h2>
            </div>
            <div className="admin-table-container glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date/Time Requested</th>
                    <th>Patient Name</th>
                    <th>Phone</th>
                    <th>Date Preference</th>
                    <th>Department</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-4">No appointments found.</td></tr>
                  ) : (
                    appointments.slice().reverse().map(app => (
                      <tr key={app.id}>
                        <td>{new Date(app.createdAt).toLocaleString()}</td>
                        <td><strong>{app.name}</strong></td>
                        <td>{app.phone}</td>
                        <td>{app.date}</td>
                        <td>{app.department}</td>
                        <td>{app.message}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DOCTORS TAB */}
        {activeTab === 'doctors' && (
          <div>
            <div className="admin-header">
              <h2>Manage Doctors</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-4">
                <h3>Add New Doctor</h3>
                <form onSubmit={handleAddDoctor} className="mt-4">
                  <div className="form-group mb-3">
                    <input type="text" placeholder="Full Name" className="form-control" value={newDoctor.name} onChange={e => setNewDoctor({...newDoctor, name: e.target.value})} required />
                  </div>
                  <div className="form-group mb-3">
                    <input type="text" placeholder="Specialty (e.g. Pediatrician)" className="form-control" value={newDoctor.specialty} onChange={e => setNewDoctor({...newDoctor, specialty: e.target.value})} required />
                  </div>
                  <div className="form-group mb-3">
                    <input type="text" placeholder="Qualifications (e.g. MBBS, MD)" className="form-control" value={newDoctor.qualification} onChange={e => setNewDoctor({...newDoctor, qualification: e.target.value})} required />
                  </div>
                  <div className="form-group mb-3">
                    <input type="text" placeholder="Experience (e.g. 10+ Years)" className="form-control" value={newDoctor.experience} onChange={e => setNewDoctor({...newDoctor, experience: e.target.value})} required />
                  </div>
                  <div className="form-group mb-3">
                    <input type="text" placeholder="Image URL (e.g. https://...)" className="form-control" value={newDoctor.image} onChange={e => setNewDoctor({...newDoctor, image: e.target.value})} required />
                  </div>
                  <button type="submit" className="btn btn-primary w-100"><Plus size={18}/> Add Doctor</button>
                </form>
              </div>

              <div className="glass-panel p-4" style={{maxHeight: '600px', overflowY: 'auto'}}>
                <h3>Current Doctors</h3>
                <div className="mt-4 flex flex-col gap-3">
                  {doctors.map(doc => (
                    <div key={doc.id} className="admin-list-item">
                      <div className="flex align-center gap-3">
                        <img src={doc.image} alt={doc.name} style={{width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover'}} />
                        <div>
                          <strong>{doc.name}</strong>
                          <p style={{fontSize: '0.8rem', color: '#666', margin: 0}}>{doc.specialty}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteDoctor(doc.id)} className="btn-icon text-danger" title="Delete"><Trash2 size={20}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div>
            <div className="admin-header">
              <h2>Manage Gallery</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-4">
                <h3>Add New Photo</h3>
                <form onSubmit={handleAddImage} className="mt-4">
                  <div className="form-group mb-3">
                    <input type="text" placeholder="Image URL (e.g. https://...)" className="form-control" value={newImage.url} onChange={e => setNewImage({...newImage, url: e.target.value})} required />
                  </div>
                  <div className="form-group mb-3">
                    <input type="text" placeholder="Caption (e.g. Modern OT Room)" className="form-control" value={newImage.caption} onChange={e => setNewImage({...newImage, caption: e.target.value})} />
                  </div>
                  <button type="submit" className="btn btn-primary w-100"><Plus size={18}/> Add Photo</button>
                </form>
              </div>

              <div className="glass-panel p-4" style={{maxHeight: '600px', overflowY: 'auto'}}>
                <h3>Current Photos</h3>
                <div className="mt-4 flex flex-col gap-3">
                  {gallery.map(img => (
                    <div key={img.id} className="admin-list-item">
                      <div className="flex align-center gap-3">
                        <img src={img.url} alt={img.caption} style={{width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover'}} />
                        <div>
                          <strong>{img.caption || 'No Caption'}</strong>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteImage(img.id)} className="btn-icon text-danger" title="Delete"><Trash2 size={20}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS TAB (Read Only for now) */}
        {activeTab === 'reviews' && (
          <div>
            <div className="admin-header">
              <h2>Patient Reviews</h2>
              <p>Reviews are currently managed via Google Reviews.</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {reviews.map(rev => (
                <div key={rev.id} className="glass-panel p-4">
                  <strong>{rev.author}</strong>
                  <div style={{color: '#FFD700', margin: '0.5rem 0'}}>{"★".repeat(rev.rating)}</div>
                  <p style={{fontSize: '0.9rem'}}>{rev.text}</p>
                  <small style={{color: '#888'}}>{rev.time}</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
