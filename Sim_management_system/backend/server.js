// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const app = express();
// const JWT_SECRET = process.env.JWT_SECRET || 'mySuperSecret';

 //app.use(express.json());
 //app.use(cors());
 //app.use(express.static(path.join(__dirname, '../frontend')));

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/simDashboard', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('✅ MongoDB connected'))
//   .catch(err => console.error('❌ MongoDB error:', err));

// // Schemas
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   role: String
// });
// const User = mongoose.model('User', userSchema);

// const simRequestSchema = new mongoose.Schema({
//   employeeName: String,
//   employeeId: String,
//   mobile: String,
//   designation: String,
//   department: String,
//   email: String,
//   currentProvider: String,
//   requestType: String,
//   justification: String,
//   duration: String,
//   priority: String,
//   status: { type: String, default: 'Pending' },
//   hod: {
//     name: String,
//     email: String,
//     approvalDate: String
//   },
//   assignedSim: String,
//   createdAt: { type: Date, default: Date.now }
// });
// const SimRequest = mongoose.model('SimRequest', simRequestSchema);

// const simInventorySchema = new mongoose.Schema({
//   simNumber: String,
//   provider: String,
//   status: { type: String, default: 'Available' },
//   assignedTo: String,
//   createdAt: { type: Date, default: Date.now }
// });
// const SimInventory = mongoose.model('SimInventory', simInventorySchema);

// // Middleware
// function verifyToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Unauthorized' });

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ error: 'Invalid token' });
//     req.user = user;
//     next();
//   });
// }

// function requireAdmin(req, res, next) {
//   if (req.user.role !== 'Admin') {return res.status(403).json({ error: 'Access denied' });
// }
//   next();
// }

// // Auth Routes
// app.post('/api/signup', async (req, res) => {
//   const { name, email, password, role } = req.body;
//   try {
//     const hashed = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashed, role });
//     await user.save();
//     res.status(201).json({ message: 'Signup successful!' });
//   } catch (err) {
//     res.status(400).json({ error: 'Email already exists or invalid data.' });
//   }
// });

// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

//     const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
//       expiresIn: '2h'
//     });

//     res.json({ message: 'Login successful', role: user.role, token });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // SIM Request Routes
// app.post('/api/requests', verifyToken, async (req, res) => {
//   try {
//     const request = new SimRequest(req.body);
//     await request.save();
//     res.status(201).json({ message: 'Request submitted successfully', request });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to submit request' });
//   }
// });

// app.get('/api/requests', verifyToken, async (req, res) => {
//   try {
//     const filter = req.user.role === 'Employee' ? { email: req.user.email } : {};
//     const requests = await SimRequest.find(filter).sort({ createdAt: -1 });
//     res.json(requests);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch requests' });
//   }
// });
// app.put('/api/requests/:id/approve', verifyToken, requireAdmin, async (req, res) => {
//   try {
//     console.log("👉 Approving request ID:", req.params.id);  // log ID
//     const updated = await SimRequest.findByIdAndUpdate(
//       req.params.id,
//       { status: 'Approved' },
//       { new: true }
//     );
//     console.log("🔁 Updated object:", updated); // log what got updated

//     if (!updated) {
//       return res.status(404).json({ error: "Request not found" });
//     }

//     res.json(updated);
//   } catch (err) {
//     console.error("❌ Approval error:", err);
//     res.status(500).json({ error: "Failed to approve request" });
//   }
// });

// app.put('/api/requests/:id/reject', verifyToken, requireAdmin, async (req, res) => {
//   try {
//     const updated = await SimRequest.findByIdAndUpdate(
//       req.params.id,
//       { status: 'Rejected' },
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to reject request' });
//   }
// });

// // SIM Inventory Routes
// app.post('/api/inventory', async (req, res) => {
//   try {
//     const sim = new SimInventory(req.body);
//     await sim.save();
//     res.status(201).json({ message: 'SIM added to inventory successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to save SIM inventory' });
//   }
// });

// app.get('/api/inventory', async (req, res) => {
//   try {
//     const filter = {};
//     if (req.query.status) filter.status = req.query.status;
//     if (req.query.provider) filter.provider = req.query.provider;

//     const sims = await SimInventory.find(filter);
//     res.json(sims);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch SIM inventory' });
//   }
// });

// app.get('/api/inventory/available', async (req, res) => {
//   try {
//     const available = await SimInventory.find({ status: 'Available' });
//     res.json(available);
//   } catch (err) {
//     res.status(500).json({ error: 'Could not get available SIMs' });
//   }
// });

