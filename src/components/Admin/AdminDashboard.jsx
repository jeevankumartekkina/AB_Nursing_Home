import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, Plus, Trash2, LogOut, Edit2 } from 'lucide-react';
import './AdminDashboard.css';

const API_URL = '/api';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [insurances, setInsurances] = useState([]);
  
  // New Doctor Form State
  const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '', qualification: '', experience: '', image: '' });
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  
  // New Gallery Form State
  const [newImage, setNewImage] = useState({ url: '', caption: '' });
  const [editingImageId, setEditingImageId] = useState(null);

  // New Review Form State
  const [newReview, setNewReview] = useState({ author: '', text: '', rating: 5, time: '' });
  const [editingReviewId, setEditingReviewId] = useState(null);

  // New Insurance Form State
  const [newInsurance, setNewInsurance] = useState({ name: '', logo: '' });
  const [editingInsuranceId, setEditingInsuranceId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appRes, docRes, revRes, galRes, insRes] = await Promise.all([
        fetch(`${API_URL}/appointments`),
        fetch(`${API_URL}/doctors`),
        fetch(`${API_URL}/reviews`),
        fetch(`${API_URL}/gallery`),
        fetch(`${API_URL}/insurance`)
      ]);
      setAppointments(await appRes.json());
      setDoctors(await docRes.json());
      setReviews(await revRes.json());
      setGallery(await galRes.json());
      setInsurances(await insRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctorId) {
        const res = await fetch(`${API_URL}/doctors/${editingDoctorId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDoctor)
        });
        if (res.ok) {
          setNewDoctor({ name: '', specialty: '', qualification: '', experience: '', image: '' });
          setEditingDoctorId(null);
          fetchData();
        }
      } else {
        const res = await fetch(`${API_URL}/doctors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDoctor)
        });
        if (res.ok) {
          setNewDoctor({ name: '', specialty: '', qualification: '', experience: '', image: '' });
          fetchData();
        }
      }
    } catch (error) {
      console.error("Error saving doctor:", error);
    }
  };

  const handleEditDoctorClick = (doctor) => {
    setNewDoctor({
      name: doctor.name,
      specialty: doctor.specialty,
      qualification: doctor.qualification,
      experience: doctor.experience,
      image: doctor.image
    });
    setEditingDoctorId(doctor.id);
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
      if (editingImageId) {
        const res = await fetch(`${API_URL}/gallery/${editingImageId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newImage)
        });
        if (res.ok) {
          setNewImage({ url: '', caption: '' });
          setEditingImageId(null);
          fetchData();
        }
      } else {
        const res = await fetch(`${API_URL}/gallery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newImage)
        });
        if (res.ok) {
          setNewImage({ url: '', caption: '' });
          fetchData();
        }
      }
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  const handleEditImageClick = (image) => {
    setNewImage({
      url: image.url,
      caption: image.caption || ''
    });
    setEditingImageId(image.id);
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

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      if (editingReviewId) {
        const res = await fetch(`${API_URL}/reviews/${editingReviewId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReview)
        });
        if (res.ok) {
          setNewReview({ author: '', text: '', rating: 5, time: '' });
          setEditingReviewId(null);
          fetchData();
        }
      } else {
        const res = await fetch(`${API_URL}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReview)
        });
        if (res.ok) {
          setNewReview({ author: '', text: '', rating: 5, time: '' });
          fetchData();
        }
      }
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  const handleEditReviewClick = (review) => {
    setNewReview({
      author: review.author,
      text: review.text,
      rating: review.rating,
      time: review.time
    });
    setEditingReviewId(review.id);
  };

  const handleDeleteReview = async (id) => {
    if(!window.confirm("Are you sure you want to remove this review?")) return;
    try {
      await fetch(`${API_URL}/reviews/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleAddInsurance = async (e) => {
    e.preventDefault();
    try {
      if (editingInsuranceId) {
        const res = await fetch(`${API_URL}/insurance/${editingInsuranceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newInsurance)
        });
        if (res.ok) {
          setNewInsurance({ name: '', logo: '' });
          setEditingInsuranceId(null);
          fetchData();
        }
      } else {
        const res = await fetch(`${API_URL}/insurance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newInsurance)
        });
        if (res.ok) {
          setNewInsurance({ name: '', logo: '' });
          fetchData();
        }
      }
    } catch (error) {
      console.error("Error saving insurance:", error);
    }
  };

  const handleEditInsuranceClick = (ins) => {
    setNewInsurance({
      name: ins.name,
      logo: ins.logo
    });
    setEditingInsuranceId(ins.id);
  };

  const handleDeleteInsurance = async (id) => {
    if(!window.confirm("Are you sure you want to remove this insurance?")) return;
    try {
      await fetch(`${API_URL}/insurance/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error("Error deleting insurance:", error);
    }
  };

  const [appointmentView, setAppointmentView] = useState('pending');

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  const renderAppointmentsTable = (appts, isPending) => (
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
            {isPending && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {appts.length === 0 ? (
            <tr><td colSpan={isPending ? "7" : "6"} className="text-center py-4">No appointments found.</td></tr>
          ) : (
            appts.map(app => (
              <tr key={app.id}>
                <td>{new Date(app.createdAt).toLocaleString()}</td>
                <td><strong>{app.name}</strong></td>
                <td>{app.phone}</td>
                <td>{app.date}</td>
                <td>{app.department}</td>
                <td>{app.message}</td>
                {isPending && (
                  <td>
                    <button 
                      onClick={() => handleUpdateStatus(app.id, 'completed')}
                      className="btn btn-primary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    >
                      Mark Complete
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

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
          <li className={activeTab === 'insurance' ? 'active' : ''} onClick={() => setActiveTab('insurance')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg> Insurance
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
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Manage Appointments</h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className={`btn ${appointmentView === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setAppointmentView('pending')}
                  style={appointmentView !== 'pending' ? { background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)' } : {}}
                >
                  Pending Requests ({pendingAppointments.length})
                </button>
                <button 
                  className={`btn ${appointmentView === 'completed' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setAppointmentView('completed')}
                  style={appointmentView !== 'completed' ? { background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)' } : {}}
                >
                  Completed History
                </button>
              </div>
            </div>
            
            {appointmentView === 'pending' 
              ? renderAppointmentsTable(pendingAppointments, true)
              : renderAppointmentsTable(completedAppointments, false)
            }
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
                <h3>{editingDoctorId ? 'Edit Doctor' : 'Add New Doctor'}</h3>
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
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary w-100">
                      {editingDoctorId ? 'Update Doctor' : <><Plus size={18}/> Add Doctor</>}
                    </button>
                    {editingDoctorId && (
                      <button type="button" className="btn btn-outline w-100" onClick={() => { setEditingDoctorId(null); setNewDoctor({ name: '', specialty: '', qualification: '', experience: '', image: '' }); }}>
                        Cancel
                      </button>
                    )}
                  </div>
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
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEditDoctorClick(doc)} className="btn-icon" style={{ color: 'var(--primary)' }} title="Edit"><Edit2 size={20}/></button>
                        <button onClick={() => handleDeleteDoctor(doc.id)} className="btn-icon text-danger" title="Delete"><Trash2 size={20}/></button>
                      </div>
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
                <h3>{editingImageId ? 'Edit Photo' : 'Add New Photo'}</h3>
                <form onSubmit={handleAddImage} className="mt-4">
                  <div className="form-group mb-3">
                    <input type="text" placeholder="Image URL (e.g. https://...)" className="form-control" value={newImage.url} onChange={e => setNewImage({...newImage, url: e.target.value})} required />
                  </div>
                  <div className="form-group mb-3">
                    <input type="text" placeholder="Caption (e.g. Modern OT Room)" className="form-control" value={newImage.caption} onChange={e => setNewImage({...newImage, caption: e.target.value})} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary w-100">
                      {editingImageId ? 'Update Photo' : <><Plus size={18}/> Add Photo</>}
                    </button>
                    {editingImageId && (
                      <button type="button" className="btn btn-outline w-100" onClick={() => { setEditingImageId(null); setNewImage({ url: '', caption: '' }); }}>
                        Cancel
                      </button>
                    )}
                  </div>
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
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEditImageClick(img)} className="btn-icon" style={{ color: 'var(--primary)' }} title="Edit"><Edit2 size={20}/></button>
                        <button onClick={() => handleDeleteImage(img.id)} className="btn-icon text-danger" title="Delete"><Trash2 size={20}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div>
            <div className="admin-header">
              <h2>Manage Patient Reviews</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-4">
                <h3>{editingReviewId ? 'Edit Review' : 'Add New Review'}</h3>
                <form onSubmit={handleAddReview} className="mt-4">
                  <div className="form-group mb-3">
                    <input type="text" placeholder="Patient Name" className="form-control" value={newReview.author} onChange={e => setNewReview({...newReview, author: e.target.value})} required />
                  </div>
                  <div className="form-group mb-3">
                    <textarea placeholder="Review Text" className="form-control" value={newReview.text} onChange={e => setNewReview({...newReview, text: e.target.value})} required rows="3" />
                  </div>
                  <div className="form-group mb-3">
                    <input type="number" placeholder="Rating (1-5)" className="form-control" min="1" max="5" value={newReview.rating} onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})} required />
                  </div>
                  <div className="form-group mb-3">
                    <input type="text" placeholder="Time (e.g. 2 days ago)" className="form-control" value={newReview.time} onChange={e => setNewReview({...newReview, time: e.target.value})} required />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary w-100">
                      {editingReviewId ? 'Update Review' : <><Plus size={18}/> Add Review</>}
                    </button>
                    {editingReviewId && (
                      <button type="button" className="btn btn-outline w-100" onClick={() => { setEditingReviewId(null); setNewReview({ author: '', text: '', rating: 5, time: '' }); }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="glass-panel p-4" style={{maxHeight: '600px', overflowY: 'auto'}}>
                <h3>Current Reviews</h3>
                <div className="mt-4 flex flex-col gap-3">
                  {reviews.map(rev => (
                    <div key={rev.id} className="admin-list-item">
                      <div className="flex flex-col gap-1" style={{ width: '100%' }}>
                        <strong>{rev.author}</strong>
                        <div style={{color: '#FFD700', fontSize: '0.9rem'}}>{"★".repeat(rev.rating)}</div>
                        <p style={{fontSize: '0.85rem', margin: '0.25rem 0', color: '#555'}}>{rev.text}</p>
                        <small style={{color: '#888'}}>{rev.time}</small>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-start' }}>
                        <button onClick={() => handleEditReviewClick(rev)} className="btn-icon" style={{ color: 'var(--primary)' }} title="Edit"><Edit2 size={20}/></button>
                        <button onClick={() => handleDeleteReview(rev.id)} className="btn-icon text-danger" title="Delete"><Trash2 size={20}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INSURANCE TAB */}
        {activeTab === 'insurance' && (
          <div>
            <div className="admin-header">
              <h2>Manage Insurance Partners</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-4">
                <h3>{editingInsuranceId ? 'Edit Insurance' : 'Add New Insurance'}</h3>
                <form onSubmit={handleAddInsurance} className="mt-4">
                  <div className="form-group mb-3">
                    <input type="text" placeholder="Insurance Name" className="form-control" value={newInsurance.name} onChange={e => setNewInsurance({...newInsurance, name: e.target.value})} required />
                  </div>
                  <div className="form-group mb-3">
                    <input type="text" placeholder="Logo URL (e.g. https://...)" className="form-control" value={newInsurance.logo} onChange={e => setNewInsurance({...newInsurance, logo: e.target.value})} required />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary w-100">
                      {editingInsuranceId ? 'Update Insurance' : <><Plus size={18}/> Add Insurance</>}
                    </button>
                    {editingInsuranceId && (
                      <button type="button" className="btn btn-outline w-100" onClick={() => { setEditingInsuranceId(null); setNewInsurance({ name: '', logo: '' }); }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="glass-panel p-4" style={{maxHeight: '600px', overflowY: 'auto'}}>
                <h3>Current Partners</h3>
                <div className="mt-4 flex flex-col gap-3">
                  {insurances.map(ins => (
                    <div key={ins.id} className="admin-list-item">
                      <div className="flex align-center gap-3">
                        <img src={ins.logo} alt={ins.name} style={{width: '100px', height: '40px', objectFit: 'contain', background: '#f8f9fa', padding: '5px', borderRadius: '4px'}} />
                        <strong>{ins.name}</strong>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEditInsuranceClick(ins)} className="btn-icon" style={{ color: 'var(--primary)' }} title="Edit"><Edit2 size={20}/></button>
                        <button onClick={() => handleDeleteInsurance(ins.id)} className="btn-icon text-danger" title="Delete"><Trash2 size={20}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
