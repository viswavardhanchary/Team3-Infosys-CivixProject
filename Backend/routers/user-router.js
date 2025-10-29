const express = require('express');
const UserRouter = express.Router();
const [
  signup,
  login,
  remove,
  verify,
  userInfo,
  updateSign,
  getUser,
  updateProfile,
  deleteAccount,
  changePassword
] = require('../controllers/user-controller');

UserRouter.get('/get/:id', getUser);
UserRouter.get('/verify', verify);
UserRouter.get('/userInfo', userInfo);

UserRouter.post('/signup', signup);
UserRouter.post('/login', login);
UserRouter.post('/updateSign', updateSign);


UserRouter.put('/updateProfile', updateProfile);

UserRouter.put('/changePassword', changePassword);

UserRouter.delete('/delete', remove);

module.exports = UserRouter;


