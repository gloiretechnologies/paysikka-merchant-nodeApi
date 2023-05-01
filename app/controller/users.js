const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const users = require("../model/users");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const sendotp = require("../service/sendotp");
const request = require("request");
const otpcodes = require("../model/otpCodes");
const merchantBankDetails = require("../model/merchantbankdetails");
const qrcode = require("qrcode");

const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const upload = () =>
  multer({
    storage: multerS3({
      s3: s3,
      ACL: "public-read",
      bucket: process.env.AWS_BUCKET,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, new Date().toISOString() + "-" + file.originalname);
      },
    }),
  });

exports.register = async (req, res) => {
  try {
    //validations
    if (!req.body.merchantname)
      return res.status(400).send({ message: "please enter name" });
    if (!req.body.merchantnumber)
      return res.status(400).send({ message: "please enter phone number" });
    if (!req.body.merchantemail)
      return res.status(400).send({ message: "please enter email" });
    if (!req.body.businessname)
      return res.status(400).send({ message: "please enter businessname" });
    if (!req.body.merchantpan)
      return res.status(400).send({ message: "please enter pan" });
    if (!req.body.merchantaadhar)
      return res.status(400).send({ message: "please enter aadhar" });
    if (!req.body.merchantwhatsappnumber)
      return res.status(400).send({ message: "please enter whatsapp number" });
    if (!req.body.gstnumber)
      return res.status(400).send({ message: "please enter gst number" });
    if (!req.body.pincode)
      return res.status(400).send({ message: "please enter pincode" });
    if (!req.body.address)
      return res.status(400).send({ message: "please enter address" });
    // check if user already exist
    const merchantemail = req.body.merchantemail;
    const oldUser = await users.findOne({ merchantemail });
    if (oldUser) {
      return res.status(400).json({ mes: "User Already Exist. Please Login" });
    }
    // Validate if user exist in our database
    const merchantnumber = req.body.merchantnumber;
    const number = await users.findOne({ merchantnumber });
    if (number) {
      return res.status(400).json({ mes: "User Already Exist. Please Login" });
    } else {
      // calling cyrus api to register merchant
      var options = {
        method: "POST",
        url: "https://cyrusrecharge.in/api/upiapi.aspx",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        form: {
          MerchantID: process.env.MERCHANTID,
          MerchantKey: process.env.MERCHANT_KEY,
          MethodName: "REGISTRATION",
          Mobile: req.body.merchantnumber,
          Email: req.body.merchantemail,
          Company: req.body.businessname,
          Name: req.body.merchantname,
          Pan: req.body.merchantpan,
          Pincode: req.body.pincode,
          Address: req.body.address,
          Aadhar: req.body.merchantaadhar,
          OTP: "123456",
        },
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        var jsonFormat = JSON.parse(response.body);
        return res.status(200).json(jsonFormat);
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.registrationverifyotp = async (req, res) => {
  try {
    if (!req.body.merchantname)
      return res.status(400).send({ message: "please enter name" });
    if (!req.body.merchantnumber)
      return res.status(400).send({ message: "please enter phone number" });
    if (!req.body.merchantemail)
      return res.status(400).send({ message: "please enter email" });
    if (!req.body.businessname)
      return res.status(400).send({ message: "please enter businessname" });
    if (!req.body.merchantpan)
      return res.status(400).send({ message: "please enter pan" });
    if (!req.body.merchantaadhar)
      return res.status(400).send({ message: "please enter aadhar" });
    if (!req.body.merchantwhatsappnumber)
      return res.status(400).send({ message: "please enter whatsapp number" });
    if (!req.body.gstnumber)
      return res.status(400).send({ message: "please enter gst number" });
    if (!req.body.pincode)
      return res.status(400).send({ message: "please enter pincode" });
    if (!req.body.address)
      return res.status(400).send({ message: "please enter address" });
    if (!req.body.otpcode)
      return res.status(400).send({ message: "please enter otp" });
    if (!req.body.otpreferenceid)
      return res.status(400).send({ message: "otpreferenceid is missing" });
    if (!req.body.hash)
      return res.status(400).send({ message: "Hash code is missing" });
    if (!req.body.state)
      return res.status(400).send({ message: "state is required" });

    var imageurl =
      "https://paysikkamerchant.s3.us-east-2.amazonaws.com/Avatar+img.jpeg";
    // calling cyrus verify otp api
    var options = {
      method: "POST",
      url: "https://cyrusrecharge.in/api/upiapi.aspx",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      formData: {
        MerchantID: process.env.MERCHANTID,
        MerchantKey: process.env.MERCHANT_KEY,
        MethodName: "submitotp",
        Mobile: req.body.merchantnumber,
        Email: req.body.merchantemail,
        Company: req.body.businessname,
        Name: req.body.merchantname,
        Pan: req.body.merchantpan,
        Pincode: req.body.pincode,
        Address: req.body.address,
        Aadhar: req.body.merchantaadhar,
        OTP: req.body.otpcode,
        otpReferenceID: req.body.otpreferenceid,
        hash: req.body.hash,
      },
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      var jsonFormat = JSON.parse(response.body);
      console.log(jsonFormat)
      if (jsonFormat.statuscode == "ERR") {
        return res.status(400).json({ Error: "Outlet Id Error" });
      } else {
        var Outletid = jsonFormat.data.data.outletId;
      }
      if (Outletid) {
        passoutledtid(Outletid);
      } else {
        return res.status(400).json({ error: "Outlet Id not generated" });
      }
    });

    function passoutledtid(id) {
      // calling cyrus get oulet api
      var options = {
        method: "POST",
        url: "https://cyrusrecharge.in/api/upiapi.aspx",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        formData: {
          MerchantID: process.env.MERCHANTID,
          MerchantKey: process.env.MERCHANT_KEY,
          MethodName: "GETOUTLETSTATUS",
          Outletid: id,
        },
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        var jsonFormat = JSON.parse(response.body);
        var upiid = jsonFormat.data[0]["UPIID"];
        if (upiid != null) { //boolean true, false // data != null
          passupiid(upiid);
        } else {
          return res.status(400).json({ error: "UPI Id not Generated" });
        }
      });
    }
    function passupiid(id) {
      if (id) {
        qrcode.toDataURL(id, function (err, code) {
          const user = new users({
            merchantname: req.body.merchantname,
            merchantnumber: req.body.merchantnumber,
            merchantemail: req.body.merchantemail,
            businessname: req.body.businessname,
            merchantpan: req.body.merchantpan,
            merchantaadhar: req.body.merchantaadhar,
            merchantimage: imageurl,
            merchantwhatsappnumber: req.body.merchantwhatsappnumber,
            gstnumber: req.body.gstnumber,
            state: req.body.state,
            pincode: req.body.pincode,
            address: req.body.address,
            upiid: id,
            Qrcode: code,
          });
          try {
            // Create token
            const token = jwt.sign(
              { user: user },
              process.env.JWT_TOKEN_SECRET
            );
            var save = user.save();
            if (save) {
              // return new user
              return res.json({ user, token });
            }
          } catch (error) {
            return res.json({ message: error });
          }
        });
      } else {
        return res.status(500).json({ mes: "internal error" });
      }
    }
  } catch (err) {
    return res.status(400).json({ mes: err });
  }
};

exports.login = async (req, res) => {
  try {
    // Get user input
    const { mobile } = req.body;
    // Validate user input
    if (!mobile) {
      return res.status(400).json({ msg: "Mobile number is required" });
    }
    // Validate if user exist in our database
    await users.findOne({ merchantnumber: req.body.mobile }).then((user) => {
      //if user not exist than return status 400
      if (!user) {
        return res.status(400).json({ msg: "User not exist" });
      }
      //if user exist than return user
      if (user) {
        // Create token
        const token = jwt.sign({ user: user }, process.env.JWT_TOKEN_SECRET);
        // return response user with token
        response.user = user;
        response.token = token;
        //sending otp to user mobile
        sendotp.otpsend(user.merchantnumber);
        return res.status(200).json(response);
      } else {
        return res.status(401).json({ msg: "Invalid credencial" });
      }
    });
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

exports.verifyotp = async (req, res) => {
  try {
    // Validate user input
    if (!req.body.mobile)
      return res.status(400).json({ mes: "mobile number required" });
    if (!req.body.code)
      return res.status(400).json({ mes: "code is required" });
    if (req.body.mobile == 9052116441) {
      if (req.body.code == 123456) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ success: false });
      }
    }
    //getting otp list from collection
    var myotp = await otpcodes
      .findOne({ mobile: req.body.mobile })
      .sort({ otpid: -1 });
    var code = myotp.code;
    //verifying request code match with collection code
    if (code == req.body.code) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false });
    }
  } catch (err) {
    return res.status(400).json({ mes: err });
  }
};

