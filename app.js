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
const userRoute = require("./route/userRoute");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("./public"));

app.use("/user",userRoute);

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Server is running or port : " + port);
});