// app.post('/api/inventory/assign', verifyToken, async (req, res) => {
//   const { simId, requestId } = req.body;

//   try {
//     const sim = await SimInventory.findById(simId);
//     if (!sim || sim.status === 'Assigned') {
//       return res.status(400).json({ error: 'SIM not available' });
//     }

//     const request = await SimRequest.findById(requestId);
//     if (!request || request.status !== 'Approved') {
//       return res.status(400).json({ error: 'Invalid or unapproved request' });
//     }

//     sim.status = 'Assigned';
//     sim.assignedTo = request.employeeName;
//     await sim.save();

//     request.assignedSim = sim.simNumber;
//     await request.save();

//     res.json({ message: 'SIM assigned successfully!' });
//   } catch (err) {
//     res.status(500).json({ error: 'Assignment failed' });
//   }
// });

// // Admin Test
// app.get('/api/admin/stats', verifyToken, requireAdmin, (req, res) => {
//   res.json({ message: 'Hello Admin 👑, here are your stats!' });
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/simDashboard';

// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(express.static(path.join(__dirname, '../frontend')));

// // Connect to MongoDB
// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('✅ MongoDB connected'))
//   .catch(err => console.error('❌ MongoDB connection error:', err));

// // Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
// });
// const upload = multer({ storage });
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Schemas
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   role: String
// });
// const User = mongoose.model('User', userSchema);

// const simRequestSchema = new mongoose.Schema({
//   employeeName: String,
//   employeeId: String,
//   mobile: String,
//   designation: String,
//   department: String,
//   email: String,
//   currentProvider: String,
//   requestType: String,
//   justification: String,
//   duration: String,
//   priority: String,
//   document: String,
//   status: { type: String, default: 'HOD Pending' },
//   hod: {
//     name: String,
//     email: String,
//     approvalDate: String,
//     status: { type: String, default: 'Pending' }
//   },
//   assignedSim: String,
//   createdAt: { type: Date, default: Date.now }
// });
// const SimRequest = mongoose.model('SimRequest', simRequestSchema);

// function verifyToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader?.split(' ')[1];

//   if (!token) return res.status(401).json({ error: 'Unauthorized - No token' });

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       console.error("❌ Token verification failed:", err.message);
//       return res.status(403).json({ error: 'Invalid or expired token' });
//     }

//     req.user = user;
//     next();
//   });
// }


// function requireRole(role) {
//   return (req, res, next) => {
//     if (req.user.role.toLowerCase() !== role.toLowerCase()) {
//       return res.status(403).json({ error: 'Access denied' });
//     }
//     next();
//   };
// }


// // Auth routes
// app.post('/api/signup', async (req, res) => {
//   const { name, email, password, role } = req.body;
//   try {
//     const hashed = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashed, role });
//     await user.save();
//     res.status(201).json({ message: 'Signup successful' });
//   } catch {
//     res.status(400).json({ error: 'Email already exists or invalid data' });
//   }
// });

// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) return res.status(404).json({ error: 'User not found' });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

//   const token = jwt.sign(
//     { id: user._id, email: user.email, role: user.role },  // ✅ Include role
//     JWT_SECRET,
//     { expiresIn: '2h' }
//   );

//   res.json({
//     message: 'Login successful',
//     token,
//     role: user.role.toLowerCase() // ✅ Send role to frontend
//   });
// });

// app.post(
//   '/api/requests',
//   verifyToken,
//   upload.single('document'),
//   async (req, res) => {
//     try {
//       /* 1️⃣  Save the request in MongoDB */
//       const simReq = new SimRequest({
//         ...req.body,
//         document: req.file ? `/uploads/${req.file.filename}` : ''
//       });
//       await simReq.save();

//       /* 2️⃣  Prepare Nodemailer transporter with DEBUG enabled */
//       const transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: process.env.SMTP_PORT,
//         secure: process.env.SMTP_SECURE === 'true',
//         auth: {
//           user: process.env.SMTP_USER,
//           pass: process.env.SMTP_PASS
//         },
//         logger: true,   // 🔍 prints info logs
//         debug: true     // 🔍 prints SMTP conversation
//       });

