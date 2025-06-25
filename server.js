require('./config/loadEnv');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

dotenv.config();
console.log("✅ TEST_ENV_WORKING:", process.env.TEST_ENV_WORKING);
connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => res.send('Calendar Scheduler API'));

require('./services/reminderScheduler');

const setupSwaggerDocs = require('./swagger');
setupSwaggerDocs(app);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
