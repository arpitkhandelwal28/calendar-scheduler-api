const { RRule } = require('rrule');

/**
 * Expand events only within a limited date range
 */
exports.expandRecurringEvent = (event, from = new Date(), to = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) => {
  if (!event.isRecurring || !event.recurrenceRule) return [];

  const rule = RRule.fromString(event.recurrenceRule);
  const dates = rule.between(from, to); // 👈 limited range

  return dates.map(date => ({
    ...event._doc,
    originalEventId: event._id,
    startTime: date,
    endTime: new Date(date.getTime() + (new Date(event.endTime) - new Date(event.startTime)))
  }));
};
