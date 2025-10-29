const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDataBase = require('./config/database.js');
const UserRouter = require('./routers/user-router.js');
const petitionRouter = require('./routers/petition-router.js');
const signRouter = require('./routers/sign-router.js');
const PollsRouter = require('./routers/polls-router.js');
const CommentsRouter = require("./routers/comments-router.js");
const AdminLogRouter = require('./routers/admin-logs-router.js');
const cors = require('cors');
dotenv.config();
connectDataBase();

app.use(cors({
  origin: ["https://civix-team3.onrender.com"] 
}));

app.use(express.json());
app.use("/users" , UserRouter);
app.use("/petitions" , petitionRouter);
app.use('/sign' ,signRouter);
app.use('/polls' ,PollsRouter);
app.use('/comment' , CommentsRouter);
app.use('/log' , AdminLogRouter);



app.get("/" , (req,res)=> {
  res.status(200).send("Hello Civix Backend");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT , ()=> {
  console.log("Server is started at port: http://localhost:"+PORT);
});
