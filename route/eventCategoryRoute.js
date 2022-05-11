const express = require('express');
const router = express.Router();
const multer = require("multer");
const eventCategoryController = require("../controller/eventCategoryController");
const { body } = require('express-validator');

var storages = multer.diskStorage({
    destination: "public/images",
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
var upload = multer({ storage: storages });

router.post("/add" , upload.single("image"),
body("name").notEmpty(),
body("image").notEmpty(),
body("type").notEmpty(),
eventCategoryController.add);

router.get("/view",eventCategoryController.view)

router.post("/update",upload.single("image"),
body("name").notEmpty(),
body("image").notEmpty(),
body("oldImage").notEmpty(),
body("type").notEmpty(),
eventCategoryController.update);

router.delete("/delete/:id", eventCategoryController.deletebyid);

router.post("/view-product-categoryId",body("id").notEmpty(), eventCategoryController.viewEventCategoryById);

module.exports = router;
 