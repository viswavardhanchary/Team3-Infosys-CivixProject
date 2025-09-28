const mongoose = require('mongoose');

const PetitionsSchema = new mongoose.Schema({
  created_user_id: String,
  title: String,
  description: String,
  category:String,
  location:String,
  goal: Number,
  created_on: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Active' , 'Under Review' , 'Closed']
  },
  signedBy: {type: [String] , default: []}
})

const Petition = mongoose.model("petition" , PetitionsSchema);

module.exports = Petition;