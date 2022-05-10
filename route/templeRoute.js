const express = require('express');
const router = express.Router();
const multer = require("multer");
const templeController = require("../controller/templeController");
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
body("address").notEmpty(),
templeController.add);

router.get("/view",templeController.view)

router.post("/update",upload.single("image"),
body("name").notEmpty(),
body("image").notEmpty(),
body("oldImage").notEmpty(),
body("address").notEmpty(),
body("id").notEmpty(),
templeController.update);

router.delete("/delete/:id", templeController.deletebyid);

// router.post("/view-temple-categoryId",body("id").notEmpty(), templeController.viewTempleCategoryById);

module.exports = router;