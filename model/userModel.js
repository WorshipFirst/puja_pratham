const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    otp : String,
    password : String,
    mobile : String,
    address : String
});

module.exports = mongoose.model("users",userSchema);