require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const users = [
  {
    fullname: 'Admin EVision',
    email: 'admin@evision.ai',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    fullname: 'Chukwuemeka Obi',
    email: 'government@evision.ai',
    password: 'Govt@123',
    role: 'government',
  },
  {
    fullname: 'Bola Adeyemi',
    email: 'investor@evision.ai',
    password: 'Invest@123',
    role: 'investor',
  },
  {
    fullname: 'Ngozi Eze',
    email: 'operator@evision.ai',
    password: 'Operator@123',
    role: 'operator',
  },
  {
    fullname: 'Emeka Nwosu',
    email: 'planner@evision.ai',
    password: 'Planner@123',
    role: 'planner',
  },
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evision_ai');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    console.log('Cleared existing users');

    // Use insertMany won't trigger pre-save hook, so save individually to hash passwords
    for (const u of users) {
      await new User(u).save();
      console.log(`  ✓ ${u.role.padEnd(12)} — ${u.email}  /  ${u.password}`);
    }

    console.log('\n✅ User seed complete!');
    console.log('\n─── Login Credentials ───────────────────────────');
    console.log('Role         Email                    Password');
    console.log('─────────────────────────────────────────────────');
    users.forEach(u =>
      console.log(`${u.role.padEnd(13)}${u.email.padEnd(25)}${u.password}`)
    );
    console.log('─────────────────────────────────────────────────');

    process.exit(0);
  } catch (err) {
    console.error('User seed error:', err);
    process.exit(1);
  }
}

seedUsers();
