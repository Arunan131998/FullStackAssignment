const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function upsertUser({ name, email, role, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      $set: {
        name,
        role,
        passwordHash,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function run() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lab-slot-booking';
  await mongoose.connect(mongoUri);

  await upsertUser({
    name: 'Lab Admin',
    email: 'admin@example.com',
    role: 'admin',
    password: 'Admin@123',
  });

  await upsertUser({
    name: 'Student User',
    email: 'student@example.com',
    role: 'student',
    password: 'Student@123',
  });

  console.log('Seed complete: admin@example.com / Admin@123, student@example.com / Student@123');
  await mongoose.disconnect();
}

run()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error('Seed failed:', error.message);
    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error('Disconnect failed:', disconnectError.message);
    }
    process.exit(1);
  });
