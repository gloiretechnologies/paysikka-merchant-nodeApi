const promotiontype = require("../model/promotiontype");
const promotionpackages = require("../model/promotionpackage");
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const promotionfeed = require("../model/promotionfeed");
const promotionpurchases = require("../model/promotionspurchase");

// uploading image to s3 bucket

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

// Get promotions
exports.getpromotiontypes = async (req, res) => {
  try {
    const promotions = await promotiontype.find();
    if (promotions) {
      return res.status(200).json(promotions);
    } else {
      return res.status(400).json({ message: "Internal Error" });
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

// Get promotion Package with Promotion Type
exports.promotionpackageswithtype = async (req, res) => {
  try {
    const promotion = await promotiontype.aggregate([
      {
        $lookup: {
          from: "promotionpackages",
          localField: "promotionid",
          foreignField: "promotionid",
          as: "promotionpackagedetails",
        },
      },
    ]);
    if (promotion) {
      return res.status(200).json(promotion);
    } else {
      return res.status(400).json({ message: "Internal Error" });
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

// Get single promotion
exports.getpromotiontype = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ mes: "Id is required" });
    const promotion = await promotiontype.find({ promotionid: req.params.id });
    if (promotion) {
      return res.status(200).json(promotion);
    } else {
      return res.status(500).send("Internal Error");
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

// Get single Promotionpacakge
exports.getpromotionpackage = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ mes: "Id is required" });
    const promotion = await promotionpackages.find({
      packageid: req.params.id,
    });
    if (promotion) {
      return res.status(200).json(promotion);
    } else {
      return res.status(400).json({ mes: "Internal Error" });
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

// Get packages by promotions id

exports.packagesbypromotions = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({ mes: "promotion id is required" });
    const packages = await promotionpackages.find({
      promotionid: req.params.id,
    });
    if (packages) {
      return res.status(200).json(packages);
    } else {
      return res.status(400).json({ mes: "Internal Error" });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

// Get promotion content from merchant
exports.content = async (req, res) => {
  try {
    const uploadSingle = upload().single("image");
    uploadSingle(req, res, async (err) => {
      //   validations
      if (!req.file) return res.status(400).json({ mes: "image is required" });
      // console.log(req.body, req.file);
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      // validations
      if (!req.body.description)
        return res.status(400).json({ mes: "Description is required" });
      if (!req.body.promotionid)
        return res.status(400).json({ mes: "Promotion id is required" });
      if (!req.body.packageid)
        return res.status(400).json({ mes: "Package id is required" });
      if (!req.body.paymentid)
        return res.status(400).json({ mes: "Payment id is required" });
      if (!req.body.validity)
        return res.status(400).json({ mes: "validity is required" });
      if (!req.body.cost)
        return res.status(400).json({ mes: "cost id is required" });
      const feed = new promotionfeed({
        merchantid: req.AuthId,
        promotionid: req.body.promotionid,
        packageid: req.body.packageid,
        image: req.file.location,
        description: req.body.description,
      });
      // saving the feed
      let save = feed.save();
      if (save) {
        const transaction = new promotionpurchases({
          merchantid: req.AuthId,
          paymentid: req.body.paymentid,
          packageid: req.body.packageid,
          promotionid: req.body.promotionid,
          validity: req.body.validity,
          cost: req.body.cost,
        });
        // saving the transaction
        let save = transaction.save();
        if (save) {
          return res.status(200).json(transaction);
        } else {
          return res.status(400).json({ mes: "Internal error" });
        }
      } else {
        return res.status(400).json({ mes: "Internal error" });
      }
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

// Get recent purchase promotions list

exports.purchaselist = async (req, res) => {
  try {
    const purchases = await promotionpurchases.aggregate([
      {
        $match: {
          merchantid: req.AuthId,
        },
      },
      {
        $lookup: {
          from: "promotiontypes",
          localField: "promotionid",
          foreignField: "promotionid",
          as: "promotiontypedetails",
        },
      },
    ]);
    if (purchases) {
      return res.status(200).json(purchases);
    } else {
      return res.status(400).json({ mes: "Internal Error" });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};
