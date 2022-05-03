const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    image : {
        type : String,
        required : true
    },
    cat_id : {
        type : Schema.Types.ObjectId,
        ref : "categories"
    },
    stock : {
        type : Number,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    keywords : {
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
    }]
});

module.exports = mongoose.model("products",productSchema);