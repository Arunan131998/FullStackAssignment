const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
const port = Number(process.env.AUTH_SERVICE_PORT || 4001);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (request, response) => {
  response.json({ success: true, service: 'auth-service' });
});

app.use('/', authRoutes);

app.use((error, request, response, next) => {
  return response.status(500).json({ message: error.message || 'Server error' });
});

async function startServer() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lab-slot-booking';
  console.log('[auth-service] connecting to MongoDB:', mongoUri);
  await mongoose.connect(mongoUri);
  console.log('[auth-service] MongoDB connected');
  app.listen(port, () => {
    console.log(`[auth-service] running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('[auth-service] failed to start:', error.message);
  process.exit(1);
});
