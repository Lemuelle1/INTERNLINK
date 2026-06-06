const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');
const Scholarship = require('./models/Scholarship');

dotenv.config();

const internships = [
  {
    title: 'Software Engineering Intern',
    company: 'Google',
    location: 'Mountain View, CA',
    salary: '$8,000/mo',
    dueDate: new Date('2026-08-15'),
    tags: ['Engineering', 'Full-stack'],
    matchPercentage: 96,
    shortDescription: "Join Google's core engineering team and work on products used by billions."
  },
  {
    title: 'Product Management Intern',
    company: 'Microsoft',
    location: 'Redmond, WA',
    salary: '$7,500/mo',
    dueDate: new Date('2026-09-01'),
    tags: ['Product', 'Strategy'],
    matchPercentage: 89,
    shortDescription: 'Shape the future of Microsoft\'s enterprise cloud products as a PM intern.'
  },
  {
    title: 'Data Science Intern',
    company: 'Meta',
    location: 'Menlo Park, CA',
    salary: '$9,000/mo',
    dueDate: new Date('2026-07-30'),
    tags: ['Data Science', 'ML'],
    matchPercentage: 82,
    shortDescription: 'Leverage large-scale data to drive insights across Meta\'s platforms.'
  },
  {
    title: 'iOS Engineering Intern',
    company: 'Apple',
    location: 'Cupertino, CA',
    salary: '$8,500/mo',
    dueDate: new Date('2026-08-20'),
    tags: ['Mobile', 'Swift'],
    matchPercentage: 91,
    shortDescription: 'Build the next generation of iOS features for hundreds of millions of users.'
  },
  {
    title: 'Backend Engineering Intern',
    company: 'Stripe',
    location: 'Remote',
    salary: '$8,200/mo',
    dueDate: new Date('2026-08-10'),
    tags: ['Backend', 'Remote'],
    matchPercentage: 88,
    shortDescription: 'Build reliable, scalable payment infrastructure used by millions of businesses.'
  },
  {
    title: 'Data Analytics Intern',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    salary: '$7,800/mo',
    dueDate: new Date('2026-09-05'),
    tags: ['Analytics', 'Python'],
    matchPercentage: 79,
    shortDescription: 'Analyze viewer data to improve Netflix\'s recommendation algorithms.'
  }
];

const scholarships = [
  {
    name: 'Gates Millennium Scholars',
    provider: 'Gates Foundation',
    amount: '$50,000',
    dueDate: new Date('2026-10-01'),
    tags: ['STEM', 'Leadership'],
    matchPercentage: 94,
    shortDescription: 'Supporting exceptional students of color in pursuing higher education in STEM.'
  },
  {
    name: 'Fulbright U.S. Student Award',
    provider: 'Fulbright Program',
    amount: 'Full Funding',
    dueDate: new Date('2026-10-15'),
    tags: ['Research', 'International'],
    matchPercentage: 87,
    shortDescription: 'Study, research, or teach English abroad for one academic year.'
  },
  {
    name: 'Knight-Hennessy Scholars',
    provider: 'Knight Foundation',
    amount: 'Full Funding',
    dueDate: new Date('2026-10-12'),
    tags: ['Graduate', 'Leadership'],
    matchPercentage: 76,
    shortDescription: "Stanford's flagship graduate scholarship for future global leaders."
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Internship.deleteMany();
    await Scholarship.deleteMany();
    await Internship.insertMany(internships);
    await Scholarship.insertMany(scholarships);
    console.log('Seed data loaded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
