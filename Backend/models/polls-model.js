const mongoose = require("mongoose");

const PollsSchema = new mongoose.Schema({
  title: String,
  description: String,
  options: [
    {
      text: {
        type: String,
        required: true
      },
      votes: {
        type: [String],
        default: []
      }
    }
  ],
  category: String,
  location: String,
  allowMultiple: { type: Boolean, default: false },
  created_user_id: String

});

const polls = mongoose.model("poll", PollsSchema);

module.exports = polls;