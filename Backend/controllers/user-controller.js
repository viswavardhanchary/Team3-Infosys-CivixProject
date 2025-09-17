const User = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const salt = Number(process.env.SALT)
const key = process.env.JWT_KEY

const signup = async (req, res) => {
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

const login = async (req,res) => {
  let {email , password} = req.body;
  let user = await User.findOne({email});
  const isMatch = await bcrypt.compare(password, user? user.password : " ");
  if(!isMatch) {
    res.status(400).json({text : "Invalid email/password"});
    return ;
  }else {
    const userdata = {name: user.name , email: user.email , role: user.role , location: user.location};
    const token = jwt.sign(userdata , key , {expiresIn : '30d'});
    res.status(200).json({token : token , userdata});
    return ;
  }
}


const verify = (req,res) => {
  const authHeader=  req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];
  if(!token) {
    return res.status(400).json({text : "Login Needed"});
  }
  jwt.verify(token , key , (err , userdata) => {
    if(err) return res.status(400).json({text : "Login Needed"});
    return res.status(200).json(userdata);
  });
}

const remove = async (req,res) => {
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

module.exports = [signup,login,remove,verify];

