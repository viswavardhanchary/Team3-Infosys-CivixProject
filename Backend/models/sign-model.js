const mongoose = require("mongoose");

const SignSchema = new mongoose.Schema({
  petition_id: String,
  signed_user_id: String,
  timestamp: Date  
});

const Sign = mongoose.model("sign" , SignSchema);
module.exports = Sign; 