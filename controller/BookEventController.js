const { response } = require('express');
const bookeventModel=require('../model/BookEventModel');
const Razorpay = require("razorpay");
const BookEventModel = require('../model/BookEventModel');
var instance = new Razorpay({ key_id: 'rzp_test_NPr7p2g2REFz6n', key_secret: '5IUWlT8W8DcE7AKSVYCDvV7O' })

exports.bookNowOnCash=(request,response)=>{
    bookeventModel.create({
       userId:request.body.userId,
        event:request.body.event,
        mobile_no:request.body.mobile_no,
        address:request.body.address,
        booking_date:request.body.booking_date,
        start_time:request.body.start_time,
        amount:request.body.amount

    }).then(result=>{
         return response.status(200).json(result);
    }).catch(err=>{
        console.log(err);
        return response.status(500).json({message:'Opps ! Something went wrong'});
    })
}

exports.createOrder = (request,response)=>{
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
        BookEventModel.create({
          userId : request.body.userId,
          event : request.body.event,
          mobile_no : request.body.mobile_no,
          address : request.body.address,
          amount:request.body.amount,
          payment_type : "Online Payment",
          transaction : paymentDetails.acquirer_data,
          order_id : paymentDetails.order_id,
          payment_method : paymentDetails.method,
          booking_date : request.body.booking_date,
          start_time : request.body.start_time 
        }).then(result=>{
          return response.status(200).json({message:"Pay success",order:result});
        }).catch(err=>{
          return response.status(500).json({error:"Internal Server Error!"});
        })
    })
    .catch(err=>{
        console.log(err);
    })
  }