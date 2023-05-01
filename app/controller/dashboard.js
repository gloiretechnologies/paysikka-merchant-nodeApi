const Transactions = require("../model/transactions");
const purchasewallet = require("../model/purchasewallet");
const collectedwallet = require("../model/collectedwalletpoints");
const Recharge = require("../model/recharge");
// const upiqr = require("upiqr");

// All transactions

exports.transactions = async (req, res) => {
  try {
    var transactions = await Transactions.find({ mupi: req.UpiId });
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(400).json({ mes: error });
  }
};

// All Amount

exports.totalamount = async (req, res) => {
  try {
    var transactions = await Transactions.find({ mupi: req.UpiId });
    var totalamounts = 0;
    for (i = 0; i < transactions.length; i++) {
      totalamounts += transactions[i]["amount"];
    }
    return res.status(200).json({ totalamountreceived: totalamounts });
  } catch (error) {
    return res.status(400).json({ mes: error });
  }
};

// All total wallet points

exports.totalwalletpoints = async (req, res) => {
  try {
    var walletpoints = await purchasewallet.findOne({ merchantid: req.AuthId });
    if (walletpoints) {
      return res.status(200).json(walletpoints);
    } else {
      return res.status(200).json({ points: 0 });
    }
  } catch (error) {
    return res.status(400).json({ mes: error });
  }
};

// All collected wallet points

exports.collectedwalletpoints = async (req, res) => {
  try {
    var collectedpoints = await collectedwallet.findOne({
      merchantid: req.AuthId,
    });
    if (collectedpoints) {
      return res.status(200).json(collectedpoints);
    } else {
      return res.status(200).json({ points: 0 });
    }
  } catch (error) {
    return res.status(400).json({ mes: error });
  }
};

// All recharges

exports.recharges = async (req, res) => {
  try {
    var numbers = await Recharge.find().distinct("mobileNumber");

    var finres = [];
    var temparray = [];
    var recentrecharge = [];
    for (i = 0; i < numbers.length; i++) {
      console.log(numbers);
      recentrecharge = await Recharge.find({
        userId: 1,
        mobileNumber: { $in: numbers },
      }).sort({ rechargeid: -1 });
    }

    for (j = 0; j < recentrecharge.length; j++) {
      temparray.push(recentrecharge[j]["mobileNumber"]);
    }

    temparray = temparray.filter(
      (item, index) => temparray.indexOf(item) === index
    );

    for (k = 0; k < temparray.length; k++) {
      for (l = 0; l < recentrecharge.length; l++) {
        if (temparray[k] == recentrecharge[l]["mobileNumber"]) {
          finres.push(recentrecharge[l]);
          break;
        }
      }
    }
    return res.status(200).json(finres);
  } catch (error) {
    return res.status(400).json({ mes: error });
  }
};
