const express = require("express");
const route = express.Router();
const multer = require("multer");
const mediafileController = require("../controller/mediafileController");
const { body } = require('express-validator');


var storages = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storages });

route.get("/view-one/:id",mediafileController.viewOne);

route.post("/add", upload.single("image"),
body("name").notEmpty(),
body("image").notEmpty(),
body("link").notEmpty(),
body("lyrics").notEmpty(),
body("type").notEmpty(),
body("catId").notEmpty(),
mediafileController.add);

route.get("/view", mediafileController.view);

route.get("/view-by-cat/:id",mediafileController.viewByCat);

route.delete("/delete/:id", mediafileController.delete);

route.post("/update", upload.single("image"),
body("name").notEmpty(),
body("image").notEmpty(),
body("link").notEmpty(),
body("lyrics").notEmpty(),
body("type").notEmpty(),
body("catId").notEmpty(),
body("oldImage").notEmpty(),
body("id").notEmpty(),
mediafileController.update);

route.get("/view-by-type/:type",mediafileController.viewByType);

route.post("/update-catId",mediafileController.updateCatId);

module.exports = route;