const mongoose = require("mongoose");

const eventCategories = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    image : {
        type : String,
        required : true
    },
    type : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model("eventCategories",eventCategories);