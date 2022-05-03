const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const multer = require("multer");
const auth = require("../middleware/auth");
var storages = multer.diskStorage({
    destination: "public/images",
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
var upload = multer({ storage: storages });

router.post("/add",upload.single("image"),userController.add);
router.post("/register-by-otp",userController.registerByOtp);
router.post("/login",userController.login);
router.get("/view",auth.verifyToken,userController.view);
module.exports = router;