const express = require('express');
const Booking = require('../models/Booking');
const Lab = require('../models/Lab');
const Slot = require('../models/Slot');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/labs', async (request, response) => {
  try {
    const labs = await Lab.find().sort({ createdAt: -1 });
    console.log('[GET /labs] returning', labs.length, 'labs');
    response.json({ data: labs });
  } catch (error) {
    console.error('[GET /labs] error:', error.message);
    response.status(500).json({ message: error.message });
  }
});

router.post('/labs', requireAuth, requireAdmin, async (request, response) => {
  console.log('[POST /labs] body:', JSON.stringify(request.body));
  const { name, location, totalSeats, equipmentTags } = request.body;
  if (!name || !location || !totalSeats) {
    return response.status(400).json({ message: 'name, location and totalSeats are required' });
  }
  try {
    const lab = await Lab.create({ name, location, totalSeats, equipmentTags: equipmentTags || [] });
    console.log('[POST /labs] created:', lab._id);
    return response.status(201).json({ data: lab });
  } catch (error) {
    console.error('[POST /labs] error:', error.message);
    return response.status(500).json({ message: error.message });
  }
});

router.get('/slots', async (request, response) => {
  const filters = {};
  if (request.query.labId) filters.labId = request.query.labId;
  if (request.query.date) filters.date = request.query.date;
  const slots = await Slot.find(filters)
    .populate('labId', 'name location')
    .sort({ date: 1, startTime: 1 });
  response.json({ data: slots });
});

router.post('/slots', requireAuth, requireAdmin, async (request, response) => {
  const { labId, date, startTime, endTime, capacity } = request.body;
  if (!labId || !date || !startTime || !endTime || !capacity) {
    return response.status(400).json({ message: 'labId, date, startTime, endTime, capacity are required' });
  }
  const slot = await Slot.create({ labId, date, startTime, endTime, capacity });
  return response.status(201).json({ data: slot });
});

router.post('/bookings', requireAuth, async (request, response) => {
  const { slotId, purpose } = request.body;
  if (!slotId) {
    return response.status(400).json({ message: 'slotId is required' });
  }

  const slot = await Slot.findById(slotId);
  if (!slot) {
    return response.status(404).json({ message: 'Slot not found' });
  }

  const approvedCount = await Booking.countDocuments({ slotId, status: 'APPROVED' });
  if (approvedCount >= slot.capacity) {
    return response.status(409).json({ message: 'Slot capacity reached' });
  }

  const existingActiveBooking = await Booking.findOne({
    studentId: request.user.id,
    slotId,
    status: { $in: ['PENDING', 'APPROVED'] },
  });

  if (existingActiveBooking) {
    return response.status(409).json({ message: 'Booking already exists for this slot' });
  }

  const booking = await Booking.create({
    studentId: request.user.id,
    slotId,
    purpose: purpose || '',
  });

  return response.status(201).json({ data: booking });
});

router.get('/bookings/me', requireAuth, async (request, response) => {
  const bookings = await Booking.find({ studentId: request.user.id })
    .populate({ path: 'slotId', populate: { path: 'labId', select: 'name location' } })
    .sort({ createdAt: -1 });
  response.json({ data: bookings });
});

router.get('/bookings', requireAuth, requireAdmin, async (request, response) => {
  const query = {};
  if (request.query.status) query.status = request.query.status;
  const bookings = await Booking.find(query).sort({ createdAt: -1 });
  response.json({ data: bookings });
});

router.patch('/bookings/:id/approve', requireAuth, requireAdmin, async (request, response) => {
  const booking = await Booking.findById(request.params.id);
  if (!booking) {
    return response.status(404).json({ message: 'Booking not found' });
  }
  booking.status = 'APPROVED';
  booking.reviewedBy = request.user.id;
  booking.reviewedAt = new Date();
  await booking.save();
  return response.json({ data: booking });
});

router.patch('/bookings/:id/reject', requireAuth, requireAdmin, async (request, response) => {
  const booking = await Booking.findById(request.params.id);
  if (!booking) {
    return response.status(404).json({ message: 'Booking not found' });
  }
  booking.status = 'REJECTED';
  booking.reviewedBy = request.user.id;
  booking.reviewedAt = new Date();
  await booking.save();
  return response.json({ data: booking });
});

module.exports = router;
