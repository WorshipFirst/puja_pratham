const Razorpay = require("razorpay");
const BookTemplePooja = require("../model/BookTemplePooja");
var instance = new Razorpay({ key_id: 'rzp_test_NPr7p2g2REFz6n', key_secret: '5IUWlT8W8DcE7AKSVYCDvV7O' })
var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);

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
        BookTemplePooja.create({
          userId : request.body.userId,
          templePooja : request.body.templePooja,
          mobile : request.body.mobile,
          amount:request.body.amount,
          transaction : paymentDetails.acquirer_data,
          order_id : paymentDetails.order_id,
          payment_method : paymentDetails.method,
          beneficiary_name : request.body.beneficiary_name
        }).then(result=>{
          if(request.body.comeStatus == 1){
            let otp = Math.floor(Math.random() * 10000);
            if (otp < 1000)
                otp = "0" + otp;        
            client.messages.create({
                body: "Dear user you can Come in the Temple's garbh grah only after showing this code : " + otp ,
                from: '+17179224972',
                to: '+91'+request.body.mobile
            })
          }
          return response.status(200).json({message:"Pay success",order:result});
        }).catch(err=>{
            console.log(err);
          return response.status(500).json({error:"Internal Server Error!"});
        })
    })
    .catch(err=>{
        console.log(err);
    })
  }