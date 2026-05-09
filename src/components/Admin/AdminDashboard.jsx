import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, Plus, Trash2, LogOut, Edit2, Settings, Lock, Mail, Phone, Image as ImageIcon, ShieldCheck, Download, Filter, X, Megaphone } from 'lucide-react';
import * as XLSX from 'xlsx';
import './AdminDashboard.css';

const API_URL = '/api';

const AdminDashboard = ({ onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDates, setExportDates] = useState({ start: '', end: '' });
  const [doctors, setDoctors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [siteSettings, setSiteSettings] = useState({
    notificationEmail: '',
    adminPassword: '',
    contactPhone: '',
    senderEmail: '',
    senderAppPassword: '',
    twilioSid: '',
    twilioAuthToken: '',
    twilioFrom: '',
    whatsappNumber: ''
  });
  
  // Form States
  const [newDepartment, setNewDepartment] = useState({ name: '' });
  const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '', qualification: '', experience: '', image: '', availability: '' });
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [newImage, setNewImage] = useState({ url: '', caption: '' });
  const [editingImageId, setEditingImageId] = useState(null);
  const [newReview, setNewReview] = useState({ author: '', text: '', rating: 5, time: '' });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [newInsurance, setNewInsurance] = useState({ name: '', logo: '' });
  const [editingInsuranceId, setEditingInsuranceId] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({ title: '', description: '', image: '', isActive: true, buttonText: 'Book Now' });
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: '', content: '', image: '', category: 'General Health' });
  const [editingBlogId, setEditingBlogId] = useState(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const fetchData = async () => {
    const token = sessionStorage.getItem('adminToken');
    try {
      const [appRes, docRes, revRes, galRes, insRes, setRes, deptRes, camRes, blogRes] = await Promise.all([
        fetch(`${API_URL}/appointments`, { headers: { 'Authorization': token } }),
        fetch(`${API_URL}/doctors`), // Public
        fetch(`${API_URL}/reviews`), // Public
        fetch(`${API_URL}/gallery`), // Public
        fetch(`${API_URL}/insurance`), // Public
        fetch(`${API_URL}/settings`, { headers: { 'Authorization': token } }),
        fetch(`${API_URL}/departments`), // Public
        fetch(`${API_URL}/campaigns`), // Public
        fetch(`${API_URL}/blogs`) // Public
      ]);
      
      if (appRes.status === 403 || setRes.status === 403) {
        handleLogout();
        return;
      }
      const appData = await appRes.json();
      const docData = await docRes.json();
      const revData = await revRes.json();
      const galData = await galRes.json();
      const insData = await insRes.json();
      const setData = await setRes.json();
      const deptData = await deptRes.json();
      const camData = await camRes.json();
      const blogData = await blogRes.json();

      if (Array.isArray(appData)) setAppointments(appData);
      if (Array.isArray(docData)) setDoctors(docData);
      if (Array.isArray(revData)) setReviews(revData);
      if (Array.isArray(galData)) setGallery(galData);
      if (Array.isArray(insData)) setInsurances(insData);
      if (setData && !setData.error) setSiteSettings(setData);
      if (Array.isArray(deptData)) setDepartments(deptData);
      if (Array.isArray(camData)) setCampaigns(camData);
      if (Array.isArray(blogData)) setBlogs(blogData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    const method = editingBlogId ? 'PUT' : 'POST';
    const url = editingBlogId ? `${API_URL}/blogs/${editingBlogId}` : `${API_URL}/blogs`;
    try {
      const payload = { ...newBlog };
      delete payload._id; delete payload.__v; delete payload.id;
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('adminToken')
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNewBlog({ title: '', content: '', image: '', category: 'General Health' });
        setEditingBlogId(null);
        fetchData();
        alert('Health Tip updated successfully!');
      } else { alert('Failed to update Health Tip'); }
    } catch (err) { console.error(err); }
  };

  const handleAddCampaign = async (e) => {
    e.preventDefault();
    const method = editingCampaignId ? 'PUT' : 'POST';
    const url = editingCampaignId ? `${API_URL}/campaigns/${editingCampaignId}` : `${API_URL}/campaigns`;
    try {
      const payload = { ...newCampaign };
      delete payload._id; delete payload.__v; delete payload.id;
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('adminToken')
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNewCampaign({ title: '', description: '', image: '', isActive: true, buttonText: 'Book Now' });
        setEditingCampaignId(null);
        fetchData();
        alert('Campaign updated successfully!');
      } else { alert('Failed to update campaign'); }
    } catch (err) { console.error(err); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        sessionStorage.setItem('adminAuth', 'true');
        sessionStorage.setItem('adminToken', data.token);
        setLoginError('');
      } else {
        setLoginError('Invalid password. Please try again.');
      }
    } catch (error) {
      setLoginError('Server error. Please try again later.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword(''); // Clear the password field
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminToken');
    if (onLogout) onLogout();
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('adminToken')
        },
        body: JSON.stringify(siteSettings)
      });
      if (res.ok) {
        alert('Settings updated successfully!');
        fetchData();
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  // --- HANDLERS (Add/Edit/Delete) ---
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    const method = editingDoctorId ? 'PUT' : 'POST';
    const url = editingDoctorId ? `${API_URL}/doctors/${editingDoctorId}` : `${API_URL}/doctors`;
    try {
      // Clean up the object to avoid sending internal IDs to the backend
      const payload = { ...newDoctor };
      delete payload._id;
      delete payload.__v;
      delete payload.id;

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('adminToken')
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNewDoctor({ name: '', specialty: '', qualification: '', experience: '', image: '', availability: '' });
        setEditingDoctorId(null);
        fetchData();
        alert(`Doctor ${editingDoctorId ? 'updated' : 'added'} successfully!`);
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error || 'Operation failed'}`);
      }
    } catch (err) { 
      console.error(err);
      alert("System error. Please try again.");
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    const method = editingImageId ? 'PUT' : 'POST';
    const url = editingImageId ? `${API_URL}/gallery/${editingImageId}` : `${API_URL}/gallery`;
    try {
      const payload = { ...newImage };
      delete payload._id; delete payload.__v; delete payload.id;
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('adminToken')
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNewImage({ url: '', caption: '' });
        setEditingImageId(null);
        fetchData();
        alert('Gallery updated successfully!');
      } else { alert('Failed to update gallery'); }
    } catch (err) { console.error(err); }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    const method = editingReviewId ? 'PUT' : 'POST';
    const url = editingReviewId ? `${API_URL}/reviews/${editingReviewId}` : `${API_URL}/reviews`;
    try {
      const payload = { ...newReview };
      delete payload._id; delete payload.__v; delete payload.id;
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('adminToken')
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNewReview({ author: '', text: '', rating: 5, time: '' });
        setEditingReviewId(null);
        fetchData();
        alert('Review updated successfully!');
      } else { alert('Failed to update review'); }
    } catch (err) { console.error(err); }
  };

  const handleAddInsurance = async (e) => {
    e.preventDefault();
    const method = editingInsuranceId ? 'PUT' : 'POST';
    const url = editingInsuranceId ? `${API_URL}/insurance/${editingInsuranceId}` : `${API_URL}/insurance`;
    try {
      const payload = { ...newInsurance };
      delete payload._id; delete payload.__v; delete payload.id;
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('adminToken')
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNewInsurance({ name: '', logo: '' });
        setEditingInsuranceId(null);
        fetchData();
        alert('Insurance updated successfully!');
      } else { alert('Failed to update insurance'); }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to remove this ${type}?`)) return;
    try {
      await fetch(`${API_URL}/${type === 'insurance' ? 'insurance' : (type === 'departments' ? 'departments' : type)}/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': sessionStorage.getItem('adminToken') }
      });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/departments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('adminToken')
        },
        body: JSON.stringify(newDepartment)
      });
      if (res.ok) {
        setNewDepartment({ name: '' });
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('adminToken')
        },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleExportExcel = () => {
    let filtered = [...appointments];
    
    if (exportDates.start) {
      const start = new Date(exportDates.start);
      filtered = filtered.filter(a => new Date(a.createdAt) >= start);
    }
    
    if (exportDates.end) {
      const end = new Date(exportDates.end);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(a => new Date(a.createdAt) <= end);
    }

    if (filtered.length === 0) {
      alert("No appointments found in this date range.");
      return;
    }

    const dataToExport = filtered.map(a => ({
      "Requested Date": new Date(a.createdAt).toLocaleString(),
      "Patient Name": a.name,
      "Phone": a.phone,
      "Appointment Date": a.date,
      "Department": a.department,
      "Status": a.status,
      "Message": a.message
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Appointments");
    XLSX.writeFile(wb, `Hospital_Appointments_${new Date().toISOString().split('T')[0]}.xlsx`);
    setShowExportModal(false);
  };

  const pendingAppointments = Array.isArray(appointments) ? appointments.filter(a => a.status === 'pending') : [];
  const completedAppointments = Array.isArray(appointments) ? appointments.filter(a => a.status === 'completed') : [];
  const [appointmentView, setAppointmentView] = useState('pending');

  if (!isLoggedIn) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card glass-panel">
          <div className="text-center mb-4">
            <Lock size={48} color="var(--primary)" />
            <h2 className="mt-3">Hospital Admin</h2>
            <p className="text-muted">Enter password to manage website</p>
          </div>
          <form onSubmit={handleLogin}>
            <input type="password" placeholder="Password" className="form-control mb-3" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {loginError && <p className="text-danger small mb-3">{loginError}</p>}
            <button type="submit" className="btn btn-primary w-100 py-2">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-logo"><h3>Admin Panel</h3></div>
        <ul className="admin-nav">
          <li className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}><Calendar size={20}/> <span>Appointments</span></li>
          <li className={activeTab === 'departments' ? 'active' : ''} onClick={() => setActiveTab('departments')}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg> <span>Departments</span></li>
          <li className={activeTab === 'doctors' ? 'active' : ''} onClick={() => setActiveTab('doctors')}><Users size={20}/> <span>Doctors</span></li>
          <li className={activeTab === 'gallery' ? 'active' : ''} onClick={() => setActiveTab('gallery')}><ImageIcon size={20}/> <span>Gallery</span></li>
          <li className={activeTab === 'insurance' ? 'active' : ''} onClick={() => setActiveTab('insurance')}><ShieldCheck size={20}/> <span>Insurance</span></li>
          <li className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}><MessageSquare size={20}/> <span>Reviews</span></li>
          <li className={activeTab === 'campaigns' ? 'active' : ''} onClick={() => setActiveTab('campaigns')}><Megaphone size={20}/> <span>Campaigns</span></li>
          <li className={activeTab === 'blogs' ? 'active' : ''} onClick={() => setActiveTab('blogs')}><FileText size={20}/> <span>Health Tips</span></li>
          <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}><Settings size={20}/> <span>Settings</span></li>
        </ul>
        <div className="admin-logout" onClick={handleLogout}><LogOut size={20}/> <span>Logout</span></div>
      </div>

      <div className="admin-content">
        {/* APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div>
            <div className="admin-header flex justify-between align-center">
              <h2>Appointments</h2>
              <div className="flex gap-2 align-center">
                <button 
                  className="btn btn-outline flex align-center gap-2" 
                  onClick={() => setShowExportModal(true)}
                  style={{ borderColor: 'var(--admin-primary)', color: 'var(--admin-primary)' }}
                >
                  <Download size={18}/> Export Excel
                </button>
                <div className="flex gap-2 ml-4" style={{ marginLeft: '1rem', borderLeft: '1px solid #ddd', paddingLeft: '1rem' }}>
                  <button className={`btn ${appointmentView === 'pending' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setAppointmentView('pending')}>Pending ({pendingAppointments.length})</button>
                  <button className={`btn ${appointmentView === 'completed' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setAppointmentView('completed')}>History</button>
                </div>
              </div>
            </div>

            {showExportModal && (
              <div className="export-modal-overlay">
                <div className="export-modal glass-panel p-4">
                  <div className="flex justify-between align-center mb-4">
                    <h3>Export Appointments</h3>
                    <button className="btn-icon" onClick={() => setShowExportModal(false)}><X size={20}/></button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="form-label">From Date</label>
                      <input type="date" className="form-control" value={exportDates.start} onChange={e => setExportDates({...exportDates, start: e.target.value})} />
                    </div>
                    <div>
                      <label className="form-label">To Date</label>
                      <input type="date" className="form-control" value={exportDates.end} onChange={e => setExportDates({...exportDates, end: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-primary w-100" onClick={handleExportExcel}>Download Excel Report</button>
                    <button className="btn btn-outline w-100" onClick={() => { setExportDates({start:'', end:''}); handleExportExcel(); }}>Export All</button>
                  </div>
                </div>
              </div>
            )}

            <div className="admin-table-container glass-panel mt-4">
              <table className="admin-table">
                <thead><tr><th>Patient</th><th>Details</th><th>Message / Reports</th>{appointmentView === 'pending' ? <th>Action</th> : <th>Doctor Notes</th>}</tr></thead>
                <tbody>
                  {(appointmentView === 'pending' ? pendingAppointments : completedAppointments).map(app => (
                    <tr key={app.id}>
                      <td><strong>{app.name}</strong><br/><small>{new Date(app.createdAt).toLocaleDateString()}</small><br/>{app.phone}</td>
                      <td><strong>Date:</strong> {app.date}<br/><strong>Dept:</strong> {app.department}</td>
                      <td>
                        <p className="text-sm mb-2">{app.message}</p>
                        {app.reportUrl && <a href={app.reportUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">View Report</a>}
                      </td>
                      {appointmentView === 'pending' ? (
                        <td><button onClick={() => handleUpdateStatus(app.id, 'completed')} className="btn btn-primary btn-sm">Complete Appointment</button></td>
                      ) : (
                        <td>
                          <textarea 
                            className="form-control text-xs" 
                            placeholder="Add notes/prescription..." 
                            defaultValue={app.doctorNotes} 
                            onBlur={async (e) => {
                              if (e.target.value === app.doctorNotes) return;
                              await fetch(`${API_URL}/appointments/${app.id}/notes`, {
                                method: 'PATCH',
                                headers: { 
                                  'Content-Type': 'application/json',
                                  'Authorization': sessionStorage.getItem('adminToken')
                                },
                                body: JSON.stringify({ notes: e.target.value })
                              });
                              fetchData();
                            }}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4">
              <h3>Add New Department</h3>
              <form onSubmit={handleAddDepartment} className="mt-4">
                <input type="text" placeholder="Department Name (e.g. Cardiology)" className="form-control mb-3" value={newDepartment.name} onChange={e => setNewDepartment({name: e.target.value})} required />
                <button type="submit" className="btn btn-primary w-100">Add Department</button>
              </form>
            </div>
            <div className="glass-panel p-4 overflow-auto">
              <h3>Current Departments</h3>
              {departments.map(dept => (
                <div key={dept.id} className="admin-list-item mt-3">
                  <strong>{dept.name}</strong>
                  <button onClick={() => handleDelete('departments', dept.id)} className="btn-icon text-danger"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCTORS */}
        {activeTab === 'doctors' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4">
              <h3>{editingDoctorId ? 'Edit Doctor' : 'Add Doctor'}</h3>
              <form onSubmit={handleAddDoctor} className="mt-4">
                <input type="text" placeholder="Name" className="form-control mb-3" value={newDoctor.name} onChange={e => setNewDoctor({...newDoctor, name: e.target.value})} required />
                <input type="text" placeholder="Specialty" className="form-control mb-3" value={newDoctor.specialty} onChange={e => setNewDoctor({...newDoctor, specialty: e.target.value})} required />
                <input type="text" placeholder="Qualification" className="form-control mb-3" value={newDoctor.qualification} onChange={e => setNewDoctor({...newDoctor, qualification: e.target.value})} required />
                <input type="text" placeholder="Experience" className="form-control mb-3" value={newDoctor.experience} onChange={e => setNewDoctor({...newDoctor, experience: e.target.value})} required />
                <input type="text" placeholder="Image URL" className="form-control mb-3" value={newDoctor.image} onChange={e => setNewDoctor({...newDoctor, image: e.target.value})} required />
                <label className="form-label">Available Hours</label>
                <input type="text" placeholder="e.g. Mon-Fri: 10AM - 5PM" className="form-control mb-3" value={newDoctor.availability} onChange={e => setNewDoctor({...newDoctor, availability: e.target.value})} />
                <button type="submit" className="btn btn-primary w-100">{editingDoctorId ? 'Update' : 'Add'}</button>
                {editingDoctorId && <button onClick={() => {setEditingDoctorId(null); setNewDoctor({name:'',specialty:'',qualification:'',experience:'',image:'',availability:''})}} className="btn btn-outline w-100 mt-2">Cancel</button>}
              </form>
            </div>
            <div className="glass-panel p-4 overflow-auto">
              <h3>Current Doctors</h3>
              {doctors.map(doc => (
                <div key={doc.id} className="admin-list-item mt-3">
                  <div className="flex gap-3"><img src={doc.image} style={{width:'50px',height:'50px',borderRadius:'50%'}}/><div><strong>{doc.name}</strong><p className="text-sm">{doc.specialty}</p></div></div>
                  <div className="flex gap-2">
                    <button onClick={() => {setNewDoctor(doc); setEditingDoctorId(doc.id)}} className="btn-icon"><Edit2 size={18}/></button>
                    <button onClick={() => handleDelete('doctors', doc.id)} className="btn-icon text-danger"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4">
              <h3>{editingImageId ? 'Edit Photo' : 'Add Photo'}</h3>
              <form onSubmit={handleAddImage} className="mt-4">
                <input type="text" placeholder="Image URL" className="form-control mb-3" value={newImage.url} onChange={e => setNewImage({...newImage, url: e.target.value})} required />
                <input type="text" placeholder="Caption" className="form-control mb-3" value={newImage.caption} onChange={e => setNewImage({...newImage, caption: e.target.value})} />
                <button type="submit" className="btn btn-primary w-100">{editingImageId ? 'Update' : 'Add'}</button>
                {editingImageId && <button onClick={() => {setEditingImageId(null); setNewImage({url:'',caption:''})}} className="btn btn-outline w-100 mt-2">Cancel</button>}
              </form>
            </div>
            <div className="glass-panel p-4 overflow-auto">
              <h3>Current Photos</h3>
              {gallery.map(img => (
                <div key={img.id} className="admin-list-item mt-3">
                  <div className="flex gap-3"><img src={img.url} style={{width:'60px',height:'60px',borderRadius:'8px'}}/><strong>{img.caption || 'No Caption'}</strong></div>
                  <div className="flex gap-2">
                    <button onClick={() => {setNewImage(img); setEditingImageId(img.id)}} className="btn-icon"><Edit2 size={18}/></button>
                    <button onClick={() => handleDelete('gallery', img.id)} className="btn-icon text-danger"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INSURANCE */}
        {activeTab === 'insurance' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4">
              <h3>{editingInsuranceId ? 'Edit Insurance' : 'Add Insurance'}</h3>
              <form onSubmit={handleAddInsurance} className="mt-4">
                <input type="text" placeholder="Name" className="form-control mb-3" value={newInsurance.name} onChange={e => setNewInsurance({...newInsurance, name: e.target.value})} required />
                <input type="text" placeholder="Logo URL" className="form-control mb-3" value={newInsurance.logo} onChange={e => setNewInsurance({...newInsurance, logo: e.target.value})} required />
                <button type="submit" className="btn btn-primary w-100">{editingInsuranceId ? 'Update' : 'Add'}</button>
                {editingInsuranceId && <button onClick={() => {setEditingInsuranceId(null); setNewInsurance({name:'',logo:''})}} className="btn btn-outline w-100 mt-2">Cancel</button>}
              </form>
            </div>
            <div className="glass-panel p-4 overflow-auto">
              <h3>Current Partners</h3>
              {insurances.map(ins => (
                <div key={ins.id} className="admin-list-item mt-3">
                  <div className="flex gap-3"><img src={ins.logo} style={{width:'80px',height:'40px',objectFit:'contain'}}/><strong>{ins.name}</strong></div>
                  <div className="flex gap-2">
                    <button onClick={() => {setNewInsurance(ins); setEditingInsuranceId(ins.id)}} className="btn-icon"><Edit2 size={18}/></button>
                    <button onClick={() => handleDelete('insurance', ins.id)} className="btn-icon text-danger"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4">
              <h3>{editingReviewId ? 'Edit Review' : 'Add Review'}</h3>
              <form onSubmit={handleAddReview} className="mt-4">
                <input type="text" placeholder="Patient Name" className="form-control mb-3" value={newReview.author} onChange={e => setNewReview({...newReview, author: e.target.value})} required />
                <textarea placeholder="Review" className="form-control mb-3" rows="3" value={newReview.text} onChange={e => setNewReview({...newReview, text: e.target.value})} required />
                <input type="number" min="1" max="5" placeholder="Rating (1-5)" className="form-control mb-3" value={newReview.rating} onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})} required />
                <input type="text" placeholder="Time (e.g. 2 days ago)" className="form-control mb-3" value={newReview.time} onChange={e => setNewReview({...newReview, time: e.target.value})} required />
                <button type="submit" className="btn btn-primary w-100">{editingReviewId ? 'Update' : 'Add'}</button>
                {editingReviewId && <button onClick={() => {setEditingReviewId(null); setNewReview({author:'',text:'',rating:5,time:''})}} className="btn btn-outline w-100 mt-2">Cancel</button>}
              </form>
            </div>
            <div className="glass-panel p-4 overflow-auto">
              <h3>Current Reviews</h3>
              {reviews.map(rev => (
                <div key={rev.id} className="admin-list-item mt-3">
                  <div><strong>{rev.author}</strong><p className="text-xs">{"★".repeat(rev.rating)}</p><p className="text-sm">{rev.text}</p></div>
                  <div className="flex gap-2">
                    <button onClick={() => {setNewReview(rev); setEditingReviewId(rev.id)}} className="btn-icon"><Edit2 size={18}/></button>
                    <button onClick={() => handleDelete('reviews', rev.id)} className="btn-icon text-danger"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
 
        {/* CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4">
              <h3>{editingCampaignId ? 'Edit Campaign' : 'Add New Campaign'}</h3>
              <form onSubmit={handleAddCampaign} className="mt-4">
                <input type="text" placeholder="Offer Title (e.g. Free Eye Checkup)" className="form-control mb-3" value={newCampaign.title} onChange={e => setNewCampaign({...newCampaign, title: e.target.value})} required />
                <textarea placeholder="Description" className="form-control mb-3" rows="3" value={newCampaign.description} onChange={e => setNewCampaign({...newCampaign, description: e.target.value})} required />
                <input type="text" placeholder="Image URL (Optional)" className="form-control mb-3" value={newCampaign.image} onChange={e => setNewCampaign({...newCampaign, image: e.target.value})} />
                <input type="text" placeholder="Button Text" className="form-control mb-3" value={newCampaign.buttonText} onChange={e => setNewCampaign({...newCampaign, buttonText: e.target.value})} />
                <div className="flex align-center gap-2 mb-3">
                  <input type="checkbox" checked={newCampaign.isActive} onChange={e => setNewCampaign({...newCampaign, isActive: e.target.checked})} />
                  <label>Is Active (Show on Homepage)</label>
                </div>
                <button type="submit" className="btn btn-primary w-100">{editingCampaignId ? 'Update' : 'Add'}</button>
                {editingCampaignId && <button onClick={() => {setEditingCampaignId(null); setNewCampaign({title:'',description:'',image:'',isActive:true,buttonText:'Book Now'})}} className="btn btn-outline w-100 mt-2">Cancel</button>}
              </form>
            </div>
            <div className="glass-panel p-4 overflow-auto">
              <h3>Current Campaigns</h3>
              {campaigns.map(cam => (
                <div key={cam.id} className={`admin-list-item mt-3 ${!cam.isActive ? 'opacity-50' : ''}`}>
                  <div>
                    <strong>{cam.title}</strong>
                    <p className="text-xs text-muted">{cam.isActive ? 'Active' : 'Draft'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {setNewCampaign(cam); setEditingCampaignId(cam.id)}} className="btn-icon"><Edit2 size={18}/></button>
                    <button onClick={() => handleDelete('campaigns', cam.id)} className="btn-icon text-danger"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
 
        {/* BLOGS / HEALTH TIPS */}
        {activeTab === 'blogs' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4">
              <h3>{editingBlogId ? 'Edit Health Tip' : 'Add New Health Tip'}</h3>
              <form onSubmit={handleAddBlog} className="mt-4">
                <input type="text" placeholder="Title (e.g. 5 Tips for a Healthy Heart)" className="form-control mb-3" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} required />
                <input type="text" placeholder="Category (e.g. Cardiology, Wellness)" className="form-control mb-3" value={newBlog.category} onChange={e => setNewBlog({...newBlog, category: e.target.value})} />
                <textarea placeholder="Content / Details" className="form-control mb-3" rows="6" value={newBlog.content} onChange={e => setNewBlog({...newBlog, content: e.target.value})} required />
                <input type="text" placeholder="Cover Image URL" className="form-control mb-3" value={newBlog.image} onChange={e => setNewBlog({...newBlog, image: e.target.value})} />
                <button type="submit" className="btn btn-primary w-100">{editingBlogId ? 'Update' : 'Add'}</button>
                {editingBlogId && <button onClick={() => {setEditingBlogId(null); setNewBlog({title:'',content:'',image:'',category:'General Health'})}} className="btn btn-outline w-100 mt-2">Cancel</button>}
              </form>
            </div>
            <div className="glass-panel p-4 overflow-auto">
              <h3>Current Health Tips</h3>
              {blogs.map(blog => (
                <div key={blog.id} className="admin-list-item mt-3">
                  <div>
                    <strong>{blog.title}</strong>
                    <p className="text-xs text-muted">{blog.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {setNewBlog(blog); setEditingBlogId(blog.id)}} className="btn-icon"><Edit2 size={18}/></button>
                    <button onClick={() => handleDelete('blogs', blog.id)} className="btn-icon text-danger"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div className="glass-panel p-4">
            <h3>Website Settings</h3>
            <form onSubmit={handleUpdateSettings} className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="form-label"><Mail size={16}/> Notification Recipient Email</label>
                <input type="email" className="form-control mb-3" value={siteSettings.notificationEmail} onChange={e => setSiteSettings({...siteSettings, notificationEmail: e.target.value})} placeholder="Receives alerts" />
                <label className="form-label"><Phone size={16}/> Hospital Phone (for Call Button)</label>
                <input type="text" className="form-control mb-3" value={siteSettings.contactPhone} onChange={e => setSiteSettings({...siteSettings, contactPhone: e.target.value})} />
                <label className="form-label"><Lock size={16}/> Admin Password</label>
                <input type="text" className="form-control mb-3" value={siteSettings.adminPassword} onChange={e => setSiteSettings({...siteSettings, adminPassword: e.target.value})} />
              </div>
              <div>
                <h4 className="text-sm font-bold mb-3">Email Sender Configuration (For Alerts)</h4>
                <label className="form-label">Gmail Address</label>
                <input type="email" className="form-control mb-3" value={siteSettings.senderEmail} onChange={e => setSiteSettings({...siteSettings, senderEmail: e.target.value})} />
                <label className="form-label">Gmail App Password</label>
                <input type="password" className="form-control mb-3" value={siteSettings.senderAppPassword} onChange={e => setSiteSettings({...siteSettings, senderAppPassword: e.target.value})} />
                <div className="alert alert-info text-xs mb-4">Go to Google Account &gt; Security &gt; 2-Step Verification &gt; App Passwords to get this.</div>

                <h4 className="text-sm font-bold mb-3">SMS & WhatsApp Alerts (Twilio)</h4>
                <label className="form-label">Twilio SID</label>
                <input type="text" className="form-control mb-3" value={siteSettings.twilioSid} onChange={e => setSiteSettings({...siteSettings, twilioSid: e.target.value})} />
                <label className="form-label">Twilio Auth Token</label>
                <input type="password" className="form-control mb-3" value={siteSettings.twilioAuthToken} onChange={e => setSiteSettings({...siteSettings, twilioAuthToken: e.target.value})} />
                <label className="form-label">Twilio Phone Number</label>
                <input type="text" className="form-control mb-3" value={siteSettings.twilioFrom} onChange={e => setSiteSettings({...siteSettings, twilioFrom: e.target.value})} />
                <label className="form-label">WhatsApp Target Number</label>
                <input type="text" className="form-control mb-3" value={siteSettings.whatsappNumber} onChange={e => setSiteSettings({...siteSettings, whatsappNumber: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary px-5 col-span-2">Save All Settings</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
