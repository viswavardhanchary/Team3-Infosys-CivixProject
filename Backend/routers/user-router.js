const express = require('express');
const [signup,login,remove,verify] = require('../controllers/user-controller');

const router = express.Router();
router.get('/verify' , verify)
router.post('/add' , signup);
router.post('/get' , login);
router.delete('/delete' , remove)
module.exports = router;

