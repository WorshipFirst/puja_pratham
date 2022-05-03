const userModel = require("../model/userModel");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fastsms = require("fast-two-sms");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const storage = new Storage({
    projectId: "worship-first",
    keyFilename: "puja-pratham-firebase-adminsdk-wvbyq-6349c2ef49.json"
});

const bucketName = "gs://puja-pratham.appspot.com";

exports.add = (request, response) => {
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
            authorization: 'ANUSRMpmxad1kqn3Q5Li8HWtfY7yuJ4wzGVg6IvhCEZKjbDP2TZ3dQtxclXbIE7OfwHnAo2K908eNyrq',
            message: "Your OTP for registration in PujaPratham is " + otp
            , numbers: [request.body.mobile]
        }
        fastsms.sendMessage(option).then((res) => {

            return response.status(201).json({ message: "OTP SEND SUCCESSFULLY" });
        });
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: "Internal Server Error" });
    })
}

exports.registerByOtp = (request, response) => {
    userModel.findOne({ _id: request.body.id, otp: request.body.otp })
        .then(data => {
            var password = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@!#$%^&*';
            var charactersLength = characters.length;
            for (var i = 0; i < 6; i++) {
                password += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            userModel.updateOne({ _id: request.body.id }, {
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
                        return response.status(200).json({message:"Password has been sent Sent"});
                    }
                });
            }).catch(err => {
                console.log(err);
                return response.status(500).json({ err: "Internal Server Error!" });
            })

        }).catch(err => {
            console.log(err);
            return response.status(500).json({ err: "Internal Server Error!" });
        })
}

exports.login = (request,response)=>{
    userModel.findOne({
        email : request.body.email,
        password : request.body.password
    }).then(result=>{
        let payload = {subject: result._id};
        let token = jwt.sign(payload,'fdfdvcvrerejljjjjl');
        return response.status(200).json({user:result,token:token});
    }).catch(err=>{
        console.log(err);
        return response.status(500).json(err);
    })
} 

exports.view = (request,response) =>{
    userModel.find()
    .then(result=>{
        return response.status(200).json(result);
    }).catch(err=>{
        return response.status(500).json({error:"Internal Server Error!"});
    })
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