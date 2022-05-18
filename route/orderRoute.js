const express = require('express');
const route = express.Router();
const orderController = require("../controller/orderController");

route.post("/place-order-by-cash",orderController.placeOrder);

route.get("/create",orderController.create);

route.post("/order-status",orderController.orderStatus);

route.get("/view-order",orderController.viewOrder);

route.get("/view-one/:userId",orderController.viewOne);

module.exports = route;