const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Internship = require('./models/Internship');
const Scholarship = require('./models/Scholarship');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/internlink';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Internship.deleteMany({});
    await Scholarship.deleteMany({});

    // Create admin user
    const hashedPassword = await bcryptjs.hash('Admin123!', 10);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@internlink.com',
      password: hashedPassword,
      role: 'admin',
      university: 'InternLink',
      programOfStudy: 'Administration'
    });
    await admin.save();
    console.log('✓ Admin user created');

    // Create sample students
    const students = [
      { name: 'Jane Doe', email: 'jane@mit.edu', university: 'MIT', program: 'Computer Science' },
      { name: 'Carlos Mendez', email: 'carlos@stanford.edu', university: 'Stanford', program: 'Business' },
      { name: 'Priya Sharma', email: 'priya@berkeley.edu', university: 'UC Berkeley', program: 'Engineering' },
      { name: 'Aisha Okonkwo', email: 'aisha@harvard.edu', university: 'Harvard', program: 'Computer Science' },
      { name: 'Marcus Thompson', email: 'marcus@yale.edu', university: 'Yale', program: 'Finance' }
    ];

    for (const student of students) {
      const hashedPwd = await bcryptjs.hash('password123', 10);
      const user = new User({
        name: student.name,
        email: student.email,
        password: hashedPwd,
        university: student.university,
        programOfStudy: student.program,
        role: 'student'
      });
      await user.save();
    }
    console.log('✓ 5 students created');

    // Create internships
    const internships = [
      { title: 'Software Engineering Intern', organization: 'Google', description: 'Build scalable systems', location: 'Mountain View, CA', salary: '$25/hr', active: true },
      { title: 'Product Management Intern', organization: 'Microsoft', description: 'Drive product strategy', location: 'Redmond, WA', salary: '$24/hr', active: true },
      { title: 'Data Science Intern', organization: 'Meta', description: 'Analyze user data', location: 'Menlo Park, CA', salary: '$26/hr', active: true },
      { title: 'Backend Engineering Intern', organization: 'Stripe', description: 'Build payment infrastructure', location: 'San Francisco, CA', salary: '$27/hr', active: true },
      { title: 'iOS Engineering Intern', organization: 'Apple', description: 'Develop iOS apps', location: 'Cupertino, CA', salary: '$28/hr', active: true }
    ];

    for (const internship of internships) {
      await new Internship(internship).save();
    }
    console.log('✓ 5 internships created');

    // Create scholarships
    const scholarships = [
      { title: 'Gates Millennium Scholars', organization: 'Gates Foundation', description: 'Full tuition scholarship', active: true },
      { title: 'Fulbright U.S. Student Award', organization: 'Fulbright Program', description: 'International study abroad', active: true },
      { title: 'Chevron Scholarship', organization: 'Chevron Corp', description: 'STEM scholarship $5000/year', active: true }
    ];

    for (const scholarship of scholarships) {
      await new Scholarship(scholarship).save();
    }
    console.log('✓ 3 scholarships created');

    console.log('✅ Seed completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seed();
