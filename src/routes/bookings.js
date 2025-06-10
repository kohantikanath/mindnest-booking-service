
// routes/bookings.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bookingController = require('../controllers/bookingController.js');

// Validation middleware
const bookingValidation = [
  body('patientId').isMongoId().withMessage('Valid patient ID is required'),
  body('timeSlotId').isMongoId().withMessage('Valid time slot ID is required')
];

const cancelValidation = [
  body('cancellationReason').notEmpty().withMessage('Cancellation reason is required'),
  body('cancelledBy').isMongoId().withMessage('Valid user ID is required')
];

const statusValidation = [
  body('status').isIn(['confirmed', 'completed', 'no-show']).withMessage('Invalid status')
];

// Routes
router.post('/', bookingValidation, bookingController.createBooking);
router.get('/patient/:patientId', bookingController.getPatientBookings);
router.get('/therapist/:therapistId', bookingController.getTherapistBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id/cancel', cancelValidation, bookingController.cancelBooking);
router.put('/:id/status', statusValidation, bookingController.updateBookingStatus);

module.exports = router;
