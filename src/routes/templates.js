// routes/templates.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const templateController = require('../controllers/templateController');

// Validation middleware
const templateValidation = [
  body('therapistId').isMongoId().withMessage('Valid therapist ID is required'),
  body('dayOfWeek').isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time required (HH:MM)'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time required (HH:MM)'),
  body('sessionDuration').isInt({ min: 15, max: 240 }).withMessage('Session duration must be 15-240 minutes'),
  body('breakTime').isInt({ min: 0, max: 60 }).withMessage('Break time must be 0-60 minutes')
];

const templateUpdateValidation = [
  body('startTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('sessionDuration').optional().isInt({ min: 15, max: 240 }),
  body('breakTime').optional().isInt({ min: 0, max: 60 })
];

// Routes
router.post('/', templateValidation, templateController.createTemplate);
router.get('/therapist/:therapistId', templateController.getTherapistTemplates);
router.put('/:id', templateUpdateValidation, templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;
