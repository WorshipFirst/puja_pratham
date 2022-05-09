const orderModel = require("../model/orderModel");

exports.placeOrder =(request,response)=>{
   console.log(request.body);
   orderModel.create({
   userId : request.body.id,
   productList : request.body.productList,
   mobile : request.body.mobile,
   address :request.body.address,
   amount : request.body.amount
 })
 .then(result=>{
   console.log(result);
   return response.status(201),json({message: "Order Placed Successfully"},result);
 })
 .catch(err=>{
   console.log(err);
   return response.status(500).json({message : "Something went wrong. Cannot place order"});
 });
};

exports.viewOrder =(request,response)=>{
  orderModel.find().populate("productList.product")
  .then(results=>{
      console.log(result);
      return response.status(200).json(result);
  })
  .catch(err=>{
      console.log(err);
      return response.status(500).json(err);
  });
};

exports.viewOne = (request,response)=>{
    orderModel.findOne({userId : request.params.userId}).populate("productList.product")
    .then(result=>{
        return response.status(200).json(result);
    })
    .catch(err=>{
        return response.status(500).json(err);
    });
};

