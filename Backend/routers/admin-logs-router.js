const express = require('express');
const AdminLogRouter = express.Router();
const [addLog,getLog] = require('../controllers/admin-logs-controller');


AdminLogRouter.get('/getLog/:admin_id' , getLog);
AdminLogRouter.put('/addLog' , addLog);


module.exports = AdminLogRouter;