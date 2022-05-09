const express = require('express');
const router = express.Router();
const multer = require("multer");
const eventController = require("../controller/eventController");
const { body } = require('express-validator');

var storages = multer.diskStorage({
    destination: "public/images",
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
var upload = multer({ storage: storages });


router.post("/add" , upload.single("image") ,
body("name").notEmpty(),
body("image").notEmpty(),
body("catId").notEmpty(),
body("price").notEmpty(),
body("description").notEmpty(),
body("byWhom").notEmpty(),
eventController.add);

router.get("/view",eventController.view);

router.post("/update",upload.single("image"),
body("name").notEmpty(),
body("image").notEmpty(),
body("oldImage").notEmpty(),
eventController.update);

router.delete("/delete/:id", eventController.deletebyid);

router.post("/view-event-categoryId",body("id").notEmpty(), eventController.viewEventBycategoryId);

module.exports = router;