//       /* 3️⃣  Send the e‑mail to HOD */
//      await transporter.sendMail({
//   from: `"Nayara SIM Portal" <${process.env.SMTP_USER}>`,
//   to: process.env.HOD_EMAILS,
//   subject: '🔔 New SIM Request – HOD Action Needed',
//   html: `
//     <h3>New SIM Request</h3>
//     <p><b>Employee:</b> ${req.body.employeeName}</p>
//     <p><b>Type:</b> ${req.body.requestType}</p>
//     <p><b>Justification:</b> ${req.body.justification}</p>
//     <p>
//       <a href="${process.env.FRONTEND_URL}/login.html?redirect=hod-dashboard.html" style="display:inline-block;padding:10px 20px;background-color:#004b8d;color:white;text-decoration:none;border-radius:5px;">
//         👉 Click here to proceed
//       </a>
//     </p>
//         `
//       }).then(info => {
//         console.log('✅ HOD Notified:', info.response);
//       }).catch(err => {
//         console.error('❌ Email Error:', err);
//       });

//       /* 4️⃣  Respond to frontend */
//       res.status(201).json({ message: 'Request submitted', request: simReq });
//     } catch (err) {
//       console.error('❌ Request save / mail error:', err);
//       res.status(500).json({ error: 'Failed to submit request' });
//     }
//   }
// );
// 🔻  REMOVE this entire duplicate block ───────────────
// const nodemailer = ….
//router.post('/', authenticateUser, async (req, res) => { … });
// ──────────────────────────────────────────────────────

// // SIM request submission
// app.post('/api/requests', verifyToken, upload.single('document'), async (req, res) => {
//   try {
//     const reqBody = req.body;
//     const simReq = new SimRequest({
//       ...reqBody,
//       document: req.file ? `/uploads/${req.file.filename}` : ''
//     });
//     await simReq.save();
//     res.status(201).json({ message: 'Request submitted', request: simReq });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to submit request' });
//   }
// });
// // POST /api/requests
// const nodemailer = require('nodemailer');

// router.post('/', authenticateUser, async (req, res) => {
//   try {
//     const newRequest = await SIMRequest.create(req.body);

//     // Example HOD email
//     const hodEmail = 'hod@nayaraenergy.com';

//     // Email setup
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'your_email@gmail.com', // use environment variable
//         pass: 'your_password' // use environment variable
//       }
//     });

//     const mailOptions = {
//       from: '"Nayara SIM Portal" <your_email@gmail.com>',
//       to: hodEmail,
//       subject: '🔔 New SIM Request Pending HOD Approval',
//       html: `
//         <h2>New SIM Request</h2>
//         <p><strong>Employee Name:</strong> ${req.body.employeeName}</p>
//         <p><strong>Type:</strong> ${req.body.requestType}</p>
//         <p><strong>Justification:</strong> ${req.body.justification}</p>
//         <p><a href="http://your-frontend.com/hod-dashboard.html">Login to Approve/Reject</a></p>
//       `
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('❌ Email Error:', error);
//       } else {
//         console.log('✅ HOD Notified:', info.response);
//       }
//     });

//     res.status(201).json(newRequest);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to create request.' });
//   }
// });


// // Get requests by role
// app.get('/api/requests', verifyToken, async (req, res) => {
//   try {
//     let filter = {};

//     if (req.user.role === 'Employee') {
//       filter.email = req.user.email;
//     } else if (req.user.role === 'HOD') {
//       filter.status = 'HOD Pending';
//     } else if (req.user.role === 'HR') {
//       filter.status = 'HR Pending';
//     }

//     const requests = await SimRequest.find(filter).sort({ createdAt: -1 });
//     res.json(requests);
//   } catch (err) {
//     res.status(500).json({ error: 'Could not fetch requests' });
//   }
// });

// // HOD approve/reject
// app.put(
//   '/api/requests/:id/hod-approve',
//   verifyToken,
//   requireRole('HOD'),
//   async (req, res) => {
//     try {
//       const { name, email, approvalDate } = req.body;

//       /* 1️⃣  Update DB */
//       const updated = await SimRequest.findByIdAndUpdate(
//         req.params.id,
//         {
//           status: 'HR Pending',
//           hod: { name, email, approvalDate, status: 'Approved' }
//         },
//         { new: true }
//       );
//       if (!updated) return res.status(404).json({ error: 'Request not found' });

//       /* 2️⃣  Notify HR by e‑mail */
//       const transporter = nodemailer.createTransport({
//   host   : process.env.SMTP_HOST,
//   port   : process.env.SMTP_PORT,
//   secure : process.env.SMTP_SECURE === 'true',
//   auth   : { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
//   logger : true,   // ✅
//   debug  : true    // ✅
// });


