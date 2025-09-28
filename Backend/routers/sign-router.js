const express = require("express");
const signRouter=  express.Router();
const [add,remove] = require('../controllers/sign-controller');


signRouter.post('/add' , add);
signRouter.delete('/remove/:id' , remove);

module.exports = signRouter;