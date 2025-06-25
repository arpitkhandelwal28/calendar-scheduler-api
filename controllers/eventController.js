const Event = require('../models/Event');
const { expandRecurringEvent } = require('../utils/recurringUtils');

// CREATE
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, user: req.user._id });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create event', error: err.message });
  }
};

// READ ALL
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
};

// READ ONE
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.user._id });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving event', error: err.message });
  }
};

// UPDATE
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update event', error: err.message });
  }
};

// DELETE
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete event', error: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id });

    const now = new Date();
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    const expandedEvents = events.flatMap(event => {
      if (event.isRecurring) {
        return expandRecurringEvent(event);
      }
      return [event];
    });

    res.status(200).json(expandedEvents);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
};