//       await transporter.sendMail({
//         from: `"Nayara SIM Portal" <${process.env.SMTP_USER}>`,
//         to:   process.env.HR_EMAILS,           // addresses from .env
//         subject: '✅ SIM Request approved by HOD – your action needed',
//         html: `
//           <h3>HOD Approval Notification</h3>
//           <p><b>Request ID:</b> ${updated._id}</p>
//           <p><b>Employee:</b> ${updated.employeeName}</p>
//           <p><b>Type:</b> ${updated.requestType}</p>
//           <p><b>HOD:</b> ${name} (${email})</p>
//           <p>
//             <a href="${process.env.FRONTEND_URL}/login.html?redirect=hr-dashboard.html"
//                style="display:inline-block;padding:10px 20px;background:#0a7a32;color:#fff;text-decoration:none;border-radius:5px;">
//               👉 Open HR Dashboard
//             </a>
//           </p>
//         `
//       }).then(info => console.log('✅ HR notified:', info.response))
//         .catch(err  => console.error('❌ Email‑to‑HR error:', err));

//       /* 3️⃣  Respond to frontend */
//       res.json({ message: 'HOD approved & HR notified', request: updated });

//     } catch (err) {
//       console.error('❌ HOD approval failed:', err);
//       res.status(500).json({ error: 'HOD approval failed' });
//     }
//   }
// );


// app.put('/api/requests/:id/hod-reject', verifyToken, requireRole('HOD'), async (req, res) => {
//   try {
//     const { name, email, approvalDate } = req.body;
//     const updated = await SimRequest.findByIdAndUpdate(
//       req.params.id,
//       {
//         status: 'Rejected by HOD',
//         hod: { name, email, approvalDate, status: 'Rejected' }
//       },
//       { new: true }
//     );
//     if (!updated) return res.status(404).json({ error: 'Request not found' });
//     res.json({ message: 'HOD rejected', request: updated });
//   } catch (err) {-
//     res.status(500).json({ error: 'HOD rejection failed' });
//   }
// });
// app.get('/api/requests/:id', verifyToken, async (req, res) => {
//   try {
//     const request = await SimRequest.findById(req.params.id);
//     if (!request) return res.status(404).json({ error: 'Request not found' });
//     res.json({ request });
//   } catch (err) {
//     console.error('❌ Error fetching request by ID:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.post(
//   '/api/inventory/assign',
//   verifyToken,
//   requireRole('Admin'),
//   async (req, res) => {
//     try {
//       const { simId, requestId } = req.body;

//       const sim = await SimInventory.findById(simId);
//       if (!sim || sim.status === 'Assigned') {
//         return res.status(400).json({ error: 'SIM not available' });
//       }

//       const request = await SimRequest.findById(requestId);
//       if (!request || !['Approved by Admin', 'Admin Pending'].includes(request.status)) {
//         return res.status(400).json({ error: 'Invalid or unapproved request' });
//       }

//       // ✅ Assign SIM to employee
//       sim.status = 'Assigned';
//       sim.assignedTo = request.employeeName;
//       await sim.save();

//       // ✅ Update SIM request
//       request.assignedSim = sim.simNumber;
//       request.status = 'SIM Assigned';
//       await request.save();

//       // ✅ Notify Employee by Email (FIXED: always notify)
//       const transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: process.env.SMTP_PORT,
//         secure: process.env.SMTP_SECURE === 'true',
//         auth: {
//           user: process.env.SMTP_USER,
//           pass: process.env.SMTP_PASS
//         },
//         logger: true,
//         debug: true
//       });

//       await transporter.sendMail({
//         from: `"Nayara SIM Portal" <${process.env.SMTP_USER}>`,
//         to: request.email,
//         subject: '📲 Your SIM Has Been Assigned',
//         html: `
//           <h3>Dear ${request.employeeName},</h3>
//           <p>Your SIM request has been <b>fully approved</b> and a SIM has been assigned to you.</p>
//           <ul>
//             <li><strong>SIM Number:</strong> ${sim.simNumber}</li>
//             <li><strong>Provider:</strong> ${sim.provider}</li>
//             <li><strong>Type:</strong> ${request.requestType}</li>
//           </ul>
//           <p>Please collect the SIM from the Admin or IT helpdesk.</p>
//           <p>Thank you,<br/>Nayara SIM Portal</p>
//         `
//       }).then(info => console.log('✅ Employee notified:', info.response))
//         .catch(err => console.error('❌ Email-to-Employee error:', err));

//       res.json({ message: 'SIM assigned successfully!', request });

//     } catch (err) {
//       console.error("❌ Assignment error:", err);
//       res.status(500).json({ error: 'Assignment failed' });
//     }
//   }
// );


// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
// // Approve request (for HR or Admin)
// app.put('/api/requests/:id/approve', verifyToken, async (req, res) => {
//   try {
//     const id = req.params.id;
//     const request = await SimRequest.findById(id);
//     if (!request) return res.status(404).json({ error: 'Request not found' });

//     // You can add role-based logic if needed
//     let newStatus = 'Approved by HR';
//     if (req.user.role.toLowerCase() === 'admin') {
//       newStatus = 'Approved by Admin';
//     }

//     request.status = newStatus;
//     await request.save();

//     res.json({ message: `${newStatus}`, request });
//   } catch (err) {
//     console.error("❌ Approve error:", err);
//     res.status(500).json({ error: 'Failed to approve request' });
//   }
// });

// // HR Forward to Admin
// app.put(
//   '/api/requests/:id/forward',
//   verifyToken,
//   requireRole('HR'),
//   upload.single('document'),
//   async (req, res) => {
//     try {
//       const id = req.params.id;
//       const updateData = { status: 'Admin Pending' };
//       if (req.file) updateData.document = `/uploads/${req.file.filename}`;

//       const updated = await SimRequest.findByIdAndUpdate(id, updateData, { new: true });
//       if (!updated) return res.status(404).json({ error: 'Request not found to forward' });

//       /* 🔔  Notify Admin ---------------------------------------------- */
//       const nodemailer = require('nodemailer');
//       const transporter = nodemailer.createTransport({
//         host:   process.env.SMTP_HOST,
//         port:   process.env.SMTP_PORT,
//         secure: process.env.SMTP_SECURE === 'true',
//         auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
//       });

//       await transporter.sendMail({
//         from: `"Nayara SIM Portal" <${process.env.SMTP_USER}>`,
//         to:   process.env.ADMIN_EMAILS,           // ← comes from .env
//         subject: '📨 SIM Request approved by HR – Admin action needed',
//         html: `
//           <h3>HR Approval Notification</h3>
//           <p><b>Request ID:</b> ${updated._id}</p>
//           <p><b>Employee:</b> ${updated.employeeName}</p>
//           <p><b>Type:</b> ${updated.requestType}</p>
//           <p><b>Status:</b> HR approved – awaiting Admin</p>
//           <p>
//             <a href="${process.env.FRONTEND_URL}/login.html?redirect=admin-dashboard.html"
//                style="display:inline-block;padding:10px 20px;background:#D97706;color:#fff;text-decoration:none;border-radius:5px;">
//               👉 Click here to proceed
//             </a>
//           </p>
//         `
//       }).then(info => console.log('✅ Admin notified:', info.response))
//         .catch(err  => console.error('❌ Email‑to‑Admin error:', err));
//       /* --------------------------------------------------------------- */

//       res.json({ message: 'Request forwarded to Admin & mail sent', request: updated });
//     } catch (err) {
//       console.error('❌ Forward error:', err);
//       res.status(500).json({ error: 'Failed to forward to Admin' });
//     }
//   }
// );




// // SIM Inventory Schema (ADD THIS if not already included)
// const simInventorySchema = new mongoose.Schema({
//   simNumber: { type: String, required: true },
//   provider: { type: String, required: true },
//   status: { type: String, default: 'Available' },
//   assignedTo: { type: String, default: '' },
//   history: [{
//     employee: String,
//     assignedOn: Date,
//     releasedOn: Date
//   }],
//   createdAt: { type: Date, default: Date.now }
// });
// const SimInventory = mongoose.model('SimInventory', simInventorySchema);

// app.post('/api/inventory', verifyToken, requireRole('Admin'), async (req, res) => {
//   try {
//     console.log("📥 Inventory Payload:", req.body);  // ✅ log payload
//     const sim = new SimInventory(req.body);
//     await sim.save();
//     res.status(201).json({ message: 'SIM added to inventory successfully' });
//   } catch (err) {
//     console.error("❌ Inventory save error:", err);   // ✅ log real error
//     res.status(500).json({ error: 'Failed to save SIM inventory' });
//   }
// });

// app.get('/api/inventory', async (req, res) => {
//   try {
//     const filter = {};
//     if (req.query.status) filter.status = req.query.status;
//     if (req.query.provider) filter.provider = req.query.provider;

