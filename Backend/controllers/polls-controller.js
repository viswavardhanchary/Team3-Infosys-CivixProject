const polls = require('../models/polls-model');

const add = async (req, res) => {
  const { id, title, description, options, category, location, allowMultiple, created_user_id } = req.body;

  if (id) {
    try {
      await polls.updateOne({ _id: id }, { title, description, options, category, location, allowMultiple, created_user_id });
      return res.status(200).json({ text: "Poll Updated SuccessFully!" });
    } catch (e) {
      res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
    }
  } else {
    try {
      await polls.create({ title, description, options, category, location, allowMultiple, created_user_id });
      return res.status(200).json({ text: "Poll Created SuccessFully!" });
    } catch (e) {
      res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
    }
  }
}


const remove = async (req, res) => {
  const { id } = req.params;
  const isFound = await polls.findOne({ _id: id });
  if (!isFound) {
    return res.status(400).json({ text: "Poll Not Found!" });
  }
  try {
    await polls.deleteOne({ _id: id });
    return res.status(200).json({ text: "Poll Deleted SuccessFully!" });
  } catch (e) {
    res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
  }
}

const getPolls = async (req, res) => {
  const isFound = await polls.find({});
  if (!isFound) {
    return res.status(400).json({ text: "Error in getting Polls!Try Reload the Website" });
  }
  try {
    return res.status(200).json(isFound);
  } catch (e) {
    res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
  }
}

const update = async (req, res) => {
  const { id } = req.params;
  const { options } = req.body;
  const isFound = await polls.findOne({ _id: id });
  if (!isFound) {
    return res.status(400).json({ text: "Poll Not Found" });
  }
  try {
    const r = await polls.updateOne({ _id: id }, { $set: { options: options } });
    if (r.modifiedCount == 0) {
      return res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
    }
    res.status(200).json({ text: "poll Updated" })
  } catch (e) {
    return res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
  }
}

const updateClose = async (req, res) => {
  const { id } = req.params;
  const { isClosed } = req.body;
  const isFound = await polls.findOne({ _id: id });
  if (!isFound) {
    return res.status(400).json({ text: "Poll Not Found" });
  }
  try {
    const r = await polls.updateOne({ _id: id }, { isClosed });
    if (r.modifiedCount == 0) {
      return res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
    }
    res.status(200).json({ text: "poll Closed" })
  } catch (e) {
    return res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
  }
}

const get = async (req, res) => {

}




module.exports = [add, remove, update, get, getPolls, updateClose];
