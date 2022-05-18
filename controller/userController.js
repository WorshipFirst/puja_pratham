const userModel = require("../model/userModel");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fastsms = require("fast-two-sms");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const storage = new Storage({
    projectId: "worship-first",
    keyFilename: "puja-pratham-firebase-adminsdk-wvbyq-6349c2ef49.json"
});

const bucketName = "gs://puja-pratham.appspot.com";

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
    let image;
    if (request.file) {
        image = "https://firebasestorage.googleapis.com/v0/b/puja-pratham.appspot.com/o/" + request.file.filename + "?alt=media&token=hello";
    }
    else {
        image = request.body.oldImage;
    }
    userModel.findOneAndUpdate(
        { email: request.body.email },
        {
            $set: {
                name: request.body.name,
                image: image,
                address: request.body.address
            }
        }, { new: true }).then(result => {
            return response.status(200).json({ user: result });
        }).catch(err => {
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
                                pass: 'worship@123!'
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
        var option = {
            authorization: 'jDkBLbZKXG3D8Dh3RpexwA6b7dJYp9xSPSdEck3ollHG3Sg7Eb4iyvhBgS91',
            message: "Your OTP for registration in PujaPratham is " + otp
            , numbers: [request.body.mobile]
        }
        fastsms.sendMessage(option).then((res) => {
            console.log("success"+res);
            return response.status(201).json({ user: result });
        }).catch(err=>{
            console.log("failed"+err);
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: "Internal Server Error" });
    })
}

exports.registerByOtp =  (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(401).json({ errors: errors.array() });
    userModel.findOne({ _id: request.body.id, otp: request.body.otp })
        .then(data => {
            if(data){
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
                            pass: 'worship@123!'
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
                            return response.status(200).json({ message: "Password has been sent Sent",user: result,token:token});
                        }
                    });
                }).catch(err => {
                    console.log(err);
                    return response.status(500).json({ err: "Internal Server Error!" });
                })
            }
            else{
                return response.status(200).json({error:"Invalid otp"});
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

exports.delete = (request, response) => {
    userModel.findOneAndDelete({ email: request.params.email })
        .then(result => {
            if (result) {
                return response.status(202).json({ message: "Success" });
            }
            return response.status(204).json(result);
        }).catch(err => {
            return response.status(500).json({ error: "Internal Server Error!" });
        });
}

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

exports.resendOtp = (request,response)=>{

    let otp = Math.floor(Math.random() * 10000);
    if (otp < 1000)
        otp = "0" + otp;

    userModel.findOneAndUpdate({_id:request.params.id},{$set:{otp:otp}},{new:true})
    .then(result=>{
        var option = {
            authorization: 'ANUSRMpmxad1kqn3Q5Li8HWtfY7yuJ4wzGVg6IvhCEZKjbDP2TZ3dQtxclXbIE7OfwHnAo2K908eNyrq',
            message: "Your OTP for registration in PujaPratham is " + otp
            , numbers: [result.mobile]
        }
        fastsms.sendMessage(option).then((res) => {
            return response.status(201).json({ user: result,message:"Otp has been sent to you" });
        });
    }).catch(err=>{
        return response.status(500).json({error:"Internal Server Error!"});
    })
}