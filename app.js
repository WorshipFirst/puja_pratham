const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
require('dotenv').config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL,{useNewUrlParser:true}).then(()=>{
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


const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Server is running or port : " + port);
});