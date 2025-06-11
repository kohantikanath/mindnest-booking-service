// models/TimeSlotTemplate.js
const mongoose = require('mongoose');

const timeSlotTemplateSchema = new mongoose.Schema({
  therapistId: {
    type: Number,
    required: true
  },
  dayOfWeek: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  },
  startTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
  },
  endTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
  },
  sessionDuration: {
    type: Number,
    required: true,
    min: 15, // minimum 15 minutes
    max: 240 // maximum 4 hours
  },
  breakTime: {
    type: Number,
    required: true,
    min: 0,
    max: 60 // maximum 1 hour break
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one template per therapist per day
// timeSlotTemplateSchema.index({ therapistId: 1, dayOfWeek: 1 }, { unique: true });

module.exports = mongoose.model('TimeSlotTemplate', timeSlotTemplateSchema);

