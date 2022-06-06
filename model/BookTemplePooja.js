const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookTemplePoojaSchema = new mongoose.Schema({
    beneficiary_name : {
        type : String,
        required : true
    },
    templePooja : {
        type : Schema.Types.ObjectId,
        required:true
    },
    amount : {
        type : Number,
        required : true
    },
    transaction : {
        type : Object,
        required : true
    },
    order_id : {
        type : String,
        required : true
    },
    payment_method : {
        type : String,
        required : true
    },
    mobile : {
        required : true,
        type : String
    }
});

module.exports = mongoose.model("bookTemplePooja",bookTemplePoojaSchema);