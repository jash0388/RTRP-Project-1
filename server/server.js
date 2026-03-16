const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/db');

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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/police', policeRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', database: 'MySQL', timestamp: new Date().toISOString() });
});

// Seed default users
const seedUsers = async () => {
  try {
    const adminExists = await User.findOne({ where: { email: 'admin@sphn.com' } });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@sphn.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user seeded: admin@sphn.com / admin123');
    }

    const policeExists = await User.findOne({ where: { email: 'police@sphn.com' } });
    if (!policeExists) {
      await User.create({
        name: 'Officer Singh',
        email: 'police@sphn.com',
        password: 'police123',
        role: 'police'
      });
      console.log('Police user seeded: police@sphn.com / police123');
    }

    const citizenExists = await User.findOne({ where: { email: 'citizen@sphn.com' } });
    if (!citizenExists) {
      await User.create({
        name: 'John Citizen',
        email: 'citizen@sphn.com',
        password: 'citizen123',
        role: 'user'
      });
      console.log('Citizen user seeded: citizen@sphn.com / citizen123');
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
  });
};

startServer();

module.exports = app;
