const mongoose = require('mongoose');
const products =require("./productModel");
const schema = mongoose.Schema;
const cartSchema = new mongoose.Schema({
    userId: schema.Types.ObjectId,
    productList: [
      {
        type: schema.Types.ObjectId,
        ref: "products"
      }
    ]
});
module.exports =mongoose.model("carts",cartSchema);