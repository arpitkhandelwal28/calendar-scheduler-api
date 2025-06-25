const cron = require('node-cron');
const Event = require('../models/Event');
const { sendReminderEmail } = require('../utils/sendReminder');
const User = require('../models/User');

cron.schedule('* * * * *', async () => {
  console.log("⏰ CRON: Checking for reminders...");

  const now = new Date();
  const soon = new Date(now.getTime() + 60 * 1000);

  console.log(`🕒 Looking for events between ${now.toISOString()} and ${soon.toISOString()}`);

  const events = await Event.find({
    startTime: { $gte: now, $lte: soon }
  }).populate('user');

  console.log(`📦 Found ${events.length} event(s)`);

  for (const event of events) {
    const reminderTime = new Date(event.startTime.getTime() - event.reminderMinutesBefore * 60000);
    const isReminderDue = reminderTime <= now && reminderTime >= new Date(now.getTime() - 60000);

    console.log(`🔍 Event: ${event.title}`);
    console.log(`    Reminder time: ${reminderTime}`);
    console.log(`    Is Reminder Due? ${isReminderDue}`);

    if (isReminderDue) {
      console.log(`🚀 Sending reminder to ${event.user.email} for "${event.title}"`);

      await sendReminderEmail(
        event.user.email,
        `Reminder: ${event.title}`,
        `You have an event "${event.title}" starting at ${event.startTime.toLocaleString()}`
      );
    }
  }
});

