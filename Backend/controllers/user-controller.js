const User = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const salt = Number(process.env.SALT)
const key = process.env.JWT_KEY

const signup = async (req, res) => {
  let { name, email, password, role, location } = req.body;
  const isUserExit = await User.findOne({email});
  if(isUserExit !== null) {
    res.status(400).json({text: "User Already Exisit"});
    return ;
  }
  try {
    const newPassword=  await bcrypt.hash(password , salt);
    password = newPassword;
    const user = await User.create({ name, email, password, role, location }); 
    const token = await getToken(user._id.toString());
    res.status(200).json({token : token});
    return ;
  }catch(e) {
    console.log(e);
    res.status(500).json({text : "Some Internal Server Error! Please Refresh the Page!And Try Again"});
  }
}

const remove = async (req,res) => {
  const {id} = req.body;
  const user = await User.findOne({_id: id});
  if(!user) {
    res.status(400).json({text: "Some Error While Deleting"});
    return ;
  }else {
    await User.deleteOne({_id : id});
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
    const token  = await getToken(user._id.toString()); 
    res.status(200).json({token : token});
    return ;
  }
}


const updateSign = async (req,res) => {
  const {user_id,id,remove} = req.body;
  const isFound = await User.findOne({_id: user_id});
  if(!isFound) {
    return res.status(400).json({text : "Petition Not Found"});
  }
  if(!remove) {
    const obj = {$push : {}};
    obj.$push["signedByMe"] = id;
    try {
      await User.updateOne(
        {_id: user_id},
        obj
      );
      return res.status(200).send();
    }catch(e) {
      console.log(e);
      return res.status(500).json({text : "Some Internal Server Error! Please Refresh the Page!And Try Again"});
    }
  }else {
    const obj = {$pull : {}};
    obj.$pull["signedByMe"] = id;
    try {
      await User.updateOne(
        {_id: user_id},
        obj
      );
      res.status(200).send()
    }catch(e) {
      console.log(e);
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
      let user = await User.findOne({_id: data.data});
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
    return {found: true , data: userdata.id};
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


const getToken = async (id) => {
  let user = await User.findOne({_id : id});
  const token = jwt.sign({id} , key , {expiresIn : '30d'});
  return token;
}

module.exports = [signup,login,remove,verify,userInfo,updateSign];

