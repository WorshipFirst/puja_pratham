const express=require('express');
const bookeventController=require('../controller/BookEventController');
const router=express.Router();

   router.post('/book-now',bookeventController.bookNow);
 
module.exports=router;