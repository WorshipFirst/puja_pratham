const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const multer = require("multer");
const auth = require("../middleware/auth");
const categoryModel = require("../model/categoryModel");
const { body } = require('express-validator');
const csv = require("csvtojson");

var storages = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storages });

router.post("/add", upload.single("image"),
  body("email").notEmpty(),
  body("mobile").notEmpty().isLength(10),
  body("address").notEmpty(),
  body("name").notEmpty(),
  userController.add);

router.post("/register-by-otp",
  body("otp").notEmpty(),
  body("id").notEmpty(),
  userController.registerByOtp);

router.post("/login",
  body("email").notEmpty(),
  body("password").notEmpty(),
  userController.login);

router.get("/view", auth.verifyToken, userController.view);

router.post("/login-by-social-media",
 body("email").notEmpty(),
 body("name").notEmpty(),
 body("image").notEmpty(),
 userController.loginBySocialMedia);

router.delete("/delete-account/:email",userController.delete);

router.get("/forget-password/:email",userController.forgetPassword);

router.post("/update-profile",upload.single("image"),
body("name").notEmpty(),
body("address").notEmpty()
,auth.verifyToken,userController.update);

router.post("/add-cat-by-csv", upload.single("file"), (request, response) => {
  csv().fromFile(request.file.path).then(jsonObj => {
    categoryModel.insertMany(jsonObj).then(res => {
      return response.status(200).json(res);
    }).catch(err => {
      console.log(err);
      return response.status(500).json({ error: "Internal Server Error!" });
    })
  })
});



module.exports = router;