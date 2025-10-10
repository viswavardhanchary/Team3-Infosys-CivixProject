const express = require("express");
const PollsRouter = express.Router();
const [add,remove,update,get,getPolls] = require('../controllers/polls-controller');

PollsRouter.get("/get" , get);
PollsRouter.get("/getPolls" , getPolls);
PollsRouter.post('/add' , add);
PollsRouter.delete("/remove/:id" , remove);
PollsRouter.put('/update/:id' ,update);

module.exports = PollsRouter;