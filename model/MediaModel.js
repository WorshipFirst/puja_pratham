const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const media = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    image : {
        type : String,
        required : true
    },
    catId : {
        type : Schema.Types.ObjectId,
        ref : "MediaCategories"
    },
    link : {
        type : String,
        required : true
    },
    lyrics : {
        type : String,
        required : true
    },
    type : {
        type : String,
        required : true
    },

});

module.exports = mongoose.model("MediaCategories",mediaCategories);