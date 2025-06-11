
// services/timeslotService.js
const TimeSlot = require('../models/TimeSlot');
const TimeSlotTemplate = require('../models/TimeslotTemplate.js');
const moment = require('moment');

const timeslotService = {
  // Generate time slots from template
  generateTimeSlots: async (templateId, startDate, endDate) => {
    const template = await TimeSlotTemplate.findById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const generatedSlots = [];
    const skippedSlots = [];
    const start = moment(startDate);
    const end = moment(endDate);
    
    // Generate slots for each day in the range
    for (let date = start.clone(); date.isSameOrBefore(end); date.add(1, 'day')) {
      const dayName = date.format('dddd').toLowerCase();
      
      if (dayName === template.dayOfWeek) {
        const slots = generateDaySlots(template, date.format('YYYY-MM-DD'));
        
        // Save each slot
        for (const slotData of slots) {
          try {
            const existingSlot = await TimeSlot.findOne({
              therapistId: template.therapistId,
              date: slotData.date,
              startTime: slotData.startTime
            });
            
            if (!existingSlot) {
              const slot = new TimeSlot(slotData);
              await slot.save();
              generatedSlots.push(slot);
            } else {
              skippedSlots.push(slotData);
            }
          } catch (err) {
            if (err.code === 11000) {
              skippedSlots.push(slotData);
            } else {
              throw err;
            }
          }
        }
      }
    }

    return { generatedSlots, skippedSlots };
  },

  // Get all time slots for a therapist
  getTherapistTimeSlots: async (therapistId, filters = {}) => {
    let query = { therapistId, isActive: true };
    
    if (filters.startDate && filters.endDate) {
      query.date = { 
        $gte: new Date(filters.startDate), 
        $lte: new Date(filters.endDate) 
      };
    }
    
    if (filters.isBooked !== undefined) {
      query.isBooked = filters.isBooked === 'true';
    }
    
    return await TimeSlot.find(query)
      .populate('templateId')
      .sort({ date: 1, startTime: 1 });
  },

  // Get available time slots for booking
  getAvailableTimeSlots: async (therapistId, filters = {}) => {
    let query = { 
      therapistId, 
      isBooked: false, 
      isActive: true,
      date: { $gte: new Date() } // Only future slots
    };
    
    if (filters.startDate && filters.endDate) {
      query.date = { 
        $gte: new Date(filters.startDate), 
        $lte: new Date(filters.endDate) 
      };
    }
    
    return await TimeSlot.find(query)
      .populate('templateId')
      .sort({ date: 1, startTime: 1 });
  },

  // Update individual time slot
  updateTimeSlot: async (timeSlotId, updateData) => {
    return await TimeSlot.findByIdAndUpdate(
      timeSlotId,
      updateData,
      { new: true, runValidators: true }
    );
  },

  // Delete individual time slot (soft delete)
  deleteTimeSlot: async (timeSlotId) => {
    return await TimeSlot.findByIdAndUpdate(
      timeSlotId,
      { isActive: false },
      { new: true }
    );
  }
};

// Helper function to generate slots for a day
function generateDaySlots(template, date) {
  const slots = [];
  const startTime = moment(`${date} ${template.startTime}`, 'YYYY-MM-DD HH:mm');
  const endTime = moment(`${date} ${template.endTime}`, 'YYYY-MM-DD HH:mm');
  
  let currentTime = startTime.clone();
  
  while (currentTime.clone().add(template.sessionDuration, 'minutes').isSameOrBefore(endTime)) {
    const slotEndTime = currentTime.clone().add(template.sessionDuration, 'minutes');
    
    slots.push({
      therapistId: template.therapistId,
      templateId: template._id,
      date: moment(date).toDate(),
      startTime: currentTime.format('HH:mm'),
      endTime: slotEndTime.format('HH:mm')
    });
    
    // Move to next slot (session duration + break time)
    currentTime.add(template.sessionDuration + template.breakTime, 'minutes');
  }
  
  return slots;
}

module.exports = timeslotService;
