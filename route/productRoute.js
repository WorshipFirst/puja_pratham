const express = require('express');
const router = express.Router();
const multer = require("multer");
const productController = require("../controller/productController");
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
body("catId").notEmpty(),
body("stock").notEmpty(),
body("price").notEmpty(),
body("description").notEmpty(),
body("keywords").notEmpty(),
body("discount").notEmpty(),
productController.add);

router.get("/view",productController.view);

router.delete("/delete/:id",productController.deletebyid);

router.post("/search", 
body("keywords").notEmpty(),
productController.search);

router.post("/edit", upload.single("image"),
body("name").notEmpty(),
body("image").notEmpty(),
body("stock").notEmpty(),
body("price").notEmpty(),
body("description").notEmpty(),
body("catId").notEmpty(),
body("keywords").notEmpty(),
body("oldImage").notEmpty(),
body("id").notEmpty(),
productController.edit);

router.post("/search-by-cat/:id",productController.searchbByCatId);

router.post("/search-by-cat-name",
body("name").notEmpty(),
productController.searchByCatName);

router.post("/filter-by-price-and-cat",
body("lowPrice").notEmpty(),
body("highPrice").notEmpty(),
body("catId").notEmpty(),
productController.filterByPriceAndCat);

router.post("/filter-by-price",
body("lowPrice").notEmpty(),
body("highPrice").notEmpty(),
productController.filteByPrice);

router.post("/view-categoryid",
body("catId").notEmpty(),
productController.viewCategoryId);

router.post("/view-productid",
body("_id").notEmpty(),
productController.viewProductId);

router.post("/add-rating-and-comment",productController.addRatting);

router.post("/search-all",productController.searchAll);

module.exports = router;