const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
require('dotenv').config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL,{useNewUrlParser:true}).then(()=>{
    console.log("Database connected sucessfully");
}).catch(err=>{
    console.log(err);
});
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Server is running or port : " + port);
});