//     const sims = await SimInventory.find(filter);
//     res.json(sims);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch SIM inventory' });
//   }
// });
// app.get('/api/inventory/available', async (req, res) => {
//   try {
//     const available = await SimInventory.find({ status: 'Available' });
//     res.json(available);
//   } catch (err) {
//     res.status(500).json({ error: 'Could not get available SIMs' });
//   }
// });


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const axios = require("axios");
// // const nodemailer = require('nodemailer');
// // require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const JWT_SECRET = process.env.JWT_SECRET;
// const MONGO_URI = process.env.MONGO_URI;

// /* ------------------ GLOBAL MIDDLEWARE ------------------ */
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// /* ------------------ MONGODB ------------------ */
// mongoose.connect(MONGO_URI)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => console.error('❌ Mongo error:', err));

// /* ------------------ MULTER ------------------ */
// const storage = multer.diskStorage({
//   destination: (_, __, cb) => cb(null, 'uploads/'),
//   filename: (_, file, cb) => cb(null, Date.now() + '_' + file.originalname)
// });
// const upload = multer({ storage });

// // /* ------------------ MAILER (ONE TIME) ------------------ */
// // const transporter = nodemailer.createTransport({
// //   host: 'smtp-relay.brevo.com',
// //   port: 587,
// //   secure: false,
// //   auth: {
// //     user: process.env.SMTP_USER,
// //     pass: process.env.SMTP_PASS
// //   }
// // });


// // verify mail once
// // transporter.verify(err => {
// //   if (err) console.error('❌ SMTP Error:', err);
// //   else console.log('✅ SMTP Ready');
// // });

// /* ------------------ SCHEMAS ------------------ */
// const User = mongoose.model('User', new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   role: String
// }));

// const SimRequest = mongoose.model('SimRequest', new mongoose.Schema({
//   employeeName: String,
//   employeeId: String,
//   mobile: String,
//   designation: String,
//   department: String,
//   email: String,
//   currentProvider: String,
//   requestType: String,
//   justification: String,
//   duration: String,
//   priority: String,
//   document: String,
//   status: { type: String, default: 'HOD Pending' },
//   hod: {
//     name: String,
//     email: String,
//     approvalDate: String,
//     status: String
//   },
//   assignedSim: String,
//   createdAt: { type: Date, default: Date.now }
// }));

// const SimInventory = mongoose.model('SimInventory', new mongoose.Schema({
//   simNumber: String,
//   provider: String,
//   status: { type: String, default: 'Available' },
//   assignedTo: String,
//   createdAt: { type: Date, default: Date.now }
// }));
// async function sendEmail({ to, subject, html }) {
//   try {
//     await axios.post(
//       "https://api.brevo.com/v3/smtp/email",
//       {
//         sender: {
//           name: "Nayara SIM Portal",
//           email: "no-reply@nayara.com"
//         },
//         to: [{ email: to }],
//         subject,
//         htmlContent: html
//       },
//       {
//         headers: {
//           "api-key": process.env.BREVO_API_KEY,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     console.log("✅ Email sent to", to);
//   } catch (err) {
//     console.error("❌ Email failed:", err.response?.data || err.message);
//   }
// }


// /* ------------------ AUTH MIDDLEWARE ------------------ */
// function verifyToken(req, res, next) {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Unauthorized' });

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ error: 'Invalid token' });
//     req.user = user;
//     next();
//   });
// }

// const requireRole = role => (req, res, next) => {
//   if (req.user.role.toLowerCase() !== role.toLowerCase()) {
//     return res.status(403).json({ error: 'Access denied' });
//   }
//   next();
// };

// /* ------------------ AUTH ------------------ */
// app.post('/api/signup', async (req, res) => {
//   try {
//     const hashed = await bcrypt.hash(req.body.password, 10);
//     await User.create({ ...req.body, password: hashed });
//     res.status(201).json({ message: 'Signup successful' });
//   } catch {
//     res.status(400).json({ error: 'Email already exists' });
//   }
// });

// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email & password required' });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }
      
//     // ✅ NORMALIZE ROLE HERE
//     const role = user.role.toLowerCase();
//     const token = jwt.sign(
//       { id: user._id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '2h' }
//     );

//     res.json({
//       message: 'Login successful',
//       token,
//       role: user.role
//     });

//   } catch (err) {
//     console.error('❌ LOGIN ERROR:', err);
//     res.status(500).json({ error: 'Server error during login' });
//   }
// });

// /* ------------------ CREATE REQUEST ------------------ */
// app.post('/api/requests', verifyToken, upload.single('document'), async (req, res) => {
//   try {
//     const request = await SimRequest.create({
//       ...req.body,
//       document: req.file ? `/uploads/${req.file.filename}` : ''
//     });

