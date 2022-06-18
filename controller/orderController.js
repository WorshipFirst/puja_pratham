const orderModel = require("../model/orderModel");
const Razorpay = require("razorpay");
var instance = new Razorpay({ key_id: 'rzp_test_NPr7p2g2REFz6n', key_secret: '5IUWlT8W8DcE7AKSVYCDvV7O' })

exports.placeOrder =(request,response)=>{
   orderModel.create({
   userId : request.body.userId,
   productList : request.body.productList,
   mobile : request.body.mobile,
   address :request.body.address,
   amount : request.body.amount,
 })
 .then(result=>{
   return response.status(201).json({message: "Order Placed Successfully",result});
 })
 .catch(err=>{
   console.log(err);
   return response.status(500).json({message : "Something went wrong. Cannot place order"});
 });
};

exports.viewOrder =(request,response)=>{
  orderModel.find().populate("productList.product").sort({date:-1})
  .then(results=>{
      return response.status(200).json(results);
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

exports.viewByOrderId = (request,response)=>{
  orderModel.findOne({_id : request.params.orderId}).populate("productList.product")
  .then(result=>{
      return response.status(200).json(result);
  })
  .catch(err=>{
      return response.status(500).json(err);
  });
};

exports.create = (request,response)=>{
  instance.orders.create({
      amount: 100,
      currency: "INR"
    },(err,order)=>{
        if(err){
            console.log(err);
        }else{
          console.log(order);
          return response.status(200).json(order);
        }
    });
}

exports.orderStatus = (request,response)=>{
  instance.payments.fetch(request.body.response.razorpay_payment_id)
  .then(paymentDetails=>{
      orderModel.create({
        userId : request.body.userId,
        productList : request.body.productList,
        mobile : request.body.mobile,
        address : request.body.address,
        amount:request.body.amount,
        payment_type : "Online Payment",
        transaction : paymentDetails.acquirer_data,
        orderId : paymentDetails.order_id,
        paymentMethod : paymentDetails.method
      }).then(result=>{
        return response.status(200).json({message:"Pay success"});
      }).catch(err=>{
        return response.status(500).json({error:"Internal Server Error!"});
      })
  })
  .catch(err=>{
      console.log(err);
  })
}

exports.viewOrders = (request,response)=>{
  orderModel.find({userId:request.params.userId}).sort({date : -1}).populate("productList.product").then(result=>{
    return response.status(200).json(result);
  }).catch(err=>{
    return response.status(500).json({message:"Something went wrong!"});
  })
}