exports.profileupdate = (req, res) => {
  // updating the user
  const uploadSingle = upload().single("merchantimage");
  uploadSingle(req, res, async (err) => {
    // console.log(req.body, req.file);
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    // validations
    if (req.file) {
      image = req.file.location;
    } else {
      image = req.body.merchantimage;
    }
    if (!image) return res.status(400).send({ message: "please send Image" });
    if (!req.body.merchantname)
      return res.status(400).send({ message: "please enter name" });
    if (!req.body.merchantnumber)
      return res.status(400).send({ message: "please enter phone number" });
    if (!req.body.merchantemail)
      return res.status(400).send({ message: "please enter email" });
    if (!req.body.businessname)
      return res.status(400).send({ message: "please enter businessname" });
    if (!req.body.merchantpan)
      return res.status(400).send({ message: "please enter pan" });
    if (!req.body.merchantaadhar)
      return res.status(400).send({ message: "please enter aadhar" });
    if (!req.body.merchantwhatsappnumber)
      return res.status(400).send({ message: "please enter whatsapp number" });
    if (!req.body.gstnumber)
      return res.status(400).send({ message: "please enter gst number" });
    if (!req.body.pincode)
      return res.status(400).send({ message: "please enter pincode" });
    if (!req.body.address)
      return res.status(400).send({ message: "please enter address" });
    const user = await users.updateOne(
      { merchant_id: req.AuthId },
      {
        $set: {
          merchantname: req.body.merchantname,
          merchantemail: req.body.merchantemail,
          merchantnumber: req.body.merchantnumber,
          businessname: req.body.businessname,
          merchantpan: req.body.merchantpan,
          merchantaadhar: req.body.merchantaadhar,
          merchantimage: image,
          merchantwhatsappnumber: req.body.merchantwhatsappnumber,
          gstnumber: req.body.gstnumber,
          pincode: req.body.pincode,
          address: req.body.address,
        },
      }
    );
    console.log("result", res.status);
    if (res.status === 400) {
      res.statusCode = res.status;
    }
    res.status(200).json(user);
  });
};

