// controllers/timeslotController.js
const timeslotService = require('../services/timeslotService');
const { validationResult } = require('express-validator');

class TimeslotController {
  // Generate time slots from template
  async generateTimeSlots(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { templateId, startDate, endDate } = req.body;
      const result = await timeslotService.generateTimeSlots(templateId, startDate, endDate);
      
      res.status(201).json({ 
        success: true, 
        message: `Generated ${result.generatedSlots.length} time slots`,
        data: result 
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get all time slots for a therapist
  async getTherapistTimeSlots(req, res) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        isBooked: req.query.isBooked
      };
      
      const timeSlots = await timeslotService.getTherapistTimeSlots(req.params.therapistId, filters);
      res.json({ success: true, data: timeSlots });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get available time slots for a therapist (for booking)
  async getAvailableTimeSlots(req, res) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };
      
      const availableSlots = await timeslotService.getAvailableTimeSlots(req.params.therapistId, filters);
      res.json({ success: true, data: availableSlots });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update individual time slot
  async updateTimeSlot(req, res) {
    try {
      const timeSlot = await timeslotService.updateTimeSlot(req.params.id, req.body);
      if (!timeSlot) {
        return res.status(404).json({ success: false, message: 'Time slot not found' });
      }
      
      res.json({ success: true, data: timeSlot });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Delete individual time slot
  async deleteTimeSlot(req, res) {
    try {
      const result = await timeslotService.deleteTimeSlot(req.params.id);
      if (!result) {
        return res.status(404).json({ success: false, message: 'Time slot not found' });
      }
      
      res.json({ success: true, message: 'Time slot deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new TimeslotController();
