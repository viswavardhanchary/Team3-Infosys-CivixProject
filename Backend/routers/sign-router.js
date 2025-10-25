const express = require("express");
const signRouter=  express.Router();
const [add,remove,getSign] = require('../controllers/sign-controller');

signRouter.get('/getSign' , getSign);
signRouter.post('/add' , add);
signRouter.delete('/remove/:id' , remove);

module.exports = signRouter;