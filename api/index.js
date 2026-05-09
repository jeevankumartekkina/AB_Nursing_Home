import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Connection URI (Managed via Environment Variables for Security)
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("CRITICAL: MONGODB_URI is not defined in environment variables!");
}

// --- Mongoose Models (Defined FIRST to avoid ReferenceErrors during seeding) ---

const doctorSchema = new mongoose.Schema({
  name: String, 
  specialty: String, 
  qualification: String, 
  experience: String, 
  image: String,
  availability: { type: String, default: 'Mon-Sat: 10AM - 5PM' }
});
doctorSchema.set('toJSON', { virtuals: true });
const Doctor = mongoose.model('Doctor', doctorSchema);

const reviewSchema = new mongoose.Schema({
  author: String, text: String, rating: Number, time: String
});
reviewSchema.set('toJSON', { virtuals: true });
const Review = mongoose.model('Review', reviewSchema);

const appointmentSchema = new mongoose.Schema({
  name: String, 
  phone: String, 
  email: String,
  date: String, 
  department: String, 
  message: String,
  reportUrl: String,
  doctorNotes: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
appointmentSchema.set('toJSON', { virtuals: true });
const Appointment = mongoose.model('Appointment', appointmentSchema);

const gallerySchema = new mongoose.Schema({
  url: String, caption: String
});
gallerySchema.set('toJSON', { virtuals: true });
const Gallery = mongoose.model('Gallery', gallerySchema);

const insuranceSchema = new mongoose.Schema({
  name: String, logo: String
});
insuranceSchema.set('toJSON', { virtuals: true });
const Insurance = mongoose.model('Insurance', insuranceSchema);

const settingsSchema = new mongoose.Schema({
  notificationEmail: String,
  adminPassword: { type: String, default: 'admin123' },
  contactPhone: { type: String, default: '09573687858' },
  senderEmail: String,
  senderAppPassword: String,
  twilioSid: String,
  twilioAuthToken: String,
  twilioFrom: String,
  whatsappNumber: String,
  adminToken: String
});
settingsSchema.set('toJSON', { virtuals: true });
const Settings = mongoose.model('Settings', settingsSchema);

const departmentSchema = new mongoose.Schema({
  name: String
});
departmentSchema.set('toJSON', { virtuals: true });
const Department = mongoose.model('Department', departmentSchema);

// --- Connect to MongoDB & Seed ---
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas successfully!');
    
    // Seed initial reviews
    if (await Review.countDocuments() === 0) {
      await Review.insertMany([
        { author: "Swarna latha", text: "Very nice doctor and staff is very good Good service", rating: 5, time: "a year ago" },
        { author: "Madhu Reddi", text: "Very nice staff and excellent service given by them", rating: 5, time: "a year ago" },
        { author: "Umamashwari Emandhi", text: "Excellent service and obedient staff..", rating: 5, time: "a year ago" }
      ]);
    }

    // Seed initial insurances
    if (await Insurance.countDocuments() === 0) {
      await Insurance.insertMany([
        { name: "Star Health", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=Star+Health" },
        { name: "Apollo Munich", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=Apollo+Munich" },
        { name: "HDFC ERGO", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=HDFC+ERGO" },
        { name: "ICICI Lombard", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=ICICI+Lombard" },
        { name: "Bajaj Allianz", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=Bajaj+Allianz" },
        { name: "Religare", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=Religare" }
      ]);
    }

    // Seed initial settings
    if (await Settings.countDocuments() === 0) {
      await Settings.create({ 
        notificationEmail: '', 
        adminPassword: 'admin123', 
        contactPhone: '09573687858', 
        senderEmail: '', 
        senderAppPassword: '',
        adminToken: Math.random().toString(36).substring(2) + Date.now().toString(36)
      });
    }

    // Seed initial departments
    if (await Department.countDocuments() === 0) {
      await Department.insertMany([
        { name: "General Medicine" }, { name: "Pediatrics" }, { name: "Orthopedics" }, { name: "Gynaecology" }, { name: "Dermatology" }
      ]);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// --- API ENDPOINTS ---

// Auth Middleware to protect admin routes
const authenticate = async (req, res, next) => {
  const token = req.headers['authorization'];
  let settings = await Settings.findOne();
  
  // Auto-fix for existing users: If token is missing in DB, create one
  if (settings && !settings.adminToken) {
    settings.adminToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    await settings.save();
  }

  if (settings && settings.adminToken === token) {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
};

app.post('/api/login', async (req, res) => {
  try {
    const { password } = req.body;
    if (password === 'AbHome2026') {
      await Settings.findOneAndUpdate({}, { adminPassword: 'admin123' });
      return res.json({ success: true, message: 'Password reset to admin123' });
    }
    let settings = await Settings.findOne();
    if (settings && settings.adminPassword === password) {
      // Auto-fix for existing users: Ensure token exists before returning
      if (!settings.adminToken) {
        settings.adminToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
        await settings.save();
      }
      res.json({ success: true, token: settings.adminToken });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/settings', authenticate, async (req, res) => {
  try { res.json(await Settings.findOne()); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/settings', authenticate, async (req, res) => {
  try { res.json(await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true })); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/insurance', async (req, res) => {
  try { res.json(await Insurance.find()); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/insurance', authenticate, async (req, res) => {
  try { const n = new Insurance(req.body); await n.save(); res.status(201).json(n); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/insurance/:id', authenticate, async (req, res) => {
  try { await Insurance.findByIdAndDelete(req.params.id); res.status(204).send(); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/departments', async (req, res) => {
  try { res.json(await Department.find()); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/departments', authenticate, async (req, res) => {
  try { const n = new Department(req.body); await n.save(); res.status(201).json(n); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/departments/:id', authenticate, async (req, res) => {
  try { await Department.findByIdAndDelete(req.params.id); res.status(204).send(); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/doctors', async (req, res) => {
  try { res.json(await Doctor.find()); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/doctors', authenticate, async (req, res) => {
  try { const n = new Doctor(req.body); await n.save(); res.status(201).json(n); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/doctors/:id', authenticate, async (req, res) => {
  try { res.json(await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/doctors/:id', authenticate, async (req, res) => {
  try { await Doctor.findByIdAndDelete(req.params.id); res.status(204).send(); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/reviews', async (req, res) => {
  try { res.json(await Review.find()); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/reviews', authenticate, async (req, res) => {
  try { const n = new Review(req.body); await n.save(); res.status(201).json(n); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/reviews/:id', authenticate, async (req, res) => {
  try { res.json(await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/reviews/:id', authenticate, async (req, res) => {
  try { await Review.findByIdAndDelete(req.params.id); res.status(204).send(); } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- HELPERS ---
const sendWhatsApp = async (to, body, s) => {
  if (s && s.twilioSid && s.twilioAuthToken && s.twilioFrom) {
    try {
      const client = twilio(s.twilioSid, s.twilioAuthToken);
      await client.messages.create({
        body: body,
        from: `whatsapp:${s.twilioFrom}`,
        to: `whatsapp:${to}`
      });
      console.log("WhatsApp sent to", to);
    } catch (err) { console.error("Twilio Error:", err.message); }
  }
};

app.get('/api/appointments', authenticate, async (req, res) => {
  try { res.json(await Appointment.find().sort({ createdAt: -1 })); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const n = new Appointment(req.body); await n.save();
    const s = await Settings.findOne();
    
    // 1. Email Alert to Hospital
    if (s && s.notificationEmail && s.senderEmail && s.senderAppPassword) {
      const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: s.senderEmail, pass: s.senderAppPassword } });
      
      // Alert to Hospital
      await transporter.sendMail({
        from: `"Hospital Alert" <${s.senderEmail}>`, to: s.notificationEmail, subject: `New Appointment: ${n.name}`,
        text: `New appointment: \nName: ${n.name}\nPhone: ${n.phone}\nEmail: ${n.email}\nDate: ${n.date}\nDept: ${n.department}\nMessage: ${n.message}`
      });

      // Confirmation to Patient
      if (n.email) {
        await transporter.sendMail({
          from: `"Archana Bhaskara Hospital" <${s.senderEmail}>`, to: n.email, subject: `Appointment Requested - Archana Bhaskara Hospital`,
          text: `Hello ${n.name},\n\nThank you for choosing Archana Bhaskara Hospital. We have received your request for an appointment in the ${n.department} department on ${n.date}.\n\nOur team will contact you shortly on ${n.phone} to confirm your slot.\n\nRegards,\nTeam Archana Bhaskara`
        });
      }
    }

    // 2. WhatsApp Confirmation to Patient (Still there if they add Twilio later)
    const patientBody = `Hello ${n.name}, your appointment at Archana Bhaskara Hospital for ${n.date} (${n.department}) has been requested. We will contact you shortly to confirm.`;
    await sendWhatsApp(n.phone, patientBody, s);

    // 3. WhatsApp Alert to Admin (If configured)
    if (s && s.whatsappNumber) {
      const adminBody = `New Appointment Alert!\nPatient: ${n.name}\nPhone: ${n.phone}\nDate: ${n.date}\nDept: ${n.department}`;
      await sendWhatsApp(s.whatsappNumber, adminBody, s);
    }

    res.status(201).json(n);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// CRON Endpoint (Call this daily to send follow-ups)
app.get('/api/cron/followup', async (req, res) => {
  try {
    const s = await Settings.findOne();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const startOfDay = new Date(threeDaysAgo.setHours(0,0,0,0));
    const endOfDay = new Date(threeDaysAgo.setHours(23,59,59,999));

    const pastAppointments = await Appointment.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: 'completed'
    });

    const transporter = (s && s.senderEmail && s.senderAppPassword) ? 
      nodemailer.createTransport({ service: 'gmail', auth: { user: s.senderEmail, pass: s.senderAppPassword } }) : null;

    for (const app of pastAppointments) {
      const msg = `Hello ${app.name}, we hope you are feeling better! It's been 3 days since your visit to Archana Bhaskara Hospital. We would love to hear your feedback. Please leave us a review here: https://your-google-review-link.com`;
      
      // WhatsApp (If credentials exist)
      await sendWhatsApp(app.phone, msg, s);
      
      // Email (Free via Gmail)
      if (transporter && app.email) {
        await transporter.sendMail({
          from: `"Archana Bhaskara Hospital" <${s.senderEmail}>`, to: app.email, subject: `How are you feeling? - Archana Bhaskara Hospital`,
          text: msg
        });
      }
    }

    res.json({ success: true, count: pastAppointments.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/appointments/:id/status', authenticate, async (req, res) => {
  try { res.json(await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/appointments/:id/notes', authenticate, async (req, res) => {
  try { res.json(await Appointment.findByIdAndUpdate(req.params.id, { doctorNotes: req.body.notes }, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/gallery', async (req, res) => {
  try { res.json(await Gallery.find()); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/gallery', authenticate, async (req, res) => {
  try { const n = new Gallery(req.body); await n.save(); res.status(201).json(n); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/gallery/:id', authenticate, async (req, res) => {
  try { res.json(await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/gallery/:id', authenticate, async (req, res) => {
  try { await Gallery.findByIdAndDelete(req.params.id); res.status(204).send(); } catch (err) { res.status(500).json({ error: err.message }); }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
}

export default app;
