const express = require("express");
const PollsRouter = express.Router();
const [add,remove,update,get,getPolls,updateClose] = require('../controllers/polls-controller');

PollsRouter.get("/get" , get);
PollsRouter.get("/getPolls" , getPolls);
PollsRouter.post('/add' , add);
PollsRouter.put('/update/:id' ,update);
PollsRouter.put('/updateClose/:id' ,updateClose);
PollsRouter.delete("/remove/:id" , remove);



module.exports = PollsRouter;