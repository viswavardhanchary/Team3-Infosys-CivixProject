const User = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const salt = Number(process.env.SALT)
const key = process.env.JWT_KEY

const signup = async (req, res) => {
  let { user_name, name, email, password, role, location } = req.body;
  const isUserExit = await User.findOne({email});
  if(isUserExit !== null) {
    res.status(400).json({text: "User Already Exisit"});
    return ;
  }
  try {
    const newPassword=  await bcrypt.hash(password , salt);
    password = newPassword;
    await User.create({ user_name, name, email, password, role, location }); 
    const token  = await getToken(email); 
    res.status(200).json({token : token});
    return ;
  }catch(e) {
    res.status(500).json({text : "Some Internal Server Error! Please Refresh the Page!And Try Again"});
  }
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

const login = async (req,res) => {
  let {email , password} = req.body;
  let user = await User.findOne({email});
  const isMatch = await bcrypt.compare(password, user? user.password : " ");
  if(!isMatch) {
    res.status(400).json({text : "Invalid email/password"});
    return ;
  }else {
    const token  = await getToken(email); 
    res.status(200).json({token : token});
    return ;
  }
}


const updateInfo = async (req,res) => {
  const {user_name,type} = req.params;
  const {data , update} = req.body;
  console.log(user_name,type);
  const isFound = await User.findOne({user_name});
  if(!isFound) {
    return res.status(400).json({text : "User Not Found"});
  }
  if(update) {
    const obj = {$push : {}};
    obj.$push[type] = data;
    try {
      await User.updateOne(
        {user_name},
        obj
      );
      return res.status(200).send();
    }catch(e) {
      return res.status(500).json({text : "Some Internal Server Error! Please Refresh the Page!And Try Again"});
    }
  }else {
    const obj = {$pull : {}};
    obj.$pull[type] = data;
    try {
      await User.updateOne(
        {user_name},
        obj
      );
      res.status(200).send()
    }catch(e) {
      return res.status(500).json({text : "Some Internal Server Error! Please Refresh the Page!And Try Again"});
    }
  }
}

const userInfo = async (req,res) => {
  const data = verifyToken(req);
  if(!data.found) {
    return res.status(400).json({text : "Login Needed!"});
  }else {
    try {
      let user = await User.findOne({user_name: data.data});
      return res.status(200).json(user);
    }catch(e) {
      return res.status(500).json({text : "Some Internal Server Error! Please Refresh the Page!And Try Again"});
    }
  }
}

const verifyToken = (req) => {
  const authHeader=  req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];
  if(!token) {
    return {found: false}
  }
  const result = jwt.verify(token , key , (err , userdata) => {
    if(err) return {found: false}
    return {found: true , data: userdata.user_name};
  });
  return result;
}


const verify = (req,res) => {
  const data = verifyToken(req);
  if(!data.found) {
    return res.status(400).json({text : "Login Needed!"});
  }else {
    return res.status(200).json({userData : data.data});
  }
}


const getToken = async (email) => {
  let user = await User.findOne({email});
  const token = jwt.sign({user_name: user.user_name} , key , {expiresIn : '30d'});
  return token;
}

module.exports = [signup,login,remove,verify,userInfo,updateInfo];

