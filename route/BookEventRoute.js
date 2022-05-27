const express = require('express');
const bookeventController = require('../controller/BookEventController');
const router = express.Router();

router.post('/book-now-on-cash', bookeventController.bookNowOnCash);

router.get("/create", bookeventController.createOrder);

router.post("/order-online", bookeventController.orderStatus);

module.exports = router;