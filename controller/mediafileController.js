const mediafile = require("../model/MediaModel");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const requests = require("request");
const response = require("express");
const {validationResult} = require ("express-validator");

const storage = new Storage({
  projectId: "worship-first",
  keyFilename: "puja-pratham-firebase-adminsdk-wvbyq-6349c2ef49.json",
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

exports.viewOne = (request,response)=>{
  mediafile.findOne({_id:request.params.id}).populate("catId")
  .then(result=>{
    return response.status(200).json(result);
  }).catch(err=>{
    return response.status(500).json({error:"Internal Server Error!"});
  })
}

exports.add = (request, response) => {
  const errors = validationResult(request);
  if(!errors.isEmpty)
  return response.status(401).json({errors: errors.array()});
  mediafile
    .create({
      name: request.body.name,
      image:
        "https://firebasestorage.googleapis.com/v0/b/puja-pratham.appspot.com/o/" +
        request.file.filename +
        "?alt=media&token=hello",
      type: request.body.type,
      link: request.body.link,
      catId: request.body.catId,
      lyrics: request.body.lyrics,
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
};

exports.view = (request, response) => {
  mediafile
    .find()
    .then((result) => {
      return response.status(200).json(result);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
};

exports.delete = (request, response) => {
  mediafile
    .deleteOne({ _id: request.params.id })
    .then((result) => {
      requests({
        url: result.image,
        qs: {
            key: "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDp6LFHpaC1iuKW\n56oz9NaSSwzv2a3JPM61nmFkSBxDzOkULaAgh9+In4U+fxxGvrOXrx6BX6yLt/MA\n0dCR0F2XThikJ52gjU7KvyzYs4S2ASbp7kqoPoDVfxtFNx47IQeG9sbqXr7cKqqM\nGE5T5mpFLHQwpfTVzqJb3h7wZVDF5hSrLYjq3oa3G9CO2kjnP+EgJOvzTtENvNf9\nq5h3OA6MYEdTMDgpsa3Nv8qPB8GJxCUvZyXB3cfo17WP7e2PyHF5X87nejArfOfO\n8qL4zoY0INnEXwjjIGNvQ1rEaPv/ItDZ9k9rHQm0mmm+tWypEkkC6Mbre0xH+PSn\nDzHpCBXdAgMBAAECggEAWcd9B/18DkJFD1vS+cc/dn5E9GiuKf/jbVVhl06QPrvP\nOHX8sI/GThfAWkkKjuLSZuWJxWl1/li39jgSIG2EBresgJFOEJo8RFiVe4WH6h3O\nFFron+QBqjBzxKDPwy09yOE+XyXHhxT/Se9oXQ6i+nMCE8wXCduaeL1sTaPtmU8n\nAfhEcdQKq5faCbWxdiJuXsJCOQkJNQZOFNoeulVyV42zighCQG3K9+1mOiDxxvhV\nMF8pc6js3OWN1v6nXHYKDS4+dbHkOcD7iVcftZnVZ8sGF0dsL3jK4wFpw/otVMtg\ni+jVWZfGjmbefbQhZbY5EJ0ZSjpRkvOHtSA8DwIXlwKBgQD3ohnZp0MtSHfbajtI\nr40H6X3S5aFyCbmugDWXKqgh3C+MJumCjASBa++UOa6EkedLV39fHrJi9G/WbDJm\ns5bZu6IQ9wr508kS7SCfEkVEE2wZEVXnc4Xy3kCFanDQ+rMb4ZcE5TwzolnQjdQe\n/hNRj8jsG9XD5skijKXMbrHY3wKBgQDxz+JD9fdA8yVqBCyT8fIigIG1FfgMXJgA\nS/E0BbExFV7mDUN3E2EbCwtvs5JSj0/qsdBhbDwYQbt0LDCUisXWYQei8KEZ6+ok\n0erBWaOHyzlkYoT0sDPi7wjHd0UWqyKd8QvChuzb5AtASHLzttDBL+H0FnUy1pvz\napUa7ZicwwKBgFhdVdAfKY+NHogDXmhPjInYPff1zSh+Y+3q/jSVGi4K/kSK1iSp\nhioQtAs2khnoXpq5/E+bCpjZFNd1AH85coj7tZdMMHR5qHTCfTOGN4VVUOuZDghr\nZs8FlAyHsP5Bl4xJcbRjgJoEQvxyv9DXZVljb5UhUaR4RCm5+qf6kCgNAoGBAM+2\nOW8VTmFdOws5MK2Yy9w1NLW/fEXqF6tRkIyWQyGdcNn+FLCpVeVr9FPsFUmTzxsT\nyKKW3Xwcoo/lEYnXNp+y02N0fX4NtyAPrS6O+DjCKbeAJSMmZDuQBqOIYTFaqa6w\nCuD7E2TDG6MJWKzeoa0Am4AW9m9IB8ftCs2JwGkPAoGBAI+zUllJBKjCTxgXTjML\n2TeP5vce41nA3XhOfUiTGMnC0F/V2kMuf9hq5Hmd1pRjFHQyV77BmSPQ9GKHzJs4\nDGvCZ5lfMGPFab9RW9byJsS43w78zEPx6c8vu8+I3HuSB0aRDcci4bLBe6G70oE/\nFUcP0GzOe2MhuBJcWWGz3Pny",
        }, // you can find your private-key in your keyfile.json
        method: "DELETE",
      });
      return response.status(200).json(result);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
};

exports.update = (request, response) => {
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
        key: "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDp6LFHpaC1iuKW\n56oz9NaSSwzv2a3JPM61nmFkSBxDzOkULaAgh9+In4U+fxxGvrOXrx6BX6yLt/MA\n0dCR0F2XThikJ52gjU7KvyzYs4S2ASbp7kqoPoDVfxtFNx47IQeG9sbqXr7cKqqM\nGE5T5mpFLHQwpfTVzqJb3h7wZVDF5hSrLYjq3oa3G9CO2kjnP+EgJOvzTtENvNf9\nq5h3OA6MYEdTMDgpsa3Nv8qPB8GJxCUvZyXB3cfo17WP7e2PyHF5X87nejArfOfO\n8qL4zoY0INnEXwjjIGNvQ1rEaPv/ItDZ9k9rHQm0mmm+tWypEkkC6Mbre0xH+PSn\nDzHpCBXdAgMBAAECggEAWcd9B/18DkJFD1vS+cc/dn5E9GiuKf/jbVVhl06QPrvP\nOHX8sI/GThfAWkkKjuLSZuWJxWl1/li39jgSIG2EBresgJFOEJo8RFiVe4WH6h3O\nFFron+QBqjBzxKDPwy09yOE+XyXHhxT/Se9oXQ6i+nMCE8wXCduaeL1sTaPtmU8n\nAfhEcdQKq5faCbWxdiJuXsJCOQkJNQZOFNoeulVyV42zighCQG3K9+1mOiDxxvhV\nMF8pc6js3OWN1v6nXHYKDS4+dbHkOcD7iVcftZnVZ8sGF0dsL3jK4wFpw/otVMtg\ni+jVWZfGjmbefbQhZbY5EJ0ZSjpRkvOHtSA8DwIXlwKBgQD3ohnZp0MtSHfbajtI\nr40H6X3S5aFyCbmugDWXKqgh3C+MJumCjASBa++UOa6EkedLV39fHrJi9G/WbDJm\ns5bZu6IQ9wr508kS7SCfEkVEE2wZEVXnc4Xy3kCFanDQ+rMb4ZcE5TwzolnQjdQe\n/hNRj8jsG9XD5skijKXMbrHY3wKBgQDxz+JD9fdA8yVqBCyT8fIigIG1FfgMXJgA\nS/E0BbExFV7mDUN3E2EbCwtvs5JSj0/qsdBhbDwYQbt0LDCUisXWYQei8KEZ6+ok\n0erBWaOHyzlkYoT0sDPi7wjHd0UWqyKd8QvChuzb5AtASHLzttDBL+H0FnUy1pvz\napUa7ZicwwKBgFhdVdAfKY+NHogDXmhPjInYPff1zSh+Y+3q/jSVGi4K/kSK1iSp\nhioQtAs2khnoXpq5/E+bCpjZFNd1AH85coj7tZdMMHR5qHTCfTOGN4VVUOuZDghr\nZs8FlAyHsP5Bl4xJcbRjgJoEQvxyv9DXZVljb5UhUaR4RCm5+qf6kCgNAoGBAM+2\nOW8VTmFdOws5MK2Yy9w1NLW/fEXqF6tRkIyWQyGdcNn+FLCpVeVr9FPsFUmTzxsT\nyKKW3Xwcoo/lEYnXNp+y02N0fX4NtyAPrS6O+DjCKbeAJSMmZDuQBqOIYTFaqa6w\nCuD7E2TDG6MJWKzeoa0Am4AW9m9IB8ftCs2JwGkPAoGBAI+zUllJBKjCTxgXTjML\n2TeP5vce41nA3XhOfUiTGMnC0F/V2kMuf9hq5Hmd1pRjFHQyV77BmSPQ9GKHzJs4\nDGvCZ5lfMGPFab9RW9byJsS43w78zEPx6c8vu8+I3HuSB0aRDcci4bLBe6G70oE/\nFUcP0GzOe2MhuBJcWWGz3Pny",
    }, // you can find your private-key in your keyfile.json
      method: "DELETE",
    });
  } else {
    image = request.body.oldImage;
  }
  mediafile
    .updateOne(
      { _id: request.body.id },
      {$set:{
        type: request.body.type,
        link: request.body.link,
        catId: request.body.catId,
        name: request.body.name,
        lyrics: request.body.lyrics,
      }
    }
    )
    .then((result) => {
      if (result.modifiedCount > 0)
        return response.status(202).json({ message: "update" });
      else return response.status(200).json({ message: "not update" });
    })
    .catch((err) => {
      return response.status(500).json({ message: "failed" });
    });
};


exports.viewByType = (request,response) =>{
  mediafile.find({type:request.params.type})
  .then(result=>{
    return response.status(200).json(result);
  }).catch(err=>{
    return response.status(500).json({message:"Something went wrong"});
  })
}

exports.viewByCat = (request,response)=>{
  mediafile.find({catId:request.params.id})
  .then(result=>{
    return response.status(200).json(result);
  }).catch(err=>{
    return response.status(500).json({message:"Something went wrong"});
  })
}