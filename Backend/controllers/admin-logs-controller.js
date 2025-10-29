const AdminLog = require('../models/admin-logs-model');

const addLog = async (req,res) => {
  const {admin_id , activity:text , user_id} = req.body;
  try {
    const isFound = await AdminLog.find({admin_id});
    if(isFound.length > 0) {
      let dActivity = isFound[0].activity;
      dActivity = [...dActivity , {text}];

      await AdminLog.updateOne({admin_id} , {activity : dActivity , user_id});
    }else
      await AdminLog.create({admin_id , activity:[{text}] , user_id});
    res.status(200).send();

  }catch(e) {
    return res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
  }
}



const getLog = async(req,res)=> {
  const { admin_id } = req.params;

  try {
    const data = await AdminLog.find({admin_id});
    res.status(200).json({data: data[0].activity});

  }catch(e) {
    return res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
  }
}


const getUserLogs = async(req,res)=> {
  const { user_id } = req.params;

  try {
    const data = await AdminLog.find({user_id});
    res.status(200).json({data: data[0]});

  }catch(e) {
    return res.status(500).json({ text: "Some Internal Server Error! Please Refresh the Page!And Try Again" });
  }
}

module.exports = [addLog,getLog,getUserLogs];