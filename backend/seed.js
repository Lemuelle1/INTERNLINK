const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Opportunity = require('./models/Opportunity');
const Application = require('./models/Application');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedData = async () => {
  try {
    // 1. Connect to DB
    const connStr = process.env.DB_URI || 'mongodb://127.0.0.1:27017/internlink';
    console.log(`Connecting to database: ${connStr}`);
    await mongoose.connect(connStr);
    console.log('Connected to MongoDB!');

    // 2. Clear old data
    console.log('Clearing old data...');
    await User.deleteMany();
    await Opportunity.deleteMany();
    await Application.deleteMany();
    console.log('Database cleared!');

    // 3. Create Users
    console.log('Creating seed users...');
    const admin = await User.create({
      name: 'Admin Jane',
      email: 'admin@internlink.com',
      password: 'admin123', // Will be hashed automatically by pre-save hook
      role: 'admin',
      bio: 'Lead Coordinator at InternLink.',
    });

    const student = await User.create({
      name: 'John Doe',
      email: 'student@internlink.com',
      password: 'student123', // Will be hashed automatically
      role: 'student',
      bio: 'Computer Science sophomore specializing in Full-Stack Web Development. Looking for summer internships.',
      skills: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'CSS', 'Bootstrap'],
      cvUrl: '', // To be uploaded
    });

    console.log('Admin user created (admin@internlink.com / admin123)');
    console.log('Student user created (student@internlink.com / student123)');

    // 4. Create Opportunities
    console.log('Creating opportunities...');
    const date30 = new Date(); date30.setDate(date30.getDate() + 30);
    const date60 = new Date(); date60.setDate(date60.getDate() + 60);
    const date15 = new Date(); date15.setDate(date15.getDate() + 15);
    const date90 = new Date(); date90.setDate(date90.getDate() + 90);

    const opportunities = await Opportunity.create([
      {
        title: 'Software Engineering Intern',
        company: 'Google',
        location: 'Mountain View, CA (Hybrid)',
        type: 'internship',
        description: 'Join the Google Workspace team to build the next generation of collaboration tools. You will work alongside experienced software engineering mentors and write code that reaches millions of users.',
        requirements: 'Currently pursuing a BS, MS or PhD in Computer Science or related technical field. Experience with Javascript, Node.js, C++ or Java.',
        stipend: '$8,000 / month',
        duration: '12 weeks',
        deadline: date30,
        createdBy: admin._id,
      },
      {
        title: 'UI/UX Design Intern',
        company: 'Figma',
        location: 'San Francisco, CA',
        type: 'internship',
        description: 'We are looking for a passionate UI/UX Design Intern who is eager to shape the future of design tools. You will help prototype new features, gather customer insights, and contribute to Figma’s design system.',
        requirements: 'Portfolio showcasing interaction design, visual design and user research. Strong familiarity with Figma tools and prototyping.',
        stipend: '$6,500 / month',
        duration: '6 months',
        deadline: date60,
        createdBy: admin._id,
      },
      {
        title: 'Women in Tech Scholarship',
        company: 'Google Generation',
        location: 'Remote',
        type: 'scholarship',
        description: 'Google Generation Scholarship was established to help aspiring computer scientists excel in technology and become leaders in the field. Selected students will receive funding for the upcoming academic year.',
        requirements: 'Identify as a female. Be currently enrolled as a full-time student in a Bachelors program in Computer Science or related field for the 2026-2027 academic year.',
        stipend: '$10,000 Award',
        duration: '1 Academic Year',
        deadline: date15,
        createdBy: admin._id,
      },
      {
        title: 'Global Leaders Graduate Fellowship',
        company: 'Fulbright Foundation',
        location: 'Global',
        type: 'scholarship',
        description: 'The Fulbright Scholarship is a prestigious international exchange program designed to support graduate studies, advanced research, and university teaching worldwide. Covers full tuition, airfare, and living stipends.',
        requirements: 'Bachelors degree or equivalent with strong academic record. English proficiency. Demonstrated leadership potential and cross-cultural adaptability.',
        stipend: 'Fully Funded (Tuition + Stipend)',
        duration: '2 Years',
        deadline: date90,
        createdBy: admin._id,
      },
    ]);

    console.log(`Created ${opportunities.length} seed opportunities!`);

    // Close connection
    await mongoose.disconnect();
    console.log('Seeding completed successfully! Connection closed.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
