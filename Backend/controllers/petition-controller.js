const Petition = require("../models/petitions-model");
const Sign = require('../models/sign-model');
const User = require('../models/user-model');



const get = async (req, res) => {
  const isFound = await Petition.find({});
  if (!isFound) {
    return res.status(400).json({ text: "Error in getting Petitions!Try Reload the Website" });
  }
  try {
    return res.status(200).json(isFound);
  } catch (e) {
    res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
  }
}


const add = async (req, res) => {
  const { id, created_user_id, created_on, goal, title, description, category, location, status } = req.body;
  if (id) {
    try {
      await Petition.updateOne({ _id: id }, { created_user_id, title, description, category, location, goal, created_on, status });
      return res.status(200).json({ text: "Petition Updated SuccessFully!" });
    } catch (e) {
      res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
    }
  } else {
    try {
      await Petition.create({ created_user_id, title, description, category, location, goal, created_on, status });
      return res.status(200).json({ text: "Petition Created SuccessFully!" });
    } catch (e) {
      res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
    }
  }
}


const updateSign = async (req, res) => {
  const { pet_id, id, remove } = req.body;
  const isFound = await Petition.findOne({ _id: pet_id });
  if (!isFound) {
    return res.status(400).json({ text: "Petition Not Found" });
  }
  if (!remove) {
    const obj = { $push: {} };
    obj.$push["signedBy"] = id;
    try {
      await Petition.updateOne(
        { _id: pet_id },
        obj
      );
      return res.status(200).send();
    } catch (e) {
      console.log(e);
      return res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
    }
  } else {
    const obj = { $pull: {} };
    obj.$pull["signedBy"] = id;
    try {
      await Petition.updateOne(
        { _id: pet_id },
        obj
      );
      res.status(200).send()
    } catch (e) {
      console.log(e);
      return res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
    }
  }
}


const remove = async (req, res) => {
  const { id } = req.params;
  const isFound = await Petition.findOne({ _id: id });
  if (!isFound) {
    return res.status(400).json({ text: "Petition Not Found!" });
  }
  try {
    const newSignedBy = (await User.findOne({ _id: isFound.created_user_id })).signedByMe.filter((sign, idx) => {
      return !isFound.signedBy.includes(sign);
    });
    await User.updateOne(
      { _id: isFound.created_user_id },
      { signedByMe: newSignedBy }
    )
    await Sign.deleteMany({ petition_id: id });
    await Petition.deleteOne({ _id: id });
    return res.status(200).json({ text: "Petition Deleted SuccessFully!" });
  } catch (e) {
    res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
  }
}

module.exports = [add, remove, get, updateSign];