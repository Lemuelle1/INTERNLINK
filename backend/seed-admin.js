const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const seedAdmin = async () => {
  try {
    await User.deleteOne({ email: 'admin@internlink.com' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin123!', salt);

    const admin = new User({
      name: 'System Administrator',
      email: 'admin@internlink.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();

    console.log('Admin account created successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
