const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const port = Number(process.env.BOOKING_SERVICE_PORT || 4002);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (request, response) => {
  response.json({ success: true, service: 'booking-service' });
});

app.use('/', bookingRoutes);

app.use((error, request, response, next) => {
  return response.status(500).json({ message: error.message || 'Server error' });
});

async function startServer() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lab-slot-booking';
  console.log('[booking-service] connecting to MongoDB:', mongoUri);
  await mongoose.connect(mongoUri);
  console.log('[booking-service] MongoDB connected');
  app.listen(port, () => {
    console.log(`[booking-service] running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('[booking-service] failed to start:', error.message);
  process.exit(1);
});
