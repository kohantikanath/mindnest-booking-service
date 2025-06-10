
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['patient', 'therapist'],
    required: true
  },
  // Additional fields for therapists
  specialization: {
    type: String,
    required: function() { return this.role === 'therapist'; }
  },
  experience: {
    type: Number,
    required: function() { return this.role === 'therapist'; }
  },
  bio: {
    type: String,
    required: function() { return this.role === 'therapist'; }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);