const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_name: String,
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['citizen', 'official']
  },
  location: String,
  petitions: {type : [String] , default: []},
  polls: {type : [String] , default: []},
  signedPetitions: {type : [String] , default: []},
  votedPolls: {type : [String] , default: []},
});

const User = mongoose.model('User' , userSchema);
module.exports = User;