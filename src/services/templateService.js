
// services/templateService.js
const TimeSlotTemplate = require('../models/TimeslotTemplate');

const templateService = {
  // Create new template
  createTemplate: async (templateData) => {
    try {
      const template = new TimeSlotTemplate(templateData);
      await template.save();
      return template;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Template already exists for this day');
      }
      throw error;
    }
  },

  // Get all templates for a therapist
  getTherapistTemplates: async (therapistId) => {
    return await TimeSlotTemplate.find({ 
      therapistId, 
      isActive: true 
    }).sort({ dayOfWeek: 1 });
  },

  // Update template
  updateTemplate: async (templateId, updateData) => {
    return await TimeSlotTemplate.findByIdAndUpdate(
      templateId, 
      updateData, 
      { new: true, runValidators: true }
    );
  },

  // Delete template (soft delete)
  deleteTemplate: async (templateId) => {
    return await TimeSlotTemplate.findByIdAndUpdate(
      templateId,
      { isActive: false },
      { new: true }
    );
  }
};

module.exports = templateService;
