const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new mongoose.Schema({
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
        ref : "eventCategories"
    },
    price : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    comments : [{
        message : String,
        date:{
            type : Date,
            default:Date.now()
        },
        userId : {
            type : Schema.Types.ObjectId,
            ref : "users"
        }
    }],
});

module.exports = mongoose.model("events",eventSchema);