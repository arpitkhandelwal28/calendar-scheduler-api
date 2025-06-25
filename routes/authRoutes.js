const express = require('express');
const { register, login } = require('../controllers/authController');
const {
  googleLogin,
  googleCallback,
  testCreateCalendarEvent
} = require('../controllers/googleController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and Google Calendar integration
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - timeZone
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               timeZone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Email already exists
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and receive a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Redirect user to Google for OAuth
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent screen
 */
router.get('/google', googleLogin);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth callback and store tokens
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Google tokens stored successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/google/callback', protect, googleCallback);

/**
 * @swagger
 * /api/auth/google/sync:
 *   post:
 *     summary: Sync a test event to Google Calendar
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Event created in Google Calendar
 *       400:
 *         description: No tokens available
 */
router.post('/google/sync', protect, testCreateCalendarEvent);

module.exports = router;


