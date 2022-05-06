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
            type : date,
            default:Date.now()
        },
        userId : {
            type : Schema.Types.ObjectId,
            ref : "users"
        }
    }],
    byWhom :{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("events",eventSchema);