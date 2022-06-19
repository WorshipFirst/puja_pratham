const userModel = require("../model/userModel");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fastsms = require("fast-two-sms");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const requests = require("request");
var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);


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

exports.loginBySocialMedia = async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(401).json({ errors: errors.array() });
    var user = await userModel.findOne({ email: request.body.email });
    if (!user) {
        userModel.create({
            email: request.body.email,
            name: request.body.name,
            image: request.body.image
        })
            .then(result => {
                let payload = { subject: result._id };
                let token = jwt.sign(payload, 'fdfdvcvrerejljjjjl');
                return response.status(200).json({ user: result, token: token });
            })
            .catch(err => {
                return response.status(500).json({ error: "Internal Server Error!" });
            })
    }
    else {
        if (user.image == " ") {
            let payload = { subject: user._id };
            let token = jwt.sign(payload, 'fdfdvcvrerejljjjjl');
            user = await userModel.findOneAndUpdate({ email: request.body.email }, {
                $set: {
                    image: request.body.image
                }
            }, { new: true });
            return response.status(200).json({ user: user, token: token });
        }
        else {
            let payload = { subject: user._id };
            let token = jwt.sign(payload, 'fdfdvcvrerejljjjjl');
            return response.status(200).json({ user: user, token: token });
        }
    }
}

exports.update = (request, response) => {
    // console.log(request.body);
    let image;
    if (request.file) {
        console.log(request.file);
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
    }
    else {
        image = request.body.oldImage;
    }
    userModel.updateOne(
        { email: request.body.email },
        {
            $set: {
                name: request.body.name,
                image: request.body.image,
                address: request.body.address
            }
        }).then(result => {
            console.log("Then " + JSON.stringify(result));
            return response.status(200).json({ user: result });
        }).catch(err => {
            console.log("Error " + err);
            return response.status(500).json({ error: "Internal Server Error" });
        });
}

exports.forgetPassword = async (request, response) => {
    console.log(request.params.email);
    userModel.findOne({ email: request.params.email })
        .then(data => {

            if (data) {
                let password = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@!#$%^&*';
                var charactersLength = characters.length;
                for (var i = 0; i < 6; i++) {
                    password += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                // const salt = await bcrypt.genSalt(10);
                // var password = await bcrypt.hash(pass, salt);
                userModel.updateOne({ email: request.params.email }, {
                    $set: {
                        password: password
                    }
                }).then(result => {
                    if (result.modifiedCount == 1) {
                        let fromMail = "worship.first01@gmail.com";
                        let toMail = data.email;
                        let subject = "New Password For Puja Pratham";
                        let message = "Yor Password for puja pratham site is " + password;

                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: fromMail,
                                pass: 'sbiqoanngferaqvn'
                            }
                        });

                        // email options
                        let mailOptions = {
                            from: fromMail,
                            to: toMail,
                            subject: subject,
                            text: message
                        };

                        transporter.sendMail(mailOptions, (error, res) => {
                            if (error) {
                                console.log(error);
                                res.send("Something went wrong");
                            }
                            else {
                                return response.status(200).json({ message: "New Password Has Been Sent Sucessfully To The Above Email ID" });
                            }
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    return response.status(500).json({ err: "Internal Server Error!" });
                })
            }
            else {
                return response.status(404).json({ message: "You are not valid user" });
            }
        }).catch(err => {
            return response.status(404).json({ err: "Internal Server Error" });
        })
}

exports.add = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(401).json({ errors: errors.array() });
    let image;
    if (!request.file)
        image = " ";
    else
        image = "https://firebasestorage.googleapis.com/v0/b/puja-pratham.appspot.com/o/" + request.file.filename + "?alt=media&token=hello";

    let otp = Math.floor(Math.random() * 10000);
    if (otp < 1000)
        otp = "0" + otp;

    userModel.create({
        name: request.body.name,
        email: request.body.email,
        mobile: request.body.mobile,
        address: request.body.address,
        image: image,
        otp: otp
    }).then(result => {
        if (image != " ") {
            uploadFile(
                path.join(__dirname, "../", "public/images/") + request.file.filename
            );
        }
        client.messages.create({
            body: 'Dear user your otp for registration in pratham puja is : ' + otp ,
            from: '+17179224972',
            to: '+91'+request.body.mobile
        }).then((message) => {
            console.log(message.sid);
            return response.status(201).json({ user: result });
        })
            .catch(err => {
                console.log(err);
            });
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: "Internal Server Error" });
    })
}

