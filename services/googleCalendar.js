const { google } = require('googleapis');
const oauth2Client = require('../utils/googleClient');

exports.createGoogleCalendarEvent = async (tokens, eventData) => {
  try {
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: eventData,
    });

    console.log('✅ Google Calendar Event Created:', response.data.htmlLink);
    return response.data;
  } catch (err) {
    console.error('❌ Failed to create Google Calendar event:', err.message);
    throw err;
  }
};
