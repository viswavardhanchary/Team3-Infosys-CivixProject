const mongoose = require('mongoose');

const PetitionsSchema = new mongoose.Schema({
  id: String,
  created_user_name: String,
  title: String,
  description: String,
  category:String,
  location:String,
  status: {
    type: String,
    enum: ['Active' , 'Under ueview' , 'Closed']
  }
})

const Petition = mongoose.model("petition" , PetitionsSchema);

module.exports = Petition;