const express = require("express");
const CommentsRouter = express.Router();
const [get , add , update , remove] = require('../controllers/comments-controller');

CommentsRouter.get("/get/:id" , get);
CommentsRouter.post("/add" , add);
CommentsRouter.put("/update" , update);
CommentsRouter.delete("/delete" , remove);



module.exports = CommentsRouter;