const mongoose = require('mongoose');

const AdminLogSchema = new mongoose.Schema({
  admin_id: String,
  user_id: String,
  activity: [
    {
      text: String,
      timestamp: {type: String , default: (new Date()).toLocaleString()}
    }
  ],
});

const AdminLog = mongoose.model("adminlog" , AdminLogSchema);

module.exports = AdminLog;