//     await transporter.sendMail({
//       from: `"Nayara SIM Portal" <${process.env.SMTP_USER}>`,
//       to: process.env.HOD_EMAILS,
//       subject: '🔔 New SIM Request – HOD Approval Required',
//       html: `
//         <h3>New SIM Request</h3>
//         <p>${request.employeeName}</p>
//         <a href="${process.env.FRONTEND_URL}/login.html?redirect=hod-dashboard.html">
//           Open HOD Dashboard
//         </a>`
//     });

//     res.status(201).json({ message: 'Request submitted', request });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Request failed' });
//   }
// });

// /* ------------------ REQUEST FLOWS ------------------ */
// app.get('/api/requests', verifyToken, async (req, res) => {
//   let filter = {};
//   if (req.user.role === 'employee') filter.email = req.user.email;
//   if (req.user.role === 'hod') filter.status = 'HOD Pending';
//   if (req.user.role === 'hr') filter.status = 'HR Pending';
//   res.json(await SimRequest.find(filter).sort({ createdAt: -1 }));
// });

// app.put('/api/requests/:id/hod-approve', verifyToken, requireRole('hod'), async (req, res) => {
//   const updated = await SimRequest.findByIdAndUpdate(
//     req.params.id,
//     { status: 'HR Pending', hod: { ...req.body, status: 'Approved' } },
//     { new: true }
//   );

//   await transporter.sendMail({
//     from: `"Nayara SIM Portal" <${process.env.SMTP_USER}>`,
//     to: process.env.HR_EMAILS,
//     subject: '✅ HOD Approved Request',
//     html: `<p>HOD approved a SIM request.</p>`
//   });

//   res.json(updated);
// });

// app.put('/api/requests/:id/forward', verifyToken, requireRole('hr'), async (req, res) => {
//   const updated = await SimRequest.findByIdAndUpdate(
//     req.params.id,
//     { status: 'Admin Pending' },
//     { new: true }
//   );

//   await transporter.sendMail({
//     from: `"Nayara SIM Portal" <${process.env.SMTP_USER}>`,
//     to: process.env.ADMIN_EMAILS,
//     subject: '📨 HR Approved – Admin Action Needed',
//     html: `<p>HR approved a SIM request.</p>`
//   });

//   res.json(updated);
// });

// /* ------------------ INVENTORY ------------------ */
// app.post('/api/inventory', verifyToken, requireRole('admin'), async (req, res) => {
//   await SimInventory.create(req.body);
//   res.status(201).json({ message: 'SIM added' });
// });

// app.post('/api/inventory/assign', verifyToken, requireRole('admin'), async (req, res) => {
//   const sim = await SimInventory.findById(req.body.simId);
//   const reqq = await SimRequest.findById(req.body.requestId);

//   sim.status = 'Assigned';
//   sim.assignedTo = reqq.employeeName;
//   await sim.save();

//   reqq.assignedSim = sim.simNumber;
//   reqq.status = 'SIM Assigned';
//   await reqq.save();

//   await transporter.sendMail({
//     from: `"Nayara SIM Portal" <${process.env.SMTP_USER}>`,
//     to: reqq.email,
//     subject: '📲 SIM Assigned',
//     html: `<p>Your SIM ${sim.simNumber} has been assigned.</p>`
//   });

//   res.json({ message: 'SIM assigned' });
// });

// // ✅ GET ALL SIMs (Admin only)
// app.get('/api/inventory', verifyToken, requireRole('admin'), async (req, res) => {
//   try {
//     const sims = await SimInventory.find();
//     res.json(sims);
//   } catch (err) {
//     console.error("❌ Inventory fetch error:", err);
//     res.status(500).json({ error: 'Failed to fetch inventory' });
//   }
// });




// app.listen(PORT, () => console.log(`🚀 Backend running on ${PORT}`));

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
require("dotenv").config();
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

/* ------------------ MIDDLEWARE ------------------ */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ------------------ MONGODB ------------------ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Mongo error:", err));

