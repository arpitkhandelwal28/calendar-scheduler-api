const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  timeZone: { type: String, required: true },
  recurrenceRule: { type: String, default: null }, 
  isRecurring: { type: Boolean, default: false },
  recurrenceRule: String, 
  reminderMinutesBefore: { type: Number, default: 15 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
