const express = require('express');
const route = express.Router();
const multer = require("multer");
const { body } = require('express-validator');
const mediafileController = require('../controller/mediafileCategoryController');

var storages = multer.diskStorage({
    destination: "public/images",
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

var upload = multer({ storage: storages });


route.post('/add', upload.single("image"),
body("name").notEmpty(),
body("image").notEmpty(),
mediafileController.add);

route.get('/view',mediafileController.view);

route.delete('/delete/:id',mediafileController.delete);

route.post('/update',upload.single("image"),
// body("name").notEmpty(),
// body("image").notEmpty(),
// body("oldImage").notEmpty(),
// body("id").notEmpty(),
mediafileController.update);

module.exports=route;