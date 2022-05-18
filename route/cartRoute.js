const express = require('express');
const route = express.Router();
const cartController = require('../controller/cartController');

route.post("/add-to-cart",cartController.addToCart);

route.get("/view-cart",cartController.viewCart);

route.get("/view-one/:userId",cartController.viewOne);

route.delete("/delete-product/:userId/:productId",cartController.deleteProduct);

route.delete("/delete-cart/:id",cartController.deleteCart);

module.exports =route;