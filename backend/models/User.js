const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  
  // Student specific fields
  university: { type: String },
  programOfStudy: { type: String },
  year: { type: String },
  gpa: { type: String },
  graduationYear: { type: String },
  skills: [{ type: String }],
  bio: { type: String },
  phone: { type: String },
  linkedin: { type: String },
  github: { type: String },
  portfolio: { type: String },
  cvPath: { type: String },
  profileComplete: { type: Number, default: 0 },
  
  notificationSettings: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: false },
    weeklyDigest: { type: Boolean, default: true },
    deadlineReminders: { type: Boolean, default: true }
  },
  
  privacySettings: {
    profileVisibility: { type: String, enum: ['public', 'private', 'employers'], default: 'employers' },
    allowCvDownload: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
