const express = require('express');
const Booking = require('../models/Booking');
const Lab = require('../models/Lab');
const Slot = require('../models/Slot');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

function hasInvalidTimeRange(startTime, endTime) {
  return startTime >= endTime;
}

function isPastSlot(date, startTime) {
  const slotDateTime = new Date(`${date}T${startTime}:00`);
  if (Number.isNaN(slotDateTime.getTime())) {
    return false;
  }
  return slotDateTime.getTime() < Date.now();
}

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

  const slotIds = slots.map((slot) => slot._id);
  const approvedCounts = await Booking.aggregate([
    {
      $match: {
        slotId: { $in: slotIds },
        status: 'APPROVED',
      },
    },
    {
      $group: {
        _id: '$slotId',
        count: { $sum: 1 },
      },
    },
  ]);

  const approvedCountMap = new Map(
    approvedCounts.map((entry) => [String(entry._id), entry.count])
  );

  const slotsWithAvailability = slots.map((slot) => {
    const approvedCount = approvedCountMap.get(String(slot._id)) || 0;
    const remainingCapacity = Math.max(slot.capacity - approvedCount, 0);

    return {
      ...slot.toObject(),
      approvedCount,
      remainingCapacity,
      isAvailable: remainingCapacity > 0,
    };
  });

  response.json({ data: slotsWithAvailability });
});

router.post('/slots', requireAuth, requireAdmin, async (request, response) => {
  const { labId, date, startTime, endTime, capacity } = request.body;
  if (!labId || !date || !startTime || !endTime || !capacity) {
    return response.status(400).json({ message: 'labId, date, startTime, endTime, capacity are required' });
  }

  const lab = await Lab.findById(labId);
  if (!lab) {
    return response.status(404).json({ message: 'Lab not found' });
  }

  if (Number(capacity) > lab.totalSeats) {
    return response.status(400).json({
      message: `Slot capacity cannot exceed the lab seats (${lab.totalSeats})`,
    });
  }

  if (hasInvalidTimeRange(startTime, endTime)) {
    return response.status(400).json({ message: 'endTime must be later than startTime' });
  }

  if (isPastSlot(date, startTime)) {
    return response.status(400).json({ message: 'Cannot create slots in the past' });
  }

  const conflictingSlot = await Slot.findOne({
    labId,
    date,
    isActive: true,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });

  if (conflictingSlot) {
    return response.status(409).json({ message: 'A slot already exists for this lab during that time' });
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

  const overlappingBookings = await Booking.find({
    studentId: request.user.id,
    status: { $in: ['PENDING', 'APPROVED'] },
  }).populate('slotId');

  for (const existingBooking of overlappingBookings) {
    const existingSlot = existingBooking.slotId;
    if (existingSlot.date === slot.date) {
      const overlap = existingSlot.startTime < slot.endTime && existingSlot.endTime > slot.startTime;
      if (overlap) {
        return response.status(409).json({
          message: `You already have a booking on ${slot.date} from ${existingSlot.startTime} to ${existingSlot.endTime}`,
        });
      }
    }
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
  const bookings = await Booking.find(query)
    .populate({ path: 'slotId', populate: { path: 'labId', select: 'name location' } })
    .sort({ createdAt: -1 });
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

router.patch('/bookings/:id/cancel', requireAuth, async (request, response) => {
  const booking = await Booking.findById(request.params.id);
  if (!booking) {
    return response.status(404).json({ message: 'Booking not found' });
  }

  const isAdmin = request.user?.role === 'admin';
  const isOwner = booking.studentId === request.user?.id;

  if (!isAdmin && !isOwner) {
    return response.status(403).json({ message: 'You can only cancel your own booking' });
  }

  if (booking.status === 'CANCELLED') {
    return response.status(409).json({ message: 'Booking is already cancelled' });
  }

  if (booking.status === 'COMPLETED') {
    return response.status(409).json({ message: 'Completed bookings cannot be cancelled' });
  }

  if (booking.status === 'REJECTED') {
    return response.status(409).json({ message: 'Rejected bookings cannot be cancelled' });
  }

  if (!isAdmin && booking.status !== 'PENDING') {
    return response.status(409).json({ message: 'Students can only cancel pending bookings' });
  }

  booking.status = 'CANCELLED';
  booking.reviewedBy = request.user.id;
  booking.reviewedAt = new Date();
  await booking.save();
  return response.json({ data: booking });
});

module.exports = router;
