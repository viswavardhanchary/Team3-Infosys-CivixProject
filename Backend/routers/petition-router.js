const express = require('express');
const petitionRouter = express.Router();
const [add,remove,get,updateSign] = require('../controllers/petition-controller');

petitionRouter.get('/get' , get);
petitionRouter.post('/add' , add);
petitionRouter.post("/updateSign" , updateSign);
petitionRouter.delete('/remove/:id' , remove);

module.exports = petitionRouter;
