const mongoose = require('mongoose');

const labSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    totalSeats: { type: Number, required: true, min: 1 },
    equipmentTags: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lab', labSchema);
