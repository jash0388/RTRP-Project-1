const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { connectDB } = require('./config/db');
const sanitize = require('./middleware/sanitize');

// Import models to register them with Sequelize
const User = require('./models/User');
const Report = require('./models/Report');

// Define associations
User.hasMany(Report, { foreignKey: 'userId', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Import routes
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');
const policeRoutes = require('./routes/police');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// ===== SECURITY MIDDLEWARE =====

// Helmet — sets secure HTTP headers (XSS, clickjacking, MIME sniffing protection)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' } // Allow uploads to load cross-origin
}));

// CORS — restrict to known frontend origins only
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, server-to-server, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS: Origin not allowed'), false);
  },
  credentials: true
}));

// Rate limiting — General API (100 requests per 15 min per IP)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP. Please try again after 15 minutes.' }
});

// Rate limiting — Auth routes (5 attempts per 15 min per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Your IP has been temporarily blocked. Try again after 15 minutes.' }
});

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization — XSS prevention on all request bodies
app.use(sanitize);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== API ROUTES =====

// Auth routes — with strict rate limiting on login/register
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/google', authLimiter);
app.use('/api/auth', authRoutes);

// Other API routes — with general rate limiting
app.use('/api/reports', generalLimiter, reportRoutes);
app.use('/api/admin', generalLimiter, adminRoutes);
app.use('/api/police', generalLimiter, policeRoutes);
app.use('/api/analytics', generalLimiter, analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', database: 'MySQL', timestamp: new Date().toISOString() });
});

// Seed default users (with strong passwords)
const seedUsers = async () => {
  try {
    const adminExists = await User.findOne({ where: { email: 'admin@sphn.com' } });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@sphn.com',
        password: 'Admin@SPHN2024',
        role: 'admin'
      });
      console.log('Admin user seeded: admin@sphn.com / Admin@SPHN2024');
    }

    const policeExists = await User.findOne({ where: { email: 'police@sphn.com' } });
    if (!policeExists) {
      await User.create({
        name: 'Officer Singh',
        email: 'police@sphn.com',
        password: 'Police@SPHN2024',
        role: 'police'
      });
      console.log('Police user seeded: police@sphn.com / Police@SPHN2024');
    }

    const citizenExists = await User.findOne({ where: { email: 'citizen@sphn.com' } });
    if (!citizenExists) {
      await User.create({
        name: 'John Citizen',
        email: 'citizen@sphn.com',
        password: 'Citizen@SPHN2024',
        role: 'user'
      });
      console.log('Citizen user seeded: citizen@sphn.com / Citizen@SPHN2024');
    }
  } catch (error) {
    console.log('User seed skipped:', error.message);
  }
};

// Seed demo reports
const seedReports = async () => {
  try {
    const citizen = await User.findOne({ where: { email: 'citizen@sphn.com' } });
    if (citizen) {
      const citizenReportsCount = await Report.count({ where: { userId: citizen.id } });
      if (citizenReportsCount === 0) {
        await Report.bulkCreate([
          {
            userId: citizen.id,
            violationType: 'signal_jump',
            description: 'Red light crossed at high speed.',
            latitude: 19.0760,
            longitude: 72.8777,
            address: 'Bandra Signal, Mumbai',
            status: 'pending',
            aiNumberPlate: 'MH02AB1234',
            aiVehicleType: 'car',
            aiConfidence: 0.89
          },
          {
            userId: citizen.id,
            violationType: 'no_helmet',
            description: 'Rider without helmet on main road.',
            latitude: 19.0822,
            longitude: 72.8812,
            address: 'Kurla West, Mumbai',
            status: 'approved',
            adminNotes: 'Clear violation. Fine issued to owner.',
            aiNumberPlate: 'MH04XY9876',
            aiVehicleType: 'motorcycle',
            aiHelmetDetected: false,
            aiConfidence: 0.95
          },
          {
            userId: citizen.id,
            violationType: 'wrong_parking',
            description: 'Parked blocking the footpath.',
            latitude: 19.0910,
            longitude: 72.8655,
            address: 'Santacruz Market, Mumbai',
            status: 'rejected',
            adminNotes: 'Image too blurry to read number plate, discarding evidence.',
            aiVehicleType: 'car',
            aiConfidence: 0.65
          },
          {
            userId: citizen.id,
            violationType: 'using_phone',
            description: 'Driver texting while driving during heavy traffic.',
            latitude: 19.1023,
            longitude: 72.8456,
            address: 'Andheri East, Mumbai',
            status: 'pending',
            aiNumberPlate: 'MH01PQ1122',
            aiVehicleType: 'car',
            aiConfidence: 0.88
          },
          {
            userId: citizen.id,
            violationType: 'overspeeding',
            description: '',
            latitude: 19.0213,
            longitude: 72.8421,
            address: 'Dadar TT Circle, Mumbai',
            status: 'pending',
            aiNumberPlate: 'MH03BC4455',
            aiVehicleType: 'car',
            aiConfidence: 0.92
          }
        ]);
        console.log('Demo violation reports seeded successfully.');
      }
    }
  } catch (error) {
    console.log('Report seed skipped:', error.message);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Connect to DB then start server
const startServer = async () => {
  await connectDB();
  await seedUsers();
  await seedReports();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Security: Helmet enabled, CORS restricted, Rate limiting active, Input sanitization on`);
  });
};

startServer();

module.exports = app;