/* ------------------ MAIL CONFIG (NODEMAILER ONLY) ------------------ */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: `"Nayara SIM Portal" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log("✅ Email actually sent to:", to);
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
}

/* ------------------ MULTER ------------------ */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) => cb(null, Date.now() + "_" + file.originalname)
});
const upload = multer({ storage });

/* ------------------ SCHEMAS ------------------ */
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String
}));

const SimRequest = mongoose.model("SimRequest", new mongoose.Schema({
  employeeName: String,
  employeeId: String,
  mobile: String,
  designation: String,
  department: String,
  email: String,
  requestType: String,
  justification: String,
  duration: String,
  priority: String,
  document: String,
  status: { type: String, default: "HOD Pending" },
  hod: {
    name: String,
    email: String,
    approvalDate: String,
    status: String
  },
  assignedSim: String,
  createdAt: { type: Date, default: Date.now }
}));

const SimInventory = mongoose.model("SimInventory", new mongoose.Schema({
  simNumber: String,
  provider: String,
  status: { type: String, default: "Available" },
  assignedTo: String,
  createdAt: { type: Date, default: Date.now }
}));

/* ------------------ AUTH MIDDLEWARE ------------------ */
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

const requireRole = role => (req, res, next) => {
  if (req.user.role.toLowerCase() !== role.toLowerCase()) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

/* ------------------ AUTH ------------------ */
app.post("/api/signup", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  await User.create({ ...req.body, password: hashed });
  res.json({ message: "Signup successful" });
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role.toLowerCase() },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token, role: user.role });
});

/* ------------------ EMPLOYEE → HOD ------------------ */
app.post("/api/requests", verifyToken, upload.single("document"), async (req, res) => {
  const request = await SimRequest.create({
    ...req.body,
    document: req.file ? `/uploads/${req.file.filename}` : ""
  });

  await sendEmail({
    to: process.env.HOD_EMAILS,
    subject: "🔔 New SIM Request – HOD Approval",
    html: `<p>Employee <b>${request.employeeName}</b> submitted a SIM request.</p>`
  });

  res.json({ message: "Request submitted", request });
});

/* ------------------ FETCH REQUESTS ------------------ */
app.get("/api/requests", verifyToken, async (req, res) => {
  let filter = {};
  if (req.user.role === "employee") filter.email = req.user.email;
  if (req.user.role === "hod") filter.status = "HOD Pending";
  if (req.user.role === "hr") filter.status = "HR Pending";

  res.json(await SimRequest.find(filter).sort({ createdAt: -1 }));
});

/* ------------------ HOD → HR ------------------ */
app.put("/api/requests/:id/hod-approve", verifyToken, requireRole("hod"), async (req, res) => {
  const updated = await SimRequest.findByIdAndUpdate(
    req.params.id,
    { status: "HR Pending", hod: { ...req.body, status: "Approved" } },
    { new: true }
  );

  await sendEmail({
    to: process.env.HR_EMAILS,
    subject: "✅ SIM Request Approved by HOD",
    html: `<p>HOD approved a SIM request.</p>`
  });

  res.json(updated);
});

/* ------------------ HR → ADMIN ------------------ */
app.put("/api/requests/:id/forward", verifyToken, requireRole("hr"), async (req, res) => {
  const updated = await SimRequest.findByIdAndUpdate(
    req.params.id,
    { status: "Admin Pending" },
    { new: true }
  );

  await sendEmail({
    to: process.env.ADMIN_EMAILS,
    subject: "📨 SIM Request Pending Admin Action",
    html: `<p>HR forwarded a SIM request.</p>`
  });

  res.json(updated);
});

/* ------------------ ADMIN INVENTORY ------------------ */
app.post("/api/inventory", verifyToken, requireRole("admin"), async (req, res) => {
  await SimInventory.create(req.body);
  res.json({ message: "SIM added" });
});

app.get("/api/inventory", verifyToken, requireRole("admin"), async (req, res) => {
  res.json(await SimInventory.find());
});

/* ------------------ ADMIN ASSIGN SIM ------------------ */
app.post("/api/inventory/assign", verifyToken, requireRole("admin"), async (req, res) => {
  const sim = await SimInventory.findById(req.body.simId);
  const reqq = await SimRequest.findById(req.body.requestId);

  sim.status = "Assigned";
  sim.assignedTo = reqq.employeeName;
  await sim.save();

  reqq.status = "SIM Assigned";
  reqq.assignedSim = sim.simNumber;
  await reqq.save();

  await sendEmail({
    to: reqq.email,
    subject: "📲 SIM Assigned",
    html: `<p>Your SIM <b>${sim.simNumber}</b> has been assigned.</p>`
  });

  res.json({ message: "SIM assigned" });
});

/* ------------------ TEST EMAIL ------------------ */
app.get("/test-email", async (req, res) => {
  await sendEmail({
    to: "popathemangi458@gmail.com",
    subject: "🚀 TEST EMAIL FROM RENDER",
    html: "<h2>If you see this, email is FINALLY working 🎉</h2>"
  });
  res.send("✅ Test email sent");
});

/* ------------------ START ------------------ */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
