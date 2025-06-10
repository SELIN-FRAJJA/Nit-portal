// === Updated server.js ===
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ExcelJS from 'exceljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    if (file.fieldname === 'aadhaarFile') uploadPath = 'uploads/aadhar/';
    else if (file.fieldname === 'nocFile') uploadPath = 'uploads/noc/';
    else if (file.fieldname === 'idCardFile') uploadPath = 'uploads/idcard/';
    else if (file.fieldname === 'resumeFile') uploadPath = 'uploads/resume/';
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});
const upload = multer({ storage });

mongoose.connect('mongodb://localhost:27017/internship_portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const ApplicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  collegeName: String,
  currentYear: String,
  department: String,
  phone: String,
  otherPhone: String,
  aadharNumber: String,
  cgpa: String,
  areaOfInterest: String,
  interestedDomain: String,
  experience: String,
  fatherName: String,
  motherName: String,
  fatherPhone: String,
  motherPhone: String,
  address: String,
  startDate: Date,
  endDate: Date,
  studentType: String,
  faculty: String,
  facultyEmail: String,
  facultyDepartment: String,
  studentDepartment: String,
  aadhaarUrl: String,
  idCardUrl: String,
  resumeUrl: String,
  nocUrl: String,
  status: { type: String, default: 'pending' }
});
const Application = mongoose.model('Application', ApplicationSchema);

const InternshipOfferingSchema = new mongoose.Schema({
  domains: {
    type: [String],
    default: [],
  },
  paid: {
    type: String,
    enum: ['Paid', 'Unpaid'],
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  }
}, { _id: false });

const FacultyUserSchema = new mongoose.Schema({
  facultyName:   { type: String, required: true },
  phone:         { type: String, required: true },
  email:         { type: String, required: true, unique: true },
  department:    { type: String, required: true },
  passwordHash:  { type: String, required: true },

  // **New** field:
  internshipOffering: {
    type: InternshipOfferingSchema,
    default: null,
  }
});
const FacultyUser = mongoose.model('FacultyUser', FacultyUserSchema);

const StudentUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  collegeState: String,
  collegeName: String,
  currentYear: String,
  department: String,
  phone: String,
  cgpa: String,
  domain: String,
  aadharNumber: String,
  fatherName: String,
  motherName: String,
  fatherPhone: String,
  motherPhone: String,
  address: String,
  accommodationType: String,
  applications: [
    {
      faculty: String,
      facultyDepartment: String,
      submittedAt: { type: Date, default: Date.now }
    }
  ]
});
const StudentUser = mongoose.model('StudentUser', StudentUserSchema);

const SubmissionWindowSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate:   { type: Date, required: true },
}, {
  timestamps: true,           // optional: track when admin last changed it
});

const  SubmissionWindow =mongoose.model('SubmissionWindow', SubmissionWindowSchema);

// set time frame 
app.post('/api/admin/window', async (req, res) => {
  const { startDate, endDate } = req.body;
  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({ error: 'Start must be before end.' });
  }

  // Overwrite existing doc (or create new if none)
  const window = await SubmissionWindow.findOneAndUpdate(
    {}, 
    { startDate, endDate },
    { upsert: true, new: true }
  );
  res.json(window);
});



// get time frame 

