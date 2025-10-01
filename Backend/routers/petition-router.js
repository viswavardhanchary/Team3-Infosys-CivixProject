const express = require('express');
const petitionRouter = express.Router();
const [add,remove,get,updateSign,updateStatus] = require('../controllers/petition-controller');

petitionRouter.get('/get' , get);
petitionRouter.post('/add' , add);
petitionRouter.post("/updateSign" , updateSign);
petitionRouter.put("/updateStatus/:id" , updateStatus);
petitionRouter.delete('/remove/:id' , remove);

module.exports = petitionRouter;
