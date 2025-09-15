const express = require('express');
const [addUser,findUser,deleteUser] = require('../controllers/user-controller');

const router = express.Router();

router.post('/add' , addUser);
router.post('/get' , findUser);
router.delete('/delete' , deleteUser)
module.exports = router;

