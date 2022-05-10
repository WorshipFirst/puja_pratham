const mongoose = require("mongoose");

const temples = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    image : {
        type : String,
        required : true
    },
    address:{
        type:String,
        required:true,
    }

});

module.exports = mongoose.model("temples",temples);