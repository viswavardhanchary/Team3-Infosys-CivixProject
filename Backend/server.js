const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDataBase = require('./config/database.js');
const UserRouter = require('./routers/user-router.js');
const petitionRouter = require('./routers/petition-router.js');
const cors = require('cors');
dotenv.config()
connectDataBase();

app.use(cors({
  origin: ["http://localhost:5173" , "http://localhost:5174"] 
}));
app.use(express.json());
app.use("/users" , UserRouter);
app.use("/petitions" , petitionRouter);


app.get("/" , (req,res)=> {
  res.status(200).send("Hello Civix Backend");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT , ()=> {
  console.log("Server is started at port: http://localhost:"+PORT);
});
