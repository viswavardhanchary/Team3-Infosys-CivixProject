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
  signedByMe: {type: [String] , default: []}
});

const User = mongoose.model('User' , UserSchema);
module.exports = User;