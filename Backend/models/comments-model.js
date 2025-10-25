const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
  petition_id: String,
  comment: {type: [[String]] , default: []},
});

const comments = mongoose.model("comment" , CommentsSchema);
module.exports = comments;
