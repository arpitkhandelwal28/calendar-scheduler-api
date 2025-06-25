const { google } = require('googleapis');
const oauth2Client = require('../utils/googleClient');
const { createGoogleCalendarEvent } = require('../services/googleCalendar');
const tokenStore = require('../utils/tokenStore');
const User = require('../models/User');

exports.googleLogin = (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/calendar'];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  res.redirect(url);
};

exports.googleCallback = async (req, res) => {
  const { code } = req.query;

  console.log("🌐 Callback route hit");

  if (!code) {
    console.log("❌ No code in query");
    return res.status(400).send("❌ Missing authorization code.");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const email = 'akhandelwal1228@gmail.com'; // TODO: replace with dynamic user email

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('❌ User not found');

    user.google = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || user.google.refreshToken, // keep old if not returned
    };

    await user.save();

    tokenStore.setTokens(tokens); // ✅ store in shared module

    console.log("✅ Received Google Tokens:", tokens);
    res.send("✅ Google Calendar connected successfully!");
  } catch (err) {
    console.error("❌ Google Auth Error:", err.message);
    res.status(500).send("❌ Failed to authenticate with Google");
  }
};

exports.testCreateCalendarEvent = async (req, res) => {
  try {
    const email = 'akhandelwal1228@gmail.com'; // TODO: use auth token to identify user
    const user = await User.findOne({ email });

    if (!user || !user.google?.accessToken) {
      return res.status(400).send("❌ No stored Google tokens for user");
    }

    const tokens = {
      access_token: user.google.accessToken,
      refresh_token: user.google.refreshToken,
    };

    const event = {
      summary: 'Demo Event from API',
      location: 'Zoom',
      description: 'This is a test event synced to Google Calendar.',
      start: {
        dateTime: new Date(Date.now() + 5 * 60000).toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: new Date(Date.now() + 35 * 60000).toISOString(),
        timeZone: 'Asia/Kolkata',
      },
    };

    const result = await createGoogleCalendarEvent(tokens, event);
    res.status(200).json({ message: 'Event created!', link: result.htmlLink });

  } catch (error) {
    console.error("❌ Event creation failed:", error.message);
    res.status(500).send("❌ Could not create event in Google Calendar");
  }
};
