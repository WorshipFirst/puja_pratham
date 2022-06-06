const productCategoryModel = require('../model/categoryModel')
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const requests = require("request");
const { response } = require("express");
const {validationResult} = require ("express-validator");
const productModel = require("../model/productModel");

const storage = new Storage({
    projectId: "worship-first",
    keyFilename: "puja-pratham-firebase-adminsdk-wvbyq-6349c2ef49.json"
});

const bucketName = "gs://puja-pratham.appspot.com";


const uploadFile = async (filename) => {
    storage.bucket(bucketName).upload(filename, {
        gzip: true,
        metadata: {
            metadata: {
                firebaseStorageDownloadTokens: "hello",
            },
        },
    });
};

exports.add = (request, response) => {
    const errors = validationResult(request);
    if(!errors.isEmpty)
    return response.status(401).json({errors: errors.array()});
    productCategoryModel
    .create({
      name: request.body.name,
      image:
        "https://firebasestorage.googleapis.com/v0/b/puja-pratham.appspot.com/o/" +
        request.file.filename +
        "?alt=media&token=hello",
      type: request.body.type,
    })
    .then((result) => {
      uploadFile(
        path.join(__dirname, "../", "public/images/") + request.file.filename
      );
      return response.status(201).json(result);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
}

exports.view = (request, response) => {
    productCategoryModel
    .find()
    .then((result) => {
      return response.status(200).json(result);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
}

exports.edit =  (request, response) => {
  const errors = validationResult(request);
    if(!errors.isEmpty)
    return response.status(401).json({errors: errors.array()});
    let image;
    if (request.file) {
      image =
        "https://firebasestorage.googleapis.com/v0/b/puja-pratham.appspot.com/o/" +
        request.file.filename +
        "?alt=media&token=hello";
  
      uploadFile(
        path.join(__dirname, "../", "public/images/") + request.file.filename
      );
      requests({
        url: request.body.oldImage,
        qs: {
          key : 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDJLLhQjQEuqfeu\n3ow3tZTDlyZFOMRP0QabEnJrcrtQ7rk5V1gdsFdgFrdJgcM+MZ9NRo9+VJRCOcug\nJD6qzJvDAnc0T7OrLZxeNaXAhL8mew0unWuDFjNoue0RaE43K2hiCLITD/l9+fU1\n980aKg8tudTKEUpZONBEVG+X+gZVgyN3K1p6f9TRgbjX1UpXeo5pTzb60X23C+40\nujNn15uWROYXfRQIAdGk7Ka0JHS5PN8Itkm8t8ICxDzl3rujom9iFKGK/+yfDZJb\n79rpvL1y87MV1LleVX9IqpC/iv4Ld21+o4nnIQ/aW7uFZRTJ7YT/YvCfX+TE6fcm\n7+56PrB5AgMBAAECggEABfeEGKuIqJwqTa7/JLCHkuI6+dxMV6ZhAPIj9P49rRGv\nlRJQpEIfN/6PKCh8+dgZ8VOm8j3K+fM3OsQ9xu4eWUM2SusUQ/8B1M+C349wZfv0\nsPhtVcGE+9W2ljNsTSRF9SZsiwvdwA1NEcaMTaWIDA380D4sC4fCXEx5f4ikbckn\nlSQP71pu5XwXDNDMYANjjBuLHL0kwBX1I75Cc+n6HYNZa3QBj+pGE1a0Sii/6c/k\nNehts1BnmCpY030g8BC3+pUIvavazAuLWdpZ1rkvDnb2gNPYpW3uDTsmYy0UcESz\nJw7Z9EL+xrzHXLWT5jlrr3Wvf/7BbOfHAMs2JdT8gQKBgQD9v61YUsH3a+ad+a9A\np2clUsHuqIDVwLKXMfZ9aKO/SD7obp+qZWyxptYKdJJZ06hKgp6VBAmDlIkcX3uG\n3r77HkUoz48CLJLZR6qrkqxrCZO1ihhZDa8vEsAdCVGDTMRAlYkO2BRrN4ukbIU8\n+Y8NcJ9Ut/BTQNwT+leWJwkM4QKBgQDK9aKF18vKwBtD1qPI6rwWHlUErdsSm6AN\n5ESCG1RXpEplKCOr+kV+E4pQA0qgim1D4obSwrhD18uJHX7fW+d3FCfi9sI4zI9k\nMOj4f/QDhs6ZdepoiCaL2U4h1xZuvIfVx6xmrK1gTDa8cj1g6o6Mg3R8Rck+XvRT\n9vGOeCe+mQKBgQDrkA20eN9oedrVvP1c4At5MqKmk/dGeGVSxyc0tPeOk9sSm9/N\np+qH4YHCowVaLouE4E2nuN+8LyA6HsnmItLY/PjnMgho1EhfPZDLRpaZp4JgfZqs\n0W9YG+gNDKGHarSl4Cwkg6QxBJe2RKhMOsD6kRrY4wlPwF6OjVDSK9rTAQKBgCEi\n8aIAlZlIvCrbRGptSMAju6XD7Nyg5ATgm/7SD3cvr6XMY+aUOfxXnGFr6CdF8oj+\n1xxaBlOtS+HbGvfEvYnHlKuNtjAn1dF52s+XtHNO8zRC+D6Q3BpBJGyJ/XOe/F5+\n9zrcPoJWbyldTYAhS5zNaZtQmYbBYgrDarTkETkhAoGBAKPvuF1U0SOmXd80M7gw\n5SYSPewvd0ViN4jnvK3i83F/dEfEjgXuMxblgR9i/Yp0gcrKTvWOtTvne0+1EDP1\nzvtMuLY6I1SjgHqKAuv0SlLOK1GMe6B5SA8+g4Ab29l1xtJ4X7szxjJG10eT3Ml4\nQwccvHOlUED8UCm3/9MCMSBO'
        },
        method: "DELETE",
      });
    } else {
      image = request.body.oldImage;
    }
    productCategoryModel
      .updateOne(
        { _id: request.body.id },{
          $set:{
          name: request.body.name,
          image: image,
          type: request.body.type,
        }
      }).then((result) => {
        return response.status(200).json(result);
      }).catch((err) => {
        return response.status(500).json(err);
      });
}

exports.deletebyid = (request, response) =>{

    productCategoryModel
    .findByIdAndDelete({ _id: request.params.id })
    .then((result) => {
      requests({
        url: result.image,
        qs: {
          key : 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDJLLhQjQEuqfeu\n3ow3tZTDlyZFOMRP0QabEnJrcrtQ7rk5V1gdsFdgFrdJgcM+MZ9NRo9+VJRCOcug\nJD6qzJvDAnc0T7OrLZxeNaXAhL8mew0unWuDFjNoue0RaE43K2hiCLITD/l9+fU1\n980aKg8tudTKEUpZONBEVG+X+gZVgyN3K1p6f9TRgbjX1UpXeo5pTzb60X23C+40\nujNn15uWROYXfRQIAdGk7Ka0JHS5PN8Itkm8t8ICxDzl3rujom9iFKGK/+yfDZJb\n79rpvL1y87MV1LleVX9IqpC/iv4Ld21+o4nnIQ/aW7uFZRTJ7YT/YvCfX+TE6fcm\n7+56PrB5AgMBAAECggEABfeEGKuIqJwqTa7/JLCHkuI6+dxMV6ZhAPIj9P49rRGv\nlRJQpEIfN/6PKCh8+dgZ8VOm8j3K+fM3OsQ9xu4eWUM2SusUQ/8B1M+C349wZfv0\nsPhtVcGE+9W2ljNsTSRF9SZsiwvdwA1NEcaMTaWIDA380D4sC4fCXEx5f4ikbckn\nlSQP71pu5XwXDNDMYANjjBuLHL0kwBX1I75Cc+n6HYNZa3QBj+pGE1a0Sii/6c/k\nNehts1BnmCpY030g8BC3+pUIvavazAuLWdpZ1rkvDnb2gNPYpW3uDTsmYy0UcESz\nJw7Z9EL+xrzHXLWT5jlrr3Wvf/7BbOfHAMs2JdT8gQKBgQD9v61YUsH3a+ad+a9A\np2clUsHuqIDVwLKXMfZ9aKO/SD7obp+qZWyxptYKdJJZ06hKgp6VBAmDlIkcX3uG\n3r77HkUoz48CLJLZR6qrkqxrCZO1ihhZDa8vEsAdCVGDTMRAlYkO2BRrN4ukbIU8\n+Y8NcJ9Ut/BTQNwT+leWJwkM4QKBgQDK9aKF18vKwBtD1qPI6rwWHlUErdsSm6AN\n5ESCG1RXpEplKCOr+kV+E4pQA0qgim1D4obSwrhD18uJHX7fW+d3FCfi9sI4zI9k\nMOj4f/QDhs6ZdepoiCaL2U4h1xZuvIfVx6xmrK1gTDa8cj1g6o6Mg3R8Rck+XvRT\n9vGOeCe+mQKBgQDrkA20eN9oedrVvP1c4At5MqKmk/dGeGVSxyc0tPeOk9sSm9/N\np+qH4YHCowVaLouE4E2nuN+8LyA6HsnmItLY/PjnMgho1EhfPZDLRpaZp4JgfZqs\n0W9YG+gNDKGHarSl4Cwkg6QxBJe2RKhMOsD6kRrY4wlPwF6OjVDSK9rTAQKBgCEi\n8aIAlZlIvCrbRGptSMAju6XD7Nyg5ATgm/7SD3cvr6XMY+aUOfxXnGFr6CdF8oj+\n1xxaBlOtS+HbGvfEvYnHlKuNtjAn1dF52s+XtHNO8zRC+D6Q3BpBJGyJ/XOe/F5+\n9zrcPoJWbyldTYAhS5zNaZtQmYbBYgrDarTkETkhAoGBAKPvuF1U0SOmXd80M7gw\n5SYSPewvd0ViN4jnvK3i83F/dEfEjgXuMxblgR9i/Yp0gcrKTvWOtTvne0+1EDP1\nzvtMuLY6I1SjgHqKAuv0SlLOK1GMe6B5SA8+g4Ab29l1xtJ4X7szxjJG10eT3Ml4\nQwccvHOlUED8UCm3/9MCMSBO'
        },
        method: "DELETE",
      });
      productModel.deleteMany({catId : request.params.id}).then(result=>{
        return response.status(200).json({status:"Deleted",delete:true});
      }).catch(err=>{
        console.log(err);
        return response.status(500).json(err);
      })
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
}

 
exports.viewProductCategory = (request,response) =>{
    productCategoryModel
    .find({ type: request.params.type })
    .then((result) => {
      return response.status(200).json(result);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });   
}

exports.viewProductCategoryId = (request, response) =>{
  const errors = validationResult(request);
    if(!errors.isEmpty)
    return response.status(401).json({errors: errors.array()});
    productCategoryModel
    .findOne({ _id: request.body.id })
    .then((result) => {
      return response.status(200).json(result);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
} 
