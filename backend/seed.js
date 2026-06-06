const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Internship = require('./models/Internship');
const Scholarship = require('./models/Scholarship');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const internships = [
  {
    title: 'Software Engineering Intern', company: 'Google', location: 'Mountain View, CA', salary: '$9,000/mo', dueDate: new Date('2026-10-15'),
    tags: ['Software Engineering', 'Python', 'C++'], description: 'Work on core Google products.', matchPercentage: 96, remote: false, requirements: ['C++', 'Python']
  },
  {
    title: 'Product Management Intern', company: 'Microsoft', location: 'Redmond, WA', salary: '$8,500/mo', dueDate: new Date('2026-11-01'),
    tags: ['Product Management', 'Strategy'], description: 'Define the future of Microsoft products.', matchPercentage: 89, remote: false, requirements: ['Business acumen']
  },
  {
    title: 'Data Science Intern', company: 'Meta', location: 'Menlo Park, CA', salary: '$8,800/mo', dueDate: new Date('2026-10-30'),
    tags: ['Data Science', 'Python', 'SQL'], description: 'Analyze large datasets.', matchPercentage: 82, remote: false, requirements: ['Python', 'SQL', 'ML']
  },
  {
    title: 'Hardware Engineering Intern', company: 'Apple', location: 'Cupertino, CA', salary: '$8,700/mo', dueDate: new Date('2026-11-15'),
    tags: ['Hardware', 'Electrical Engineering'], description: 'Design next generation Apple devices.', matchPercentage: 91, remote: false, requirements: ['EE', 'Verilog']
  },
  {
    title: 'Backend Engineering Intern', company: 'Stripe', location: 'San Francisco, CA', salary: '$9,200/mo', dueDate: new Date('2026-10-20'),
    tags: ['Backend', 'Go', 'Ruby'], description: 'Build payment infrastructure.', matchPercentage: 88, remote: false, requirements: ['Go', 'Ruby']
  },
  {
    title: 'UI/UX Design Intern', company: 'Netflix', location: 'Los Gatos, CA', salary: '$8,600/mo', dueDate: new Date('2026-11-05'),
    tags: ['Design', 'Figma', 'UI/UX'], description: 'Design amazing user experiences.', matchPercentage: 79, remote: false, requirements: ['Figma', 'Portfolio']
  }
];

const scholarships = [
  {
    name: 'Gates Millennium Scholars', provider: 'Bill & Melinda Gates Foundation', amount: '$50k', dueDate: new Date('2026-12-01'),
    tags: ['Undergraduate', 'Minority'], description: 'Full scholarship for outstanding minority students.', matchPercentage: 94
  },
  {
    name: 'Fulbright Foreign Student Program', provider: 'U.S. Department of State', amount: 'Full Funding', dueDate: new Date('2026-10-15'),
    tags: ['International', 'Graduate'], description: 'Grants for international students to study in the US.', matchPercentage: 87
  },
  {
    name: 'Knight-Hennessy Scholars', provider: 'Stanford University', amount: 'Full Funding', dueDate: new Date('2026-10-09'),
    tags: ['Graduate', 'Leadership'], description: 'Full funding for any graduate degree at Stanford.', matchPercentage: 76
  }
];

const seedData = async () => {
  try {
    await Internship.deleteMany();
    await Scholarship.deleteMany();
    await User.deleteOne({ email: 'jane@mit.edu' });

    await Internship.insertMany(internships);
    await Scholarship.insertMany(scholarships);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const student = new User({
      name: 'Jane Doe',
      email: 'jane@mit.edu',
      password: hashedPassword,
      role: 'student',
      university: 'MIT',
      programOfStudy: 'B.S. Computer Science & Engineering',
      year: 'Junior',
      gpa: '3.87/4.00',
      graduationYear: 'May 2027',
      skills: ['React', 'TypeScript', 'Python', 'Machine Learning', 'Node.js', 'PostgreSQL', 'Git', 'Docker', 'AWS', 'GraphQL'],
      bio: 'Computer Science Student at MIT passionate about software engineering.',
      phone: '+1 (617) 555-0192',
      linkedin: 'linkedin.com/in/janedoe',
      github: 'github.com/janedoe',
      portfolio: 'janedoe.dev',
      profileComplete: 78
    });
    await student.save();

    console.log('Seed data inserted successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
