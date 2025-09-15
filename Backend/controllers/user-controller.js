const User = require('../models/user-model');
const bcrypt = require('bcrypt');
const salt = Number(process.env.SALT)

const addUser = async (req, res) => {
  console.log(req.body);
  let { id, name, email, password, role, location } = req.body;
  const isUserExit = await User.findOne({email});
  if(isUserExit !== null) {
    res.status(400).json({text: "User Already Exisit"});
    return ;
  }
  const newPassword=  await bcrypt.hash(password , salt);
  try {
    password = newPassword;
    await User.create({ id, name, email, password, role, location }); 
    res.status(200).json({name , email , role , location});
    return ;
  }catch(e) {
    res.status(500).json({text : "Some Internal Server Error! Please Refresh the Page!And Try Again"});
  }
}

const findUser = async (req,res) => {
  let {email , password} = req.body;
  let user = await User.findOne({email});
  const isMatch = await bcrypt.compare(password, user? user.password : " ");
  if(!isMatch) {
    res.status(400).json({text : "Invalid email/password"});
    return ;
  }else {
    const {name , role , location} = user;
    res.status(200).json({name , email , role , location});
    return ;
  }
}

const deleteUser = async (req,res) => {
  let {email} = req.body;
  let user = await User.findOne({email});
  if(!user) {
    res.status(400).json({text: "Some Error While Deleting"});
    return ;
  }else {
    await User.deleteOne({email});
    res.status(200).json({text: "SuccessFully Deleted User"});
    return ;
  }
}

module.exports = [addUser,findUser,deleteUser];

