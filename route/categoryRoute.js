const express = require('express');
const router = express.Router();
const multer = require("multer");
const categoryController = require("../controller/categoryController");
const { body } = require('express-validator');

var storages = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storages });

router.post("/add", upload.single("image"),
body("name").notEmpty(),
body("image").notEmpty(),
body("type").notEmpty(),
categoryController.add);

router.get("/view",categoryController.view)

router.post("/edit",upload.single("image"),
body("name").notEmpty(),
body("image").notEmpty(),
body("type").notEmpty(),
body("oldImage").notEmpty(),
categoryController.edit);

router.delete("/delete/:id",categoryController.deletebyid);

router.get("/view-product-category/:type",categoryController.viewProductCategory);

router.post("/view-product-categoryId",body("id").notEmpty(), categoryController.viewProductCategoryId);

module.exports = router;