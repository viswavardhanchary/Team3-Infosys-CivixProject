const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['citizen', 'official']
  },
  location: String,
  phone: { type: String, default: "" },
  bio: { type: String, default: "" },
  socialLinks: {
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    github: { type: String, default: "" }
  },
  signedByMe: { type: [String], default: [] }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
