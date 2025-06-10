
// services/bookingService.js
const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');

const bookingService = {
  // Create new booking
  createBooking: async (patientId, timeSlotId, notes = '') => {
    // Check if time slot is available
    const timeSlot = await TimeSlot.findById(timeSlotId);
    if (!timeSlot) {
      throw new Error('Time slot not found');
    }
    
    if (timeSlot.isBooked) {
      throw new Error('Time slot already booked');
    }
    
    // Create booking
    const booking = new Booking({
      patientId,
      therapistId: timeSlot.therapistId,
      timeSlotId,
      sessionDate: timeSlot.date,
      sessionStartTime: timeSlot.startTime,
      sessionEndTime: timeSlot.endTime,
      notes
    });
    
    await booking.save();
    
    // Mark time slot as booked
    await TimeSlot.findByIdAndUpdate(timeSlotId, {
      isBooked: true,
      bookedBy: patientId
    });
    
    // Return populated booking
    return await Booking.findById(booking._id).populate('timeSlotId');
  },

  // Get bookings for a patient
  getPatientBookings: async (patientId, filters = {}) => {
    let query = { patientId };
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.startDate && filters.endDate) {
      query.sessionDate = { 
        $gte: new Date(filters.startDate), 
        $lte: new Date(filters.endDate) 
      };
    }
    
    return await Booking.find(query)
      .populate('timeSlotId')
      .sort({ sessionDate: 1, sessionStartTime: 1 });
  },

  // Get bookings for a therapist
  getTherapistBookings: async (therapistId, filters = {}) => {
    let query = { therapistId };
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.startDate && filters.endDate) {
      query.sessionDate = { 
        $gte: new Date(filters.startDate), 
        $lte: new Date(filters.endDate) 
      };
    }
    
    return await Booking.find(query)
      .populate('timeSlotId')
      .sort({ sessionDate: 1, sessionStartTime: 1 });
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    return await Booking.findById(bookingId).populate('timeSlotId');
  },

  // Cancel booking
  cancelBooking: async (bookingId, cancellationReason, cancelledBy) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    if (booking.status === 'cancelled') {
      throw new Error('Booking already cancelled');
    }
    
    // Update booking status
    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.cancelledBy = cancelledBy;
    booking.cancelledAt = new Date();
    await booking.save();
    
    // Free up the time slot
    await TimeSlot.findByIdAndUpdate(booking.timeSlotId, {
      isBooked: false,
      bookedBy: null
    });
    
    return booking;
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    return await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true, runValidators: true }
    );
  }
};

module.exports = bookingService;
