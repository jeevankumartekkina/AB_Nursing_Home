import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Connection URI - Use environment variable or the provided string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Ab_Home:admin123@cluster0.sq7te5u.mongodb.net/hospital?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas successfully!');
    // Seed initial reviews if empty
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      await Review.insertMany([
        { author: "Swarna latha", text: "Very nice doctor and staff is very good Good service", rating: 5, time: "a year ago" },
        { author: "Madhu Reddi", text: "Very nice staff and excellent service given by them", rating: 5, time: "a year ago" },
        { author: "Umamashwari Emandhi", text: "Excellent service and obedient staff..", rating: 5, time: "a year ago" }
      ]);
      console.log('Seeded initial reviews.');
    }

    // Seed initial insurances if empty
    const insuranceCount = await Insurance.countDocuments();
    if (insuranceCount === 0) {
      await Insurance.insertMany([
        { name: "Star Health", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=Star+Health" },
        { name: "Apollo Munich", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=Apollo+Munich" },
        { name: "HDFC ERGO", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=HDFC+ERGO" },
        { name: "ICICI Lombard", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=ICICI+Lombard" },
        { name: "Bajaj Allianz", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=Bajaj+Allianz" },
        { name: "Religare", logo: "https://via.placeholder.com/150x60/f0f9ff/0369a1?text=Religare" }
      ]);
      console.log('Seeded initial insurances.');
    }

    // Seed initial settings
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create({
        notificationEmail: '',
        adminPassword: 'admin123',
        contactPhone: '09573687858',
        senderEmail: '',
        senderAppPassword: ''
      });
      console.log('Seeded initial settings.');
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../dist')));

// --- Mongoose Models ---

const doctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  qualification: String,
  experience: String,
  image: String
});
// Transform _id to id for the frontend
doctorSchema.set('toJSON', { virtuals: true });
const Doctor = mongoose.model('Doctor', doctorSchema);

const reviewSchema = new mongoose.Schema({
  author: String,
  text: String,
  rating: Number,
  time: String
});
reviewSchema.set('toJSON', { virtuals: true });
const Review = mongoose.model('Review', reviewSchema);

const appointmentSchema = new mongoose.Schema({
  name: String,
  phone: String,
  date: String,
  department: String,
  message: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
appointmentSchema.set('toJSON', { virtuals: true });
const Appointment = mongoose.model('Appointment', appointmentSchema);

const gallerySchema = new mongoose.Schema({
  url: String,
  caption: String
});
gallerySchema.set('toJSON', { virtuals: true });
const Gallery = mongoose.model('Gallery', gallerySchema);

const insuranceSchema = new mongoose.Schema({
  name: String,
  logo: String
});
insuranceSchema.set('toJSON', { virtuals: true });
const Insurance = mongoose.model('Insurance', insuranceSchema);

const settingsSchema = new mongoose.Schema({
  notificationEmail: String,
  adminPassword: { type: String, default: 'admin123' },
  contactPhone: { type: String, default: '09573687858' },
  senderEmail: String,
  senderAppPassword: String
});
settingsSchema.set('toJSON', { virtuals: true });
const Settings = mongoose.model('Settings', settingsSchema);


// --- API ENDPOINTS ---

// AUTH
app.post('/api/login', async (req, res) => {
  try {
    const { password } = req.body;
    const settings = await Settings.findOne();
    if (settings && settings.adminPassword === password) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SETTINGS
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const updatedSettings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updatedSettings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// INSURANCES
app.get('/api/insurance', async (req, res) => {
  try {
    const insurances = await Insurance.find();
    res.json(insurances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/insurance', async (req, res) => {
  try {
    const newInsurance = new Insurance(req.body);
    await newInsurance.save();
    res.status(201).json(newInsurance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/insurance/:id', async (req, res) => {
  try {
    const updatedInsurance = await Insurance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedInsurance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/insurance/:id', async (req, res) => {
  try {
    await Insurance.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DOCTORS
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/doctors', async (req, res) => {
  try {
    const newDoctor = new Doctor(req.body);
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/doctors/:id', async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDoctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/doctors/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REVIEWS
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/reviews/:id', async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// APPOINTMENTS
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const newAppt = new Appointment(req.body);
    await newAppt.save();

    // Trigger Email Notification
    const settings = await Settings.findOne();
    if (settings && settings.notificationEmail && settings.senderEmail && settings.senderAppPassword) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: settings.senderEmail,
          pass: settings.senderAppPassword
        }
      });

      const mailOptions = {
        from: `"Hospital Alert" <${settings.senderEmail}>`,
        to: settings.notificationEmail,
        subject: `New Appointment: ${newAppt.name}`,
        text: `New appointment request received!
        
        Name: ${newAppt.name}
        Phone: ${newAppt.phone}
        Date: ${newAppt.date}
        Department: ${newAppt.department}
        Message: ${newAppt.message}
        
        View details in your dashboard: https://archana-hospital.vercel.app/admin`
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json(newAppt);
  } catch (err) {
    console.error("Error in appointment/email:", err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/appointments/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GALLERY
app.get('/api/gallery', async (req, res) => {
  try {
    const gallery = await Gallery.find();
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/gallery', async (req, res) => {
  try {
    const newImage = new Gallery(req.body);
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/gallery/:id', async (req, res) => {
  try {
    const updatedImage = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedImage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Only listen locally, Vercel will handle the rest
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel Serverless
export default app;
