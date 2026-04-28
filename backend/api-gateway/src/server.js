const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const port = Number(process.env.API_GATEWAY_PORT || 4000);
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
const bookingServiceUrl = process.env.BOOKING_SERVICE_URL || 'http://localhost:4002';

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(morgan('dev'));

app.get('/health', (request, response) => {
  response.json({ success: true, service: 'api-gateway' });
});

app.use('/auth', createProxyMiddleware({ target: authServiceUrl, changeOrigin: true }));
app.use('/booking', createProxyMiddleware({ target: bookingServiceUrl, changeOrigin: true }));

app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