exports.registerByOtp = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(401).json({ errors: errors.array() });
    userModel.findOne({ _id: request.body.id, otp: request.body.otp })
        .then(data => {
            if (data) {
                var password = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@!#$%^&*';
                var charactersLength = characters.length;
                for (var i = 0; i < 6; i++) {
                    password += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                // const salt = await bcrypt.genSalt(10);
                // password = await bcrypt.hash(password,salt);
                userModel.findOneAndUpdate({ _id: request.body.id }, {
                    $set: {
                        password: password
                    }
                }).then(result => {
                    let fromMail = "worship.first01@gmail.com";
                    let toMail = data.email;
                    let subject = "Password For Puja Pratham";
                    let message = "Yor Password for puja pratham site is " + password;

                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: fromMail,
                            pass: 'sbiqoanngferaqvn'
                        }
                    });

                    // email options
                    let mailOptions = {
                        from: fromMail,
                        to: toMail,
                        subject: subject,
                        text: message
                    };

                    transporter.sendMail(mailOptions, (error, res) => {
                        if (error) {
                            console.log(error);
                            res.send("Something went wrong");
                        }
                        else {
                            let payload = { subject: result._id };
                            let token = jwt.sign(payload, 'fdfdvcvrerejljjjjl');
                            return response.status(200).json({ message: "Password has been sent Sent", user: result, token: token });
                        }
                    });
                }).catch(err => {
                    console.log(err);
                    return response.status(500).json({ err: "Internal Server Error!" });
                })
            }
            else {
                return response.status(200).json({ error: "Invalid otp" });
            }
        }).catch(err => {
            console.log(err);
            return response.status(500).json({ err: "Internal Server Error!" });
        })
}

exports.login = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(401).json({ errors: errors.array() });
    userModel.findOne({
        email: request.body.email,
        password: request.body.password
    }).then(result => {
        if (result) {
            let payload = { subject: result._id };
            let token = jwt.sign(payload, 'fdfdvcvrerejljjjjl');
            return response.status(200).json({ user: result, token: token });
        }
        return response.status(200).json({ message: "You are not valid user" });
    }).catch(err => {
        console.log(err);
        return response.status(500).json(err);
    })
}

exports.view = (request, response) => {
    userModel.find()
        .then(result => {
            return response.status(200).json(result);
        }).catch(err => {
            return response.status(500).json({ error: "Internal Server Error!" });
        })
}

exports.viewOne = (request, response) => {
    userModel.findOne({ _id: request.params.id })
        .then(result => {
            return response.status(200).json(result);
        }).catch(err => {
            return response.status(500).json({ error: "Internal Server Error!" });
        })
}

exports.resendOtp = (request, response) => {

    let otp = Math.floor(Math.random() * 10000);
    if (otp < 1000)
        otp = "0" + otp;

    userModel.findOneAndUpdate({ _id: request.params.id }, { $set: { otp: otp } }, { new: true })
        .then(result => {
            var option = {
                authorization: 'ANUSRMpmxad1kqn3Q5Li8HWtfY7yuJ4wzGVg6IvhCEZKjbDP2TZ3dQtxclXbIE7OfwHnAo2K908eNyrq',
                message: "Your OTP for registration in PujaPratham is " + otp
                , numbers: [result.mobile]
            }
            fastsms.sendMessage(option).then((res) => {
                return response.status(201).json({ user: result, message: "Otp has been sent to you" });
            });
        }).catch(err => {
            return response.status(500).json({ error: "Internal Server Error!" });
        })
}