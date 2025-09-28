const express = require('express');
const UserRouter = express.Router();
const [signup,login,remove,verify,userInfo,updateSign] = require('../controllers/user-controller');


UserRouter.get('/verify' , verify);
UserRouter.get('/userInfo' , userInfo);
UserRouter.post('/signup' , signup);
UserRouter.post('/updateSign' , updateSign);
UserRouter.post('/login' , login);
UserRouter.delete('/delete' , remove)



module.exports = UserRouter;

