const express = require("express");
const route = express.Router();
const bookTempleController = require("../controller/bookTemplePoojaController");

route.get("/create",bookTempleController.create);

route.post("/place",bookTempleController.orderStatus);

module.exports = route;