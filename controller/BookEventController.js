const { response } = require('express');
const bookeventModel=require('../model/BookEventModel');

exports.bookNow=(request,response)=>{
    bookeventModel.create({
       userId:request.body.userId,
        event:request.body.event,
        payment_type:request.body.payment_type,
        transaction:request.body.transaction,
        order_id:request.body.order_id,
        payment_method:request.body.payment_method,
        order_status:request.body.order_status,
        isCancelled:request.body.isCancelled,
        mobile_no:request.body.mobile_no,
        address:request.body.address,
        booking_date:request.body.booking_date,
        today_date:request.body.today_date,
        start_time:request.body.start_time,
        end_time:request.body.end_time,
        amount:request.body.amount

    }).then(result=>{
         return response.status(200).json(result);
    }).catch(err=>{
        console.log(err);
        return response.status(500).json({message:'Opps ! Something went wrong'});
    })
}