app.get('/api/admin/window', async (req, res) => {
  try {
    const window = await SubmissionWindow.findOne({});
    if (!window) {
      return res.status(404).json({ error: 'Submission window not configured' });
    }
    res.json({
      startDate: window.startDate.toISOString(),
      endDate:   window.endDate.toISOString(),
    });
  } catch (err) {
    console.error('Error fetching submission window:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/applications/basic-submit', upload.fields([
  { name: 'aadhaarFile', maxCount: 1 },
  { name: 'idCardFile', maxCount: 1 },
  { name: 'resumeFile', maxCount: 1 },
  { name: 'nocFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const formData = req.body;
    const aadhaarUrl = req.files['aadhaarFile'] ? `/uploads/aadhar/${req.files['aadhaarFile'][0].filename}` : '';
    const idCardUrl = req.files['idCardFile'] ? `/uploads/idcard/${req.files['idCardFile'][0].filename}` : '';
    const resumeUrl = req.files['resumeFile'] ? `/uploads/resume/${req.files['resumeFile'][0].filename}` : '';
    const nocUrl = req.files['nocFile'] ? `/uploads/noc/${req.files['nocFile'][0].filename}` : '';

    const newApp = new Application({
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      studentDepartment: formData.department,
      aadhaarUrl, idCardUrl, resumeUrl, nocUrl,
    });

    const savedApp = await newApp.save();

    const student = await StudentUser.findOne({ email: formData.email });
    if (student) {
      student.collegeName = formData.collegeName;
      student.currentYear = formData.currentYear;
      student.department = formData.department;
      student.phone = formData.phone;
      student.cgpa = formData.cgpa;
      student.aadharNumber = formData.aadharNumber;
      student.fatherName = formData.fatherName;
      student.motherName = formData.motherName;
      student.fatherPhone = formData.fatherPhone;
      student.motherPhone = formData.motherPhone;
      student.address = formData.address;
      await student.save();
    }

    res.status(201).json({ message: 'Basic application submitted!', applicationId: savedApp._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit basic application' });
  }
});

// Add this route to duplicate application with new faculty details
app.post('/api/applications/:id/duplicate', async (req, res) => {
  try {
    const originalApp = await Application.findById(req.params.id);
    if (!originalApp) return res.status(404).json({ error: 'Original application not found' });

    const student = await StudentUser.findOne({ email: originalApp.email });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    if (student.applications.length >= 5) {
      return res.status(403).json({ error: 'Application limit reached' });
    }

    // Check if student already applied to this faculty
    const existingFacultyApp = await Application.findOne({
      email: originalApp.email,
      facultyEmail: req.body.facultyEmail
    });
    if (existingFacultyApp) {
      return res.status(400).json({ 
        error: 'You have already applied to this faculty member' 
      });
    }

    // Check if student already applied to this department
    const existingDeptApp = await Application.findOne({
      email: originalApp.email,
      facultyDepartment: req.body.facultyDepartment
    });
    if (existingDeptApp) {
      return res.status(400).json({ 
        error: 'You have already applied to this department' 
      });
    }

    const newApp = new Application({
      ...originalApp.toObject(),
      _id: new mongoose.Types.ObjectId(),
      faculty: req.body.faculty,
      facultyEmail: req.body.facultyEmail,
      facultyDepartment: req.body.facultyDepartment,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    student.applications.push({
      faculty: req.body.faculty,
      facultyDepartment: req.body.facultyDepartment
    });
    await student.save();
    await newApp.save();

    res.status(201).json({ message: 'New application created', applicationId: newApp._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create new application' });
  }
});

app.get('/api/student/info', async (req, res) => {
  try {
    const student = await StudentUser.findOne({ email: req.query.email });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student info' });
  }
});

// PATCH: Update faculty info
app.patch('/api/applications/:id/update-faculty', async (req, res) => {
  try {
    const appId = req.params.id;
    const { faculty, facultyDepartment } = req.body;

    const facultyUser = await FacultyUser.findOne({ facultyName: faculty, department: facultyDepartment });
    if (!facultyUser) return res.status(404).json({ error: 'Faculty not found' });

    const application = await Application.findById(appId);
    if (!application) return res.status(404).json({ error: 'Application not found' });

    application.faculty = faculty;
    application.facultyEmail = facultyUser.email;
    application.facultyDepartment = facultyDepartment;

    await application.save();
    res.json({ message: 'Faculty info updated', updatedApp: application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update faculty info' });
  }
});


// form api fpor fculty 
// GET /api/faculty/internship-form?email=foo@uni.edu
app.get('/api/faculty/internship-form', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const faculty = await FacultyUser.findOne({ email }).select('internshipOffering -_id');
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    // Returns { internshipOffering: { domains, paid, startDate, endDate } } or { internshipOffering: null }
    res.json(faculty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// internship‐form submission
app.post('/api/faculty/internship-form', async (req, res) => {
  const { email, domains, paid, startDate, endDate } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // 1) Fetch the admin’s submission window
  const win = await SubmissionWindow.findOne({});
  if (!win) {
    return res.status(503).json({ error: 'Submission window not configured' });
  }

  // 2) Disallow if now is past the admins endDate
  const now = new Date();
  if (now > win.endDate) {
    return res
      .status(403)
      .json({ error: `Deadline passed (${win.endDate.toISOString().slice(0,10)}). No further changes allowed.` });
  }

  if (now < win.startDate) {
    return res
      .status(403)
      .json({ error: `Application not started (${win.endDate.toISOString().slice(0,10)}). No further changes allowed.` });
  }

  // 3) Build update payload
  const hasInternshipData =
    Array.isArray(domains) && domains.length > 0 && paid && startDate && endDate;

  const updateData = hasInternshipData
    ? { internshipOffering: { domains, paid, startDate: new Date(startDate), endDate: new Date(endDate) } }
    : { internshipOffering: null };

  try {
    const updatedFaculty = await FacultyUser.findOneAndUpdate(
      { email },
      updateData,
      { new: true }
    ).select('-passwordHash');

    if (!updatedFaculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    res.json({
      message: 'Internship offering updated successfully',
      faculty: updatedFaculty
    });
  } catch (err) {
    console.error('Error updating internship offering:', err);
    res.status(500).json({ error: 'Server error' });
  }
});







// Signup
app.post('/api/faculty/signup', async (req, res) => {
  try {
    const { facultyName, phone, email, department, password } = req.body;
    if (!facultyName || !phone || !email || !password || !department) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existingUser = await FacultyUser.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new FacultyUser({
      facultyName,
      phone,
      email,
      department,
      passwordHash
    });
    await newUser.save();
    res.status(201).json({ message: 'Faculty user registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/faculty/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await FacultyUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.status(200).json({ message: 'Login successful', facultyName: user.facultyName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Faculty Details
app.get('/api/faculty', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter is required' });
    }
    const user = await FacultyUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    res.json({ 
      name: user.facultyName, 
      email: user.email, 
      phone: user.phone,
      department: user.department
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch faculty details' });
  }
});

app.get('/api/student/email/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const student = await StudentUser.findOne({ email });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Optional: include application info if needed
    const applications = await Application.find({ email });

    res.json({ ...student.toObject(), applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Fetch Applications
app.get('/api/applications', async (req, res) => {
  try {
    const facultyEmail = req.query.facultyEmail;
    // const department = req.query.department;
    if (!facultyEmail) {
      return res.status(400).json({ error: 'facultyEmail query parameter is required' });
    }
    const facultyUser = await FacultyUser.findOne({ 
      email: { $regex: new RegExp(`^${facultyEmail}$`, 'i') } 
    });
    console.log(1);
    if (!facultyUser) {
      return res.status(404).json({ error: 'Faculty user not found' });
    }
    const filter = {
      facultyEmail: { 
        $regex: new RegExp(`^${facultyUser.email}$`, 'i') 
      }
    };
    // if (department) filter.studentDepartment = department; // Filter by student department
    const applications = await Application.find(filter);
    // console.log(applications);
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Add this route to handle application count
app.get('/api/applications/count', async (req, res) => {
  try {
    const email = req.query.email;
    const count = await Application.countDocuments({ email });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get application count' });
  }
});

// Update Status
app.patch('/api/applications/:id/status', async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;
    
    if (!['accepted', 'declined', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check faculty acceptance limit when trying to accept
    if (status === 'accepted') {
      const acceptedCount = await Application.countDocuments({ 
        facultyEmail: application.facultyEmail,
        status: 'accepted'
      });
      
      if (acceptedCount >= 5) {
        return res.status(403).json({ 
          error: 'Faculty can accept maximum 5 students' 
        });
      }
    }

    application.status = status;
    await application.save();
    
    res.json({ message: `Application status updated to ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Excel Exports
app.get('/api/applications/accepted-excel', async (req, res) => {
  try {
    const facultyEmail = req.query.facultyEmail;
    if (!facultyEmail) {
      return res.status(400).json({ error: 'facultyEmail query parameter is required' });
    }
    const applications = await Application.find({
      facultyEmail: { $regex: new RegExp(`^${facultyEmail}$`, 'i') },
      status: 'accepted'
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Accepted Applications');
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Student Department', key: 'studentDepartment', width: 20 },
      { header: 'Current Year', key: 'currentYear', width: 15 },
      { header: 'Domain', key: 'domain', width: 25 },
      { header: 'Internship Details', key: 'internshipDetails', width: 40 },
      { header: 'Duration', key: 'duration', width: 15 },
      { header: 'Start Date', key: 'startDate', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];
    applications.forEach(app => {
      worksheet.addRow({
        name: app.name,
        email: app.email,
        phone: app.phone,
        studentDepartment: app.studentDepartment,
        currentYear: app.currentYear,
        domain: app.domain,
        internshipDetails: app.internshipDetails,
        duration: app.duration,
        startDate: app.startDate ? app.startDate.toLocaleDateString() : '',
        status: app.status
      });
    });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=accepted_applications.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate accepted applications Excel' });
  }
});

// Rejected Excel
app.get('/api/applications/rejected-excel', async (req, res) => {
  try {
    const facultyEmail = req.query.facultyEmail;
    if (!facultyEmail) {
      return res.status(400).json({ error: 'facultyEmail query parameter is required' });
    }
    const applications = await Application.find({
      facultyEmail: { $regex: new RegExp(`^${facultyEmail}$`, 'i') },
      status: 'declined'
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Rejected Applications');
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Student Department', key: 'studentDepartment', width: 20 },
      { header: 'Current Year', key: 'currentYear', width: 15 },
      { header: 'Domain', key: 'domain', width: 25 },
      { header: 'Internship Details', key: 'internshipDetails', width: 40 },
      { header: 'Duration', key: 'duration', width: 15 },
      { header: 'Start Date', key: 'startDate', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];
    applications.forEach(app => {
      worksheet.addRow({
        name: app.name,
        email: app.email,
        phone: app.phone,
        studentDepartment: app.studentDepartment,
        currentYear: app.currentYear,
        domain: app.domain,
        internshipDetails: app.internshipDetails,
        duration: app.duration,
        startDate: app.startDate ? app.startDate.toLocaleDateString() : '',
        status: app.status
      });
    });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=rejected_applications.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate rejected applications Excel' });
  }
});

// Add this route to check faculty acceptance limit
app.get('/api/faculty/acceptance-count', async (req, res) => {
  try {
    const facultyEmail = req.query.facultyEmail;
    const count = await Application.countDocuments({ 
      facultyEmail: { $regex: new RegExp(`^${facultyEmail}$`, 'i') },
      status: 'accepted'
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get faculty acceptance count' });
  }
});

// Student Signup
app.post('/api/student/signup', async (req, res) => {
  
  try {
    const { name, email, password, collegeState, collegeName, currentYear, department, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const existingUser = await StudentUser.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new StudentUser({
      name,
      email,
      passwordHash,
      collegeState,
      collegeName,
      currentYear,
      department,
      phone,
    });
    await newUser.save();
    res.status(201).json({ message: 'Student user registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Student Login
app.post('/api/student/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await StudentUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.status(200).json({ message: 'Login successful', name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin User Schema
const AdminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});
const AdminUser = mongoose.model('AdminUser', AdminUserSchema);

// Admin Signup
app.post('/api/admin/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new AdminUser({
      name,
      email,
      passwordHash
    });
    await newUser.save();
    res.status(201).json({ message: 'Admin user registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.status(200).json({ message: 'Login successful', name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all faculty for admin
app.get('/api/admin/faculty', async (req, res) => {
  try {
    const faculty = await FacultyUser.find({}).select(
      'facultyName email department internshipOffering'
    );
    res.json(faculty);
  } catch (err) {
    console.error('Error fetching faculty data:', err);
    res.status(500).json({ error: 'Failed to fetch faculty data' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});