// controllers/templateController.js
const templateService = require('../services/templateService');
const { validationResult } = require('express-validator');

class TemplateController {
  // Create new template
  static async createTemplate(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const template = await templateService.createTemplate(req.body);
      res.status(201).json({ success: true, data: template });
    } catch (error) {
      if (error.message.includes('already exists')) {
        return res.status(400).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get all templates for a therapist
  static async getTherapistTemplates(req, res) {
    try {
      const templates = await templateService.getTherapistTemplates(req.params.therapistId);
      res.json({ success: true, data: templates });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update template
  static async updateTemplate(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const template = await templateService.updateTemplate(req.params.id, req.body);
      if (!template) {
        return res.status(404).json({ success: false, message: 'Template not found' });
      }

      res.json({ success: true, data: template });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Delete template
  static async deleteTemplate(req, res) {
    try {
      const result = await templateService.deleteTemplate(req.params.id);
      if (!result) {
        return res.status(404).json({ success: false, message: 'Template not found' });
      }

      res.json({ success: true, message: 'Template deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = TemplateController;
