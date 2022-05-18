const cartModel = require('../model/cartModel');

exports.addToCart = async (request,response)=>{
    console.log(request.body);
 let user = request.body.userId;
 let product = request.body.productId;
 let cart = await cartModel.findOne({userId : user});

 if(!cart){
   cart = new cartModel({ userId : user});
 }
 cart.productList.push(product);

 cart.save()
 .then((results)=>{
   return response.status(201).json(results);
 })
 .catch((err)=>{
   return response.status(500).json({ message : "Opps! Something went wrong"});
 });
};

exports.viewCart =(request,response)=>{
    cartModel.find().populate("productList")
    .then((results)=>{
      return response.status(201).json(results);
    })
    .catch((err)=>{
      console.log(err);
      return response.status(500).json({message :"Opps! Something went wrong"});
    });
};

exports.viewOne =(request,response)=>{
    cartModel.findOne({ userId : request.params.userId})
    .populate("productList")
    .then((result)=>{
      return response.status(200).json(result);
    })
    .catch((err)=>{
      return response.status(500).json({message : "Opps! Something went wrong"});
    });
};

exports.deleteProduct= async (request,response)=>{
    let result=await cartModel.findOne({userId:request.params.userId});
    result.productList.pull(request.params.productId);
    result.save()
    .then(result=>{
        return response.status(200).json(result);
    })
    .catch(err=>{
      console.log(err);
        return response.status(500).json(err);
    });
}

exports.deleteCart =(request,response)=>{
    cartModel.deleteOne({userId : request.params.id})
    .then(result=>{
        console.log(result);
        if(result.deletedCount)
          return response.status(202).json({ message: "Deletion Successful" });
        else 
          return response.status(204).json({ message: "Deletion Unsuccessful" });
    })
    .catch(err=>{
        console.log(err);
          return response.status(500).json({ message: "Oops! something went wrong" });
    })
}
