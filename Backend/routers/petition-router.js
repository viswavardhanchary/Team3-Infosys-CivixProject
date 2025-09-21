const express = require('express');
const petitionRouter = express.Router();
const [add,remove] = require('../controllers/petition-controller');


petitionRouter.post('/add' , add);
petitionRouter.delete('/remove' , remove);

module.exports = petitionRouter;
