// controllers/bookingController.js
const bookingService = require('../services/bookingService');
const { validationResult } = require('express-validator');

class BookingController {
  // Create new booking
  static async createBooking(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { patientId, timeSlotId, notes } = req.body;
      const booking = await bookingService.createBooking(patientId, timeSlotId, notes);

      res.status(201).json({ success: true, data: booking });
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('already booked')) {
        return res.status(400).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get bookings for a patient
  static async getPatientBookings(req, res) {
    try {
      const filters = {
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const bookings = await bookingService.getPatientBookings(req.params.patientId, filters);
      res.json({ success: true, data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get bookings for a therapist
  static async getTherapistBookings(req, res) {
    try {
      const filters = {
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const bookings = await bookingService.getTherapistBookings(req.params.therapistId, filters);
      res.json({ success: true, data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get booking by ID
  static async getBookingById(req, res) {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      res.json({ success: true, data: booking });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Cancel booking
  static async cancelBooking(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { cancellationReason, cancelledBy } = req.body;
      const booking = await bookingService.cancelBooking(req.params.id, cancellationReason, cancelledBy);

      res.json({ success: true, data: booking });
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('already cancelled')) {
        return res.status(400).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update booking status
  static async updateBookingStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const booking = await bookingService.updateBookingStatus(req.params.id, req.body.status);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      res.json({ success: true, data: booking });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = BookingController;
