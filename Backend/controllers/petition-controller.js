const Petition = require("../models/petitions-model");

const add = async (req,res) => {
  const {id,created_user_name,title,description,category,location,status} = req.body;
    const isFound = await Petition.findOne({created_user_name,title,description,category,location,status});
    if(isFound) {
      return res.status(400).json({text: "Petition Already Created!"});
    }
   try {
      await Petition.create({id,created_user_name,title,description,category,location,status}); 
      return res.status(200).json({text : "Petition Created SuccessFully!"});
    }catch(e) {
      res.status(500).json({text : "Some Internal Server Error! Please Refresh the Page!And Try Again"});
    }
}


const remove = async (req,res) => {
  const {id} = req.body;
    const isFound = await Petition.findOne({id});
    if(!isFound) {
      return res.status(400).json({text: "Petition Not Found!"});
    }
   try {
      await Petition.deleteOne({id}); 
      return res.status(200).json({text : "Petition Deleted SuccessFully!"});
    }catch(e) {
      res.status(500).json({text : "Some Internal Server Error! Please Refresh the Page!And Try Again"});
    }
}

module.exports = [add,remove];