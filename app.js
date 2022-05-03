const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const port = process.env.PORT || 3000; 
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://worship:1234@cluster0.lyfcn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority").then(()=>{
    console.log("database connected");
}).catch(err=>{
    console.log("connection failed " + err);
});

app.listen(port,()=>{
    console.log("Server is running or port : " + port);
});