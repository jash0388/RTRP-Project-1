const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  violationType: {
    type: DataTypes.ENUM(
      'no_helmet', 'signal_jump', 'wrong_parking', 'overspeeding',
      'wrong_side', 'no_seatbelt', 'overloading', 'using_phone',
      'drunk_driving', 'other'
    ),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  },
  // Media stored as JSON array: [{ url, type }]
  media: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // Location fields
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    defaultValue: ''
  },
  // Manual verification fields (populated by Police/Admin)
  verifiedNumberPlate: {
    type: DataTypes.STRING(20),
    defaultValue: ''
  },
  verifiedVehicleType: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'resolved'),
    defaultValue: 'pending'
  },
  adminNotes: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
}, {
  tableName: 'reports',
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['createdAt'] },
    { fields: ['userId'] },
    { fields: ['violationType'] }
  ]
});

// Helper to format report for API response (matching MongoDB shape)
Report.prototype.toAPIFormat = function(user) {
  return {
    _id: this.id,
    user: user ? { _id: user.id, name: user.name, email: user.email } : { _id: this.userId },
    violationType: this.violationType,
    description: this.description,
    media: this.media || [],
    location: {
      type: 'Point',
      coordinates: [parseFloat(this.longitude), parseFloat(this.latitude)],
      address: this.address
    },
    verifiedNumberPlate: this.verifiedNumberPlate,
    verifiedVehicleType: this.verifiedVehicleType,
    status: this.status,
    adminNotes: this.adminNotes,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = Report;
