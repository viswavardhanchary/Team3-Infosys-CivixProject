const express = require('express');
const UserRouter = express.Router();
const [signup,login,remove,verify,userInfo,updateInfo] = require('../controllers/user-controller');


UserRouter.get('/verify' , verify);
UserRouter.get('/userInfo' , userInfo);
UserRouter.post('/signup' , signup);
UserRouter.post('/login' , login);
UserRouter.put('/update/:type/:user_name' , updateInfo);
UserRouter.delete('/delete' , remove)



module.exports = UserRouter;

