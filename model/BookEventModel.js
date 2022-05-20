const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const bookEventSchema=new mongoose.Schema({
    userId:{
        type :Schema.Types.ObjectId,
        ref:'users'
    },
    event:{
       type:String,
        ref:'events'
       
    },
    payment_type:{
        type:String,
        default:'cash on delievery'
    },
    transaction:{
        type:Object
    },
    order_id:{
        type:String
    },
    payment_method:{
        type:String
    },
    order_status:{
        type:String,
        default:'pending'
    },
    isCancelled:{
        type:Boolean,
        default:false
    },
    mobile_no:{
        type:Number,
        required:true

    },
    address:{
        type:String,
        required:true
    },
    booking_date:{
       type:Date,
       
    },
    today_date:{
       type:Date,
       default:Date.now()
    },
    start_time:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    }
});

module.exports=mongoose.model('bookEvent',bookEventSchema);