const express = require('express');
const router = express.Router();
const multer = require("multer");
const { body } = require('express-validator');
const templePoojaController = require('../controller/templePoojaController');

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
body("catId").notEmpty(),
body("price").notEmpty(),
body("description").notEmpty(),
body("day").notEmpty(),
templePoojaController.add);

router.get("/view", templePoojaController.view);

router.post("/update",upload.single("image"),
body("name").notEmpty(),
body("image").notEmpty(),
body("oldImage").notEmpty(),
body("price").notEmpty(),
body("description").notEmpty(),
body("day").notEmpty(),
body("catId").notEmpty(),
body("id").notEmpty(),
templePoojaController.update);

router.get("/view-one/:id",templePoojaController.viewOne);

router.post("/delete/:id",templePoojaController.deletebyid);

router.post("/view-event-categoryId",body("id").notEmpty(), templePoojaController.viewEventBycategoryId);

// router.post("/view-one-pooja", body("id").notEmpty(), templePoojaController.viewOne)

module.exports=router;