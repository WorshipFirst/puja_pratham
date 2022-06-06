const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
require('dotenv').config();
// var accountSid = process.env.accountSid ;
// var authToken = process.env.authToken ;
const app = express();
const cors = require("cors");
app.use(cors());


mongoose.connect(process.env.DB_URL ,{useNewUrlParser:true}).then(()=>{
    console.log("Database connected sucessfully");
}).catch(err=>{
    console.log(err);
});



const userRoute = require("./route/userRoute");
const productCategoryRoute = require("./route/categoryRoute")
const productRoute = require("./route/productRoute")
const mediafileCategoryRoute = require("./route/mediafileCategoryRoute");
const  mediafileRoute = require("./route/mediafileRoute");
const eventCategoryRoute = require("./route/eventCategoryRoute");
const eventRoute = require("./route/eventRoute");
const templeroute = require("./route/templeRoute");
const templePoojaroute = require("./route/templePoojaroute");
const bookEventRoute=require('./route/BookEventRoute');
const bookTemplePooja = require("./route/bookTemplePoojaRoute");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("./public"));

const cartRoute = require("./route/cartRoute");
const orderRoute = require("./route/orderRoute");

app.use("/user",userRoute);
app.use("/cart",cartRoute);
app.use("/order",orderRoute);
app.use("/product-category", productCategoryRoute);
app.use("/product", productRoute);
app.use("/mediafile-category", mediafileCategoryRoute);
app.use("/mediafile", mediafileRoute);
app.use("/event-category",eventCategoryRoute);
app.use("/event",eventRoute)
app.use("/temple",templeroute)
app.use("/templePooja",templePoojaroute)
app.use("/book-event",bookEventRoute);
app.use("/book-event",bookEventRoute);
app.use("/book-temple-pooja",bookTemplePooja);

app.post("/message",(req,res)=>{
console.log('this is the req');

client.messages.create({
   body: 'Pratham puja',
   from: '+17179224972',
   to: '+9197549 93047'
 }).then(message => console.log(message.sid)).catch(err=>{
     console.log(err);
 });
})

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("Server is running or port : " + port);
});
