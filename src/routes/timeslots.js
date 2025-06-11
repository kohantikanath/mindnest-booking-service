
// routes/timeslots.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const timeslotController = require('../controllers/timeslotController.js');

// Validation middleware
const generateSlotsValidation = [
  body('templateId').isMongoId().withMessage('Valid template ID is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required')
];

// Routes
router.post('/generate', generateSlotsValidation, timeslotController.generateTimeSlots);
router.get('/therapist/:therapistId', timeslotController.getTherapistTimeSlots);
router.get('/available/:therapistId', timeslotController.getAvailableTimeSlots);
router.put('/:id', timeslotController.updateTimeSlot);
router.delete('/:id', timeslotController.deleteTimeSlot);

module.exports = router;
