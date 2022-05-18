const mongoose = require('mongoose');
const schema = mongoose.Schema;
const orderSchema = new mongoose.Schema({
    userId: schema.Types.ObjectId,
    productList: [
        {
            product: {
                type: schema.Types.ObjectId,
                ref: "products",
            },
            totalPrice: {
                type: Number,
                required: true
            },
            qty: {
                type: Number,
                required: true
            },
        }
    ],

    date: {
        type: Date,
        default: Date.now
    },
    mobile: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment_type: {
        type: String,
        default: "Cash On Delivery"
    },
    transaction : Object,
    orderId : String,
    paymentMethod : String,
    orderStaus : {
        type : String,
        default : "pending"
    },
    isCancelled : {
        type : Boolean,
        default : false
    }
});

module.exports = mongoose.model("orders", orderSchema);
