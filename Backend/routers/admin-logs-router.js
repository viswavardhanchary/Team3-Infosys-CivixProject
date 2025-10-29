const express = require('express');
const AdminLogRouter = express.Router();
const [addLog,getLog,getUserLogs] = require('../controllers/admin-logs-controller');


AdminLogRouter.get('/getLog/:admin_id' , getLog);
AdminLogRouter.get('/getUserLogs/:user_id' , getUserLogs);
AdminLogRouter.put('/addLog' , addLog);


module.exports = AdminLogRouter;