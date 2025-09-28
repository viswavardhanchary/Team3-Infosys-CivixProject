const Sign = require('../models/sign-model');

const add = async (req,res) => {
  const {petition_id , signed_user_id} = req.body;
  try {
    const isFound = await Sign.findOne({petition_id , signed_user_id});
    if(isFound) {
      return res.status(200).send({text : "SucessFully Signed" , response});
    }
    const response = await Sign.create({petition_id , signed_user_id});
    return res.status(200).send({text : "SucessFully Signed" , response});
  } catch (e) {
    return res.status(500).json({text : "Some Internal Server Error! Please Refresh the Page!And Try Again"});
  }
}



const remove = async (req,res) => {
  const {id} = req.params;
  try {
    const isFound = await Sign.findOne({_id : id});
    if(isFound) {
      await Sign.deleteOne({_id: id});
      return res.status(200).send({text : "SucessFully UnSigned"});
    }else {
      return res.status(500).json({text : "Some Internal Server Error! Please Refresh the Page!And Try Again"});
    }
  } catch (e) {
    return res.status(500).json({text : "Some Internal Server Error! Please Refresh the Page!And Try Again"});
  }
}


module.exports = [add,remove];