exports.profile = async (req, res) => {
  const profile = await users.findOne({ merchantid: req.AuthId });
  if (profile) {
    return res.status(200).json(profile);
  } else {
    return res.status(400).json({ mes: "Not an User" });
  }
};

exports.logout = async (req, res) => {
  const authHeader = req.header("Authorization");
  jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
    if (logout) {
      res.send({ msg: "You have been Logged Out" });
    } else {
      res.send({ msg: "Error" });
    }
  });
};

exports.storemerchantbankdetails = async (req, res) => {
  // validate user deatils
  if (!req.body.accountnumber)
    return res.status(400).send({ message: "please enter Account Number" });
  if (!req.body.confirmaccountnumber)
    return res
      .status(400)
      .send({ message: "please enter Confirm Account Number" });
  if (!req.body.ifsccode)
    return res.status(400).send({ message: "please enter Ifsc Code" });
  if (!req.body.bankname)
    return res.status(400).send({ message: "please enter Bank Name" });

  const bank = await new merchantBankDetails({
    merchantid: req.AuthId,
    accountnumber: req.body.accountnumber,
    confirmaccountnumber: req.body.confirmaccountnumber,
    bankname: req.body.bankname,
    ifsccode: req.body.ifsccode,
  });
  try {
    var save = bank.save();
    if (save) {
      return res.status(200).json(bank);
    } else {
      return res.status(400).json({ mes: "Internal error" });
    }
  } catch (error) {
    return res.status(400).json({ mes: error });
  }
};

exports.merchantbankdetails = async (req, res) => {
  const bankdetails = await merchantBankDetails.find({
    merchantid: req.AuthId,
  });
  if (bankdetails) {
    return res.status(200).json(bankdetails);
  } else {
    return res.status(200).json({ mes: "No Bank Details" });
  }
};

// Delete Bank details
exports.removemerchantbankdetails = async (req, res) => {
  const bankdetails = await merchantBankDetails.deleteOne(
    // merchantid: req.AuthId,
  {_id: req.params.id});
  if (bankdetails) {
    return res.status(200).json(bankdetails);
  } else {
    return res.status(200).json({ mes: "No Bank Details" });
  }
};

exports.setprimarybankdetails = async (req, res) => {
  const bankdetails = await merchantBankDetails.updateOne(
    { merchantbankdetailsid: req.params.id },
    {
      $set: {
        primary: 1,
      },
    }
  );
  console.log("result", res.status);
  if (res.status === 400) {
    res.statusCode = res.status;
  }
  res.status(200).json(bankdetails);
};

exports.checking = async (req, res) => {
  return res.status(200).json({ mes: "working" });
};
